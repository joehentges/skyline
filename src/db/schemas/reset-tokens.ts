import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./users"

export const resetTokens = pgTable("reset_tokens", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("token_expires_at", { mode: "date" }),
})

export type ResetToken = typeof resetTokens.$inferSelect
