import Redis from "ioredis"

import { env } from "@/env"

export const redis = new Redis(env.REDIS_URL, {
  connectTimeout: 1000,
  retryStrategy: () => {
    redis.quit()
  },
})
