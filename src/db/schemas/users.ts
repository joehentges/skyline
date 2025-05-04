import { createId } from "@paralleldrive/cuid2"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

const ROLES_ENUM = {
  ADMIN: "admin",
  USER: "user",
} as const

const roleTuple = Object.values(ROLES_ENUM) as [string, ...string[]]

export const usersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  dateCreated: timestamp("date_created", { mode: "date" }).defaultNow(),
  dateUpdated: timestamp("date_updated", { mode: "date" }).defaultNow(),
  signUpIpAddress: text("sign_up_ip_address"),
  role: text("role", {
    enum: roleTuple,
  })
    .default(ROLES_ENUM.USER)
    .notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  passwordHash: text("password_hash"),
  displayName: text("display_name").notNull(),
  /**
   * This can either be an absolute or relative path to an image
   */
  avatar: text("avatar"),
})

export type User = typeof usersTable.$inferSelect
