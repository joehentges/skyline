import { relations } from "drizzle-orm"

import { userSubscriptionsTable } from "./user-subscriptions"
import { usersTable } from "./users"

export * from "./users"
export * from "./user-subscriptions"

export const usersRelations = relations(usersTable, ({ one }) => ({
  subscription: one(userSubscriptionsTable, {
    fields: [usersTable.id],
    references: [userSubscriptionsTable.userId],
  }),
}))

export const userSubscriptionsRelations = relations(
  userSubscriptionsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userSubscriptionsTable.userId],
      references: [usersTable.id],
    }),
  })
)
