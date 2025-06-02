"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function TailwindIndicator() {
  const { theme, setTheme } = useTheme()

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-1 left-1 z-50 flex items-center space-x-2 print:hidden">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
        <div className="block sm:hidden">xs</div>
        <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
          sm
        </div>
        <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
        <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
        <div className="hidden xl:block 2xl:hidden">xl</div>
        <div className="hidden 2xl:block">2xl</div>
      </div>
      <Button
        className="rounded-full bg-gray-800 hover:bg-gray-900"
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 text-white transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
