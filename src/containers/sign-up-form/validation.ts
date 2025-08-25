import { z } from "zod"

import { env } from "@/env"

export const userFormSchema = z.object({
  firstName: z
    .string()
    .min(3, "No less than 3 characters")
    .max(40, "No more than 40 characters"),
  lastName: z
    .string()
    .min(3, "No less than 3 characters")
    .max(80, "No more than 80 characters"),
  email: z.email(),
})

export const sendVerifyEmailActionSchema = z.object({
  email: z.email(),
})

export const verifyEmailFormSchema = z.object({
  otpSecret: z.string().min(1, "Missing secret"),
  token: z.string().length(6, "Must be 6 characters"),
})

export const commonlyUsedPasswords = [
  "Password!",
  "Qwerty123!",
  "P@ssword1",
  "Abcdefg1!",
  "1qazXsw2!",
]

export const reviewAndPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "No less than 8 characters")
      .max(80, "No more than 80 characters"),
    confirmPassword: z
      .string()
      .min(8, "No less than 8 characters")
      .max(80, "No more than 80 characters"),
    captchaToken: Boolean(env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY)
      ? z.string().min(1, "Please complete the captcha")
      : z.string().optional(),
  })
  .superRefine(({ password }, ctx) => {
    // Check for at least 3 of the 4 character types
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

    const characterTypeCount = [
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length

    if (characterTypeCount < 3) {
      ctx.addIssue({
        code: "custom",
        message:
          "Password must contain at least 3 of the following: an uppercase letter, a lowercase letter, a number, or a special character.",
        path: ["password"],
      })
    }

    // Check if the password is on the common passwords list
    if (commonlyUsedPasswords.includes(password.toLowerCase())) {
      ctx.addIssue({
        code: "custom",
        message:
          "This password is too commonly used. Please choose a different one.",
        path: ["password"],
      })
    }
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const signUpFormSchema = userFormSchema.extend(
  reviewAndPasswordFormSchema.shape
)
