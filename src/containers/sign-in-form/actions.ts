"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { afterSignInUrl } from "@/config"
import { rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { setSession } from "@/lib/session"
import { loginUseCase } from "@/use-cases/auth"

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      from: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByKey({ key: input.email, limit: 3, window: 10000 })
    const user = await loginUseCase(input.email, input.password)
    await setSession(user.id)
    redirect(input.from ? input.from : afterSignInUrl)
  })
