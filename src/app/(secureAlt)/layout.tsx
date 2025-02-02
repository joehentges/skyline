import React from "react"

import { assertAuthenticated } from "@/lib/session"
import { SideNav } from "@/containers/side-nav"

interface SecureLayoutProps {
  children: React.ReactNode
}

export default async function SecureLayout(props: SecureLayoutProps) {
  const { children } = props

  const user = await assertAuthenticated()

  return (
    <div className="flex h-screen flex-row gap-x-4">
      <SideNav displayName={user.displayName} email={user.email} />
      <div className="relative flex-1">{children}</div>
    </div>
  )
}
