import { z } from "zod"

import {
  passwordFormSchema,
  passwordFormSchemaSuperRefine,
} from "@/containers/password-form-fields/validation"

export const resetPasswordFormSchema = z
  .object({
    ...passwordFormSchema.shape,
    token: z.string().min(1),
  })
  .superRefine(passwordFormSchemaSuperRefine)
