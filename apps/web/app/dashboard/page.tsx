'use client'

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/search-bar"
import { LinkGrid } from "@/components/link-grid"
import { LinkModal } from "@/components/link-modal"
import { AddLinkButton } from "@/components/add-link-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, BookmarkPlus, Tags, TrendingUp } from "lucide-react"
import { Link } from "../../lib/types"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState<Link | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const categories = ["All", "Development", "Design", "Tools", "Research"]

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (link.tags && link.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    // Simple category detection based on tags and description
    const linkCategory = link.tags?.[0] || "Other"
    const matchesCategory = selectedCategory === "All" || linkCategory.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const fetchLinks = async (search = "") => {
    try {
      setIsLoading(true)
      const url = search ? `/api/links?search=${encodeURIComponent(search)}` : '/api/links'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setLinks(data)
      }
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLinks(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleLinkEdit = (link: Link) => {
    setSelectedLink(link)
    setIsModalOpen(true)
  }

  const handleLinkDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        const response = await fetch(`/api/links/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setLinks(links.filter(link => link.id !== id))
        }
      } catch (error) {
        console.error('Error deleting link:', error)
      }
    }
  }

  const handleAddLink = () => {
    setSelectedLink(null)
    setIsModalOpen(true)
  }

  const totalLinks = links.length
  const recentLinks = links.filter((link) => {
    const linkDate = new Date(link.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return linkDate >= weekAgo
  }).length

  const allTags = links.flatMap((link) => link.tags || [])
  const uniqueTags = [...new Set(allTags)].length

  const categoryStats = categories.slice(1).map((category) => ({
    name: category,
    count: links.filter((link) => {
      const linkCategory = link.tags?.[0] || "Other"
      return linkCategory.toLowerCase() === category.toLowerCase()
    }).length,
  }))

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Dashboard</h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Overview of your link collection and recent activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Links</CardTitle>
            <BookmarkPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalLinks}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{recentLinks}</div>
            <p className="text-xs text-muted-foreground">Links added recently</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tags</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{uniqueTags}</div>
            <p className="text-xs text-muted-foreground">Unique tags used</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{categoryStats.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Category Breakdown</h2>
        <div className="flex flex-wrap gap-3">
          {categoryStats.map((category) => (
            <Badge key={category.name} variant="outline" className="px-3 py-2 text-sm bg-secondary/30 border-secondary">
              {category.name} ({category.count})
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search links, descriptions, or tags..." />
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <LinkGrid
        links={filteredLinks}
        onEdit={handleLinkEdit}
        onDelete={handleLinkDelete}
        isLoading={isLoading}
      />

      <AddLinkButton onClick={handleAddLink} />

      <LinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} link={selectedLink} />
    </main>
  )
}