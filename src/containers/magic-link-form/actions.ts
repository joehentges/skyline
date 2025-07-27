"use server"

import { createId } from "@paralleldrive/cuid2"

import { REDIS_PREFIX, TOKEN_TTL } from "@/config"
import { redis } from "@/client/redis"
import { rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { sendMagicLinkEmail } from "@/lib/send-email"

import { magicLinkFormSchema } from "./validation"

export const sendMagicLinkAction = unauthenticatedAction
  .schema(magicLinkFormSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey({
      key: `${parsedInput.email}-send-magic-link`,
      limit: 3,
      window: 10000,
    })

    const magicLinkToken = createId()
    const expiresAt = new Date(Date.now() + TOKEN_TTL.MAGIC_LINK_EMAIL)

    // Save verification token in KV with expiration
    await redis.set(
      `${REDIS_PREFIX.MAGIC_SIGN_IN}:${magicLinkToken}`,
      JSON.stringify({
        email: parsedInput.email,
        expiresAt: expiresAt.toISOString(),
      }),
      "EX",
      Math.floor((expiresAt.getTime() - Date.now()) / 1000)
    )

    await sendMagicLinkEmail(parsedInput.email, magicLinkToken)
  })
