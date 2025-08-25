import React from "react"
import { CommandIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export const Logo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex w-fit items-center gap-x-1", className)}
      {...props}
    >
      <CommandIcon />
      <p className="font-header text-lg font-medium uppercase">
        {siteConfig.name}
      </p>
    </div>
  )
})
Logo.displayName = "Logo"
