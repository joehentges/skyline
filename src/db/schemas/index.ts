import { relations } from "drizzle-orm";

import { sessionsTable } from "./sessions";
import { userSubscriptionsTable } from "./user-subscriptions";
import { usersTable } from "./users";

export * from "./sessions";
export * from "./tokens";
export * from "./user-subscriptions";
export * from "./users";

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  subscription: one(userSubscriptionsTable, {
    fields: [usersTable.id],
    references: [userSubscriptionsTable.userId],
  }),
  sessions: many(sessionsTable),
}));

export const userSubscriptionsRelations = relations(
  userSubscriptionsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userSubscriptionsTable.userId],
      references: [usersTable.id],
    }),
  })
);

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));
