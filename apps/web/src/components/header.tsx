"use client"

import { Button } from "../components/ui/button"
import { Settings, User, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <Link href="/dashboard">
              <h1 className="text-xl font-bold text-foreground hover:text-primary transition-colors">LinkVault</h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`transition-colors ${
                pathname === "/dashboard"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/collections"
              className={`transition-colors ${
                pathname === "/collections"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Collections
            </Link>
            <Link
              href="/tags"
              className={`transition-colors ${
                pathname === "/tags" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tags
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
