"use server"

import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { env } from "@/env"
import { database } from "@/db"
import { userSubscriptionsTable } from "@/db/schemas"
import { CacheSession } from "@/cache-session"
import { stripe } from "@/client/stripe"

export async function onCheckoutClicked(
  { id: userId, subscription: { customerId } }: CacheSession["user"],
  priceId: string
) {
  const userSubscription =
    await database.query.userSubscriptionsTable.findFirst({
      where: eq(userSubscriptionsTable.userId, userId),
    })
  if (userSubscription?.status === "active") {
    throw new Error("You already have an active subscription")
  }

  let session
  try {
    session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      success_url: `${env.HOST_NAME}/success?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.HOST_NAME}/dashboard`,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
      allow_promotion_codes: true,
    })
  } catch (error: any) {
    console.error("Error creating checkout session", error)
    throw new Error(
      "Failed to create checkout session. Please refresh and try again."
    )
  }
  redirect(session.url!)
}

export async function onManageSubscriptionClicked({
  subscription: { customerId },
}: CacheSession["user"]) {
  let session
  try {
    session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.HOST_NAME}/dashboard`,
    })
  } catch (error: any) {
    console.error("Error creating billing portal session", error)
    throw new Error(
      "Failed to create billing portal session. Please refresh and try again."
    )
  }
  redirect(session.url!)
}
