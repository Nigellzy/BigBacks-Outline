import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyAXv76qnitMB8uV0q4n0hrTLzWA0XYdTFE",
  authDomain: "bigbacks-foodtracker.firebaseapp.com",
  projectId: "bigbacks-foodtracker",
  storageBucket: "bigbacks-foodtracker.firebasestorage.app",
  messagingSenderId: "780585237839",
  appId: "1:780585237839:web:0933db098de2b51cee193a",
  measurementId: "G-5PW85X39X8"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

