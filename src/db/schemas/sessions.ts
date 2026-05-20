import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const authenticationTypes = pgEnum("authentication_type", [
  "password",
  "magic-link",
]);

export type AuthenticationType =
  (typeof authenticationTypes.enumValues)[number];

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  authenticationType: authenticationTypes("authentication_type").notNull(),
  city: text("city"),
  continent: text("continent"),
  country: text("country"),
  userAgent: text("user_agent"),
  ip: text("ip"),
});

export type Session = typeof sessionsTable.$inferSelect;
export type NewSession = typeof sessionsTable.$inferInsert;
