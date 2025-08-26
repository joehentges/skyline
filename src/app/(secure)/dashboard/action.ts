"use server"

import { redirect } from "next/navigation"

import { env } from "@/env"
import { stripe } from "@/client/stripe"

export async function onCheckoutClicked({
  email,
  id: userId,
}: {
  email: string
  id: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${env.HOST_NAME}/dashboard`,
    cancel_url: `${env.HOST_NAME}/dashboard`,
    customer_email: email,
    line_items: [
      {
        price: "price_1S06yRDVAP63KtqVljm9ceuY",
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
  })

  if (!session?.url) {
    throw new Error("Unable to create session")
  }
  redirect(session.url)
}

export async function onManageSubscriptionClicked({
  stripeCustomerId,
}: {
  stripeCustomerId: string | null
}) {
  if (!stripeCustomerId) {
    throw new Error("Unable to create session")
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${env.HOST_NAME}/dashboard`,
  })

  if (!session?.url) {
    throw new Error("Unable to create session")
  }

  redirect(session.url)
}
