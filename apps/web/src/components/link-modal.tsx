"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Copy, Edit, Trash2, Calendar, Tag, Plus, X } from "lucide-react"
import { useState } from "react"

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

interface LinkModalProps {
  isOpen: boolean
  onClose: () => void
  link: Link | null
}

export function LinkModal({ isOpen, onClose, link }: LinkModalProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "Development",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")

  useState(() => {
    if (link && isEditing) {
      setFormData({
        title: link.title,
        url: link.url,
        description: link.description,
        category: link.category,
        tags: [...link.tags],
      })
    } else if (!link) {
      setFormData({
        title: "",
        url: "",
        description: "",
        category: "Development",
        tags: [],
      })
    }
  }, [link, isEditing])

  const categories = ["Development", "Design", "Tools", "Research", "Other"]

  const handleCopyUrl = async () => {
    if (link?.url) {
      await navigator.clipboard.writeText(link.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenLink = () => {
    if (link?.url) {
      window.open(link.url, "_blank", "noopener,noreferrer")
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim().toLowerCase()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = () => {
    if (formData.title.trim() && formData.url.trim()) {
      // Mock save functionality - in real app would save to database
      console.log("Saving link:", formData)

      // Reset form and close modal
      setFormData({
        title: "",
        url: "",
        description: "",
        category: "Development",
        tags: [],
      })
      setIsEditing(false)
      onClose()
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    if (link) {
      setFormData({
        title: link.title,
        url: link.url,
        description: link.description,
        category: link.category,
        tags: [...link.tags],
      })
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData({
      title: "",
      url: "",
      description: "",
      category: "Development",
      tags: [],
    })
  }

  if (!link || isEditing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{!link ? "Add New Link" : "Edit Link"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="url" className="text-foreground">
                  URL *
                </Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="bg-background border-border"
                />
              </div>

              <div>
                <Label htmlFor="title" className="text-foreground">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter link title"
                  className="bg-background border-border"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this link..."
                  className="bg-background border-border"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-foreground">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-foreground hover:bg-accent">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="bg-background border-border"
                  />
                  <Button type="button" onClick={handleAddTag} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={isEditing ? handleCancelEdit : onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.title.trim() || !formData.url.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {!link ? "Add Link" : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img src={link.favicon || "/placeholder.svg"} alt="" className="w-5 h-5 rounded" />
            <DialogTitle className="text-foreground text-lg">{link.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground leading-relaxed">{link.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {link.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Added {new Date(link.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{link.category}</span>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground font-mono truncate">{link.url}</span>
              <Button variant="ghost" size="sm" onClick={handleCopyUrl} className="flex-shrink-0">
                <Copy className="h-3 w-3 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>

            <Button onClick={handleOpenLink} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
