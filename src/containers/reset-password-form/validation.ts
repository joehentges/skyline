import { z } from "zod"

import { passwordFormSchema } from "@/components/password-form-fields"

export const resetPasswordFormSchema = z
  .object({
    token: z.string().min(1),
  })
  .extend(passwordFormSchema.shape)
