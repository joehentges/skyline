"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronUpIcon } from "lucide-react"

import { User } from "@/db/schemas"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { signOutAction } from "./actions"
import { useDelayShow } from "./useDelayShow"

interface UserDropdownProps {
  navExpanded: boolean
  displayName: User["displayName"]
  email: User["email"]
  navLinks: {
    label: string
    href: string
    mobileOnly?: boolean
  }[]
}

export function UserDropdown(props: UserDropdownProps) {
  const { navExpanded, displayName, email, navLinks } = props

  const showDisplayName = useDelayShow(navExpanded)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex h-9 w-full flex-row items-center space-x-3">
        <Image
          src={`https://api.dicebear.com/9.x/initials/svg?scale=75&seed=${displayName}`}
          alt="avatar"
          className="rounded-xl"
          width={35}
          height={35}
        />
        <div
          className={cn(
            "flex w-full items-center transition-all duration-500",
            showDisplayName ? "opacity-100" : "opacity-0"
          )}
        >
          {showDisplayName && (
            <>
              <div className="flex w-full flex-col items-start">
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                  {displayName}
                </p>
                <p className="max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-foreground/60">
                  {email}
                </p>
              </div>
              <ChevronUpIcon className="w-4 transition-transform group-hover:-translate-y-0.5" />
            </>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={showDisplayName ? "min-w-[250px]" : "min-w-[200px]"}
      >
        {navLinks.map(
          (link) =>
            !link.mobileOnly && (
              <DropdownMenuItem key={link.label}>
                <Link href={link.href} className="w-full">
                  {link.label}
                </Link>
              </DropdownMenuItem>
            )
        )}
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onClick={() => signOutAction()}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
