import { eq } from "drizzle-orm"

import { AFTER_SIGN_IN_URL, REDIS_PREFIX } from "@/config"
import { database } from "@/db"
import { usersTable } from "@/db/schemas"
import { updateAllSessionsOfUser } from "@/cache-session"
import { redis } from "@/client/redis"
import { rateLimitByIp } from "@/lib/limiter"
import { getCurrentUser } from "@/lib/session"

export const dynamic = "force-dynamic"

export const GET = async (request: Request) => {
  try {
    await rateLimitByIp({ key: "verify-email", limit: 5, window: 60000 })

    const existingSession = await getCurrentUser()

    if (!existingSession) {
      throw new Error("User not authenticated")
    }

    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (!token) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/sign-in",
        },
      })
    }

    const verifyEmailInfoStr = await redis.get(
      `${REDIS_PREFIX.EMAIL_VERIFICATION}:${token}`
    )

    if (!verifyEmailInfoStr) {
      throw new Error("Invalid token")
    }

    const verifyEmailInfo = JSON.parse(verifyEmailInfoStr) as {
      userId: string
      expiresAt: string
    }

    if (verifyEmailInfo.userId !== existingSession.id) {
      throw new Error("You are not authorized to verify this email")
    }

    // Check if token is expired (although KV should have auto-deleted it)
    if (new Date() > new Date(verifyEmailInfo.expiresAt)) {
      throw new Error("Token has expired")
    }

    const user = await database.query.usersTable.findFirst({
      where: eq(usersTable.id, verifyEmailInfo.userId),
    })

    if (!user) {
      throw new Error("User not found")
    }

    await database
      .update(usersTable)
      .set({
        emailVerified: new Date(),
      })
      .where(eq(usersTable.id, verifyEmailInfo.userId))

    await updateAllSessionsOfUser(verifyEmailInfo.userId)

    await redis.del(`${REDIS_PREFIX.EMAIL_VERIFICATION}:${token}`)

    return new Response(null, {
      status: 302,
      headers: {
        Location: AFTER_SIGN_IN_URL,
      },
    })
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("api/auth/verify-email - error", error)
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/sign-in",
      },
    })
  }
}
