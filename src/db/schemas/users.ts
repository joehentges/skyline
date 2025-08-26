import { createId } from "@paralleldrive/cuid2"
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const subscriptionStatuses = pgEnum("subscription_statuses", [
  "active",
  "inactive",
])
export type SubscriptionStatus =
  (typeof subscriptionStatuses.enumValues)[number]

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
  // stripe
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  subscriptionStatus: subscriptionStatuses("subscription_status"),
  subscriptionCancelled: boolean("subscription_canclled"),
  subscriptionPeriodEnd: timestamp("subscription_period_end", { mode: "date" }),
  lastSubscriptionRenewalDate: timestamp("last_subscription_renewal_date", {
    mode: "date",
  }),
  subscriptionPriceId: text("subscription_price_id"),
  // auth
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  passwordHash: text("password_hash").notNull(),
  // profile
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatar: text("avatar"),
})

export type User = typeof usersTable.$inferSelect
