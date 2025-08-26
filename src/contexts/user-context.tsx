"use client"

import { createContext, useContext } from "react"

import { CacheSession } from "@/cache-session"

export type UserDetails = {
  user: CacheSession["user"]
}

const Context = createContext<UserDetails | undefined>(undefined)
Context.displayName = "UserContext"

export function useUserContext() {
  const context = useContext(Context)
  if (!context) {
    throw new Error("UserContext is not available")
  }
  return context
}

interface UserContextProviderProps {
  user: CacheSession["user"]
  children: React.ReactNode
}

export function UserContextProvider(props: UserContextProviderProps) {
  const { user, children } = props

  return <Context.Provider value={{ user }}>{children}</Context.Provider>
}
