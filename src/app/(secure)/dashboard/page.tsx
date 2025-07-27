import { getAllSessionsOfUser } from "@/cache-session"
import { assertAuthenticated } from "@/lib/session"

export default async function SecureDashboardPage() {
  const user = await assertAuthenticated()
  const sessions = await getAllSessionsOfUser(user.id)

  return (
    <div>
      <p>Secure dashboard</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(sessions, null, "\t")}</pre>
    </div>
  )
}
