import { eq } from "drizzle-orm"

import { TOKEN_LENGTH, TOKEN_TTL } from "@/config"
import { database } from "@/db"
import { MagicLink, magicLinks } from "@/db/schemas"

import { generateRandomToken } from "./utils"

export async function createMagicLinkToken(email: string): Promise<string> {
  const token = await generateRandomToken(TOKEN_LENGTH)
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL)

  await database
    .insert(magicLinks)
    .values({
      email,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: magicLinks.email,
      set: {
        token,
        tokenExpiresAt,
      },
    })

  return token
}

export async function getMagicLinkByToken(
  token: string
): Promise<MagicLink | undefined> {
  const existingToken = await database.query.magicLinks.findFirst({
    where: eq(magicLinks.token, token),
  })

  return existingToken
}

export async function deleteMagicToken(token: string): Promise<void> {
  await database.delete(magicLinks).where(eq(magicLinks.token, token))
}
