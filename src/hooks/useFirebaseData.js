import { useState, useEffect } from 'react';
import { 
  foodService, 
  recipeService, 
  historyService, 
  notificationService,
  userService 
} from '../firebase/services';

export function useFirebaseData(user) {
  const [foodItems, setFoodItems] = useState([]);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [wasteHistory, setWasteHistory] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let unsubscribeFunctions = [];

    const initializeData = async () => {
      try {
        setLoading(true);

        // Load user profile
        const profile = await userService.getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
        } else {
          // Create default profile if none exists
          const defaultProfile = {
            name: user.displayName || 'Food Saver User',
            email: user.email,
            streakDays: 0,
            totalSaved: 0,
            wasteReduction: 0
          };
          await userService.saveUserProfile(user.uid, defaultProfile);
          setUserProfile(defaultProfile);
        }

        // Set up real-time listeners
        const unsubscribeFoodItems = foodService.getUserFoodItems(user.uid, setFoodItems);
        const unsubscribeRecipes = recipeService.getUserRecipes(user.uid, setCustomRecipes);
        const unsubscribeNotifications = notificationService.getUserNotifications(user.uid, setNotifications);
        const unsubscribeWasteHistory = historyService.getUserHistory(user.uid, 'waste', setWasteHistory);
        const unsubscribeUsageHistory = historyService.getUserHistory(user.uid, 'usage', setUsageHistory);

        // Load bookmarked recipes
        const bookmarked = await recipeService.getBookmarkedRecipes(user.uid);
        setBookmarkedRecipes(bookmarked);

        unsubscribeFunctions = [
          unsubscribeFoodItems,
          unsubscribeRecipes,
          unsubscribeNotifications,
          unsubscribeWasteHistory,
          unsubscribeUsageHistory
        ];

      } catch (error) {
        console.error('Error initializing Firebase data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, [user]);

  const updateUserProfile = async (profileData) => {
    if (!user) return;
    
    const success = await userService.saveUserProfile(user.uid, profileData);
    if (success) {
      setUserProfile(profileData);
    }
  };

  const addFoodItem = async (foodItem) => {
    if (!user) return null;
    return await foodService.addFoodItem(user.uid, foodItem);
  };

  const updateFoodItem = async (itemId, updates) => {
    return await foodService.updateFoodItem(itemId, updates);
  };

  const deleteFoodItem = async (itemId) => {
    return await foodService.deleteFoodItem(itemId);
  };

  const addCustomRecipe = async (recipe) => {
    if (!user) return null;
    return await recipeService.addCustomRecipe(user.uid, recipe);
  };

  const toggleBookmark = async (recipeId) => {
    if (!user) return null;
    
    const isBookmarked = await recipeService.toggleBookmark(user.uid, recipeId);
    
    // Update local state
    if (isBookmarked !== null) {
      setBookmarkedRecipes(prev => 
        isBookmarked 
          ? [...prev, recipeId]
          : prev.filter(id => id !== recipeId)
      );
    }
    
    return isBookmarked;
  };

  const addUsageEntry = async (entry) => {
    if (!user) return false;
    return await historyService.addUsageEntry(user.uid, entry);
  };

  const addWasteEntry = async (entry) => {
    if (!user) return false;
    return await historyService.addWasteEntry(user.uid, entry);
  };

  const markNotificationRead = async (notificationId) => {
    return await notificationService.markAsRead(notificationId);
  };

  return {
    // Data
    foodItems,
    customRecipes,
    bookmarkedRecipes,
    notifications,
    wasteHistory,
    usageHistory,
    userProfile,
    loading,
    
    // Functions
    updateUserProfile,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    addCustomRecipe,
    toggleBookmark,
    addUsageEntry,
    addWasteEntry,
    markNotificationRead
  };
}