import Link from "next/link"

import { secureNav } from "@/config/secure-nav"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <div className="border-t py-4">
      <div className="text-muted-foreground container flex flex-col justify-between gap-y-2 place-self-center self-center text-sm md:flex-row">
        <div>
          <p>© 2025 {siteConfig.name}</p>
        </div>

        <div className="flex flex-col gap-y-2 text-center md:flex-row md:gap-x-4">
          {secureNav.footer.right.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
