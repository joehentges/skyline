"use server"

import { z } from "zod"

import { rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { sendMagicLinkUseCase } from "@/use-cases/auth"

export const sendMagicLinkAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      from: z.string().min(2).optional(),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByKey({
      key: `${input.email}-send-magic-link`,
      limit: 3,
      window: 10000,
    })
    await sendMagicLinkUseCase(input.email, input.from)
  })
