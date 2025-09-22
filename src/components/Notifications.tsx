import { Bell, AlertTriangle, Trophy, Lightbulb, Check, X, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'expiration' | 'achievement' | 'reminder';
  date: Date;
  isRead: boolean;
  foodItemId?: string;
}

interface FoodItem {
  id: string;
  name: string;
  expirationDate: Date;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  foodItems: FoodItem[];
  onBack?: () => void;
  previousTab?: string;
}

export function Notifications({ notifications, onMarkAsRead, foodItems, onBack, previousTab }: NotificationsProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'expiration':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'reminder':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'expiration':
        return 'border-l-orange-500 bg-orange-50';
      case 'achievement':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'reminder':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated on your food and achievements
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="accent-gradient">
          {unreadNotifications.length} unread
        </Badge>
      </div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Unread ({unreadNotifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${getNotificationColor(notification.type)}`}
              >
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-sm">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimeAgo(notification.date)}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMarkAsRead(notification.id)}
                      className="flex-shrink-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest notifications and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {readNotifications.length > 0 ? (
            readNotifications.map((notification, index) => (
              <div key={notification.id}>
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex-shrink-0 opacity-60">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm opacity-80">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatTimeAgo(notification.date)}
                    </p>
                  </div>
                </div>
                {index < readNotifications.length - 1 && <Separator className="my-2" />}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No previous notifications</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h3 className="font-medium">Expiration Alerts</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Get notified when food is about to expire
              </p>
              <Badge variant="secondary" className="text-xs">
                Daily at 9 AM
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h3 className="font-medium">Achievements</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Celebrate your food-saving milestones
              </p>
              <Badge variant="secondary" className="text-xs">
                Instant
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Recipe Tips</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Smart suggestions for your ingredients
              </p>
              <Badge variant="secondary" className="text-xs">
                Weekly
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}