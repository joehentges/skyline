import { z } from "zod"

import { env } from "@/env"

export const magicLinkSignUpFormSchema = z.object({
  displayName: z.string().min(3),
  token: z.string().min(1),
  captchaToken: Boolean(env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY)
    ? z.string().min(1, "Please complete the captcha")
    : z.string().optional(),
})
