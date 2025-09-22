'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Edit, Trash2, ExternalLink, Globe, Lock } from "lucide-react"
import { Link } from "../lib/types"

interface LinkCardProps {
  link: Link
  onEdit: (link: Link) => void
  onDelete: (id: number) => void
}

export function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{link.title}</CardTitle>
              <Badge variant={link.isPublic ? "default" : "secondary"} className="text-xs">
                {link.isPublic ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                {link.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Created on {formatDate(link.createdAt)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(link)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(link.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">{link.url}</span>
            </a>
          </div>

          {link.description && (
            <p className="text-sm text-muted-foreground">{link.description}</p>
          )}

          {link.collection && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${link.collection.color}`} />
              <span className="text-xs text-muted-foreground">{link.collection.name}</span>
            </div>
          )}

          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {link.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}