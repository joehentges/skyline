"use server"

import { redirect } from "next/navigation"
import argon2 from "argon2"
import { eq } from "drizzle-orm"

import { signInUrl } from "@/config"
import { database } from "@/db"
import { usersTable } from "@/db/schemas"
import { redis } from "@/client/redis"
import { rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"

import { resetPasswordFormSchema } from "./validation"

export const resetPasswordAction = unauthenticatedAction
  .schema(resetPasswordFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.token}-reset-password`,
      limit: 3,
      window: 10000,
    })

    const passwordResetInfoStr = await redis.get(
      `password-reset:${parsedInput.token}`
    )

    if (!passwordResetInfoStr) {
      throw new Error("Invalid token")
    }

    const passwordResetInfo = JSON.parse(passwordResetInfoStr) as {
      userId: string
      expiresAt: string
    }

    if (new Date() > new Date(passwordResetInfo.expiresAt)) {
      throw new Error("Token has expired")
    }

    const user = await database.query.usersTable.findFirst({
      where: eq(usersTable.id, passwordResetInfo.userId),
    })

    if (!user) {
      throw new Error("User not found")
    }

    const passwordHash = await argon2.hash(parsedInput.password)

    await database
      .update(usersTable)
      .set({
        passwordHash,
      })
      .where(eq(usersTable.id, user.id))

    await redis.del(`password-reset:${parsedInput.token}`)

    redirect(signInUrl)
  })
