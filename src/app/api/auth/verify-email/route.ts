import { updateAllSessionsOfUser } from "@/cache-session"
import { eq } from "drizzle-orm"

import { database } from "@/db"
import { usersTable } from "@/db/schemas"
import { redis } from "@/client/redis"
import { rateLimitByIp } from "@/lib/limiter"

export const dynamic = "force-dynamic"

export const GET = async (request: Request) => {
  try {
    await rateLimitByIp({ key: "verify-email", limit: 5, window: 60000 })

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

    const verifyEmailInfoStr = await redis.get(`email-verification:${token}`)

    if (!verifyEmailInfoStr) {
      throw new Error("Invalid token")
    }

    const verifyEmailInfo = JSON.parse(verifyEmailInfoStr) as {
      userId: string
      expiresAt: string
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

    await redis.del(`email-verification:${token}`)

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/verify-email-success",
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
