"use client";

import { createContext, useContext } from "react";

import type { CacheSession } from "@/cache-session";

export interface UserDetails {
  user: CacheSession["user"];
}

const Context = createContext<UserDetails | undefined>(undefined);
Context.displayName = "UserContext";

export function useUserContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("UserContext is not available");
  }
  return context;
}

interface UserContextProviderProps {
  children: React.ReactNode;
  user: CacheSession["user"];
}

export function UserContextProvider(props: UserContextProviderProps) {
  const { user, children } = props;

  return <Context.Provider value={{ user }}>{children}</Context.Provider>;
}
