import { eq } from "drizzle-orm"

import { database } from "@/db"
import { userSubscriptionsTable } from "@/db/schemas"
import { stripe } from "@/client/stripe"

export async function syncDatabaseWithStripe(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: "all",
      expand: ["data.default_payment_method"],
    })

    if (subscriptions.data.length < 1) {
      const [userSubscription] = await database
        .update(userSubscriptionsTable)
        .set({ status: null })
        .where(eq(userSubscriptionsTable.customerId, customerId))
        .returning()
      return userSubscription
    }

    const subscription = subscriptions.data[0]
    const paymentMethod =
      typeof subscription.default_payment_method !== "string"
        ? subscription.default_payment_method
        : null

    const subscriptionData = {
      subscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(
        subscription.items.data[0].current_period_end * 1000
      ),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      paymentMethodBrand: paymentMethod?.card?.brand ?? null,
      paymentMethodLast4: paymentMethod?.card?.last4 ?? null,
    }
    const [userSubscription] = await database
      .update(userSubscriptionsTable)
      .set(subscriptionData)
      .where(eq(userSubscriptionsTable.customerId, customerId))
      .returning()

    return userSubscription
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (error) {
    console.error("Error updating Stripe data", error)
    throw error
  }
}
