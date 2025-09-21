"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, Settings, Bell, Shield, Download, Upload, Trash2, Eye, EyeOff, Save } from "lucide-react"

// Mock user data
const mockUser = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "/diverse-user-avatars.png",
  joinDate: "2024-01-01",
  bio: "Frontend developer passionate about creating beautiful and functional web experiences. Love exploring new technologies and sharing knowledge with the community.",
  stats: {
    totalLinks: 42,
    collections: 8,
    tags: 24,
    linksThisMonth: 12,
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    publicProfile: true,
    showStats: true,
    darkMode: true,
    autoBackup: true,
  },
}

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: user.bio,
  })

  const handleSaveProfile = () => {
    setUser({
      ...user,
      name: editForm.name,
      bio: editForm.bio,
    })
    setIsEditing(false)
  }

  const handlePreferenceChange = (key, value) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        [key]: value,
      },
    })
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
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-foreground">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-2">
                <Calendar className="h-3 w-3" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
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
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{user.bio}</p>
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
                  <div className="text-2xl font-bold text-foreground">{user.stats.totalLinks}</div>
                  <div className="text-xs text-muted-foreground">Total Links</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{user.stats.collections}</div>
                  <div className="text-xs text-muted-foreground">Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{user.stats.tags}</div>
                  <div className="text-xs text-muted-foreground">Tags</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{user.stats.linksThisMonth}</div>
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
                  checked={user.preferences.emailNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch
                  checked={user.preferences.pushNotifications}
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
                  {user.preferences.publicProfile ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={user.preferences.publicProfile}
                    onCheckedChange={(checked) => handlePreferenceChange("publicProfile", checked)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Show Statistics</Label>
                  <p className="text-sm text-muted-foreground">Display your link statistics publicly</p>
                </div>
                <Switch
                  checked={user.preferences.showStats}
                  onCheckedChange={(checked) => handlePreferenceChange("showStats", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup your data</p>
                </div>
                <Switch
                  checked={user.preferences.autoBackup}
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
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              </div>

              <div>
                <Label className="text-foreground font-medium">Member Since</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(user.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
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
