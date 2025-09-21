"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/search-bar"
import { LinkGrid } from "@/components/link-grid"
import { LinkModal } from "@/components/link-modal"
import { Tag, Hash, TrendingUp, Calendar, Filter } from "lucide-react"

// Mock tags data with associated links
const mockTags = [
  {
    id: "1",
    name: "react",
    count: 8,
    color: "bg-blue-500",
    trending: true,
    lastUsed: "2024-01-15",
    links: [
      {
        id: "1",
        title: "Next.js Documentation",
        url: "https://nextjs.org/docs",
        description: "The official Next.js documentation with guides, API reference, and examples.",
        tags: ["nextjs", "react", "documentation"],
        favicon: "/nextjs-logo.jpg",
        createdAt: "2024-01-15",
        category: "Development",
      },
      {
        id: "5",
        title: "React Patterns",
        url: "https://reactpatterns.com",
        description: "Common React patterns and best practices for building scalable applications.",
        tags: ["react", "patterns", "best-practices"],
        favicon: "/react-logo.jpg",
        createdAt: "2024-01-11",
        category: "Development",
      },
    ],
  },
  {
    id: "2",
    name: "css",
    count: 6,
    color: "bg-purple-500",
    trending: false,
    lastUsed: "2024-01-14",
    links: [
      {
        id: "2",
        title: "Tailwind CSS Components",
        url: "https://tailwindui.com",
        description: "Beautiful UI components built with Tailwind CSS.",
        tags: ["tailwind", "css", "components"],
        favicon: "/tailwind-logo.jpg",
        createdAt: "2024-01-14",
        category: "Design",
      },
      {
        id: "6",
        title: "CSS Grid Generator",
        url: "https://cssgrid-generator.netlify.app",
        description: "Interactive tool to generate CSS Grid layouts with visual interface.",
        tags: ["css", "grid", "tool"],
        favicon: "/css-logo.jpg",
        createdAt: "2024-01-10",
        category: "Tools",
      },
    ],
  },
  {
    id: "3",
    name: "documentation",
    count: 5,
    color: "bg-green-500",
    trending: true,
    lastUsed: "2024-01-15",
    links: [],
  },
  {
    id: "4",
    name: "design-system",
    count: 4,
    color: "bg-orange-500",
    trending: false,
    lastUsed: "2024-01-12",
    links: [],
  },
  {
    id: "5",
    name: "typescript",
    count: 7,
    color: "bg-indigo-500",
    trending: true,
    lastUsed: "2024-01-13",
    links: [],
  },
  {
    id: "6",
    name: "tools",
    count: 3,
    color: "bg-teal-500",
    trending: false,
    lastUsed: "2024-01-10",
    links: [],
  },
  {
    id: "7",
    name: "nextjs",
    count: 4,
    color: "bg-pink-500",
    trending: true,
    lastUsed: "2024-01-15",
    links: [],
  },
  {
    id: "8",
    name: "figma",
    count: 2,
    color: "bg-red-500",
    trending: false,
    lastUsed: "2024-01-12",
    links: [],
  },
]

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState(null)
  const [sortBy, setSortBy] = useState("count") // count, name, recent
  const [showTrendingOnly, setShowTrendingOnly] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState(null)

  const filteredTags = mockTags
    .filter((tag) => {
      const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTrending = !showTrendingOnly || tag.trending
      return matchesSearch && matchesTrending
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "recent":
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
        case "count":
        default:
          return b.count - a.count
      }
    })

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag?.id === tag.id ? null : tag)
  }

  const handleLinkClick = (link) => {
    setSelectedLink(link)
    setIsModalOpen(true)
  }

  const totalTags = mockTags.length
  const trendingTags = mockTags.filter((tag) => tag.trending).length
  const totalLinks = mockTags.reduce((sum, tag) => sum + tag.count, 0)
  const mostUsedTag = mockTags.reduce((prev, current) => (prev.count > current.count ? prev : current))

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
        {filteredTags.map((tag) => (
          <Card
            key={tag.id}
            className={`bg-card border-border cursor-pointer transition-all hover:shadow-lg ${
              selectedTag?.id === tag.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleTagClick(tag)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                  <span className="font-medium text-foreground">#{tag.name}</span>
                </div>
                {tag.trending && (
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
                Last used {new Date(tag.lastUsed).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Tag Links */}
      {selectedTag && selectedTag.links.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-4 h-4 rounded-full ${selectedTag.color}`} />
            <h2 className="text-2xl font-semibold text-foreground">Links tagged with #{selectedTag.name}</h2>
            <Badge variant="outline" className="bg-secondary/30">
              {selectedTag.links.length} {selectedTag.links.length === 1 ? "link" : "links"}
            </Badge>
          </div>

          <LinkGrid links={selectedTag.links} onLinkClick={handleLinkClick} />
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
