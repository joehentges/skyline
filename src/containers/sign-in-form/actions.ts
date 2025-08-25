"use server"

import { redirect } from "next/navigation"
import argon2 from "argon2"
import { eq } from "drizzle-orm"

import { AFTER_SIGN_IN_URL } from "@/config"
import { database } from "@/db"
import { usersTable } from "@/db/schemas"
import { rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { setSession } from "@/lib/session"

import { signInFormSchema } from "./validation"

export const signInAction = unauthenticatedAction
  .inputSchema(signInFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.email}-sign-in`,
      limit: 3,
      window: 10000,
    })

    const user = await database.query.usersTable.findFirst({
      where: eq(usersTable.email, parsedInput.email.toLowerCase()),
    })

    if (!user) {
      throw new Error("Invalid email or password")
    }

    const hashedPassword = user.passwordHash

    if (!hashedPassword) {
      return false
    }

    const isPasswordCorrect = await argon2.verify(
      hashedPassword,
      parsedInput.password
    )

    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password")
    }

    await setSession(user.id, "password")

    redirect(AFTER_SIGN_IN_URL)
  })
