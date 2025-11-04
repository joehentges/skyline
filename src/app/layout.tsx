import type { Metadata } from "next"
import { Inter, Roboto } from "next/font/google"

import "@/styles/globals.css"

import { siteConfig } from "@/config/site"
import { Providers } from "@/providers"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { TailwindIndicator } from "@/components/tailwind-indicator"

const fontBase = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-base",
})

const fontHeader = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-header",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Minnesota", "Engineer", "Software Engineer", "Portfolio"],
  authors: [
    {
      name: "Joe Hentges",
      url: "joehentges.dev",
    },
  ],
  creator: "Joe Hentges",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@joehentges",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-base antialiased",
          fontBase.variable,
          fontHeader.variable
        )}
      >
        <Providers>
          {children}
          <TailwindIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
