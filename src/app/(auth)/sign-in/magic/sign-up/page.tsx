import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { afterSignInUrl } from "@/config"
import { redis } from "@/client/redis"
import { getCurrentUser } from "@/lib/session"
import { MagicLinkSignUpForm } from "@/containers/magic-link-sign-up-form"

interface MagicLinkSignUpPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function MagicLinkSignUpPage(
  props: MagicLinkSignUpPageProps
) {
  const user = await getCurrentUser()

  if (user) {
    redirect(afterSignInUrl)
  }

  const { token } = await props.searchParams

  if (!token) {
    return notFound()
  }

  const magicSignInTokenStr = await redis.get(`magic-sign-in:${token}`)

  if (!magicSignInTokenStr) {
    return notFound()
  }

  return (
    <div className="flex h-full flex-col justify-between space-y-8 px-4 py-8">
      <Link href="/">
        <p className="text-center text-3xl font-bold">
          upload<span className="text-primary">thing</span>
        </p>
      </Link>
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Get Started
          </h2>
          <p className="text-center text-base">
            Add a name to create your account
          </p>
        </div>
        <MagicLinkSignUpForm token={token} />
      </div>
    </div>
  )
}
