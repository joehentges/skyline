import { headers as nextHeaders } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

import { env } from "@/env"
import { updateAllSessionsOfUser } from "@/cache-session"
import { stripe } from "@/client/stripe"
import { syncDatabaseWithStripe } from "@/lib/sync-database-with-stripe"

const allowedEvents: Stripe.Event.Type[] = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "invoice.marked_uncollectible",
  "invoice.payment_succeeded",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
]

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text()
  const headers = await nextHeaders()
  const signature = headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      {
        message: "Webhook secret or signature not found.",
      },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(`Webhook signature verification failed. ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    const userSubscription = await processEvent(event)

    if (userSubscription) {
      updateAllSessionsOfUser(userSubscription?.userId)
    }

    return NextResponse.json({ message: "success" })
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("api/webhooks/stripe - error", error)
    return new NextResponse(null, {
      status: 500,
    })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

async function processEvent(event: Stripe.Event) {
  if (allowedEvents.includes(event.type)) {
    const { customer: customerId } = event?.data?.object as {
      customer: string
    }

    if (typeof customerId !== "string") {
      throw new Error(
        `STRIPE WEBHOOK] CustomerID is not a string. Event type: ${event.type}`
      )
    }

    return syncDatabaseWithStripe(customerId)
  } else {
    console.log(`[STRIPE WEBHOOK] Ingoring event type: ${event.type}`)
  }
}
