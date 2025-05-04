import Link from "next/link"
import { redirect } from "next/navigation"
import { WandSparkles } from "lucide-react"

import { afterSignInUrl } from "@/config"
import { getCurrentUser } from "@/lib/session"
import { SignInForm } from "@/containers/sign-in-form"
import { Button } from "@/components/ui/button"

export default async function SignInPage() {
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
            Welcome Back
          </h2>
          <p className="text-center text-base">
            Enter your email and password to access your account
          </p>
        </div>
        <SignInForm />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <Link href="/sign-in/magic">
          <Button variant="outline" className="w-full" type="submit" size="sm">
            <WandSparkles className="mr-2 h-4 w-4" /> Magic Link
          </Button>
        </Link>
      </div>

      <div>
        <p className="text-center">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
