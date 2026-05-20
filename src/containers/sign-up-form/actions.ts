"use server";

import crypto from "node:crypto";
import argon2 from "argon2";
import { and, eq } from "drizzle-orm";
import { cookies as nextCookies } from "next/headers";
import { redirect } from "next/navigation";
import { stripe } from "@/client/stripe";
import { AFTER_SIGN_IN_URL, TOKEN_TTL } from "@/config";
import { database } from "@/db";
import { tokensTable, userSubscriptionsTable, usersTable } from "@/db/schemas";
import { env } from "@/env";
import { getIp } from "@/lib/get-ip";
import { rateLimitByIp, rateLimitByKey } from "@/lib/limiter";
import { unauthenticatedAction } from "@/lib/safe-action";
import { sendVerifyEmail } from "@/lib/send-email";
import { setSession } from "@/lib/session";
import { validateTurnstileToken } from "@/lib/validate-turnstile-token";

import {
  sendVerifyEmailActionSchema,
  signUpFormSchema,
  verifyEmailFormSchema,
} from "./validation";

export const sendEmailVerificationCodeAction = unauthenticatedAction
  .inputSchema(sendVerifyEmailActionSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByIp({
      key: `${parsedInput.email}-send-email-verification-code`,
      limit: 3,
      window: 10_000,
    });

    const [existingUser] = await database
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, parsedInput.email));

    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expiresAt = new Date(Date.now() + TOKEN_TTL.EMAIL_VERIFICATION);

    // Delete any existing verification tokens for this email before inserting a new one
    await database
      .delete(tokensTable)
      .where(
        and(
          eq(tokensTable.email, parsedInput.email),
          eq(tokensTable.type, "email-verification")
        )
      );

    await database.insert(tokensTable).values({
      token,
      type: "email-verification",
      email: parsedInput.email,
      expiresAt,
    });

    await sendVerifyEmail(parsedInput.email, token);

    return { email: parsedInput.email };
  });

export const verifyEmailAction = unauthenticatedAction
  .inputSchema(verifyEmailFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByIp({
      key: "verify-email-code",
      limit: 3,
      window: 10_000,
    });

    const tokenRow = await database.query.tokensTable.findFirst({
      where: and(
        eq(tokensTable.token, parsedInput.token),
        eq(tokensTable.type, "email-verification")
      ),
    });

    if (!tokenRow) {
      throw new Error("Invalid token");
    }

    if (new Date() > tokenRow.expiresAt) {
      throw new Error("Token has expired");
    }

    if (tokenRow.email !== parsedInput.email) {
      throw new Error("Invalid token");
    }

    return { email: parsedInput.email };
  });

export const signUpAction = unauthenticatedAction
  .inputSchema(signUpFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.email}-sign-up`,
      limit: 3,
      window: 10_000,
    });

    if (
      !env.NEXT_PUBLIC_DISABLE_TURNSTILE &&
      env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY &&
      parsedInput.captchaToken
    ) {
      const success = await validateTurnstileToken(parsedInput.captchaToken);

      if (!success) {
        throw new Error("Please complete the captcha");
      }
    }

    const [existingUser] = await database
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, parsedInput.email));

    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const cookies = await nextCookies();
    const referralCookie = cookies.get("referral");
    const referralId = referralCookie
      ? decodeURIComponent(referralCookie.value)
      : null;

    const signUpIpAddress = await getIp();

    const user = await database.transaction(async (trx) => {
      const passwordHash = await argon2.hash(parsedInput.password);
      const [createdUser] = await trx
        .insert(usersTable)
        .values({
          signUpIpAddress,
          email: parsedInput.email,
          emailVerified: new Date(),
          passwordHash,
          firstName: parsedInput.firstName,
          lastName: parsedInput.lastName,
        })
        .returning();

      const stripeCustomer = await stripe.customers.create({
        email: parsedInput.email,
        name: `${parsedInput.firstName} ${parsedInput.lastName}`,
        metadata: {
          signUpIpAddress,
          referralId,
        },
      });

      await trx
        .insert(userSubscriptionsTable)
        .values({
          userId: createdUser.id,
          customerId: stripeCustomer.id,
          referralId,
        })
        .returning();

      return createdUser;
    });

    await setSession(user.id, "password");

    redirect(AFTER_SIGN_IN_URL);
  });
