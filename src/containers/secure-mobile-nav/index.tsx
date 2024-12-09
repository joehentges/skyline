"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { AlignJustifyIcon, XIcon } from "lucide-react"

import { secureNav } from "@/config/secure-nav"
import { cn } from "@/lib/utils"
import { useScrollBlock } from "@/hooks/useScrollBlock"

import { SecureMobileNavLink } from "./secure-mobile-nav-link"
import { SecureMobileNavUserDropdown } from "./secure-mobile-nav-user-dropdown"

interface SecureMobileNavProps {
  displayName: string
}

export function SecureMobileNav(props: SecureMobileNavProps) {
  const { displayName } = props

  const pathname = usePathname()
  const { blockScroll, allowScroll } = useScrollBlock()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  function handleMobileNavButton() {
    setMobileNavOpen(!mobileNavOpen)
    if (mobileNavOpen) {
      allowScroll()
      return
    }
    blockScroll()
  }

  return (
    <>
      <div className="container flex h-16 items-center justify-between border-b py-3">
        <p className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          <span className="text-4xl">t</span> trenning
        </p>
        <span
          className="cursor-pointer"
          onClick={() => handleMobileNavButton()}
        >
          {mobileNavOpen ? <XIcon /> : <AlignJustifyIcon />}
        </span>
      </div>
      <div
        className={cn(
          "transition-all duration-300",
          mobileNavOpen ? "" : "-ml-[200vw]"
        )}
      >
        <div className="container absolute z-20 flex w-full flex-col space-y-5 border-b bg-background py-4">
          <SecureMobileNavUserDropdown
            displayName={displayName}
            navLinks={secureNav.userNav}
          />
          {secureNav.nav.map((link) => (
            <SecureMobileNavLink
              key={link.label}
              label={link.label}
              href={link.href}
              isActive={pathname === link.href}
            />
          ))}
        </div>
        <div className="absolute top-16 z-10 h-full w-full backdrop-blur-sm" />
      </div>
    </>
  )
}
