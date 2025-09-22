"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { SearchBar } from "../../src/components/search-bar"
import { ExternalLink, Globe, Clock, User, BookmarkPlus, Heart, Share2 } from "lucide-react"

interface PublicLink {
  id: number
  title: string
  url: string
  description?: string
  tags: string[]
  createdAt: string
  isPublic: boolean
  collection?: {
    name: string
    color: string
  }
}

interface User {
  id: string
  name: string
  bio?: string
  isPublic: boolean
  savedLinks: Array<{
    id: number
    linkId: number
    createdAt: string
    link: PublicLink
  }>
}

export default function DiscoverPage() {
  const [links, setLinks] = useState<PublicLink[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [savedLinkIds, setSavedLinkIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchPublicLinks()
    initializeUser()
  }, [currentPage])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1)
      fetchPublicLinks()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const initializeUser = async () => {
    try {
      let user = localStorage.getItem('currentUser')

      if (!user) {
        const newUser = {
          id: `user_${Date.now()}`,
          name: "Anonymous User",
          isPublic: true,
          savedLinks: []
        }
        localStorage.setItem('currentUser', JSON.stringify(newUser))
        user = JSON.stringify(newUser)
      }

      const userData = JSON.parse(user)
      setCurrentUser(userData)

      const savedResponse = await fetch(`http://localhost:8080/api/users/${userData.id}/saved-links`)
      if (savedResponse.ok) {
        const savedLinks = await savedResponse.json()
        setSavedLinkIds(new Set(savedLinks.map((sl: any) => sl.linkId)))
      }
    } catch (error) {
      console.error('Error initializing user:', error)
    }
  }

  const fetchPublicLinks = async () => {
    try {
      setLoading(true)
      const searchParam = searchQuery.trim() ? `&search=${encodeURIComponent(searchQuery)}` : ''
      const response = await fetch(`http://localhost:8080/api/public/links?page=${currentPage}&limit=12${searchParam}`)
      if (response.ok) {
        const data = await response.json()
        setLinks(data.links)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching public links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveLink = async (linkId: number) => {
    if (!currentUser) return

    try {
      const response = await fetch(`http://localhost:8080/api/users/${currentUser.id}/saved-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId })
      })

      if (response.ok) {
        setSavedLinkIds(prev => new Set(prev).add(linkId))
      }
    } catch (error) {
      console.error('Error saving link:', error)
    }
  }

  const handleUnsaveLink = async (linkId: number) => {
    if (!currentUser) return

    try {
      const response = await fetch(`http://localhost:8080/api/users/${currentUser.id}/saved-links`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId })
      })

      if (response.ok) {
        setSavedLinkIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(linkId)
          return newSet
        })
      }
    } catch (error) {
      console.error('Error unsaving link:', error)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Discover Public Links</h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Explore useful links shared by the LinkVault community
        </p>
      </div>

      <div className="mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search public links..."
          className="max-w-2xl"
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-secondary/30">
            <Globe className="h-3 w-3 mr-1" />
            {links.length} public links
          </Badge>
          {currentUser && (
            <Badge variant="outline" className="bg-secondary/30">
              <BookmarkPlus className="h-3 w-3 mr-1" />
              {savedLinkIds.size} saved
            </Badge>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading public links...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {links.map((link) => (
              <Card key={link.id} className="bg-card border-border hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-foreground truncate mb-1">
                        {link.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {getDomain(link.url)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {link.collection && (
                        <div
                          className={`w-3 h-3 rounded-full ${link.collection.color}`}
                          title={link.collection.name}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {link.description || 'No description available'}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {link.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {link.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{link.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>

                    {currentUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (savedLinkIds.has(link.id)) {
                            handleUnsaveLink(link.id)
                          } else {
                            handleSaveLink(link.id)
                          }
                        }}
                        className={savedLinkIds.has(link.id) ? "text-red-500" : "text-muted-foreground"}
                      >
                        <Heart className={`h-4 w-4 ${savedLinkIds.has(link.id) ? 'fill-current' : ''}`} />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {links.length === 0 && !loading && (
        <div className="text-center py-12">
          <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No public links found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Be the first to share a public link!'}
          </p>
        </div>
      )}
    </main>
  )
}