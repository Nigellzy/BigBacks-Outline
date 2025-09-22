import { useState } from 'react';
import { Bell, Home, PlusCircle, BarChart3, Trophy, Settings, Menu, User, ChefHat, Wrench, Users, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'expiration' | 'achievement' | 'reminder';
  date: Date;
  isRead: boolean;
  foodItemId?: string;
}

interface UserProfile {
  name: string;
  email: string;
  streakDays: number;
  totalSaved: number;
  wasteReduction: number;
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications: Notification[];
  userProfile: UserProfile;
  onSignOut?: () => void;
}

export function Layout({ children, activeTab, onTabChange, notifications, userProfile, onSignOut }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'recipes', name: 'Recipes', icon: ChefHat },
    { id: 'tools', name: 'Tools', icon: Wrench },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              activeTab === item.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-col card border-r lg:flex">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1 className="text-xl primary-gradient bg-clip-text text-transparent font-semibold">🥬 FoodSaver</h1>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          <NavItems />
        </nav>
        <div className="border-t p-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start relative"
            onClick={() => onTabChange('notifications')}
          >
            <Bell className="h-4 w-4 mr-3" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-auto h-5 w-5 p-0 text-xs flex items-center justify-center destructive-gradient">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => onTabChange('profile')}
          >
            <User className="h-4 w-4 mr-3" />
            Profile
          </Button>
          {onSignOut && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area - Works for both mobile and desktop */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header - Only visible on mobile */}
        <header className="flex h-16 items-center justify-between gap-4 border-b card px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-slate-900 border-r">
                <div className="flex h-full flex-col bg-white dark:bg-slate-900">
                  <div className="flex h-16 items-center border-b px-4 bg-white dark:bg-slate-900">
                    <h1 className="text-xl primary-gradient bg-clip-text text-transparent font-semibold">🥬 FoodSaver</h1>
                  </div>
                  <nav className="flex-1 space-y-2 p-4 bg-white dark:bg-slate-900">
                    <NavItems />
                  </nav>
                  <div className="border-t p-4 space-y-2 bg-white dark:bg-slate-900">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start relative"
                      onClick={() => {
                        onTabChange('notifications');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Bell className="h-4 w-4 mr-3" />
                      Notifications
                      {unreadCount > 0 && (
                        <Badge className="ml-auto h-5 w-5 p-0 text-xs flex items-center justify-center destructive-gradient">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        onTabChange('profile');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Button>
                    {onSignOut && (
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          onSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg primary-gradient bg-clip-text text-transparent font-semibold">🥬 FoodSaver</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => onTabChange('notifications')}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center destructive-gradient">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onTabChange('profile')}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </header>

        {/* Desktop Header - Only visible on desktop */}
        <header className="hidden lg:flex h-16 items-center justify-end gap-4 border-b card px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => onTabChange('notifications')}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center destructive-gradient">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2"
            onClick={() => onTabChange('profile')}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="hidden md:block">{userProfile.name}</span>
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}