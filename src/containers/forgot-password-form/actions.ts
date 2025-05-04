"use server"

import { createId } from "@paralleldrive/cuid2"
import { eq } from "drizzle-orm"

import { EMAIL_TTL } from "@/config"
import { database } from "@/db"
import { usersTable } from "@/db/schemas"
import { redis } from "@/client/redis"
import { rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { sendResetPasswordEmail } from "@/lib/send-email"

import { forgotPasswordFormSchema } from "./validation"

export const sendForgotPasswordAction = unauthenticatedAction
  .schema(forgotPasswordFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.email}-send-forgot-password`,
      limit: 3,
      window: 10000,
    })

    const user = await database.query.usersTable.findFirst({
      where: eq(usersTable.email, parsedInput.email),
    })

    if (!user) {
      throw new Error("Email address not found")
    }

    const verificationToken = createId()
    const expiresAt = new Date(Date.now() + EMAIL_TTL)

    // Save verification token in KV with expiration
    await redis.set(
      `password-reset:${verificationToken}`,
      JSON.stringify({
        userId: user.id,
        expiresAt: expiresAt.toISOString(),
      }),
      "EX",
      Math.floor((expiresAt.getTime() - Date.now()) / 1000)
    )

    await sendResetPasswordEmail(parsedInput.email, verificationToken)
  })
