import { z } from "zod"

import { passwordFormSchema } from "@/containers/password-form-fields/validation"

export const resetPasswordFormSchema = z
  .object({
    token: z.string().min(1),
  })
  .extend(passwordFormSchema.shape)
