import "dotenv/config"

import argon2 from "argon2"

import { database, pg } from "./index"
import { usersTable } from "./schemas"

async function main() {
  const passwordHash = await argon2.hash("password")
  await database
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

  await pg.end()
}

main()
