import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';

// Authentication service
export const authService = {
  // Create new user account
  async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: displayName,
        email: email,
        streakDays: 0,
        totalSaved: 0,
        wasteReduction: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return { success: true, user };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign out user
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
};