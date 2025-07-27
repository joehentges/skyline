import { cookies as nextCookies } from "next/headers"
import { sha256 } from "@oslojs/crypto/sha2"
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding"
import { eq } from "drizzle-orm"

import { User, usersTable } from "@/db/schemas"

import {
  CacheSession,
  createCacheSession,
  CreateCacheSessionParams,
  deleteCacheSession,
  getSessionKey,
  updateCacheSession,
} from "./cache-session"
import { redis } from "./client/redis"
import { database } from "./db"

export function getUserFromDatabase(userId: User["id"]) {
  return database.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    columns: {
      id: true,
      dateCreated: true,
      dateUpdated: true,
      displayName: true,
      email: true,
      emailVerified: true,
      avatar: true,
    },
  })
}

export async function createSession(
  token: string,
  userId: User["id"],
  authenticationType?: CreateCacheSessionParams["authenticationType"],
  passkeyCredentialId?: CreateCacheSessionParams["passkeyCredentialId"]
): Promise<CacheSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const user = await getUserFromDatabase(userId)

  if (!user) {
    throw new Error("User not found")
  }

  return createCacheSession({
    sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    user,
    authenticationType,
    passkeyCredentialId,
  })
}

async function validateSessionToken(
  token: string,
  userId: User["id"]
): Promise<SessionValidationResult | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const sessionStr = await redis.get(getSessionKey(userId, sessionId))
  if (!sessionStr) {
    return null
  }

  const session = JSON.parse(sessionStr) as CacheSession

  if (Date.now() >= session.expiresAt) {
    await deleteCacheSession(sessionId, userId)
    return null
  }

  if (Date.now() >= session.expiresAt - 1000 * 60 * 60 * 24 * 15) {
    await updateCacheSession(
      sessionId,
      userId,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    )
  }

  return session
}

export async function invalidateSession(
  sessionId: string,
  userId: User["id"]
): Promise<void> {
  await deleteCacheSession(sessionId, userId)
}

function encodeSessionCookie(userId: string, token: string): string {
  return `${userId}:${token}`
}

export async function setSessionTokenCookie(
  token: string,
  userId: User["id"],
  expiresAt: Date
): Promise<void> {
  const cookies = await nextCookies()
  cookies.set("session", encodeSessionCookie(userId, token), {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookies = await nextCookies()
  cookies.delete("session")
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

function decodeSessionCookie(
  cookie: string
): { userId: string; token: string } | null {
  const parts = cookie.split(":")
  if (parts.length !== 2) return null
  return { userId: parts[0], token: parts[1] }
}

export async function validateRequest(): Promise<SessionValidationResult | null> {
  const cookies = await nextCookies()
  const sessionCookie = cookies.get("session")?.value ?? null
  if (!sessionCookie) {
    return null
  }

  const decoded = decodeSessionCookie(sessionCookie)

  if (!decoded || !decoded.token || !decoded.userId) {
    return null
  }

  const result = await validateSessionToken(decoded.token, decoded.userId)

  return result
}

export type SessionValidationResult = CacheSession | null
