import argon2 from "argon2"
import { eq } from "drizzle-orm"

import { database } from "@/db"
import { User, users } from "@/db/schemas"

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password)
}

export async function verifyPasswordHash(
  hash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(hash, password)
}

export async function getUser(userId: User["id"]): Promise<User | undefined> {
  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  })

  return user
}

export async function getUserByEmail(
  email: User["email"]
): Promise<User | undefined> {
  const user = await database.query.users.findFirst({
    where: eq(users.email, email),
  })

  return user
}

export async function verifyPassword(
  userId: User["id"],
  plainTextPassword: string
): Promise<boolean> {
  const user = await getUser(userId)

  if (!user) {
    return false
  }

  const hashedPassword = user.password

  if (!hashedPassword) {
    return false
  }

  return verifyPasswordHash(hashedPassword, plainTextPassword)
}

export async function updateUser(
  userId: User["id"],
  updatedUser: Partial<User>
): Promise<void> {
  await database.update(users).set(updatedUser).where(eq(users.id, userId))
}

export async function updatePassword(
  userId: User["id"],
  password: string,
  trx = database
): Promise<void> {
  const hash = await hashPassword(password)
  await trx
    .update(users)
    .set({
      password: hash,
    })
    .where(eq(users.id, userId))
}

export async function setEmailVerified(userId: User["id"]): Promise<void> {
  await database
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.id, userId))
}

export async function createUser(
  email: User["email"],
  password: string,
  displayName: User["displayName"]
): Promise<User> {
  const hash = await hashPassword(password)
  const [user] = await database
    .insert(users)
    .values({
      email,
      emailVerified: undefined,
      password: hash,
      displayName,
    })
    .returning()
  return user
}

export async function createMagicUser(
  email: User["email"],
  displayName: User["displayName"]
): Promise<User> {
  const [user] = await database
    .insert(users)
    .values({
      email,
      emailVerified: new Date(),
      password: undefined,
      displayName,
    })
    .returning()

  return user
}
