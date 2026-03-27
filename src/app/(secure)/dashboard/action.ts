"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import type { CacheSession } from "@/cache-session";
import { stripe } from "@/client/stripe";
import { database } from "@/db";
import { userSubscriptionsTable } from "@/db/schemas";
import { env } from "@/env";

export async function onCheckoutClicked(
  { id: userId, subscription: { customerId } }: CacheSession["user"],
  priceId: string
) {
  const userSubscription =
    await database.query.userSubscriptionsTable.findFirst({
      where: eq(userSubscriptionsTable.userId, userId),
    });
  if (userSubscription?.status === "active") {
    throw new Error("You already have an active subscription");
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      success_url: `${env.VERCEL_URL}/success?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.VERCEL_URL}/dashboard`,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId,
        },
      },
      allow_promotion_codes: true,
    });
  } catch (error: unknown) {
    console.error("Error creating checkout session", error);
    throw new Error(
      "Failed to create checkout session. Please refresh and try again."
    );
  }
  if (!session.url) {
    throw new Error("Checkout session did not return a URL.");
  }
  redirect(session.url);
}

export async function onManageSubscriptionClicked({
  subscription: { customerId },
}: CacheSession["user"]) {
  let session: Stripe.BillingPortal.Session;
  try {
    session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.VERCEL_URL}/dashboard`,
    });
  } catch (error: unknown) {
    console.error("Error creating billing portal session", error);
    throw new Error(
      "Failed to create billing portal session. Please refresh and try again."
    );
  }
  if (!session.url) {
    throw new Error("Billing portal session did not return a URL.");
  }
  redirect(session.url);
}
