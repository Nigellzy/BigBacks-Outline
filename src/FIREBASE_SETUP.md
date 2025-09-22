# Firebase Setup Instructions for FoodSaver

## 🚀 Quick Start

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "FoodSaver" (or your preferred name)
4. Enable Google Analytics (optional)
5. Wait for project creation

### 2. Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click **Save**

### 3. Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location
5. Click **Done**

### 4. Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web** icon (`</>`)
4. Register app with nickname "FoodSaver Web"
5. Copy the `firebaseConfig` object

### 5. Update Configuration File
Replace the config in `/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 📊 Database Structure

The app automatically creates these Firestore collections:

### Users Collection (`users`)
```
users/{userId}
├── name: string
├── email: string
├── streakDays: number
├── totalSaved: number
├── wasteReduction: number
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Food Items Collection (`foodItems`)
```
foodItems/{itemId}
├── userId: string
├── name: string
├── expirationDate: timestamp
├── quantity: number
├── unit: string
├── price: number
├── category: string
└── createdAt: timestamp
```

### Custom Recipes (`recipes`)
```
recipes/{recipeId}
├── userId: string
├── name: string
├── ingredients: array
├── instructions: string
├── prepTime: number
├── servings: number
├── isCustom: boolean
└── createdAt: timestamp
```

### Bookmarked Recipes (`bookmarkedRecipes`)
```
bookmarkedRecipes/{bookmarkId}
├── userId: string
├── recipeId: string
└── createdAt: timestamp
```

### History Collections (`usageHistory`, `wasteHistory`)
```
usageHistory/{entryId}
├── userId: string
├── itemName: string
├── value: number
├── category: string
├── date: timestamp
└── createdAt: timestamp
```

### Notifications (`notifications`)
```
notifications/{notificationId}
├── userId: string
├── title: string
├── message: string
├── type: string
├── date: timestamp
├── isRead: boolean
├── foodItemId: string (optional)
└── createdAt: timestamp
```

## 🔐 Security Rules

For production, update Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /foodItems/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /recipes/{recipeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /bookmarkedRecipes/{bookmarkId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /usageHistory/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /wasteHistory/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🎯 Testing the Integration

1. **Sign Up**: Create a new account using the sign-up form
2. **Add Food Items**: Test adding food items through the dashboard
3. **Real-time Updates**: Open multiple browser tabs to see real-time synchronization
4. **Recipes**: Create custom recipes and bookmark external ones
5. **Data Persistence**: Sign out and back in to verify data persistence

## 🔧 Troubleshooting

### Common Issues:

1. **"Permission denied" errors**: Check Firestore security rules
2. **App not loading**: Verify Firebase configuration in `/firebase/config.js`
3. **Auth not working**: Ensure Email/Password provider is enabled
4. **Data not syncing**: Check browser console for Firebase errors

### Debug Mode:
Add this to see Firebase logs:
```javascript
// In firebase/config.js
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

// Add after initializing services (for local development)
if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 📱 Features Enabled

✅ **User Authentication**: Sign up/sign in with email/password  
✅ **Real-time Data Sync**: Food items update across devices instantly  
✅ **Personal Data**: Each user has their own food inventory  
✅ **Recipe Management**: Save custom recipes and bookmark favorites  
✅ **History Tracking**: Usage and waste history with analytics  
✅ **Notifications**: Personal notifications and achievements  
✅ **Offline Support**: Basic offline functionality with sync when online  
✅ **Data Security**: User data is private and secure  

## 🚀 Next Steps

After setup, consider adding:
- Push notifications for expiring food
- Photo uploads for food items  
- Sharing features between users
- Advanced analytics and insights
- Barcode scanning integration