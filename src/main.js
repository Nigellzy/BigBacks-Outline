import { createApp } from 'vue'
import App from './App.vue'
import './styles/globals.css'

// Import Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

const app = createApp(App)
app.mount('#app')