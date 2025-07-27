import { createId } from "@paralleldrive/cuid2"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  dateCreated: timestamp("date_created", { mode: "date" })
    .notNull()
    .defaultNow(),
  dateUpdated: timestamp("date_updated", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  signUpIpAddress: text("sign_up_ip_address"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  passwordHash: text("password_hash"),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  stripeCustomerId: text("stripe_customer_id").notNull(),
})

export type User = typeof usersTable.$inferSelect
