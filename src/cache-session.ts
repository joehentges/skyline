import "server-only";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { getUserFromDatabase } from "@/auth";
import { database } from "@/db";
import { sessionsTable } from "@/db/schemas";
import { getIp } from "@/lib/get-ip";

type CacheSessionUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDatabase>>,
  undefined
>;

export interface CacheSession {
  authenticationType: "password" | "magic-link";
  city?: string;
  continent?: string;
  country?: string;
  createdAt: number;
  expiresAt: number;
  id: string;
  ip?: string | null;
  user: CacheSessionUser;
  userAgent?: string | null;
  userId: string;
}

export interface CreateCacheSessionParams
  extends Omit<CacheSession, "id" | "createdAt" | "expiresAt"> {
  expiresAt: Date;
  sessionId: string;
}

export async function createCacheSession({
  sessionId,
  userId,
  expiresAt,
  user,
  authenticationType,
}: CreateCacheSessionParams): Promise<CacheSession> {
  const headersList = await headers();
  const ip = await getIp();
  const userAgent = headersList.get("user-agent");
  const city = headersList.get("cf-ipcity") ?? undefined;
  const continent = headersList.get("cf-ipcontinent") ?? undefined;
  const country = headersList.get("cf-ipcountry") ?? undefined;

  const allSessions = await getAllSessionsOfUser(userId);
  if (allSessions.length > 9) {
    const oldest = allSessions.reduce((prev, curr) =>
      curr.expiresAt < prev.expiresAt ? curr : prev
    );
    await deleteCacheSession(oldest.id, userId);
  }

  await database.insert(sessionsTable).values({
    id: sessionId,
    userId,
    expiresAt,
    authenticationType,
    ip,
    userAgent,
    city,
    continent,
    country,
  });

  return {
    id: sessionId,
    userId,
    expiresAt: expiresAt.getTime(),
    createdAt: Date.now(),
    ip,
    userAgent,
    city,
    continent,
    country,
    user,
    authenticationType,
  };
}

export async function getCacheSession(
  sessionId: string,
  userId: string
): Promise<CacheSession | null> {
  const row = await database.query.sessionsTable.findFirst({
    where: and(
      eq(sessionsTable.id, sessionId),
      eq(sessionsTable.userId, userId)
    ),
  });

  if (!row) {
    return null;
  }

  const user = await getUserFromDatabase(userId);
  if (!user) {
    return null;
  }

  return {
    id: row.id,
    userId: row.userId,
    expiresAt: row.expiresAt.getTime(),
    createdAt: row.createdAt.getTime(),
    ip: row.ip,
    userAgent: row.userAgent,
    city: row.city ?? undefined,
    continent: row.continent ?? undefined,
    country: row.country ?? undefined,
    user,
    authenticationType: row.authenticationType,
  };
}

export async function updateCacheSession(
  sessionId: string,
  userId: string,
  expiresAt: Date
): Promise<CacheSession | null> {
  const [updated] = await database
    .update(sessionsTable)
    .set({ expiresAt })
    .where(
      and(eq(sessionsTable.id, sessionId), eq(sessionsTable.userId, userId))
    )
    .returning();

  if (!updated) {
    return null;
  }

  const user = await getUserFromDatabase(userId);
  if (!user) {
    return null;
  }

  return {
    id: updated.id,
    userId: updated.userId,
    expiresAt: updated.expiresAt.getTime(),
    createdAt: updated.createdAt.getTime(),
    ip: updated.ip,
    userAgent: updated.userAgent,
    city: updated.city ?? undefined,
    continent: updated.continent ?? undefined,
    country: updated.country ?? undefined,
    user,
    authenticationType: updated.authenticationType,
  };
}

export async function deleteCacheSession(
  sessionId: string,
  userId: string
): Promise<void> {
  await database
    .delete(sessionsTable)
    .where(
      and(eq(sessionsTable.id, sessionId), eq(sessionsTable.userId, userId))
    );
}

export async function getAllSessionsOfUser(userId: string) {
  return await database.query.sessionsTable.findMany({
    where: eq(sessionsTable.userId, userId),
  });
}
