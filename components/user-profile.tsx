"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { User, Mail, Bell, Shield, Award, Target, Calendar, TrendingUp, Leaf, Settings, Edit } from "lucide-react"

interface UserProfileProps {
  userStats: {
    totalItems: number
    expiringItems: number
    wasteReduced: number
    moneySaved: number
    ecoPoints: number
    level: number
    streak: number
    rank: string
  }
}

export function UserProfile({ userStats }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [notifications, setNotifications] = useState({
    expiry: true,
    recipes: true,
    achievements: true,
    weekly: false,
  })

  const [userInfo, setUserInfo] = useState({
    name: "Alex Chen",
    email: "alex.chen@email.com",
    phone: "+65 9123 4567",
    location: "Singapore, Central",
    joinDate: "January 2024",
  })

  const levelProgress = ((userStats.ecoPoints % 1000) / 1000) * 100
  const nextLevelPoints = 1000 - (userStats.ecoPoints % 1000)

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  {userInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userInfo.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Award className="w-3 h-3" />
                    {userStats.rank}
                  </Badge>
                  <Badge variant="outline">Level {userStats.level}</Badge>
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="gap-2">
              <Edit className="w-4 h-4" />
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={userInfo.email} disabled={!isEditing} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={userInfo.phone} disabled={!isEditing} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={userInfo.location} disabled={!isEditing} className="mt-1" />
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Level Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Level</span>
                  <Badge variant="secondary">Level {userStats.level}</Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress to Level {userStats.level + 1}</span>
                    <span className="text-sm font-medium">{nextLevelPoints} points needed</span>
                  </div>
                  <Progress value={levelProgress} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Points</span>
                  <span className="font-semibold text-primary">{userStats.ecoPoints}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Impact
          </CardTitle>
          <CardDescription>Your contribution to reducing food waste in Singapore</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{userStats.streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{userStats.wasteReduced}%</p>
              <p className="text-sm text-muted-foreground">Waste Reduced</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Award className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">S${userStats.moneySaved}</p>
              <p className="text-sm text-muted-foreground">Money Saved</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Leaf className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{Math.round(userStats.wasteReduced * 0.5)}kg</p>
              <p className="text-sm text-muted-foreground">CO₂ Saved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Customize how you receive alerts and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="expiry-notifications">Expiry Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when items are about to expire</p>
            </div>
            <Switch
              id="expiry-notifications"
              checked={notifications.expiry}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, expiry: checked }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="recipe-notifications">Recipe Suggestions</Label>
              <p className="text-sm text-muted-foreground">Receive recipe ideas for expiring ingredients</p>
            </div>
            <Switch
              id="recipe-notifications"
              checked={notifications.recipes}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, recipes: checked }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="achievement-notifications">Achievement Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about new badges and milestones</p>
            </div>
            <Switch
              id="achievement-notifications"
              checked={notifications.achievements}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, achievements: checked }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-notifications">Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">Receive weekly reports on your progress</p>
            </div>
            <Switch
              id="weekly-notifications"
              checked={notifications.weekly}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weekly: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">{userInfo.joinDate}</p>
            </div>
            <Badge variant="outline">{userInfo.joinDate}</Badge>
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Mail className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
