import Link from "next/link"

import { getCurrentUser } from "@/lib/session"

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-8">
      <Link href="/">home</Link>
      <div className="flex flex-col">
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
        <span>Home: {user?.displayName}</span>
      </div>
    </div>
  )
}
