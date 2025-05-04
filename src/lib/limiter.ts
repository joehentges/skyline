import { redis } from "@/client/redis"

import { getIp } from "./get-ip"

type Tracker = {
  count: number
  expiresAt: number
}

export async function rateLimitByIp({
  key = "global",
  limit = 1,
  window = 10000,
}: {
  key?: string
  limit?: number
  window?: number
}) {
  const ip = await getIp()

  if (!ip) {
    throw new Error("Rate limit exceeded")
  }

  await rateLimitByKey({
    key: `${ip}-${key}`,
    limit,
    window,
  })
}

export async function rateLimitByKey({
  key = "global",
  limit = 1,
  window = 10000,
}: {
  key?: string
  limit?: number
  window?: number // ms
}) {
  let tracker: Tracker = { count: 0, expiresAt: 0 }

  const cachedTracker = await redis.get(key)
  if (cachedTracker) {
    tracker = JSON.parse(cachedTracker)
  }

  if (tracker.expiresAt < Date.now()) {
    tracker.count = 0
    tracker.expiresAt = Date.now() + window
  }

  tracker.count += 1

  if (tracker.count > limit) {
    throw new Error("Rate limit exceeded")
  }

  await redis.set(key, JSON.stringify(tracker), "EX", window)
}
