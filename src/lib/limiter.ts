import { getIp } from "./get-ip";

interface Tracker {
  count: number;
  expiresAt: number;
}

// Temporary in-process rate limit store — replace with Cloudflare edge rules later
const trackerMap = new Map<string, Tracker>();

export async function rateLimitByIp({
  key = "global",
  limit = 1,
  window = 10_000,
}: {
  key?: string;
  limit?: number;
  window?: number;
}) {
  const ip = await getIp();

  if (!ip) {
    throw new Error("Rate limit exceeded");
  }

  rateLimitByKey({
    key: `${ip}-${key}`,
    limit,
    window,
  });
}

export function rateLimitByKey({
  key = "global",
  limit = 1,
  window = 10_000,
}: {
  key?: string;
  limit?: number;
  window?: number;
}) {
  let tracker: Tracker = trackerMap.get(key) ?? { count: 0, expiresAt: 0 };

  if (tracker.expiresAt < Date.now()) {
    tracker = { count: 0, expiresAt: Date.now() + window };
  }

  tracker.count += 1;

  if (tracker.count > limit) {
    throw new Error("Rate limit exceeded");
  }

  trackerMap.set(key, tracker);
}
