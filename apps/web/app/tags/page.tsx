"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { SearchBar } from "../../src/components/search-bar"
import { LinkGrid } from "../../src/components/link-grid"
import { LinkModal } from "../../src/components/link-modal"
import { Tag, Hash, TrendingUp, Calendar, Filter } from "lucide-react"
import { getApiUrl } from "../../lib/api-config"

interface TagData {
  name: string
  count: number
  color: string
  trending?: boolean
  lastUsed?: string
  links?: Array<{
    id: number
    title: string
    url: string
    description?: string
    tags: string[]
    createdAt: string
  }>
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<TagData | null>(null)
  const [sortBy, setSortBy] = useState("count") // count, name, recent
  const [showTrendingOnly, setShowTrendingOnly] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState(null)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch(getApiUrl("links"))
      if (response.ok) {
        const links = await response.json()
        const tagMap = new Map<string, TagData>()

        links.forEach((link: any) => {
          if (link.tags && Array.isArray(link.tags)) {
            link.tags.forEach((tagName: string) => {
              if (!tagMap.has(tagName)) {
                tagMap.set(tagName, {
                  name: tagName,
                  count: 0,
                  color: getRandomColor(),
                  links: []
                })
              }
              const tag = tagMap.get(tagName)!
              tag.count++
              if (tag.links) {
                tag.links.push({
                  id: link.id,
                  title: link.title,
                  url: link.url,
                  description: link.description,
                  tags: link.tags,
                  createdAt: link.createdAt
                })
              }
            })
          }
        })

        const sortedTags = Array.from(tagMap.values()).sort((a, b) => b.count - a.count)
        setTags(sortedTags)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRandomColor = () => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-red-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const filteredTags = tags
    .filter((tag) => {
      const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTrending = !showTrendingOnly || tags.indexOf(tag) < trendingTags
      return matchesSearch && matchesTrending
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "recent":
          return b.count - a.count
        case "count":
        default:
          return b.count - a.count
      }
    })

  const handleTagClick = (tag: TagData) => {
    setSelectedTag(selectedTag?.name === tag.name ? null : tag)
  }

  const handleLinkClick = (link) => {
    setSelectedLink(link)
    setIsModalOpen(true)
  }

  const totalTags = tags.length
  const trendingTags = Math.floor(tags.length * 0.3)
  const totalLinks = tags.reduce((sum, tag) => sum + tag.count, 0)
  const mostUsedTag = tags.length > 0 ? tags[0] : { name: "None", count: 0 }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Tags</h1>
        <p className="text-lg text-muted-foreground text-pretty">Explore and manage your link tags</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalTags}</div>
            <p className="text-xs text-muted-foreground">Unique tags created</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{trendingTags}</div>
            <p className="text-xs text-muted-foreground">Tags trending up</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tagged Links</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalLinks}</div>
            <p className="text-xs text-muted-foreground">Total tagged links</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Most Used</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mostUsedTag.name}</div>
            <p className="text-xs text-muted-foreground">{mostUsedTag.count} links</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tags..." />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 text-sm bg-card border border-border rounded-md text-foreground"
            >
              <option value="count">Usage Count</option>
              <option value="name">Name</option>
              <option value="recent">Recently Used</option>
            </select>
          </div>

          <Button
            variant={showTrendingOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTrendingOnly(!showTrendingOnly)}
            className="text-sm"
          >
            <Filter className="h-3 w-3 mr-1" />
            Trending Only
          </Button>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading tags...</p>
            </div>
          </div>
        ) : (
          filteredTags.map((tag, index) => (
            <Card
              key={`${tag.name}-${index}`}
              className={`bg-card border-border cursor-pointer transition-all hover:shadow-lg ${
                selectedTag?.name === tag.name ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleTagClick(tag)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                  <span className="font-medium text-foreground">#{tag.name}</span>
                </div>
                {index < trendingTags && (
                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                    <TrendingUp className="h-2 w-2 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>

              <div className="text-sm text-muted-foreground mb-2">
                {tag.count} {tag.count === 1 ? "link" : "links"}
              </div>

              <div className="text-xs text-muted-foreground">
                Most used tag
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Selected Tag Links */}
      {selectedTag && selectedTag.links && selectedTag.links.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-4 h-4 rounded-full ${selectedTag.color}`} />
            <h2 className="text-2xl font-semibold text-foreground">Links tagged with #{selectedTag.name}</h2>
            <Badge variant="outline" className="bg-secondary/30">
              {selectedTag.links.length} {selectedTag.links.length === 1 ? "link" : "links"}
            </Badge>
          </div>

          <LinkGrid links={selectedTag.links} onEdit={handleLinkClick} />
        </div>
      )}

      {selectedTag && selectedTag.links.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No links found</h3>
          <p className="text-muted-foreground">This tag doesn't have any associated links yet</p>
        </div>
      )}

      <LinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} link={selectedLink} />
    </main>
  )
}
