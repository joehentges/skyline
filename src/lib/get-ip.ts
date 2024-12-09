import { headers as nextHeaders } from "next/headers"

export async function getIp() {
  const headers = await nextHeaders()
  const forwardedFor = headers.get("x-forwarded-for")
  const realIp = headers.get("x-real-ip")

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  if (realIp) {
    return realIp.trim()
  }

  return null
}
