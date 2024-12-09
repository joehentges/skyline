type Link = {
  label: string
  href: string
}

type UserNav = Link & {
  mobileOnly?: boolean
}

interface SecureNav {
  userNav: UserNav[]
  nav: Link[]
  footer: {
    right: Link[]
  }
}

export const secureNav: SecureNav = {
  userNav: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Messages",
      href: "/messages",
      mobileOnly: true,
    },
    {
      label: "Notifications",
      href: "/notifications",
      mobileOnly: true,
    },
  ],
  nav: [
    {
      label: "Home",
      href: "/home",
    },
    {
      label: "My Learning",
      href: "/my-learning",
    },
    {
      label: "Catalog",
      href: "/catalog",
    },
    {
      label: "Favorites",
      href: "/favorites",
    },
  ],
  footer: {
    right: [
      {
        label: "Marketing",
        href: "/",
      },
      {
        label: "Blog",
        href: "/blog",
      },
    ],
  },
}
