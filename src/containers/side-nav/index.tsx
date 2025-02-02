"use client"

import { useState } from "react"
import { AlignJustifyIcon, XIcon } from "lucide-react"

import { secureNav } from "@/config/secure-nav"
import { User } from "@/db/schemas"
import { cn } from "@/lib/utils"

import { ChangeTheme } from "./change-theme"
import { NavLink } from "./nav-link"
import { UserDropdown } from "./user-dropdown"

interface SideNavProps {
  displayName: User["displayName"]
  email: User["email"]
}

export function SideNav(props: SideNavProps) {
  const { displayName, email } = props

  const [navExpanded, setNavExpanded] = useState<boolean>(false)

  return (
    <div
      className={cn(
        "flex flex-col justify-between bg-muted-foreground/30 p-4 transition-all duration-300 dark:bg-muted-foreground/10",
        navExpanded ? "w-[275px]" : "w-[70px]"
      )}
    >
      <div id="top-nav" className="flex flex-col gap-y-6">
        <button
          onClick={() => setNavExpanded(!navExpanded)}
          className="w-fit rounded-full p-2 transition-colors hover:bg-background/50"
        >
          {navExpanded ? (
            <XIcon className="h-5 w-5" />
          ) : (
            <AlignJustifyIcon className="h-5 w-5" />
          )}
        </button>
        <NavLink
          navExpanded={navExpanded}
          icon="HomeIcon"
          label="Home"
          href="/"
        />
      </div>

      <div id="bottom-nav" className="flex flex-col gap-y-6">
        <ChangeTheme navExpanded={navExpanded} />

        <UserDropdown
          navExpanded={navExpanded}
          displayName={displayName}
          email={email}
          navLinks={secureNav.userNav}
        />
      </div>
    </div>
  )
}
