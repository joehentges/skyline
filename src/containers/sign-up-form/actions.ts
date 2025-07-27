"use server"

import { redirect } from "next/navigation"
import { createId } from "@paralleldrive/cuid2"
import argon2 from "argon2"
import { eq } from "drizzle-orm"

import { env } from "@/env"
import { AFTER_SIGN_IN_URL, REDIS_PREFIX, TOKEN_TTL } from "@/config"
import { database } from "@/db"
import { usersTable } from "@/db/schemas"
import { redis } from "@/client/redis"
import { stripe } from "@/client/stripe"
import { getIp } from "@/lib/get-ip"
import { rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { sendVerifyEmail } from "@/lib/send-email"
import { setSession } from "@/lib/session"
import { validateTurnstileToken } from "@/lib/validate-turnstile-token"

import { signUpFormSchema } from "./validation"

export const signUpAction = unauthenticatedAction
  .schema(signUpFormSchema)
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
      name: parsedInput.displayName,
      metadata: {
        signUpIpAddress,
      },
    })

    const passwordHash = await argon2.hash(parsedInput.password)
    const [user] = await database
      .insert(usersTable)
      .values({
        email: parsedInput.email,
        passwordHash,
        signUpIpAddress,
        displayName: parsedInput.displayName,
        stripeCustomerId: stripeCustomer.id,
      })
      .returning()

    const verificationToken = createId()
    const expiresAt = new Date(Date.now() + TOKEN_TTL.EMAIL_VERIFICATION_EMAIL)

    await redis.set(
      `${REDIS_PREFIX.EMAIL_VERIFICATION}:${verificationToken}`,
      JSON.stringify({
        userId: user.id,
        expiresAt: expiresAt.toISOString(),
      }),
      "EX",
      Math.floor((expiresAt.getTime() - Date.now()) / 1000)
    )

    await sendVerifyEmail(user.email, verificationToken)

    await setSession(user.id, "password")

    redirect(AFTER_SIGN_IN_URL)
  })
