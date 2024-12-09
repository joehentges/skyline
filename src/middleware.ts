import { NextRequest, NextResponse } from "next/server"

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
}

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.append(
    "x-from",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  )
  return NextResponse.next({ request: { headers } })
}
