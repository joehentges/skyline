import Link from "next/link"
import * as Icons from "lucide-react"

import { cn } from "@/lib/utils"

import { useDelayShow } from "./useDelayShow"

interface NavLinkProps {
  navExpanded: boolean
  icon: keyof typeof Icons
  label: string
  href: string
}

export function NavLink(props: NavLinkProps) {
  const { navExpanded, icon, label, href } = props

  const showThemeLabel = useDelayShow(navExpanded)

  const IconElement = Icons[icon] as unknown as React.ComponentType<
    React.SVGProps<SVGSVGElement>
  >

  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-x-5 p-2 transition-colors hover:bg-background/50",
        navExpanded ? "rounded-3xl" : "rounded-full"
      )}
    >
      <div>
        <IconElement className="h-5 w-5" />
      </div>

      <div
        className={cn(
          "flex items-center transition-all duration-500",
          showThemeLabel ? "w-full opacity-100" : "w-0 opacity-0"
        )}
      >
        {showThemeLabel && <p className="whitespace-nowrap text-sm">{label}</p>}
      </div>
    </Link>
  )
}
