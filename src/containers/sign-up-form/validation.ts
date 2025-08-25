import { z } from "zod"

import { env } from "@/env"
import {
  passwordFormSchema,
  passwordFormSchemaSuperRefine,
} from "@/containers/password-form-fields/validation"

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
  email: z.email(),
  token: z.string().length(6, "Must be 6 characters"),
})

export const reviewAndPasswordFormSchema = z
  .object({
    ...passwordFormSchema.shape,
    captchaToken: Boolean(env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY)
      ? z.string().min(1, "Please complete the captcha")
      : z.string().optional(),
  })
  .superRefine(passwordFormSchemaSuperRefine)

export const signUpFormSchema = userFormSchema.extend(
  reviewAndPasswordFormSchema.shape
)
