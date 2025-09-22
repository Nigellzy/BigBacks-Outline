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
import { AuthWrapper } from './components/AuthWrapper';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from './components/ui/dialog';
import { VisuallyHidden } from './components/ui/visually-hidden';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';
import { authService } from './firebase/auth';
import { useFirebaseData } from './hooks/useFirebaseData';

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
  // Auth and UI state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [previousTab, setPreviousTab] = useState('dashboard');
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [recipeSearchTerm, setRecipeSearchTerm] = useState<string>('');
  const [userScore, setUserScore] = useState(1950);

  // Firebase data hook
  const {
    foodItems,
    customRecipes,
    bookmarkedRecipes,
    notifications,
    wasteHistory,
    usageHistory,
    userProfile,
    loading: dataLoading,
    updateUserProfile,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    addCustomRecipe,
    toggleBookmark,
    addUsageEntry,
    addWasteEntry,
    markNotificationRead
  } = useFirebaseData(user);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleAddFood = async (newFood: Omit<FoodItem, 'id'>) => {
    const itemId = await addFoodItem(newFood);
    if (itemId) {
      setUserScore(prev => prev + 25); // Points for adding food
      setShowAddFoodModal(false); // Close modal after adding
    }
  };

  const handleUseItem = async (itemId: string, usedQuantity?: number) => {
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
      await addUsageEntry(usageEntry);
      
      if (quantityUsed >= item.quantity) {
        // Remove completely
        await deleteFoodItem(itemId);
      } else {
        // Update quantity
        await updateFoodItem(itemId, { quantity: item.quantity - quantityUsed });
      }
      
      // Add points for using food before expiration
      setUserScore(prev => prev + Math.floor(proportionalValue));
    }
  };

  const handleEditItem = async (itemId: string, updatedItem: Omit<FoodItem, 'id'>) => {
    await updateFoodItem(itemId, updatedItem);
  };

  const handleAddCustomRecipe = async (recipe: Omit<Recipe, 'id' | 'isCustom'>) => {
    const recipeId = await addCustomRecipe(recipe);
    if (recipeId) {
      setUserScore(prev => prev + 25); // Points for adding recipe
    }
  };

  const handleBookmarkRecipe = async (recipeId: string) => {
    await toggleBookmark(recipeId);
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    await markNotificationRead(notificationId);
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

  const handleSignOut = async () => {
    await authService.signOut();
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
            userProfile={userProfile || {
              name: 'Loading...',
              email: '',
              streakDays: 0,
              totalSaved: 0,
              wasteReduction: 0
            }}
            onUpdateProfile={updateUserProfile}
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
    <AuthWrapper user={user} loading={authLoading || dataLoading}>
      <Layout 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        notifications={notifications}
        userProfile={userProfile || {
          name: 'Loading...',
          email: '',
          streakDays: 0,
          totalSaved: 0,
          wasteReduction: 0
        }}
        onSignOut={handleSignOut}
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
    </AuthWrapper>
  );
}