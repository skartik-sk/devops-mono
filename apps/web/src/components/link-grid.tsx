"use client"

import { LinkCard } from "./link-card"

interface Link {
  id: number
  title: string
  url: string
  description?: string
  tags?: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
  collectionId?: number
  collection?: {
    id: number
    name: string
    description?: string
    color: string
    isPublic: boolean
    createdAt: string
    updatedAt: string
  }
}

interface LinkGridProps {
  links: Link[]
  onEdit?: (link: Link) => void
  onDelete?: (link: Link) => void
  isLoading?: boolean
}

export function LinkGrid({ links, onEdit, onDelete, isLoading }: LinkGridProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔗</span>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No links found</h3>
        <p className="text-muted-foreground">Try adjusting your search or add some new links</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onClick={() => onEdit?.(link)}
        />
      ))}
    </div>
  )
}
