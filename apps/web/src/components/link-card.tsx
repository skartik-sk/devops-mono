"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface LinkCardProps {
  link: Link
  onClick: () => void
}

export function LinkCard({ link, onClick }: LinkCardProps) {
  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(link.url, "_blank", "noopener,noreferrer")
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20 bg-card border-border"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img src={link.favicon || "/placeholder.svg"} alt="" className="w-4 h-4 rounded flex-shrink-0" />
            <h3 className="font-semibold text-foreground text-sm leading-tight truncate">{link.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={handleExternalClick}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{link.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {link.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-1 bg-secondary/50 text-secondary-foreground"
            >
              {tag}
            </Badge>
          ))}
          {link.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{link.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(link.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>{link.category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
