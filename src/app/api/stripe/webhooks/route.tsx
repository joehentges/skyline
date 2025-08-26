import { headers as nextHeaders } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import Stripe from "stripe"

import { env } from "@/env"
import { database } from "@/db"
import { User, usersTable } from "@/db/schemas"
import { updateAllSessionsOfUser } from "@/cache-session"
import { stripe } from "@/client/stripe"

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
    if (event.type === "checkout.session.completed") {
      // when the user subscribes for the first time
      const checkoutEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: { userId: User["id"] }
      }

      const subscription = (await stripe.subscriptions.retrieve(
        checkoutEvent.subscription as string
      )) as Stripe.Subscription
      const subscriptionItem = subscription.items.data[0]

      const [user] = await database
        .update(usersTable)
        .set({
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: "active",
          subscriptionCancelled: false,
          subscriptionPeriodEnd: new Date(
            subscriptionItem.current_period_end * 1000
          ),
          lastSubscriptionRenewalDate: new Date(
            subscriptionItem.current_period_start * 1000
          ),
          subscriptionPriceId: subscriptionItem.price.id,
        })
        .where(eq(usersTable.id, checkoutEvent.metadata.userId))
        .returning()

      updateAllSessionsOfUser(user.id)
    }
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription
      const subscriptionItem = subscription.items.data[0]
      const subscriptionStatus = ["active", "trialing"].includes(
        subscription.status
      )
        ? "active"
        : "inactive"

      const [user] = await database
        .update(usersTable)
        .set({
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscriptionStatus,
          subscriptionCancelled: subscription.cancel_at_period_end,
          subscriptionPeriodEnd: new Date(
            subscriptionItem.current_period_end * 1000
          ),
          lastSubscriptionRenewalDate: new Date(
            subscriptionItem.current_period_start * 1000
          ),
          subscriptionPriceId: subscriptionItem.price.id,
        })
        .where(eq(usersTable.stripeSubscriptionId, subscription.id))
        .returning()

      updateAllSessionsOfUser(user.id)
    }

    return NextResponse.json({ message: "success" })
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("api/webhooks/stripe - error", error)
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: "/sign-in/magic/error",
      },
    })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
