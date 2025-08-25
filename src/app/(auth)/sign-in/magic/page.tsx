import Link from "next/link"

import { MagicLinkForm } from "@/containers/magic-link-form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default async function MagicLinkPage() {
  return (
    <div className="flex h-full flex-col justify-between space-y-8 px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Welcome Back
          </h2>
          <p className="text-center">
            Send a{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-primary">
                  magic link
                </TooltipTrigger>
                <TooltipContent>
                  A magic link lets you to sign in without a password
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
