'use client'

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { getApiUrl, getUserApiUrl } from "../../lib/api-config";
import { Link } from "../../lib/types"

interface LinkModalProps {
  isOpen: boolean
  onClose: () => void
  link?: Link | null
}

export function LinkModal({ isOpen, onClose, link }: LinkModalProps) {
  const [formData, setFormData] = useState({
    title: link?.title || "",
    url: link?.url || "",
    description: link?.description || "",
    tags: link?.tags?.join(", ") || "",
    isPublic: link?.isPublic || false,
    collectionId: link?.collectionId || ""
  })
  const [collections, setCollections] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchCollections()
    }
  }, [isOpen])

  const fetchCollections = async () => {
    try {
      const response = await fetch(getApiUrl("collections"))
      if (response.ok) {
        const data = await response.json()
        setCollections(data)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const tags = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const linkData = {
      title: formData.title,
      url: formData.url,
      description: formData.description || undefined,
      tags: tags.length > 0 ? tags : undefined,
      isPublic: formData.isPublic,
      collectionId: formData.collectionId ? parseInt(formData.collectionId) : undefined
    }

    try {
      const url = link
        ? getApiUrl("links", link.id.toString())
        : getApiUrl("links")

      const method = link ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      })

      if (response.ok) {
        onClose()
        window.location.reload()
      } else {
        console.error('Failed to save link')
      }
    } catch (error) {
      console.error('Error saving link:', error)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {link ? "Edit Link" : "Add New Link"}
          </DialogTitle>
          <DialogDescription>
            {link
              ? "Update the details of your saved link."
              : "Save a new link to your collection."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter link title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              URL *
            </label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Add a description or notes..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="react, tutorial, css (comma separated)"
            />
          </div>

          {collections.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="collection">Collection (Optional)</Label>
              <select
                id="collection"
                value={formData.collectionId}
                onChange={(e) => handleInputChange("collectionId", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">No Collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id.toString()}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
              />
              <Label htmlFor="isPublic">Make this link public</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Public links can be discovered and saved by other users
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {link ? "Update" : "Save"} Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}