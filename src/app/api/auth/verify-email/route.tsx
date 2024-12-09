import { rateLimitByIp } from "@/lib/limiter"
import { verifyEmailUseCase } from "@/use-cases/auth"

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

    await verifyEmailUseCase(token)

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
