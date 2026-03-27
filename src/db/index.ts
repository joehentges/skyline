import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";

import {
  subscriptionStatuses,
  userSubscriptionsRelations,
  userSubscriptionsTable,
  usersRelations,
  usersTable,
} from "./schemas";

const schema = {
  usersTable,
  userSubscriptionsTable,
  subscriptionStatuses,
  usersRelations,
  userSubscriptionsRelations,
};

type GlobalWithDatabase = typeof globalThis & {
  database?: PostgresJsDatabase<typeof schema>;
};

const globalForDb = globalThis as GlobalWithDatabase;

let database: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

if (env.NODE_ENV === "production") {
  pg = postgres(env.DATABASE_URL);
  database = drizzle(pg, { schema });
} else {
  if (!globalForDb.database) {
    pg = postgres(env.DATABASE_URL);
    globalForDb.database = drizzle(pg, { schema });
  }
  database = globalForDb.database;
}

export { database, pg };
