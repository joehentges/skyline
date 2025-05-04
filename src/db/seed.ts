import "dotenv/config"

import { animals, colors, uniqueNamesGenerator } from "unique-names-generator"

import { database, pg } from "./index"
import { usersTable } from "./schemas"

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user] = await database
    .insert(usersTable)
    .values({
      email: "testing@example.com",
      // password = 'password'
      passwordHash:
        "$argon2id$v=19$m=19456,t=2,p=1$i1xOrGnKrUIUfy0Mw2JFpQ$THIIWncQ9A3ASymUMSP4ziumdOAe3vIEdt3ZP8YF6a4",
      displayName: uniqueNamesGenerator({
        dictionaries: [colors, animals],
        separator: " ",
        style: "capital",
      }),
    })
    .onConflictDoNothing()
    .returning()

  await pg.end()
}

main()
