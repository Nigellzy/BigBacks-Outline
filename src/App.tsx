import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AddFood } from './components/AddFood';
import { Recipes } from './components/Recipes';
import { Analytics } from './components/Analytics';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Notifications } from './components/Notifications';
import { Tools } from './components/Tools';
import { Community } from './components/Community';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from './components/ui/dialog';
import { VisuallyHidden } from './components/ui/visually-hidden';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  expirationDate: Date;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  servings: number;
  isCustom: boolean;
  isBookmarked: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'expiration' | 'achievement' | 'reminder';
  date: Date;
  isRead: boolean;
  foodItemId?: string;
}

interface HistoryItem {
  date: Date;
  itemName: string;
  value: number;
  category: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [previousTab, setPreviousTab] = useState('dashboard');
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [recipeSearchTerm, setRecipeSearchTerm] = useState<string>('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [userScore, setUserScore] = useState(1950);
  const [wasteHistory, setWasteHistory] = useState<HistoryItem[]>([]);
  const [usageHistory, setUsageHistory] = useState<HistoryItem[]>([]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Smith',
    email: 'alex@example.com',
    streakDays: 4,
    totalSaved: 156.78,
    wasteReduction: 73
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleItems: FoodItem[] = [
      {
        id: '1',
        name: 'Apples',
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        quantity: 6,
        unit: 'pieces',
        price: 3.99,
        category: 'Fruits & Vegetables'
      },
      {
        id: '2',
        name: 'Milk',
        expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
        quantity: 1,
        unit: 'liter',
        price: 2.49,
        category: 'Dairy & Eggs'
      },
      {
        id: '3',
        name: 'Chicken Breast',
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        quantity: 500,
        unit: 'grams',
        price: 8.99,
        category: 'Meat & Poultry'
      },
      {
        id: '4',
        name: 'Bread',
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        quantity: 1,
        unit: 'loaf',
        price: 2.99,
        category: 'Bakery'
      },
      {
        id: '5',
        name: 'Yogurt',
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        quantity: 4,
        unit: 'cups',
        price: 4.99,
        category: 'Dairy & Eggs'
      }
    ];

    setFoodItems(sampleItems);

    // Sample waste and usage history
    const sampleWaste: HistoryItem[] = [
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        itemName: 'Lettuce',
        value: 2.99,
        category: 'Fruits & Vegetables'
      },
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        itemName: 'Bananas',
        value: 1.99,
        category: 'Fruits & Vegetables'
      }
    ];

    const sampleUsage: HistoryItem[] = [
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        itemName: 'Eggs',
        value: 3.49,
        category: 'Dairy & Eggs'
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        itemName: 'Tomatoes',
        value: 4.99,
        category: 'Fruits & Vegetables'
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        itemName: 'Ground Beef',
        value: 6.99,
        category: 'Meat & Poultry'
      }
    ];

    setWasteHistory(sampleWaste);
    setUsageHistory(sampleUsage);

    // Sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Food Expiring Soon!',
        message: 'Your milk expires in 1 day',
        type: 'expiration',
        date: new Date(),
        isRead: false,
        foodItemId: '2'
      },
      {
        id: '2',
        title: 'Achievement Unlocked!',
        message: 'You saved $50 this month',
        type: 'achievement',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: false
      },
      {
        id: '3',
        title: 'Recipe Suggestion',
        message: 'Try apple pie with your expiring apples',
        type: 'reminder',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isRead: true
      }
    ];

    setNotifications(sampleNotifications);
  }, []);

  const handleAddFood = (newFood: Omit<FoodItem, 'id'>) => {
    const foodWithId = {
      ...newFood,
      id: Math.random().toString(36).substr(2, 9)
    };
    setFoodItems(prev => [...prev, foodWithId]);
    setUserScore(prev => prev + 25); // Points for adding food
    setShowAddFoodModal(false); // Close modal after adding
  };

  const handleUseItem = (itemId: string, usedQuantity?: number) => {
    const item = foodItems.find(f => f.id === itemId);
    if (item) {
      const quantityUsed = usedQuantity || item.quantity;
      const proportionalValue = (item.price * quantityUsed) / item.quantity;
      
      // Add to usage history
      const usageEntry: HistoryItem = {
        date: new Date(),
        itemName: item.name,
        value: proportionalValue,
        category: item.category
      };
      setUsageHistory(prev => [...prev, usageEntry]);
      
      if (quantityUsed >= item.quantity) {
        // Remove completely
        setFoodItems(prev => prev.filter(f => f.id !== itemId));
      } else {
        // Update quantity
        setFoodItems(prev => prev.map(f => 
          f.id === itemId 
            ? { ...f, quantity: f.quantity - quantityUsed }
            : f
        ));
      }
      
      // Add points for using food before expiration
      setUserScore(prev => prev + Math.floor(proportionalValue));
    }
  };

  const handleEditItem = (itemId: string, updatedItem: Omit<FoodItem, 'id'>) => {
    setFoodItems(prev => prev.map(f => 
      f.id === itemId 
        ? { ...f, ...updatedItem }
        : f
    ));
  };

  const handleAddCustomRecipe = (recipe: Omit<Recipe, 'id' | 'isCustom'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Math.random().toString(36).substr(2, 9),
      isCustom: true
    };
    setCustomRecipes(prev => [...prev, newRecipe]);
    setUserScore(prev => prev + 25); // Points for adding recipe
  };

  const handleBookmarkRecipe = (recipeId: string) => {
    setBookmarkedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const handleTabChange = (newTab: string) => {
    // When navigating TO notifications, save current tab as previous (unless already on notifications)
    if (newTab === 'notifications' && activeTab !== 'notifications') {
      setPreviousTab(activeTab);
    }
    // Clear recipe search term when switching tabs (except when going to recipes)
    if (newTab !== 'recipes') {
      setRecipeSearchTerm('');
    }
    setActiveTab(newTab);
  };

  const handleFindRecipe = (item: FoodItem) => {
    setRecipeSearchTerm(item.name);
    setActiveTab('recipes');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            foodItems={foodItems} 
            onUseItem={handleUseItem}
            onEditItem={handleEditItem}
            onAddFood={() => setShowAddFoodModal(true)}
            onFindRecipe={handleFindRecipe}
            userScore={userScore}
          />
        );
      case 'recipes':
        return (
          <Recipes 
            foodItems={foodItems}
            customRecipes={customRecipes}
            bookmarkedRecipes={bookmarkedRecipes}
            onAddCustomRecipe={handleAddCustomRecipe}
            onBookmarkRecipe={handleBookmarkRecipe}
            initialSearchTerm={recipeSearchTerm}
          />
        );
      case 'analytics':
        return (
          <Analytics 
            foodItems={foodItems}
            wasteHistory={wasteHistory}
            usageHistory={usageHistory}
          />
        );
      case 'leaderboard':
        return <Leaderboard userScore={userScore} userRank={5} />;
      case 'profile':
        return (
          <Profile 
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            userScore={userScore}
            onBack={() => setActiveTab('dashboard')}
          />
        );
      case 'tools':
        return (
          <Tools 
            foodItems={foodItems}
          />
        );
      case 'community':
        return (
          <Community 
            foodItems={foodItems}
            userProfile={userProfile}
          />
        );
      case 'notifications':
        return (
          <Notifications 
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationRead}
            foodItems={foodItems}
            onBack={() => setActiveTab(previousTab)}
            previousTab={previousTab}
          />
        );
      default:
        return (
          <Dashboard 
            foodItems={foodItems} 
            onUseItem={handleUseItem}
            onEditItem={handleEditItem}
            onAddFood={() => setShowAddFoodModal(true)}
            onFindRecipe={handleFindRecipe}
            userScore={userScore}
          />
        );
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        notifications={notifications}
        userProfile={userProfile}
      >
        {renderContent()}
      </Layout>

      {/* Floating Add Food Button - Only show on dashboard */}
      {activeTab === 'dashboard' && (
        <Button
          onClick={() => setShowAddFoodModal(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-lg hover:shadow-xl primary-gradient z-50 transition-all duration-200 hover:scale-105 whitespace-nowrap"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Food
        </Button>
      )}

      {/* Add Food Modal */}
      <Dialog open={showAddFoodModal} onOpenChange={setShowAddFoodModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Food Item</DialogTitle>
            <DialogDescription>
              Log your groceries to track expiration and reduce waste
            </DialogDescription>
          </DialogHeader>
          <AddFood onAddFood={handleAddFood} />
        </DialogContent>
      </Dialog>
    </>
  );
}