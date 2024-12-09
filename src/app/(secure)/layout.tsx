import React from "react"

import { assertAuthenticated } from "@/lib/session"
import { SecureFooter } from "@/containers/secure-footer"
import { SecureHeader } from "@/containers/secure-header"
import { SecureMobileNav } from "@/containers/secure-mobile-nav"
import { SecureNav } from "@/containers/secure-nav"

interface SecureLayoutProps {
  children: React.ReactNode
}

export default async function SecureLayout(props: SecureLayoutProps) {
  const { children } = props

  const user = await assertAuthenticated()

  return (
    <div className="min-h-screen">
      <header>
        <div className="hidden space-y-3 border border-b md:block">
          <SecureHeader displayName={user.displayName} />
          <SecureNav />
        </div>
        <div className="block md:hidden">
          <SecureMobileNav displayName={user.displayName} />
        </div>
      </header>

      <main className="min-h-[calc(100vh-10.8rem)] md:min-h-[calc(100vh-10.05rem)]">
        {children}
      </main>

      <footer>
        <SecureFooter />
      </footer>
    </div>
  )
}
