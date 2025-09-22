"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ThemeToggle } from "./theme-toggle"
import {
  Home,
  Search,
  FolderOpen,
  Tag,
  Heart,
  User,
  Plus,
  Menu,
  X
} from "lucide-react"
import { API_BASE_URL } from "../lib/api-config"

export function MainNav() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [savedCount, setSavedCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    initializeUser()
  }, [])

  const initializeUser = async () => {
    try {
      const user = localStorage.getItem('currentUser')
      if (user) {
        const userData = JSON.parse(user)
        setCurrentUser(userData)

        const savedResponse = await fetch(`${API_BASE_URL}/api/users/${userData.id}/saved-links`)
        if (savedResponse.ok) {
          const savedLinks = await savedResponse.json()
          setSavedCount(savedLinks.length)
        }
      }
    } catch (error) {
      console.error('Error initializing user:', error)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Discover', href: '/discover', icon: Search },
    { name: 'Collections', href: '/collections', icon: FolderOpen },
    { name: 'Tags', href: '/tags', icon: Tag },
    { name: 'Saved', href: '/saved', icon: Heart, badge: savedCount },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const NavItem = ({ item }: { item: any }) => {
    const Icon = item.icon
    const isActive = pathname === item.href

    return (
      <Link href={item.href}>
        <Button
          variant={isActive ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Icon className="h-4 w-4 mr-3" />
          {item.name}
          {item.badge > 0 && (
            <Badge variant="secondary" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-foreground">LinkVault</span>
              </Link>

              <div className="hidden md:flex items-center space-x-1">
                {navigation.slice(0, -1).map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="relative"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                        {item.badge > 0 && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/saved">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved ({savedCount})
                </Button>
              </Link>

              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-foreground">LinkVault</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/saved">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                  {savedCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                      {savedCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}