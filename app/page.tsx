"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlusCircle, Leaf, TrendingDown, Award, Bell, Calendar, User, Settings, LogOut } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { AddItemModal } from "@/components/add-item-modal"
import { InventoryList } from "@/components/inventory-list"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { RecipeSuggestions } from "@/components/recipe-suggestions"
import { GamificationDashboard } from "@/components/gamification-dashboard"
import { AdvancedFeatures } from "@/components/advanced-features"
import { NotificationCenter } from "@/components/notification-center"
import { UserProfile } from "@/components/user-profile"

// Mock data for demonstration
const mockInventory = [
  { id: 1, name: "Bananas", category: "Fruits", quantity: 6, unit: "pieces", expiryDate: "2024-01-15", daysLeft: 2 },
  { id: 2, name: "Milk", category: "Dairy", quantity: 1, unit: "carton", expiryDate: "2024-01-18", daysLeft: 5 },
  { id: 3, name: "Bread", category: "Grains", quantity: 1, unit: "loaf", expiryDate: "2024-01-14", daysLeft: 1 },
  {
    id: 4,
    name: "Chicken Breast",
    category: "Meat",
    quantity: 500,
    unit: "grams",
    expiryDate: "2024-01-16",
    daysLeft: 3,
  },
  { id: 5, name: "Yogurt", category: "Dairy", quantity: 2, unit: "cups", expiryDate: "2024-01-13", daysLeft: 0 },
  { id: 6, name: "Lettuce", category: "Vegetables", quantity: 1, unit: "head", expiryDate: "2024-01-14", daysLeft: 1 },
  {
    id: 7,
    name: "Tomatoes",
    category: "Vegetables",
    quantity: 4,
    unit: "pieces",
    expiryDate: "2024-01-17",
    daysLeft: 4,
  },
]

const mockStats = {
  totalItems: 28,
  expiringItems: 5,
  wasteReduced: 85,
  moneySaved: 45,
  ecoPoints: 1250,
  level: 8,
  streak: 12,
  rank: "Eco Champion",
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [inventory, setInventory] = useState(mockInventory)
  const [userStats, setUserStats] = useState(mockStats)

  const handleLogin = () => {
    setIsAuthenticated(true)
    setShowAuthModal(false)
  }

  const handleAddItem = (item: any) => {
    const newItem = {
      id: inventory.length + 1,
      ...item,
      daysLeft: Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    }
    setInventory([...inventory, newItem])
    setShowAddItemModal(false)

    setUserStats((prev) => ({
      ...prev,
      ecoPoints: prev.ecoPoints + 10,
    }))
  }

  const handleRemoveItem = (itemId: number) => {
    setInventory((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleMarkAsUsed = (itemId: number, quantity = 1) => {
    const item = inventory.find((i) => i.id === itemId)
    if (!item) return

    if (quantity >= item.quantity) {
      // Remove item completely if all quantity consumed
      setInventory((prev) => prev.filter((item) => item.id !== itemId))
    } else {
      // Reduce quantity if partially consumed
      setInventory((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - quantity } : item)),
      )
    }

    // Award points based on expiry status
    if (item && item.daysLeft >= 0) {
      const points = item.daysLeft <= 1 ? 50 : item.daysLeft <= 3 ? 30 : 20
      setUserStats((prev) => ({
        ...prev,
        ecoPoints: prev.ecoPoints + points,
      }))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-balance">FreshTrack</CardTitle>
            <CardDescription className="text-pretty">
              Your smart companion for reducing food waste and saving money in Singapore
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <TrendingDown className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-sm font-medium">Reduce Waste</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Award className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-sm font-medium">Earn Points</p>
              </div>
            </div>
            <Button onClick={() => setShowAuthModal(true)} className="w-full" size="lg">
              Get Started
            </Button>
          </CardContent>
        </Card>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">FreshTrack</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Award className="w-3 h-3" />
                Level {userStats.level}
              </Badge>
              <Badge variant="outline" className="gap-1">
                {userStats.ecoPoints} points
              </Badge>
              <Badge variant="default" className="gap-1 bg-orange-500">
                {userStats.streak} day streak
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowNotifications(true)}>
              <Bell className="w-4 h-4" />
              <Badge variant="destructive" className="ml-1 px-1 text-xs">
                3
              </Badge>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsAuthenticated(false)}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{userStats.totalItems}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold text-destructive">{userStats.expiringItems}</p>
                </div>
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Waste Reduced</p>
                  <p className="text-2xl font-bold text-primary">{userStats.wasteReduced}%</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-primary" />
                </div>
              </div>
              <Progress value={userStats.wasteReduced} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Money Saved</p>
                  <p className="text-2xl font-bold text-primary">S${userStats.moneySaved}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="advanced">Smart Tools</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowAddItemModal(true)} className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          <TabsContent value="inventory">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Food Inventory</CardTitle>
                  <CardDescription>Track your groceries and get notified before they expire</CardDescription>
                </CardHeader>
                <CardContent>
                  <InventoryList items={inventory} onRemoveItem={handleRemoveItem} onMarkAsUsed={handleMarkAsUsed} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard inventory={inventory} />
          </TabsContent>

          <TabsContent value="recipes">
            <RecipeSuggestions inventory={inventory} />
          </TabsContent>

          <TabsContent value="achievements">
            <GamificationDashboard userStats={userStats} />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedFeatures inventory={inventory} onAddItem={handleAddItem} />
          </TabsContent>
        </Tabs>
      </main>

      <AddItemModal isOpen={showAddItemModal} onClose={() => setShowAddItemModal(false)} onAddItem={handleAddItem} />

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        inventory={inventory}
      />

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          <UserProfile userStats={userStats} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
