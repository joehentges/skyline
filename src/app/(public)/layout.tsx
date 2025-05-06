import React from "react"

import { Footer } from "@/containers/footer"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout(props: MarketingLayoutProps) {
  const { children } = props

  return (
    <div className="flex h-screen flex-col">
      <header>
        <p>header</p>
      </header>

      <main className="flex-grow">{children}</main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}
