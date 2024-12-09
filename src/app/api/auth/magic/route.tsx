import { afterSignInUrl } from "@/config"
import { rateLimitByIp } from "@/lib/limiter"
import { pathIsUrl } from "@/lib/path-is-url"
import { setSession } from "@/lib/session"
import { signInWithMagicLinkUseCase } from "@/use-cases/auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request): Promise<Response> {
  try {
    await rateLimitByIp({ key: "magic-token", limit: 5, window: 60000 })
    const url = new URL(request.url)
    const token = url.searchParams.get("token")
    const from = url.searchParams.get("from")

    if (!token) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/sign-in",
        },
      })
    }

    // verify the from param is not a url - only want paths
    const fromIsNotUrl = !pathIsUrl(from || "")

    const user = await signInWithMagicLinkUseCase(token)

    await setSession(user.id)

    return new Response(null, {
      status: 302,
      headers: {
        Location: fromIsNotUrl && from ? from : afterSignInUrl,
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
