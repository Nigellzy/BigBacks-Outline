"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, AlertTriangle, Clock, Search, ChefHat, CheckCircle } from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate: string
  daysLeft: number
}

interface InventoryListProps {
  items: InventoryItem[]
  onRemoveItem?: (itemId: number) => void
  onMarkAsUsed?: (itemId: number, quantity: number) => void
}

export function InventoryList({ items, onRemoveItem, onMarkAsUsed }: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [expiryFilter, setExpiryFilter] = useState("All Items")
  const [consumeModal, setConsumeModal] = useState<{ isOpen: boolean; item: InventoryItem | null }>({
    isOpen: false,
    item: null,
  })
  const [consumeQuantity, setConsumeQuantity] = useState(1)

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter
    const matchesExpiry =
      expiryFilter === "All Items" ||
      (expiryFilter === "Expired" && item.daysLeft < 0) ||
      (expiryFilter === "Expiring Soon" && item.daysLeft >= 0 && item.daysLeft <= 3) ||
      (expiryFilter === "Fresh" && item.daysLeft > 3)

    return matchesSearch && matchesCategory && matchesExpiry
  })

  const getExpiryStatus = (daysLeft: number) => {
    if (daysLeft < 0)
      return { color: "text-red-600", icon: AlertTriangle, text: `Expired ${Math.abs(daysLeft)} days ago` }
    if (daysLeft === 0) return { color: "text-red-600", icon: AlertTriangle, text: "Expires today" }
    if (daysLeft <= 3) return { color: "text-orange-600", icon: Clock, text: `${daysLeft} days left` }
    return { color: "text-gray-600", icon: Clock, text: `${daysLeft} days left` }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Fruits: "bg-orange-100 text-orange-800",
      Vegetables: "bg-green-100 text-green-800",
      Dairy: "bg-blue-100 text-blue-800",
      Meat: "bg-red-100 text-red-800",
      Grains: "bg-yellow-100 text-yellow-800",
      Pantry: "bg-purple-100 text-purple-800",
      Frozen: "bg-cyan-100 text-cyan-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors["Other"]
  }

  const findRecipe = (itemName: string) => {
    const recipesByIngredient: Record<
      string,
      Array<{ name: string; time: string; difficulty: string; description: string }>
    > = {
      Bananas: [
        {
          name: "Banana Bread",
          time: "45 mins",
          difficulty: "Easy",
          description: "Classic moist banana bread perfect for overripe bananas",
        },
        {
          name: "Banana Smoothie",
          time: "5 mins",
          difficulty: "Easy",
          description: "Creamy breakfast smoothie with banana and yogurt",
        },
        {
          name: "Banana Pancakes",
          time: "20 mins",
          difficulty: "Medium",
          description: "Fluffy pancakes with mashed banana",
        },
      ],
      Milk: [
        {
          name: "Creamy Mushroom Soup",
          time: "25 mins",
          difficulty: "Medium",
          description: "Rich and creamy soup using fresh milk",
        },
        { name: "Custard", time: "20 mins", difficulty: "Medium", description: "Smooth vanilla custard dessert" },
      ],
      Bread: [
        {
          name: "Bread Pudding",
          time: "40 mins",
          difficulty: "Easy",
          description: "Sweet dessert using day-old bread",
        },
        {
          name: "French Toast",
          time: "15 mins",
          difficulty: "Easy",
          description: "Classic breakfast with crispy exterior",
        },
      ],
      "Chicken Breast": [
        {
          name: "Chicken Curry",
          time: "35 mins",
          difficulty: "Medium",
          description: "Spicy and aromatic chicken curry",
        },
        {
          name: "Chicken Stir Fry",
          time: "15 mins",
          difficulty: "Easy",
          description: "Quick and healthy stir-fried chicken",
        },
      ],
      Yogurt: [
        {
          name: "Yogurt Parfait",
          time: "5 mins",
          difficulty: "Easy",
          description: "Layered yogurt with fruits and granola",
        },
        {
          name: "Smoothie Bowl",
          time: "10 mins",
          difficulty: "Easy",
          description: "Thick smoothie bowl with toppings",
        },
      ],
      Lettuce: [
        {
          name: "Caesar Salad",
          time: "15 mins",
          difficulty: "Easy",
          description: "Classic salad with homemade dressing",
        },
        {
          name: "Lettuce Wraps",
          time: "20 mins",
          difficulty: "Easy",
          description: "Healthy wraps with seasoned filling",
        },
      ],
      Tomatoes: [
        { name: "Tomato Sauce", time: "30 mins", difficulty: "Easy", description: "Fresh homemade tomato sauce" },
        {
          name: "Caprese Salad",
          time: "10 mins",
          difficulty: "Easy",
          description: "Simple salad with tomatoes and mozzarella",
        },
      ],
    }

    const recipes = recipesByIngredient[itemName] || [
      {
        name: `${itemName} Smoothie`,
        time: "10 mins",
        difficulty: "Easy",
        description: `Healthy smoothie featuring ${itemName.toLowerCase()}`,
      },
      {
        name: `${itemName} Soup`,
        time: "30 mins",
        difficulty: "Medium",
        description: `Warming soup with ${itemName.toLowerCase()}`,
      },
    ]

    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]

    alert(
      `🍳 Recipe Suggestion: ${randomRecipe.name}\n\n⏱️ Cook Time: ${randomRecipe.time}\n📊 Difficulty: ${randomRecipe.difficulty}\n\n${randomRecipe.description}\n\n💡 This recipe is perfect for using up your ${itemName.toLowerCase()}!`,
    )
  }

  const openConsumeModal = (item: InventoryItem) => {
    setConsumeModal({ isOpen: true, item })
    setConsumeQuantity(Math.min(1, item.quantity))
  }

  const closeConsumeModal = () => {
    setConsumeModal({ isOpen: false, item: null })
    setConsumeQuantity(1)
  }

  const confirmConsume = () => {
    if (consumeModal.item && onMarkAsUsed) {
      onMarkAsUsed(consumeModal.item.id, consumeQuantity)
      closeConsumeModal()
    }
  }

  if (filteredItems.length === 0 && items.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Fruits">Fruits</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Meat">Meat</SelectItem>
                <SelectItem value="Grains">Grains</SelectItem>
                <SelectItem value="Pantry">Pantry</SelectItem>
                <SelectItem value="Frozen">Frozen</SelectItem>
              </SelectContent>
            </Select>
            <Select value={expiryFilter} onValueChange={setExpiryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Items">All Items</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                <SelectItem value="Fresh">Fresh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-center py-8 text-muted-foreground">
          <p>No items found.</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No items in your inventory yet.</p>
        <p className="text-sm">Add your first item to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="Fruits">Fruits</SelectItem>
              <SelectItem value="Vegetables">Vegetables</SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
              <SelectItem value="Meat">Meat</SelectItem>
              <SelectItem value="Grains">Grains</SelectItem>
              <SelectItem value="Pantry">Pantry</SelectItem>
              <SelectItem value="Frozen">Frozen</SelectItem>
            </SelectContent>
          </Select>
          <Select value={expiryFilter} onValueChange={setExpiryFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Items">All Items</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
              <SelectItem value="Fresh">Fresh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => {
          const status = getExpiryStatus(item.daysLeft)
          const StatusIcon = status.icon

          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <Badge className={getCategoryColor(item.category)} variant="secondary">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {item.quantity} {item.unit}
                      </span>
                      <div className="flex items-center gap-1">
                        <StatusIcon className="w-3 h-3" />
                        <span className={status.color}>{status.text}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => findRecipe(item.name)}
                      className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      <ChefHat className="w-3 h-3" />
                      Recipe
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openConsumeModal(item)}
                      className="gap-1 bg-green-50 text-green-700 hover:bg-green-100"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Consumed
                    </Button>
                    {onRemoveItem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={consumeModal.isOpen} onOpenChange={closeConsumeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Consumed</DialogTitle>
          </DialogHeader>
          {consumeModal.item && (
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground">
                  How much of <strong>{consumeModal.item.name}</strong> did you consume?
                </p>
                <p className="text-sm text-muted-foreground">
                  Available: {consumeModal.item.quantity} {consumeModal.item.unit}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity Consumed</label>
                <Input
                  type="number"
                  min="1"
                  max={consumeModal.item.quantity}
                  value={consumeQuantity}
                  onChange={(e) => setConsumeQuantity(Number(e.target.value))}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={closeConsumeModal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button onClick={confirmConsume} className="flex-1">
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
