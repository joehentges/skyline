"use client"

import Link from "next/link"

import { AuthenticationError } from "@/errors"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string }
}) {
  const isAuthenticationError = AuthenticationError.instanceOf(error)

  if (isAuthenticationError) {
    return (
      <div className="container mx-auto min-h-screen space-y-8 py-12">
        <h1 className="text-4xl font-bold">Oops! You Need to Be Logged In</h1>
        <p className="text-lg">To access this page, please log in first.</p>

        <Button variant="default">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-screen space-y-8 py-12">
      <h1 className="text-4xl font-bold">Oops! Something went wrong</h1>
      <p className="text-lg">{error.message}</p>
    </div>
  )
}
