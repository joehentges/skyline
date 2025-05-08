import { eq } from "drizzle-orm"
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator"

import { afterSignInUrl } from "@/config"
import { database } from "@/db"
import { usersTable } from "@/db/schemas"
import { redis } from "@/client/redis"
import { getIp } from "@/lib/get-ip"
import { rateLimitByIp } from "@/lib/limiter"
import { setSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export async function GET(request: Request): Promise<Response> {
  try {
    await rateLimitByIp({ key: "magic-token", limit: 5, window: 60000 })
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

    const magicSignInInfoStr = await redis.get(`magic-sign-in:${token}`)

    if (!magicSignInInfoStr) {
      throw new Error("Invalid token")
    }

    const magicSignInInfo = JSON.parse(magicSignInInfoStr) as {
      email: string
      expiresAt: string
    }

    // Check if token is expired (although KV should have auto-deleted it)
    if (new Date() > new Date(magicSignInInfo.expiresAt)) {
      throw new Error("Token has expired")
    }

    const existingUser = await database.query.usersTable.findFirst({
      where: eq(usersTable.email, magicSignInInfo.email),
    })

    if (existingUser) {
      const [user] = await database
        .update(usersTable)
        .set({
          emailVerified: new Date(),
        })
        .where(eq(usersTable.id, existingUser.email))
        .returning()
      await setSession(user.id)
    } else {
      const [newUser] = await database
        .insert(usersTable)
        .values({
          email: magicSignInInfo.email,
          emailVerified: new Date(),
          signUpIpAddress: await getIp(),
          displayName: uniqueNamesGenerator({
            dictionaries: [colors, animals],
            separator: " ",
            style: "capital",
          }),
        })
        .returning()
      await setSession(newUser.id)
    }

    await redis.del(`magic-sign-in:${token}`)

    return new Response(null, {
      status: 302,
      headers: {
        Location: afterSignInUrl,
      },
    })
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("api/auth/magic - error", error)
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/sign-in/magic/error",
      },
    })
  }
}
