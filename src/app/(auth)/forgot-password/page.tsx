import Link from "next/link"
import { redirect } from "next/navigation"

import { afterSignInUrl } from "@/config"
import { getCurrentUser } from "@/lib/session"
import { ForgotPasswordForm } from "@/containers/forgot-password-form"

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect(afterSignInUrl)
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
            Forgot Password?
          </h2>
          <p className="text-center text-base">
            Send yourself an email to reset your password
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
      <div>
        <p className="text-center">
          Remember your password?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
