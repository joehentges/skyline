import Link from "next/link"
import { redirect } from "next/navigation"

import { afterSignInUrl } from "@/config"
import { getCurrentUser } from "@/lib/session"
import { SignUpForm } from "@/containers/sign-up-form"

export default async function SignUpPage() {
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
            Get Started
          </h2>
          <p className="text-center text-base">
            Welcome to{" "}
            <span className="font-bold">
              upload<span className="text-primary">thing</span>
            </span>{" "}
            - Let&apos;s create your account
          </p>
        </div>
        <SignUpForm />
      </div>
      <div>
        <p className="text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
