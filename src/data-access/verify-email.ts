import { eq } from "drizzle-orm"

import { TOKEN_LENGTH, VERIFY_EMAIL_TTL } from "@/config"
import { database } from "@/db"
import { User, VerifyEmailToken, verifyEmailTokens } from "@/db/schemas"

import { generateRandomToken } from "./utils"

export async function createVerifyEmailToken(
  userId: User["id"]
): Promise<string> {
  const token = await generateRandomToken(TOKEN_LENGTH)
  const tokenExpiresAt = new Date(Date.now() + VERIFY_EMAIL_TTL)

  await database
    .insert(verifyEmailTokens)
    .values({
      userId,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: verifyEmailTokens.id,
      set: {
        token,
        tokenExpiresAt,
      },
    })

  return token
}

export async function getVerifyEmailToken(
  token: string
): Promise<VerifyEmailToken | undefined> {
  const existingToken = await database.query.verifyEmailTokens.findFirst({
    where: eq(verifyEmailTokens.token, token),
  })

  return existingToken
}

export async function deleteVerifyEmailToken(token: string): Promise<void> {
  await database
    .delete(verifyEmailTokens)
    .where(eq(verifyEmailTokens.token, token))
}
