import Link from "next/link";

import { secureNav } from "@/config/secure-nav";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <div className="border-t py-4">
      <div className="container flex flex-col justify-between gap-y-2 place-self-center self-center text-muted-foreground text-sm md:flex-row">
        <div className="mx-auto md:mx-0">
          <p>© 2025 {siteConfig.name}</p>
        </div>

        <div className="flex flex-col gap-y-2 text-center md:flex-row md:gap-x-4">
          {secureNav.footer.right.map((link) => (
            <Link
              className="transition-colors hover:text-foreground"
              href={link.href}
              key={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
