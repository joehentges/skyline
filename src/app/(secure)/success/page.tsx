import { Suspense } from "react"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { database } from "@/db"
import { userSubscriptionsTable } from "@/db/schemas"
import { assertAuthenticated, getCurrentUser } from "@/lib/session"
import { syncDatabaseWithStripe } from "@/lib/sync-database-with-stripe"

export const dynamic = "force-dynamic"

async function triggerStripeSync() {
  const user = await getCurrentUser()
  if (!user) return

  const userSubscription =
    await database.query.userSubscriptionsTable.findFirst({
      where: eq(userSubscriptionsTable.userId, user.id),
    })
  if (!userSubscription) return

  return syncDatabaseWithStripe(userSubscription?.customerId)
}

async function ConfirmStripeSession() {
  const user = await assertAuthenticated()

  try {
    await triggerStripeSync()
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return <div>Failed to sync with stripe {error.message}</div>
  }

  redirect("/dashboard")
}

interface SuccessPageProps {
  searchParams: Promise<{
    stripe_session_id: string | undefined
  }>
}

export default async function SuccessPage(props: SuccessPageProps) {
  const { searchParams } = props
  const { stripe_session_id } = await searchParams

  console.log(`[stripe/success] Checkout sesion id: ${stripe_session_id}`)

  return (
    <div className="flex min-h-screen items-center justify-center text-xl">
      <Suspense fallback={<div>One moment...</div>}>
        <ConfirmStripeSession />
      </Suspense>
    </div>
  )
}
