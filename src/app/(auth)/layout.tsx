import Link from "next/link"
import { redirect } from "next/navigation"
import { CommandIcon } from "lucide-react"

import { AFTER_SIGN_IN_URL } from "@/config"
import { getCurrentUser } from "@/lib/session"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (user) {
    redirect(AFTER_SIGN_IN_URL)
  }

  return (
    <div className="flex">
      <div className="bg-muted-foreground/20 hidden w-3/5 p-10 md:block">
        <Link href="/" className="flex w-fit items-center gap-x-1">
          <CommandIcon />
          <p className="font-header text-lg font-medium">PENDULEM</p>
        </Link>
      </div>

      <main className="flex min-h-screen w-full items-center justify-center">
        <div className="w-full max-w-128 p-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-x-1 md:hidden"
          >
            <CommandIcon />
            <p className="text-lg font-medium">
              upload<span className="text-primary">thing</span>
            </p>
          </Link>
          {children}
        </div>
      </main>
    </div>
  )
}
