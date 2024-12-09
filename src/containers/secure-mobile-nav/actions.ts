"use server"

import { redirect } from "next/navigation"

import { signInUrl } from "@/config"
import { rateLimitByIp } from "@/lib/limiter"
import { authenticatedAction } from "@/lib/safe-action"
import { clearSession } from "@/lib/session"

export const signOutAction = authenticatedAction
  .createServerAction()
  .handler(async () => {
    await rateLimitByIp({ limit: 3, window: 10000 })
    await clearSession()
    redirect(signInUrl)
  })
