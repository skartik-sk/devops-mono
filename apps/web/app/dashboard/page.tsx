"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { LinkGrid } from "@/components/link-grid"
import { LinkModal } from "@/components/link-modal"
import { AddLinkButton } from "@/components/add-link-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, BookmarkPlus, Tags, TrendingUp } from "lucide-react"

// Mock data for demonstration
const mockLinks = [
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
    id: "3",
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    description: "Learn TypeScript from the ground up with comprehensive guides.",
    tags: ["typescript", "javascript", "programming"],
    favicon: "/typescript-logo.jpg",
    createdAt: "2024-01-13",
    category: "Development",
  },
  {
    id: "4",
    title: "Figma Design System",
    url: "https://www.figma.com/design-systems/",
    description: "Best practices for creating and maintaining design systems in Figma.",
    tags: ["figma", "design-system", "ui-ux"],
    favicon: "/figma-logo.jpg",
    createdAt: "2024-01-12",
    category: "Design",
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
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState(null)

  const categories = ["All", "Development", "Design", "Tools", "Research"]

  const filteredLinks = mockLinks.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || link.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleLinkClick = (link) => {
    setSelectedLink(link)
    setIsModalOpen(true)
  }

  const handleAddLink = () => {
    setSelectedLink(null)
    setIsModalOpen(true)
  }

  const totalLinks = mockLinks.length
  const recentLinks = mockLinks.filter((link) => {
    const linkDate = new Date(link.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return linkDate >= weekAgo
  }).length

  const allTags = mockLinks.flatMap((link) => link.tags)
  const uniqueTags = [...new Set(allTags)].length

  const categoryStats = categories.slice(1).map((category) => ({
    name: category,
    count: mockLinks.filter((link) => link.category === category).length,
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

      <LinkGrid links={filteredLinks} onLinkClick={handleLinkClick} />

      <AddLinkButton onClick={handleAddLink} />

      <LinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} link={selectedLink} />
    </main>
  )
}
