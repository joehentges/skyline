"use server"

import { redirect } from "next/navigation"
import argon2 from "argon2"
import { eq } from "drizzle-orm"
import speakeasy from "speakeasy"

import { env } from "@/env"
import { AFTER_SIGN_IN_URL, TOKEN_TTL } from "@/config"
import { database } from "@/db"
import { usersTable } from "@/db/schemas"
import { stripe } from "@/client/stripe"
import { getIp } from "@/lib/get-ip"
import { rateLimitByIp, rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { sendVerifyEmail } from "@/lib/send-email"
import { setSession } from "@/lib/session"
import { validateTurnstileToken } from "@/lib/validate-turnstile-token"

import {
  sendVerifyEmailActionSchema,
  signUpFormSchema,
  verifyEmailFormSchema,
} from "./validation"

export const sendEmailVerificationCodeAction = unauthenticatedAction
  .inputSchema(sendVerifyEmailActionSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByIp({
      key: `${parsedInput.email}-send-email-verification-code`,
      limit: 3,
      window: 10000,
    })

    const [existingUser] = await database
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, parsedInput.email))

    if (existingUser) {
      throw new Error("Email is already in use")
    }

    const secret = speakeasy.generateSecret()

    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
      step: TOKEN_TTL.EMAIL_VERIFICATION_EMAIL,
    })

    await sendVerifyEmail(parsedInput.email, token)

    return {
      ...parsedInput,
      otpSecret: secret.base32,
    }
  })

export const verifyEmailAction = unauthenticatedAction
  .inputSchema(verifyEmailFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByIp({
      key: `verify-email-code`,
      limit: 3,
      window: 10000,
    })

    const verified = speakeasy.totp.verify({
      secret: parsedInput.otpSecret,
      encoding: "base32",
      token: parsedInput.token,
      step: 300,
    })

    if (!verified) {
      throw new Error("Invalid code!")
    }
  })

export const signUpAction = unauthenticatedAction
  .inputSchema(signUpFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.email}-sign-up`,
      limit: 3,
      window: 10000,
    })

    if (
      Boolean(env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY) &&
      parsedInput.captchaToken
    ) {
      const success = await validateTurnstileToken(parsedInput.captchaToken)

      if (!success) {
        throw new Error("Please complete the captcha")
      }
    }

    const [existingUser] = await database
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, parsedInput.email))

    if (existingUser) {
      throw new Error("Email is already in use")
    }

    const signUpIpAddress = await getIp()

    const stripeCustomer = await stripe.customers.create({
      email: parsedInput.email,
      name: `${parsedInput.firstName} ${parsedInput.lastName}`,
      metadata: {
        signUpIpAddress,
      },
    })

    const passwordHash = await argon2.hash(parsedInput.password)
    const [user] = await database
      .insert(usersTable)
      .values({
        stripeCustomerId: stripeCustomer.id,
        signUpIpAddress,
        email: parsedInput.email,
        emailVerified: new Date(),
        passwordHash,
        firstName: parsedInput.firstName,
        lastName: parsedInput.lastName,
      })
      .returning()

    await setSession(user.id, "password")

    redirect(AFTER_SIGN_IN_URL)
  })
