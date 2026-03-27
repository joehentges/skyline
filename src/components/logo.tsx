import { CommandIcon } from "lucide-react";
import React from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export const Logo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("flex w-fit items-center gap-x-1", className)}
      ref={ref}
      {...props}
    >
      <CommandIcon />
      <p className="font-header font-medium text-lg uppercase">
        {siteConfig.name}
      </p>
    </div>
  );
});
Logo.displayName = "Logo";
