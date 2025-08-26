import { redirect } from "next/navigation"

import { env } from "@/env"
import { getAllSessionsOfUser } from "@/cache-session"
import { stripe } from "@/client/stripe"
import { assertAuthenticated } from "@/lib/session"

import { TempButton } from "./temp"

export default async function SecureDashboardPage() {
  const user = await assertAuthenticated()
  const sessions = await getAllSessionsOfUser(user.id)

  return (
    <div>
      <p>Secure dashboard</p>
      <TempButton />
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(sessions, null, "\t")}</pre>
    </div>
  )
}
