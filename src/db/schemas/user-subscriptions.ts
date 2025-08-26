import { createId } from "@paralleldrive/cuid2"
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { usersTable } from "./users"

export const subscriptionStatuses = pgEnum("subscription_status", [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
])
export type SubscriptionStatus =
  (typeof subscriptionStatuses.enumValues)[number]

export const userSubscriptionsTable = pgTable("user_subscriptions", {
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
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  customerId: text("customer_id").unique().notNull(),
  subscriptionId: text("subscription_id").unique(),
  status: subscriptionStatuses("status"),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  paymentMethodBrand: text("payment_method_brand"),
  paymentMethodLast4: text("payment_method_last_4"),
})

export type UserSubscription = typeof userSubscriptionsTable.$inferSelect
