import { redirect } from "next/navigation"

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
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-muted-foreground hidden h-full min-h-screen w-screen md:block md:w-[50vw]" />

      <main className="flex min-h-screen items-center justify-center">
        <div className="space-y-8 p-4 md:w-full lg:w-[75%] xl:w-[65%] 2xl:w-[54%]">
          {children}
        </div>
      </main>
    </div>
  )
}
