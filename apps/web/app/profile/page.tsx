"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Switch } from "../../components/ui/switch"
import { Separator } from "../../components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { User, Mail, Calendar, Settings, Bell, Shield, Download, Upload, Trash2, Eye, EyeOff, Save } from "lucide-react"
import { API_BASE_URL, getApiUrl } from "../../lib/api-config"

interface UserStats {
  totalLinks: number
  collections: number
  tags: number
  linksThisMonth: number
}

interface UserData {
  name: string
  email: string
  avatar?: string
  joinDate: string
  bio?: string
  stats: UserStats
  preferences: {
    emailNotifications: boolean
    pushNotifications: boolean
    publicProfile: boolean
    showStats: boolean
    darkMode: boolean
    autoBackup: boolean
  }
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [savedLinks, setSavedLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
  })

  useEffect(() => {
    initializeUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchSavedLinks()
      setEditForm({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
      })
    }
  }, [currentUser])

  const initializeUser = async () => {
    try {
      let user = localStorage.getItem('currentUser')
      if (!user) {
        // Create a new user if none exists
        const newUser = {
          id: `user_${Date.now()}`,
          name: "Anonymous User",
          isPublic: true,
        }

        const response = await fetch(getApiUrl("users"), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        })

        if (response.ok) {
          const createdUser = await response.json()
          localStorage.setItem('currentUser', JSON.stringify(createdUser))
          setCurrentUser(createdUser)
        }
      } else {
        // Verify user exists in backend
        const userData = JSON.parse(user)
        const response = await fetch(getApiUrl("users", userData.id))

        if (response.ok) {
          const backendUser = await response.json()
          setCurrentUser(backendUser)
          localStorage.setItem('currentUser', JSON.stringify(backendUser))
        } else {
          // User doesn't exist in backend, create them
          const createResponse = await fetch(getApiUrl("users"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          })

          if (createResponse.ok) {
            const createdUser = await createResponse.json()
            localStorage.setItem('currentUser', JSON.stringify(createdUser))
            setCurrentUser(createdUser)
          }
        }
      }
    } catch (error) {
      console.error('Error initializing user:', error)
    }
  }

  const fetchSavedLinks = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/users/${currentUser.id}/saved-links`)
      if (response.ok) {
        const data = await response.json()
        setSavedLinks(data)
      }
    } catch (error) {
      console.error('Error fetching saved links:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserStats = () => {
    const allTags = new Set<string>()
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    let linksThisMonth = 0

    savedLinks.forEach((savedLink: any) => {
      const link = savedLink.link
      if (link.tags && Array.isArray(link.tags)) {
        link.tags.forEach((tag: string) => allTags.add(tag))
      }

      const linkDate = new Date(link.createdAt)
      if (linkDate.getMonth() === currentMonth && linkDate.getFullYear() === currentYear) {
        linksThisMonth++
      }
    })

    const collections = new Set(savedLinks.map((sl: any) => sl.link.collection?.name).filter(Boolean))

    return {
      totalLinks: savedLinks.length,
      collections: collections.size,
      tags: allTags.size,
      linksThisMonth,
    }
  }

  const handleSaveProfile = async () => {
    if (!currentUser) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          bio: editForm.bio,
        })
      })

      if (response.ok) {
        const updatedUser = { ...currentUser, name: editForm.name, bio: editForm.bio }
        setCurrentUser(updatedUser)
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handlePreferenceChange = async (key: string, value: boolean) => {
    if (!currentUser) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      })

      if (response.ok) {
        const updatedUser = { ...currentUser, [key]: value }
        setCurrentUser(updatedUser)
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Error updating preference:', error)
    }
  }

  const handleExportData = () => {
    // Mock export functionality
    console.log("Exporting user data...")
  }

  const handleDeleteAccount = () => {
    // Mock delete functionality
    console.log("Account deletion requested...")
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Profile</h1>
        <p className="text-lg text-muted-foreground text-pretty">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {currentUser?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-foreground">{currentUser?.name}</CardTitle>
              <p className="text-muted-foreground">{currentUser?.email}</p>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-2">
                <Calendar className="h-3 w-3" />
                <span>Joined {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground font-medium">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="mt-1 bg-background border-border"
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{currentUser?.bio || 'No bio available'}</p>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Display Name</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                ) : null}

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile} size="sm" className="flex-1">
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="w-full">
                      <User className="h-3 w-3 mr-1" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{getUserStats().totalLinks}</div>
                  <div className="text-xs text-muted-foreground">Total Links</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{getUserStats().collections}</div>
                  <div className="text-xs text-muted-foreground">Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{getUserStats().tags}</div>
                  <div className="text-xs text-muted-foreground">Tags</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{getUserStats().linksThisMonth}</div>
                  <div className="text-xs text-muted-foreground">This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={currentUser?.emailNotifications || false}
                  onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch
                  checked={currentUser?.pushNotifications || false}
                  onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                </div>
                <div className="flex items-center gap-2">
                  {currentUser?.publicProfile ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={currentUser?.isPublic || false}
                    onCheckedChange={(checked) => handlePreferenceChange("isPublic", checked)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Show Statistics</Label>
                  <p className="text-sm text-muted-foreground">Display your link statistics publicly</p>
                </div>
                <Switch
                  checked={currentUser?.showStats || false}
                  onCheckedChange={(checked) => handlePreferenceChange("showStats", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup your data</p>
                </div>
                <Switch
                  checked={currentUser?.autoBackup || false}
                  onCheckedChange={(checked) => handlePreferenceChange("autoBackup", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Download className="h-4 w-4" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Export Data</Label>
                  <p className="text-sm text-muted-foreground">Download all your links and collections</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Import Data</Label>
                  <p className="text-sm text-muted-foreground">Import links from a backup file</p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-3 w-3 mr-1" />
                  Import
                </Button>
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-destructive font-medium">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-foreground font-medium">Email Address</Label>
                <p className="text-sm text-muted-foreground mt-1">{currentUser?.email || 'No email available'}</p>
              </div>

              <div>
                <Label className="text-foreground font-medium">Member Since</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : 'Unknown'}
                </p>
              </div>

              <div>
                <Label className="text-foreground font-medium">Account Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Active
                  </Badge>
                  <span className="text-sm text-muted-foreground">Free Plan</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
