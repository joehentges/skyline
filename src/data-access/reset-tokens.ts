import { eq } from "drizzle-orm"

import { TOKEN_LENGTH, TOKEN_TTL } from "@/config"
import { database } from "@/db"
import { ResetToken, resetTokens, User } from "@/db/schemas"

import { generateRandomToken } from "./utils"

export async function createPasswordResetToken(
  userId: User["id"]
): Promise<string> {
  const token = await generateRandomToken(TOKEN_LENGTH)
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL)

  await database
    .insert(resetTokens)
    .values({
      userId,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: resetTokens.id,
      set: {
        token,
        tokenExpiresAt,
      },
    })

  return token
}

export async function getPasswordResetToken(
  token: string
): Promise<ResetToken | undefined> {
  const existingToken = await database.query.resetTokens.findFirst({
    where: eq(resetTokens.token, token),
  })

  return existingToken
}

export async function deletePasswordResetToken(
  token: string,
  trx = database
): Promise<void> {
  await trx.delete(resetTokens).where(eq(resetTokens.token, token))
}
