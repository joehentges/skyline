import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const tokenTypes = pgEnum("token_type", [
  "magic-link",
  "password-reset",
  "email-verification",
]);

export type TokenType = (typeof tokenTypes.enumValues)[number];

export const tokensTable = pgTable("tokens", {
  token: text("token").primaryKey().notNull(),
  type: tokenTypes("type").notNull(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
});

export type Token = typeof tokensTable.$inferSelect;
export type NewToken = typeof tokensTable.$inferInsert;
