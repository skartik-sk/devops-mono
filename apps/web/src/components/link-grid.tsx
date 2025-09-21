"use client"

import { LinkCard } from "./link-card"

interface Link {
  id: string
  title: string
  url: string
  description: string
  tags: string[]
  favicon: string
  createdAt: string
  category: string
}

interface LinkGridProps {
  links: Link[]
  onLinkClick: (link: Link) => void
}

export function LinkGrid({ links, onLinkClick }: LinkGridProps) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onClick={() => onLinkClick(link)} />
      ))}
    </div>
  )
}
