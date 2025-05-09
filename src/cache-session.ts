import "server-only"

import { headers } from "next/headers"

import { getUserFromDatabase } from "@/auth"
import { getIp } from "@/lib/get-ip"

import { redis } from "./client/redis"

const SESSION_PREFIX = "session:"

export function getSessionKey(userId: string, sessionId: string): string {
  return `${SESSION_PREFIX}${userId}:${sessionId}`
}

type CacheSessionUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDatabase>>,
  undefined
>

export interface CacheSession {
  id: string
  userId: string
  expiresAt: number
  createdAt: number
  user: CacheSessionUser
  country?: string
  city?: string
  continent?: string
  ip?: string | null
  userAgent?: string | null
  authenticationType?: "password" | "magic-link"
  passkeyCredentialId?: string
}

export interface CreateCacheSessionParams
  extends Omit<CacheSession, "id" | "createdAt" | "expiresAt"> {
  sessionId: string
  expiresAt: Date
}

export async function createCacheSession({
  sessionId,
  userId,
  expiresAt,
  user,
  authenticationType,
  passkeyCredentialId,
}: CreateCacheSessionParams): Promise<CacheSession> {
  const headersList = await headers()
  const session: CacheSession = {
    id: sessionId,
    userId,
    expiresAt: expiresAt.getTime(),
    createdAt: Date.now(),
    ip: await getIp(),
    userAgent: headersList.get("user-agent"),
    user,
    authenticationType,
    passkeyCredentialId,
  }

  // TODO We should limit the number of sessions per user to 10
  // If we have more than 10 sessions, we should delete the oldest session

  await redis.set(
    getSessionKey(userId, sessionId),
    JSON.stringify(session),
    "EX",
    Math.floor((expiresAt.getTime() - Date.now()) / 1000)
  )

  return session
}

export async function getCacheSession(
  sessionId: string,
  userId: string
): Promise<CacheSession | null> {
  const sessionStr = await redis.get(getSessionKey(userId, sessionId))
  if (!sessionStr) return null

  return JSON.parse(sessionStr) as CacheSession
}

export async function updateCacheSession(
  sessionId: string,
  userId: string,
  expiresAt: Date
): Promise<CacheSession | null> {
  const session = await getCacheSession(sessionId, userId)
  if (!session) return null

  const updatedUser = await getUserFromDatabase(userId)

  if (!updatedUser) {
    throw new Error("User not found")
  }

  const updatedSession: CacheSession = {
    ...session,
    expiresAt: expiresAt.getTime(),
    user: updatedUser,
  }

  await redis.set(
    getSessionKey(userId, sessionId),
    JSON.stringify(updatedSession),
    "EX",
    Math.floor((expiresAt.getTime() - Date.now()) / 1000)
  )

  return updatedSession
}

export async function deleteCacheSession(
  sessionId: string,
  userId: string
): Promise<void> {
  const session = await getCacheSession(sessionId, userId)
  if (!session) return

  await redis.del(getSessionKey(userId, sessionId))
}

export async function getAllSessionsOfUser(userId: string) {
  const keys = await redis.keys(`${getSessionKey(userId, "")}*`)

  const sessions = []
  for (const key of keys) {
    const ttl = await redis.ttl(key)
    const session = await redis.get(key)

    if (!ttl || !session) continue

    sessions.push({
      key,
      absoluteExpiration: ttl ? new Date(Date.now() + ttl * 1000) : undefined,
      session: JSON.parse(session) as CacheSession,
    })
  }

  return sessions
}

/**
 * Update all sessions of a user. It can only be called in a server actions and api routes.
 * @param userId
 */
export async function updateAllSessionsOfUser(userId: string) {
  const sessions = await getAllSessionsOfUser(userId)
  const newUserData = await getUserFromDatabase(userId)

  if (!newUserData) return

  for (const sessionObj of sessions) {
    const session = await redis.get(sessionObj.key)
    if (!session) continue

    const sessionData = JSON.parse(session) as CacheSession

    // Only update non-expired sessions
    if (
      sessionObj.absoluteExpiration &&
      sessionObj.absoluteExpiration.getTime() > Date.now()
    ) {
      const ttlInSeconds = Math.floor(
        (sessionObj.absoluteExpiration.getTime() - Date.now()) / 1000
      )

      await redis.set(
        sessionObj.key,
        JSON.stringify({
          ...sessionData,
          user: newUserData,
        }),
        "EX",
        ttlInSeconds
      )
    }
  }
}
