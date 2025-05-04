"use server"

import { cache } from "react"
import { cookies as nextCookies } from "next/headers"
import { redirect } from "next/navigation"
import { CreateCacheSessionParams } from "@/cache-session"

import { signInUrl } from "@/config"
import { User } from "@/db/schemas"
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
  validateRequest,
} from "@/auth"

export const getCurrentUser = cache(async () => {
  const session = await validateRequest()
  if (!session || !session.user) {
    return undefined
  }
  return session.user
})

export const assertAuthenticated = async () => {
  const user = await getCurrentUser()
  if (!user) {
    redirect(signInUrl)
  }
  return user
}

export async function setSession(
  userId: User["id"],
  authenticationType?: CreateCacheSessionParams["authenticationType"]
) {
  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, userId, authenticationType)
  await setSessionTokenCookie(sessionToken, userId, new Date(session.expiresAt))
}

export async function clearSession(userId: User["id"]) {
  const cookies = await nextCookies()
  const sessionId = cookies.get("session")?.value ?? null
  if (sessionId) {
    await invalidateSession(sessionId, userId)
  }
  await deleteSessionTokenCookie()
}
