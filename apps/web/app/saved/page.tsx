"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { SearchBar } from "../../src/components/search-bar"
import { ExternalLink, Clock, Trash2, Heart, FolderOpen, Tag as TagIcon } from "lucide-react"

interface SavedLink {
  id: number
  linkId: number
  createdAt: string
  link: {
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
}

export default function SavedPage() {
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    initializeUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchSavedLinks()
    }
  }, [currentUser])

  const initializeUser = async () => {
    try {
      let user = localStorage.getItem('currentUser')
      if (!user) {
        window.location.href = '/'
        return
      }
      setCurrentUser(JSON.parse(user))
    } catch (error) {
      console.error('Error initializing user:', error)
    }
  }

  const fetchSavedLinks = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/api/users/${currentUser.id}/saved-links`)
      if (response.ok) {
        const data = await response.json()
        setSavedLinks(data)
      }
    } catch (error) {
      console.error('Error fetching saved links:', error)
    } finally {
      setLoading(false)
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
        setSavedLinks(prev => prev.filter(sl => sl.linkId !== linkId))
      }
    } catch (error) {
      console.error('Error unsaving link:', error)
    }
  }

  const getAllTags = () => {
    const tagSet = new Set<string>()
    savedLinks.forEach(savedLink => {
      savedLink.link.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet)
  }

  const filteredLinks = savedLinks.filter(savedLink => {
    const link = savedLink.link
    const matchesSearch = !searchQuery ||
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = !filterTag || link.tags.includes(filterTag)

    return matchesSearch && matchesTag
  })

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
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Saved Links</h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Your personal collection of useful links
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search saved links..."
          className="max-w-2xl"
        />
      </div>

      {getAllTags().length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Filter by tags:</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTag(null)}
            >
              All
            </Button>
            {getAllTags().map(tag => (
              <Button
                key={tag}
                variant={filterTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTag(tag)}
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <Badge variant="outline" className="bg-secondary/30">
          <Heart className="h-3 w-3 mr-1" />
          {filteredLinks.length} saved links
        </Badge>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading saved links...</p>
          </div>
        </div>
      ) : (
        <>
          {filteredLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((savedLink) => (
                <Card key={savedLink.id} className="bg-card border-border hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg text-foreground truncate mb-1">
                          {savedLink.link.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getDomain(savedLink.link.url)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {savedLink.link.collection && (
                          <div
                            className={`w-3 h-3 rounded-full ${savedLink.link.collection.color}`}
                            title={savedLink.link.collection.name}
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(savedLink.link.url, '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {savedLink.link.description || 'No description available'}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {savedLink.link.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {savedLink.link.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{savedLink.link.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Saved {new Date(savedLink.createdAt).toLocaleDateString()}</span>
                        </div>
                        {savedLink.link.isPublic && (
                          <Badge variant="outline" className="text-xs">
                            Public
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnsaveLink(savedLink.linkId)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No saved links found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterTag ? 'Try adjusting your search or filters' : 'Start saving links you find useful!'}
              </p>
              <Button onClick={() => window.location.href = '/discover'}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Discover Links
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  )
}