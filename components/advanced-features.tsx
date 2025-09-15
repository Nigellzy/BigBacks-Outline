"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Scan,
  MessageCircle,
  ShoppingCart,
  Users,
  Camera,
  Bot,
  ListPlus,
  Share2,
  Sparkles,
  Send,
  Plus,
  Check,
} from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate: string
  daysLeft: number
}

interface AdvancedFeaturesProps {
  inventory: InventoryItem[]
  onAddItem: (item: any) => void
}

// Mock data for chatbot and marketplace
const chatMessages = [
  { id: 1, type: "bot", message: "Hi! I'm your food waste assistant. How can I help you today?" },
  { id: 2, type: "user", message: "My bananas are getting overripe. What should I do?" },
  {
    id: 3,
    type: "bot",
    message:
      "Great question! Overripe bananas are perfect for banana bread, smoothies, or pancakes. You can also freeze them for later use in baking. Would you like me to suggest some specific recipes?",
  },
]

const marketplaceItems = [
  {
    id: 1,
    user: "Sarah Chen",
    item: "Fresh Vegetables",
    quantity: "2kg mixed",
    location: "Toa Payoh",
    distance: "0.8km",
    expires: "Tomorrow",
  },
  {
    id: 2,
    user: "Alex Wong",
    item: "Bread Loaves",
    quantity: "3 loaves",
    location: "Bishan",
    distance: "1.2km",
    expires: "Today",
  },
  {
    id: 3,
    user: "Maria Santos",
    item: "Dairy Products",
    quantity: "Milk & Yogurt",
    location: "Ang Mo Kio",
    distance: "2.1km",
    expires: "2 days",
  },
]

export function AdvancedFeatures({ inventory, onAddItem }: AdvancedFeaturesProps) {
  const [scanResult, setScanResult] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState(chatMessages)
  const [shoppingList, setShoppingList] = useState<string[]>([])
  const [newListItem, setNewListItem] = useState("")

  // Mock barcode scanning
  const handleBarcodeScan = async () => {
    setIsScanning(true)
    // Simulate API call to OpenFoodFacts
    setTimeout(() => {
      setScanResult({
        product_name: "Organic Whole Milk",
        brands: "Meiji",
        categories: "Dairy",
        image_url: "/glass-of-milk.png",
        nutriscore_grade: "b",
        ecoscore_grade: "c",
      })
      setIsScanning(false)
    }, 2000)
  }

  const addScannedItem = () => {
    if (scanResult) {
      onAddItem({
        name: scanResult.product_name,
        category: "Dairy",
        quantity: 1,
        unit: "carton",
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      })
      setScanResult(null)
    }
  }

  // Mock chatbot response
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = { id: messages.length + 1, type: "user", message: chatInput }
    setMessages((prev) => [...prev, userMessage])

    // Mock bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        message:
          "That's a great question! Based on your inventory, I'd suggest using your expiring items in a stir-fry or soup. Would you like me to find some specific recipes for you?",
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)

    setChatInput("")
  }

  // Generate smart shopping list
  const generateSmartList = () => {
    const suggestions = [
      "Bananas (running low)",
      "Milk (expires soon)",
      "Bread (weekly staple)",
      "Eggs (recipe ingredient)",
      "Onions (versatile ingredient)",
    ]
    setShoppingList(suggestions)
  }

  const addToShoppingList = () => {
    if (newListItem.trim()) {
      setShoppingList((prev) => [...prev, newListItem.trim()])
      setNewListItem("")
    }
  }

  const removeFromShoppingList = (index: number) => {
    setShoppingList((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scanner" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scanner">Barcode Scanner</TabsTrigger>
          <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
          <TabsTrigger value="shopping">Smart Shopping</TabsTrigger>
          <TabsTrigger value="marketplace">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5" />
                Barcode Scanner
              </CardTitle>
              <CardDescription>
                Scan product barcodes to quickly add items with nutritional and expiry information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!scanResult ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <Button onClick={handleBarcodeScan} disabled={isScanning} className="gap-2">
                    <Scan className="w-4 h-4" />
                    {isScanning ? "Scanning..." : "Start Scanning"}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">Point your camera at a product barcode</p>
                </div>
              ) : (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={scanResult.image_url || "/placeholder.svg"}
                      alt={scanResult.product_name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{scanResult.product_name}</h3>
                      <p className="text-sm text-muted-foreground">{scanResult.brands}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">Nutri-Score: {scanResult.nutriscore_grade?.toUpperCase()}</Badge>
                        <Badge variant="outline">Eco-Score: {scanResult.ecoscore_grade?.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addScannedItem} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Inventory
                    </Button>
                    <Button variant="outline" onClick={() => setScanResult(null)}>
                      Scan Another
                    </Button>
                  </div>
                </div>
              )}

              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Scanning barcodes automatically fills in product details, nutritional information, and suggests
                  optimal storage methods.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Food Waste Assistant
              </CardTitle>
              <CardDescription>Get personalized tips and advice for reducing food waste</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 border rounded-lg p-4 overflow-y-auto space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    placeholder="Ask about food storage, recipes, or waste reduction tips..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setChatInput("How to store vegetables properly?")}>
                    Storage Tips
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setChatInput("Recipe for expiring ingredients")}>
                    Recipe Ideas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shopping">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Smart Shopping List
              </CardTitle>
              <CardDescription>AI-generated shopping suggestions based on your consumption patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={generateSmartList} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Smart List
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Share List
                </Button>
              </div>

              {shoppingList.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Your Shopping List</h4>
                  <div className="space-y-2">
                    {shoppingList.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                        <span className="text-sm">{item}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => removeFromShoppingList(index)}>
                            <Check className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Add custom item..."
                  value={newListItem}
                  onChange={(e) => setNewListItem(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addToShoppingList()}
                />
                <Button onClick={addToShoppingList} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Alert>
                <ListPlus className="h-4 w-4" />
                <AlertDescription>
                  Smart suggestions are based on your consumption patterns, expiring items, and seasonal availability in
                  Singapore.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Community Marketplace
              </CardTitle>
              <CardDescription>Share excess food with neighbors and reduce community waste</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {marketplaceItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{item.item}</h4>
                        <p className="text-sm text-muted-foreground">by {item.user}</p>
                        <p className="text-sm">{item.quantity}</p>
                      </div>
                      <Badge variant={item.expires === "Today" ? "destructive" : "secondary"}>
                        Expires {item.expires}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {item.location} • {item.distance} away
                      </span>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full gap-2">
                <Share2 className="w-4 h-4" />
                Share Your Excess Food
              </Button>

              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  Connect with neighbors to share excess food before it expires. Help build a more sustainable
                  community!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
