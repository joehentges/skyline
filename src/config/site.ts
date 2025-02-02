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
  name: "Boilerplate",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 15.",
  url: "https://joehentges.dev",
  ogImage: "https://joehentges.dev/og.png",
  links: {
    github: "https://github.com/joehentges",
  },
}
