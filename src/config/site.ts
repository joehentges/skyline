type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Trenning",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 13.",
  url: "https://joehentges.dev",
  ogImage: "https://joehentges.dev/og.jpg",
  links: {
    github: "https://github.com/joeyhentges",
  },
}
