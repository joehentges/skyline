"use server"

import crypto from "node:crypto"
import { redirect } from "next/navigation"
import argon2 from "argon2"
import { eq } from "drizzle-orm"

import { env } from "@/env"
import { AFTER_SIGN_IN_URL, REDIS_PREFIX, TOKEN_TTL } from "@/config"
import { database } from "@/db"
import { usersTable, userSubscriptionsTable } from "@/db/schemas"
import { redis } from "@/client/redis"
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

    const token = crypto.randomInt(100000, 1000000).toString()
    const expiresAt = new Date(Date.now() + TOKEN_TTL.EMAIL_VERIFICATION)

    // Save verification token in KV with expiration
    await redis.set(
      `${REDIS_PREFIX.VERIFY_EMAIL}:${token}`,
      JSON.stringify({
        email: parsedInput.email,
        expiresAt: expiresAt.toISOString(),
      }),
      "EX",
      Math.floor((expiresAt.getTime() - Date.now()) / 1000)
    )

    await sendVerifyEmail(parsedInput.email, token)

    return { email: parsedInput.email }
  })

export const verifyEmailAction = unauthenticatedAction
  .inputSchema(verifyEmailFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByIp({
      key: `verify-email-code`,
      limit: 3,
      window: 10000,
    })

    const tokenInfoStr = await redis.get(
      `${REDIS_PREFIX.VERIFY_EMAIL}:${parsedInput.token}`
    )

    if (!tokenInfoStr) {
      throw new Error("Invalid token")
    }

    const tokenInfo = JSON.parse(tokenInfoStr) as {
      email: string
      expiresAt: string
    }

    // Check if token is expired (although redis should have auto-deleted it)
    if (new Date() > new Date(tokenInfo.expiresAt)) {
      throw new Error("Token has expired")
    }

    if (tokenInfo.email !== parsedInput.email) {
      throw new Error("Invalid token")
    }

    return { email: parsedInput.email }
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

    const user = await database.transaction(async (trx) => {
      const passwordHash = await argon2.hash(parsedInput.password)
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
        .returning()

      const stripeCustomer = await stripe.customers.create({
        email: parsedInput.email,
        name: `${parsedInput.firstName} ${parsedInput.lastName}`,
        metadata: {
          signUpIpAddress,
        },
      })

      await trx
        .insert(userSubscriptionsTable)
        .values({
          userId: createdUser.id,
          customerId: stripeCustomer.id,
        })
        .returning()

      return createdUser
    })

    await setSession(user.id, "password")

    redirect(AFTER_SIGN_IN_URL)
  })
