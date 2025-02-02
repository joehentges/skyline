import Link from "next/link"

import { secureNav } from "@/config/secure-nav"
import { siteConfig } from "@/config/site"

export function SecureFooter() {
  return (
    <div className="border-t py-4">
      <div className="container flex flex-col items-center justify-between gap-y-2 text-sm text-muted-foreground md:flex-row">
        <div>
          <p>© 2025 {siteConfig.name}</p>
        </div>

        <div className="flex flex-col gap-y-2 text-center md:flex-row md:gap-x-4">
          {secureNav.footer.right.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
