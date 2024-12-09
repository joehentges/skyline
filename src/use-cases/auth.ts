import { animals, colors, uniqueNamesGenerator } from "unique-names-generator"

import { CustomError, LoginError } from "@/errors"
import {
  createMagicLinkToken,
  deleteMagicToken,
  getMagicLinkByToken,
} from "@/data-access/magic-links"
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetToken,
} from "@/data-access/reset-tokens"
import {
  createMagicUser,
  createUser,
  getUserByEmail,
  setEmailVerified,
  updatePassword,
  updateUser,
  verifyPassword,
} from "@/data-access/users"
import { createTransaction } from "@/data-access/utils"
import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from "@/data-access/verify-email"

import {
  sendMagicLinkEmail,
  sendResetPasswordEmail,
  sendVerifyEmail,
} from "./utils"

export async function loginUseCase(email: string, password: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    throw new LoginError()
  }

  const isPasswordCorrect = await verifyPassword(user.id, password)

  if (!isPasswordCorrect) {
    throw new LoginError()
  }

  return { id: user.id }
}

export async function signUpUseCase(email: string, password: string) {
  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    throw new CustomError("Email is already in use")
  }

  const displayName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: " ",
    style: "capital",
  })
  const user = await createUser(email, password, displayName)

  const token = await createVerifyEmailToken(user.id)
  await sendVerifyEmail(email, token)

  return user
}

export async function verifyEmailUseCase(token: string) {
  const verifyEmailInfo = await getVerifyEmailToken(token)

  if (!verifyEmailInfo) {
    throw new CustomError("Invalid token")
  }

  if (verifyEmailInfo.tokenExpiresAt! < new Date()) {
    await deleteVerifyEmailToken(token)
    throw new CustomError("Token has expired")
  }

  const userId = verifyEmailInfo.userId

  await updateUser(userId, { emailVerified: new Date() })
  await deleteVerifyEmailToken(token)
  return userId
}

export async function sendMagicLinkUseCase(email: string, from?: string) {
  const token = await createMagicLinkToken(email)
  await sendMagicLinkEmail(email, token, from)
}

export async function signInWithMagicLinkUseCase(token: string) {
  const magicLinkInfo = await getMagicLinkByToken(token)

  if (!magicLinkInfo) {
    throw new CustomError("Token not found")
  }

  if (magicLinkInfo.tokenExpiresAt! < new Date()) {
    throw new CustomError("Token has expired")
  }

  const existingUser = await getUserByEmail(magicLinkInfo.email)

  if (existingUser) {
    await setEmailVerified(existingUser.id)
    await deleteMagicToken(token)
    return existingUser
  } else {
    const displayName = uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: " ",
      style: "capital",
    })
    const newUser = await createMagicUser(magicLinkInfo.email, displayName)
    await deleteMagicToken(token)
    return newUser
  }
}

export async function sendForgotPasswordUseCase(email: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    throw new CustomError("Email address not found")
  }

  const token = await createPasswordResetToken(user.id)

  await sendResetPasswordEmail(email, token)
}

export async function changePasswordUseCase(token: string, password: string) {
  const passwordResetInfo = await getPasswordResetToken(token)

  if (!passwordResetInfo) {
    throw new CustomError("Invalid token")
  }

  if (passwordResetInfo.tokenExpiresAt! < new Date()) {
    throw new CustomError("Token has expired")
  }

  const userId = passwordResetInfo.userId

  await createTransaction(async (trx) => {
    await deletePasswordResetToken(token, trx)
    await updatePassword(userId, password, trx)
  })
}
