"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { secureNav } from "@/config/secure-nav"
import { cn } from "@/lib/utils"

export function SecureNav() {
  const pathname = usePathname()

  return (
    <div className="container flex flex-row space-x-8 text-sm">
      {secureNav.nav.map((link) => (
        <SecureNavLink
          key={link.label}
          label={link.label}
          href={link.href}
          isActive={pathname === link.href}
        />
      ))}
    </div>
  )
}

interface SecureNavLinkProps {
  label: string
  href: string
  isActive?: boolean
}

function SecureNavLink(props: SecureNavLinkProps) {
  const { label, href, isActive } = props

  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 border-background px-1 pb-2 transition-colors hover:border-primary/50",
        isActive ? "border-primary font-bold hover:border-primary" : ""
      )}
    >
      {label}
    </Link>
  )
}
