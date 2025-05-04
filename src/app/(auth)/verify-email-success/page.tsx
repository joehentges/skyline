import Link from "next/link"

import { afterSignInUrl } from "@/config"
import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"

export default async function VerifyEmailSuccessPage() {
  const user = await getCurrentUser()

  return (
    <div className="relative flex h-screen flex-col px-4 py-8">
      <Link href="/">
        <p className="text-center text-3xl font-bold">
          upload<span className="text-primary">thing</span>
        </p>
      </Link>
      <div className="flex h-full flex-col items-center justify-center space-y-6">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Email Verified
        </h2>
        <p className="text-center text-base">
          Your email has been successfully verified
        </p>
        <Link href={user ? afterSignInUrl : "/sign-in"} className="w-full">
          <Button className="w-full">{user ? "Continue" : "Sign In"}</Button>
        </Link>
      </div>
    </div>
  )
}
