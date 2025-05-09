"use server"

import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { env } from "@/env"
import { afterSignInUrl } from "@/config"
import { database } from "@/db"
import { usersTable } from "@/db/schemas"
import { redis } from "@/client/redis"
import { getIp } from "@/lib/get-ip"
import { rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { setSession } from "@/lib/session"
import { validateTurnstileToken } from "@/lib/validate-turnstile-token"

import { magicLinkSignUpFormSchema } from "./validation"

export const magicLinkSignUpAction = unauthenticatedAction
  .schema(magicLinkSignUpFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.token}-sign-up`,
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

    const magicSignInInfoStr = await redis.get(
      `magic-sign-in:${parsedInput.token}`
    )

    if (!magicSignInInfoStr) {
      throw new Error("Invalid token")
    }

    const magicSignInInfo = JSON.parse(magicSignInInfoStr) as {
      email: string
      expiresAt: string
    }

    // Check if token is expired (although redis should have auto-deleted it)
    if (new Date() > new Date(magicSignInInfo.expiresAt)) {
      throw new Error("Token has expired")
    }

    const [existingUser] = await database
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, magicSignInInfo.email))

    if (existingUser) {
      throw new Error("Email is already in use")
    }

    const [user] = await database
      .insert(usersTable)
      .values({
        email: magicSignInInfo.email,
        emailVerified: new Date(),
        signUpIpAddress: await getIp(),
        displayName: parsedInput.displayName,
      })
      .returning()

    await redis.del(`magic-sign-in:${parsedInput.token}`)

    await setSession(user.id, "magic-link")

    redirect(afterSignInUrl)
  })
