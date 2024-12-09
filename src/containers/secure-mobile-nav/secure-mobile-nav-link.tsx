import Link from "next/link"

import { cn } from "@/lib/utils"

interface SecureMobileNavLinkProps {
  label: string
  href: string
  isActive?: boolean
}

export function SecureMobileNavLink(props: SecureMobileNavLinkProps) {
  const { label, href, isActive } = props

  return (
    <Link href={href} className={cn("text-sm", isActive ? "font-bold" : "")}>
      {label}
    </Link>
  )
}
