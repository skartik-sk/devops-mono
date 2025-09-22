"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const toggleTheme = () => {
    console.log('Current theme:', theme, 'Resolved:', resolvedTheme)
    if (theme === 'light') {
      setTheme('dark')
      console.log('Setting to dark')
    } else if (theme === 'dark') {
      setTheme('system')
      console.log('Setting to system')
    } else {
      setTheme('light')
      console.log('Setting to light')
    }
  }

  const getCurrentIcon = () => {
    if (theme === 'light') return <Sun className="h-[1.2rem] w-[1.2rem]" />
    if (theme === 'dark') return <Moon className="h-[1.2rem] w-[1.2rem]" />
    return <Monitor className="h-[1.2rem] w-[1.2rem]" />
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme}>
      {getCurrentIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}