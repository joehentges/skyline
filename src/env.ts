import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.string().optional(),
    HOST_NAME: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    HOST_NAME: process.env.HOST_NAME,
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  },
})
