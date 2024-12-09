"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDownIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { signOutAction } from "./actions"

interface SecureHeaderUserDropdownProps {
  displayName: string
  navLinks: {
    label: string
    href: string
    mobileOnly?: boolean
  }[]
}

export function SecureHeaderUserDropdown(props: SecureHeaderUserDropdownProps) {
  const { displayName, navLinks } = props

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex flex-row items-center space-x-2">
        <Image
          src={`https://api.dicebear.com/9.x/initials/svg?scale=75&seed=${displayName}`}
          alt="avatar"
          className="rounded-xl"
          width={35}
          height={35}
        />
        <div className="flex flex-col items-start">
          <p className="text-sm">{displayName}</p>
          <p className="text-xs text-foreground/60">Jr UI/UX Designer</p>
        </div>
        <ChevronDownIcon className="w-4 transition-transform group-hover:translate-y-0.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px]">
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
