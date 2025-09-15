"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Clock, CheckCircle, Trash2, ChefHat, Calendar, Lightbulb } from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate: string
  daysLeft: number
}

interface ExpirationDashboardProps {
  items: InventoryItem[]
  onRemoveItem: (itemId: number) => void
  onMarkAsUsed: (itemId: number) => void
}

export function ExpirationDashboard({ items, onRemoveItem, onMarkAsUsed }: ExpirationDashboardProps) {
  // Categorize items by expiration status
  const expiredItems = items.filter((item) => item.daysLeft <= 0)
  const expiringToday = items.filter((item) => item.daysLeft === 1)
  const expiringSoon = items.filter((item) => item.daysLeft > 1 && item.daysLeft <= 3)
  const expiringThisWeek = items.filter((item) => item.daysLeft > 3 && item.daysLeft <= 7)

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

  const getActionSuggestions = (item: InventoryItem) => {
    const suggestions = []

    if (item.category === "Fruits" && item.daysLeft <= 2) {
      suggestions.push("Make a smoothie or fruit salad")
    }
    if (item.category === "Vegetables" && item.daysLeft <= 2) {
      suggestions.push("Add to stir-fry or soup")
    }
    if (item.category === "Dairy" && item.daysLeft <= 1) {
      suggestions.push("Use in baking or cooking")
    }
    if (item.category === "Meat" && item.daysLeft <= 1) {
      suggestions.push("Cook immediately or freeze")
    }
    if (item.category === "Grains" && item.daysLeft <= 1) {
      suggestions.push("Make toast or breadcrumbs")
    }

    return suggestions
  }

  const ExpirationSection = ({
    title,
    items,
    icon: Icon,
    variant,
    description,
  }: {
    title: string
    items: InventoryItem[]
    icon: any
    variant: "destructive" | "default" | "secondary"
    description: string
  }) => {
    if (items.length === 0) return null

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant={variant}>{items.length}</Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => {
            const suggestions = getActionSuggestions(item)

            return (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <Badge className={getCategoryColor(item.category)} variant="secondary">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>
                        {item.quantity} {item.unit}
                      </span>
                      <span>Expires: {item.expiryDate}</span>
                    </div>

                    {suggestions.length > 0 && (
                      <div className="flex items-start gap-2 mt-2">
                        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-primary mb-1">Suggestions:</p>
                          <ul className="text-muted-foreground space-y-1">
                            {suggestions.map((suggestion, index) => (
                              <li key={index}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onMarkAsUsed(item.id)} className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Mark as Used
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                    <ChefHat className="w-3 h-3" />
                    Find Recipe
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    )
  }

  const totalExpiringItems = expiredItems.length + expiringToday.length + expiringSoon.length

  return (
    <div className="space-y-6">
      {/* Overview Alert */}
      {totalExpiringItems > 0 ? (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            You have {totalExpiringItems} item{totalExpiringItems > 1 ? "s" : ""} that need immediate attention to
            prevent waste!
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-primary/50 bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            Great job! No items are expiring in the next few days. Keep up the good work!
          </AlertDescription>
        </Alert>
      )}

      {/* Expired Items */}
      <ExpirationSection
        title="Expired Items"
        items={expiredItems}
        icon={AlertTriangle}
        variant="destructive"
        description="These items have already expired. Consider composting or proper disposal."
      />

      {/* Expiring Today */}
      <ExpirationSection
        title="Expiring Today"
        items={expiringToday}
        icon={Calendar}
        variant="destructive"
        description="Use these items today to prevent waste!"
      />

      {/* Expiring Soon (2-3 days) */}
      <ExpirationSection
        title="Expiring Soon"
        items={expiringSoon}
        icon={Clock}
        variant="secondary"
        description="Plan to use these items in the next 2-3 days."
      />

      {/* Expiring This Week */}
      <ExpirationSection
        title="Expiring This Week"
        items={expiringThisWeek}
        icon={Calendar}
        variant="default"
        description="Keep an eye on these items - they'll expire within a week."
      />

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Food Waste Prevention Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Storage Tips:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Store fruits and vegetables separately</li>
                <li>• Keep dairy products in the coldest part of fridge</li>
                <li>• Freeze meat if not using within 2 days</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Quick Uses:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Overripe fruits → smoothies or baking</li>
                <li>• Wilting vegetables → soups or stir-fries</li>
                <li>• Stale bread → breadcrumbs or croutons</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
