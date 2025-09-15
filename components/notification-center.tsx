"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Clock, Bell, CheckCircle, X } from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate: string
  daysLeft: number
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  inventory: InventoryItem[]
}

export function NotificationCenter({ isOpen, onClose, inventory }: NotificationCenterProps) {
  // Generate notifications based on inventory
  const notifications = [
    {
      id: 1,
      type: "urgent",
      title: "Items Expiring Today!",
      message: "Yogurt and Lettuce expire today. Use them now to avoid waste!",
      time: "2 hours ago",
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      id: 2,
      type: "warning",
      title: "Bananas Expiring Soon",
      message: "Your bananas will expire in 2 days. Perfect time for banana bread!",
      time: "4 hours ago",
      icon: Clock,
      color: "text-orange-500",
    },
    {
      id: 3,
      type: "achievement",
      title: "Streak Achievement!",
      message: "Congratulations! You've maintained a 12-day streak of tracking your food.",
      time: "1 day ago",
      icon: CheckCircle,
      color: "text-primary",
    },
    {
      id: 4,
      type: "tip",
      title: "Weekly Tip",
      message: "Store your tomatoes at room temperature for better flavor and longer life.",
      time: "2 days ago",
      icon: Bell,
      color: "text-blue-500",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </DialogTitle>
          <DialogDescription>Stay updated on your food inventory and waste reduction progress</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => {
            const IconComponent = notification.icon
            return (
              <Card key={notification.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${notification.color}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        <Badge
                          variant={
                            notification.type === "urgent"
                              ? "destructive"
                              : notification.type === "warning"
                                ? "secondary"
                                : notification.type === "achievement"
                                  ? "default"
                                  : "outline"
                          }
                          className="text-xs"
                        >
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
