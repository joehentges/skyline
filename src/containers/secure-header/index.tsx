import { BellDotIcon, MessageSquareTextIcon } from "lucide-react"

import { secureNav } from "@/config/secure-nav"

import { SecureHeaderUserDropdown } from "./secure-header-user-dropdown"

interface SecureHeaderProps {
  displayName: string
}

export function SecureHeader(props: SecureHeaderProps) {
  const { displayName } = props

  return (
    <div className="container flex items-center justify-between py-3">
      <div className="flex flex-row items-center space-x-8">
        <p className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          <span className="text-4xl">t</span> trenning
        </p>
      </div>
      <div className="flex flex-row items-center space-x-10">
        <MessageSquareTextIcon className="w-5 cursor-pointer" />
        <BellDotIcon className="w-5 cursor-pointer hover:animate-bell-shake" />
        <SecureHeaderUserDropdown
          displayName={displayName}
          navLinks={secureNav.userNav}
        />
      </div>
    </div>
  )
}
