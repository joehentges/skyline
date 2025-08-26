"use client"

import { useState } from "react"
import { useUserContext } from "@/contexts/user-context"

import { LoaderButton } from "@/components/loader-button"

import { onCheckoutClicked, onManageSubscriptionClicked } from "./action"

export function TempButton() {
  const { user } = useUserContext()
  const [isPending, setIsPending] = useState<boolean>(false)

  if (user.stripeCustomerId && user.subscriptionStatus === "active") {
    return (
      <LoaderButton
        isLoading={isPending}
        onClick={() => {
          setIsPending(true)
          onManageSubscriptionClicked(user)
        }}
      >
        manage subscription
      </LoaderButton>
    )
  }

  return (
    <LoaderButton
      isLoading={isPending}
      onClick={() => {
        setIsPending(true)
        onCheckoutClicked(user)
      }}
    >
      checkout
    </LoaderButton>
  )
}
