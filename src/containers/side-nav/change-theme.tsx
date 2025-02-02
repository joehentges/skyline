"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

import { useDelayShow } from "./useDelayShow"

interface ChangeThemeProps {
  navExpanded: boolean
}

export function ChangeTheme(props: ChangeThemeProps) {
  const { navExpanded } = props
  const { theme, setTheme } = useTheme()

  const showThemeLabel = useDelayShow(navExpanded)

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "flex w-full items-center gap-x-5 p-2 transition-colors hover:bg-background/50",
        navExpanded ? "rounded-3xl" : "rounded-full"
      )}
    >
      <div>
        {theme === "dark" ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </div>

      <div
        className={cn(
          "flex items-center transition-all duration-500",
          showThemeLabel ? "w-full opacity-100" : "w-0 opacity-0"
        )}
      >
        {showThemeLabel && (
          <p className="whitespace-nowrap text-sm">
            {theme === "dark" ? "Dark" : "Light"} Theme
          </p>
        )}
      </div>
    </button>
  )
}
