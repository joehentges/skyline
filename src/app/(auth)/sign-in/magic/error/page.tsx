import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function MagicLinkErrorPage() {
  return (
    <div className="relative flex h-screen flex-col px-4 py-8">
      <Link href="/">
        <p className="text-center text-3xl font-bold">
          upload<span className="text-primary">thing</span>
        </p>
      </Link>
      <div className="flex h-full flex-col items-center justify-center space-y-6">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Expired Token
        </h2>
        <p className="text-center text-base">
          Sorry, this token was either expired or already used
        </p>
        <Link href="/sign-in" className="w-full">
          <Button className="w-full">Sign In</Button>
        </Link>
      </div>
    </div>
  )
}
