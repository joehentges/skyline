import { useState } from "react"
import Image from "next/image"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { signOutAction } from "./actions"
import { SecureMobileNavLink } from "./secure-mobile-nav-link"

interface SecureMobileNavUserDropdownProps {
  displayName: string
  navLinks: { label: string; href: string }[]
}

export function SecureMobileNavUserDropdown(
  props: SecureMobileNavUserDropdownProps
) {
  const { displayName, navLinks } = props

  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  return (
    <>
      <button
        className="flex w-full flex-row items-center space-x-3"
        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
      >
        <Image
          src={`https://api.dicebear.com/9.x/initials/svg?scale=75&seed=${displayName}`}
          alt="avatar"
          className="rounded-xl"
          width={35}
          height={35}
        />
        <div className="flex flex-col items-start text-sm">
          <p>{displayName}</p>
          <p className="text-xs text-foreground/60">Jr UI/UX Designer</p>
        </div>
        <ChevronDownIcon
          className={cn(
            "w-4 transition-transform",
            userDropdownOpen ? "rotate-180" : ""
          )}
        />
      </button>
      {userDropdownOpen && (
        <div className="flex flex-col space-y-5 border-b pb-4">
          {navLinks.map((link) => (
            <SecureMobileNavLink
              key={link.label}
              label={link.label}
              href={link.href}
            />
          ))}
          <button
            onClick={() => signOutAction()}
            className="text-left text-sm text-destructive"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  )
}
