import Link from "next/link"
import { redirect } from "next/navigation"

import { afterSignInUrl } from "@/config"
import { getCurrentUser } from "@/lib/session"
import { MagicLinkForm } from "@/containers/magic-link-form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

export default async function MagicLinkPage() {
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
            Welcome
          </h2>
          <p className="text-center text-base">
            Send a{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-primary">
                  magic link
                </TooltipTrigger>
                <TooltipContent>
                  A magic link lets you to sign in / up without a password
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
            to your email to sign in
          </p>
        </div>
        <MagicLinkForm />
      </div>
      <div>
        <p className="text-center">
          Prefer to use a password?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
