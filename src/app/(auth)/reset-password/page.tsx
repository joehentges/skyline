import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { AFTER_SIGN_IN_URL, REDIS_PREFIX } from "@/config"
import { redis } from "@/client/redis"
import { getCurrentUser } from "@/lib/session"
import { ResetPasswordForm } from "@/containers/reset-password-form"

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const user = await getCurrentUser()

  if (user) {
    redirect(AFTER_SIGN_IN_URL)
  }

  const { token } = await props.searchParams

  if (!token) {
    return notFound()
  }

  const resetTokenStr = await redis.get(
    `${REDIS_PREFIX.PASSWORD_RESET}:${token}`
  )

  if (!resetTokenStr) {
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
            Reset Your Password
          </h2>
          <p className="text-center text-base">
            Change your password to something more memorable
          </p>
        </div>
        <ResetPasswordForm token={token} />

        <div>
          <p className="text-center">
            Remember your password?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
