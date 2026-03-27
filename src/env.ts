import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.string().optional(),
    VERCEL_URL: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    RESEND_EMAIL_FROM: z.string().min(1),
    DISABLE_EMAIL: z
      .string()
      .optional()
      .default("false")
      .transform((val) => val.toLowerCase() === "true"),
    CLOUDFLARE_TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_PRICE_ID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_DISABLE_TURNSTILE: z
      .string()
      .optional()
      .default("false")
      .transform((val) => val.toLowerCase() === "true"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
    DISABLE_EMAIL: process.env.DISABLE_EMAIL,
    CLOUDFLARE_TURNSTILE_SECRET_KEY:
      process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_DISABLE_TURNSTILE: process.env.NEXT_PUBLIC_DISABLE_TURNSTILE,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY:
      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
});
