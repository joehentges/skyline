import "dotenv/config"

import argon2 from "argon2"

import { stripe } from "@/client/stripe"

import { database, pg } from "./index"
import { usersTable } from "./schemas"

async function main() {
  // create stripe seed user
  const stripeCustomer = await stripe.customers.create({
    email: "delivered@resend.dev",
    name: "Seed Account",
    metadata: {
      signUpIpAddress: null,
    },
  })

  const passwordHash = await argon2.hash("password")
  await database
    .insert(usersTable)
    .values({
      stripeCustomerId: stripeCustomer.id,
      email: "delivered@resend.dev",
      passwordHash,
      signUpIpAddress: null,
      firstName: "Seed",
      lastName: "Account",
    })
    .returning()

  await pg.end()
}

main()
