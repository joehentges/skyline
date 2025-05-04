import { z } from "zod"

export const magicLinkFormSchema = z.object({
  email: z.string().email(),
})
