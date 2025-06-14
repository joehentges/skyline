import React from "react"

import { assertAuthenticated } from "@/lib/session"
import { Footer } from "@/containers/footer"

interface SecureLayoutProps {
  children: React.ReactNode
}

export default async function SecureLayout(props: SecureLayoutProps) {
  const { children } = props

  await assertAuthenticated()

  return (
    <div className="flex h-screen flex-col">
      <header>
        <p>header</p>
      </header>

      <main className="grow">{children}</main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}
