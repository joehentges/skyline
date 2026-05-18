import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const kvStoreTable = pgTable("kv_store", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});
