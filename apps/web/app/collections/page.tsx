"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { Plus, FolderOpen, LinkIcon, Calendar, MoreVertical, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../src/components/ui/dropdown-menu"

interface Collection {
  id: number
  name: string
  description?: string
  color: string
  createdAt: string
  _count: {
    links: number
  }
  links?: Array<{
    id: number
    title: string
    url: string
  }>
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
  })

  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/collections')
      if (response.ok) {
        const data = await response.json()
        setCollections(data)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async () => {
    if (newCollection.name.trim()) {
      try {
        const response = await fetch('http://localhost:8080/api/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newCollection,
            updatedAt: new Date().toISOString()
          }),
        })

        if (response.ok) {
          await fetchCollections()
          setNewCollection({ name: "", description: "", color: "bg-blue-500" })
          setIsCreateModalOpen(false)
        }
      } catch (error) {
        console.error('Error creating collection:', error)
      }
    }
  }

  const handleViewCollection = async (collection: Collection) => {
    try {
      const response = await fetch(`http://localhost:8080/api/links?collectionId=${collection.id}`)
      if (response.ok) {
        const links = await response.json()
        setSelectedCollection({
          ...collection,
          links
        })
        setIsViewModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching collection links:', error)
    }
  }

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/collections/${collectionId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchCollections()
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Collections</h1>
          <p className="text-lg text-muted-foreground text-pretty">Organize your links into themed collections</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Collection Name
                </Label>
                <Input
                  id="name"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  placeholder="Enter collection name"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  placeholder="Describe your collection"
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label className="text-foreground">Color</Label>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCollection({ ...newCollection, color })}
                      className={`w-8 h-8 rounded-full ${color} ${
                        newCollection.color === color
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateCollection} className="flex-1">
                  Create Collection
                </Button>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading collections...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card
              key={collection.id}
              className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${collection.color}`} />
                    <CardTitle className="text-foreground text-lg">{collection.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem className="text-foreground hover:bg-accent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteCollection(collection.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent onClick={() => handleViewCollection(collection)}>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{collection.description}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" />
                    <span>{collection._count.links} links</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewCollection(collection)
                  }}
                >
                  <FolderOpen className="h-3 w-3 mr-2" />
                  View Collection
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Collection View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full ${selectedCollection?.color}`} />
              <DialogTitle className="text-foreground text-xl">{selectedCollection?.name}</DialogTitle>
            </div>
          </DialogHeader>

          {selectedCollection && (
            <div className="space-y-6">
              <p className="text-muted-foreground">{selectedCollection.description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="outline" className="bg-secondary/30">
                  {selectedCollection.linkCount} links
                </Badge>
                <span>Created {new Date(selectedCollection.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-foreground">Links in this collection</h3>
                {selectedCollection.links && selectedCollection.links.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCollection.links.map((link) => (
                      <div key={link.id} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                        <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{link.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => window.open(link.url, "_blank")}>
                          Open
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No links in this collection yet</p>
                    <p className="text-sm">Add links from your dashboard or create new ones</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
