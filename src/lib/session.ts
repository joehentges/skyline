"use server"

import { cache } from "react"
import { cookies as nextCookies, headers as nextHeaders } from "next/headers"
import { redirect } from "next/navigation"

import { signInUrl } from "@/config"
import { User } from "@/db/schemas"
import {
  createSession,
  generateSessionToken,
  invalidateSession,
  validateRequest,
} from "@/auth"

export const getCurrentUser = cache(async () => {
  const session = await validateRequest()
  if (!session.user) {
    return undefined
  }
  return session.user
})

export const assertAuthenticated = async () => {
  const user = await getCurrentUser()
  if (!user) {
    const headers = await nextHeaders()
    const from = headers.get("x-from")
    redirect(`${signInUrl}?from=${from}`)
  }
  return user
}

export async function setSession(userId: User["id"]) {
  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, userId)
  const cookies = await nextCookies()
  cookies.set("session", sessionToken, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: session.expiresAt,
  })
}

export async function clearSession() {
  const cookies = await nextCookies()
  const sessionId = cookies.get("session")?.value ?? null
  if (sessionId) {
    await invalidateSession(sessionId)
  }
  cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
}
