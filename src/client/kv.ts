import { and, eq, gt, isNull, like, or, sql } from "drizzle-orm";

import { database } from "@/db";
import { kvStoreTable } from "@/db/schemas";

const notExpired = or(
  isNull(kvStoreTable.expiresAt),
  gt(kvStoreTable.expiresAt, sql`NOW()`)
);

export const kv = {
  async get(key: string): Promise<string | null> {
    const rows = await database
      .select({ value: kvStoreTable.value })
      .from(kvStoreTable)
      .where(and(eq(kvStoreTable.key, key), notExpired))
      .limit(1);
    return rows[0]?.value ?? null;
  },

  async set(
    key: string,
    value: string,
    ex?: "EX",
    ttlSeconds?: number
  ): Promise<void> {
    const expiresAt =
      ex === "EX" && ttlSeconds != null
        ? new Date(Date.now() + ttlSeconds * 1000)
        : null;
    await database
      .insert(kvStoreTable)
      .values({ key, value, expiresAt })
      .onConflictDoUpdate({
        target: kvStoreTable.key,
        set: { value, expiresAt },
      });
  },

  async del(key: string): Promise<void> {
    await database.delete(kvStoreTable).where(eq(kvStoreTable.key, key));
  },

  async keys(pattern: string): Promise<string[]> {
    const sqlPattern = pattern.replace(/\*/g, "%");
    const rows = await database
      .select({ key: kvStoreTable.key })
      .from(kvStoreTable)
      .where(and(like(kvStoreTable.key, sqlPattern), notExpired));
    return rows.map((r) => r.key);
  },

  async ttl(key: string): Promise<number> {
    const rows = await database
      .select({ expiresAt: kvStoreTable.expiresAt })
      .from(kvStoreTable)
      .where(and(eq(kvStoreTable.key, key), notExpired))
      .limit(1);
    if (!rows[0]) {
      return -2;
    }
    if (!rows[0].expiresAt) {
      return -1;
    }
    return Math.floor((rows[0].expiresAt.getTime() - Date.now()) / 1000);
  },

  async flushall(): Promise<void> {
    await database.delete(kvStoreTable);
  },

  async disconnect(): Promise<void> {
    // no-op: connection is managed by the shared postgres client
  },
};
