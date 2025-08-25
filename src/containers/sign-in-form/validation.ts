import { z } from "zod"

export const signInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Enter your password"),
  staySignedIn: z.boolean(),
})
