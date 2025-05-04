import { assertAuthenticated } from "@/lib/session"

export default async function SecureDashboardPage() {
  const user = await assertAuthenticated()

  return (
    <div>
      <p>Secure dashboard</p>
      <p>{JSON.stringify(user, null, 2)}</p>
    </div>
  )
}
