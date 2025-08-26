import "dotenv/config"

import argon2 from "argon2"

import { stripe } from "@/client/stripe"

import { database, pg } from "./index"
import { usersTable, userSubscriptionsTable } from "./schemas"

async function main() {
  const passwordHash = await argon2.hash("password")
  const [user] = await database
    .insert(usersTable)
    .values({
      email: "delivered@resend.dev",
      emailVerified: new Date(),
      passwordHash,
      signUpIpAddress: null,
      firstName: "Seed",
      lastName: "Account",
    })
    .returning()

  const stripeCustomer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    metadata: {
      userId: user.id,
    },
  })

  await database
    .insert(userSubscriptionsTable)
    .values({
      userId: user.id,
      customerId: stripeCustomer.id,
    })
    .returning()

  await pg.end()
}

main()
