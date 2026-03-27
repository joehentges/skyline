import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { database } from "@/db";
import { userSubscriptionsTable } from "@/db/schemas";
import { assertAuthenticated } from "@/lib/session";
import { syncDatabaseWithStripe } from "@/lib/sync-database-with-stripe";

export const dynamic = "force-dynamic";

async function triggerStripeSync(userId: string) {
  const userSubscription =
    await database.query.userSubscriptionsTable.findFirst({
      where: eq(userSubscriptionsTable.userId, userId),
    });
  if (!userSubscription) {
    return;
  }

  return syncDatabaseWithStripe(userSubscription?.customerId);
}

async function ConfirmStripeSession() {
  const user = await assertAuthenticated();

  try {
    await triggerStripeSync(user.id);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Failed to sync with stripe {message}</div>;
  }

  redirect("/dashboard");
}

interface SuccessPageProps {
  searchParams: Promise<{
    stripe_session_id: string | undefined;
  }>;
}

export default async function SuccessPage(props: SuccessPageProps) {
  const { searchParams } = props;
  const { stripe_session_id } = await searchParams;

  console.log(`[stripe/success] Checkout sesion id: ${stripe_session_id}`);

  return (
    <div className="flex min-h-screen items-center justify-center text-xl">
      <Suspense fallback={<div>One moment...</div>}>
        <ConfirmStripeSession />
      </Suspense>
    </div>
  );
}
