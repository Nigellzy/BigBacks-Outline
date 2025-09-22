import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// User data services
export const userService = {
  // Get user profile
  async getUserProfile(userId) {
    try {
      const userDoc = doc(db, 'users', userId);
      const snapshot = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
      return snapshot.docs[0]?.data() || null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Create or update user profile
  async saveUserProfile(userId, profileData) {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        ...profileData,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }
};

// Food items services
export const foodService = {
  // Get all food items for a user
  getUserFoodItems(userId, callback) {
    const q = query(
      collection(db, 'foodItems'),
      where('userId', '==', userId),
      orderBy('expirationDate', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expirationDate: doc.data().expirationDate?.toDate() || new Date()
      }));
      callback(items);
    });
  },

  // Add new food item
  async addFoodItem(userId, foodItem) {
    try {
      const docRef = await addDoc(collection(db, 'foodItems'), {
        ...foodItem,
        userId,
        expirationDate: Timestamp.fromDate(foodItem.expirationDate),
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding food item:', error);
      return null;
    }
  },

  // Update food item
  async updateFoodItem(itemId, updates) {
    try {
      const itemDoc = doc(db, 'foodItems', itemId);
      const updateData = { ...updates };
      
      if (updates.expirationDate) {
        updateData.expirationDate = Timestamp.fromDate(updates.expirationDate);
      }
      
      await updateDoc(itemDoc, {
        ...updateData,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating food item:', error);
      return false;
    }
  },

  // Delete food item
  async deleteFoodItem(itemId) {
    try {
      await deleteDoc(doc(db, 'foodItems', itemId));
      return true;
    } catch (error) {
      console.error('Error deleting food item:', error);
      return false;
    }
  }
};

// Recipe services
export const recipeService = {
  // Get user's custom recipes
  getUserRecipes(userId, callback) {
    const q = query(
      collection(db, 'recipes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const recipes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(recipes);
    });
  },

  // Add custom recipe
  async addCustomRecipe(userId, recipe) {
    try {
      const docRef = await addDoc(collection(db, 'recipes'), {
        ...recipe,
        userId,
        isCustom: true,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding recipe:', error);
      return null;
    }
  },

  // Get bookmarked recipes for user
  async getBookmarkedRecipes(userId) {
    try {
      const q = query(
        collection(db, 'bookmarkedRecipes'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data().recipeId);
    } catch (error) {
      console.error('Error getting bookmarked recipes:', error);
      return [];
    }
  },

  // Bookmark/unbookmark recipe
  async toggleBookmark(userId, recipeId) {
    try {
      const q = query(
        collection(db, 'bookmarkedRecipes'),
        where('userId', '==', userId),
        where('recipeId', '==', recipeId)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Add bookmark
        await addDoc(collection(db, 'bookmarkedRecipes'), {
          userId,
          recipeId,
          createdAt: Timestamp.now()
        });
        return true;
      } else {
        // Remove bookmark
        await deleteDoc(snapshot.docs[0].ref);
        return false;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return null;
    }
  }
};

// History services
export const historyService = {
  // Add usage history entry
  async addUsageEntry(userId, entry) {
    try {
      await addDoc(collection(db, 'usageHistory'), {
        ...entry,
        userId,
        date: Timestamp.fromDate(entry.date),
        createdAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error adding usage entry:', error);
      return false;
    }
  },

  // Add waste history entry
  async addWasteEntry(userId, entry) {
    try {
      await addDoc(collection(db, 'wasteHistory'), {
        ...entry,
        userId,
        date: Timestamp.fromDate(entry.date),
        createdAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error adding waste entry:', error);
      return false;
    }
  },

  // Get user history
  getUserHistory(userId, type, callback) {
    const collectionName = type === 'usage' ? 'usageHistory' : 'wasteHistory';
    const q = query(
      collection(db, collectionName),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      }));
      callback(history);
    });
  }
};

// Notifications services
export const notificationService = {
  // Get user notifications
  getUserNotifications(userId, callback) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      }));
      callback(notifications);
    });
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const notificationDoc = doc(db, 'notifications', notificationId);
      await updateDoc(notificationDoc, {
        isRead: true,
        readAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  // Add notification
  async addNotification(userId, notification) {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        userId,
        date: Timestamp.fromDate(notification.date),
        createdAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error adding notification:', error);
      return false;
    }
  }
};