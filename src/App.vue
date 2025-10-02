<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from './components/layout/Sidebar.vue'
import MobileHeader from './components/layout/MobileHeader.vue'
import DashboardView from './views/DashboardView.vue'
import RecipesView from './views/RecipesView.vue'
import ChatView from './views/ChatView.vue'
import CommunityView from './views/CommunityView.vue'
import AnalyticsView from './views/AnalyticsView.vue'
import LeaderboardView from './views/LeaderboardView.vue'
import ProfileView from './views/ProfileView.vue'
import NotificationsView from './views/NotificationsView.vue'

// Import composables to initialize data
import { useFoodItems } from './composables/useFoodItems'
import { useNotifications } from './composables/useNotifications'
import { useActivities } from './composables/useActivities'
import { useRecipes } from './composables/useRecipes'
import { useUser } from './composables/useUser'

const currentView = ref('dashboard')
const sidebarOpen = ref(false)

const user = ref({
  id: '1',
  fullName: 'John Doe',
  email: 'john.doe@email.com',
  avatarUrl: '',
  currentScore: 1250,
  currentStreak: 7,
  totalSaved: 127.50,
  wasteReductionPercentage: 85
})

const foodItems = ref([])
const notifications = ref([])
const activities = ref([])
const recipes = ref([])

const userInitials = computed(() => {
  return user.value.fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
})

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.isRead).length
})

const setView = (view) => {
  currentView.value = view
  sidebarOpen.value = false
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const loadUser = () => {
  // Load user data from localStorage or initialize
  const stored = localStorage.getItem('foodsaver_user')
  if (stored) {
    user.value = JSON.parse(stored)
  }
}

// Initialize composables and load data
const { loadFoodItems: initFoodItems } = useFoodItems()
const { loadNotifications: initNotifications } = useNotifications()
const { loadActivities: initActivities } = useActivities()
const { loadRecipes: initRecipes } = useRecipes()

// Initialize data on mount
onMounted(() => {
  loadUser()
  initFoodItems()
  initNotifications()
  initActivities()
  initRecipes()
})
</script>

<template>
  <div class="app-container">
    <!-- Header with notifications and profile -->
    <header class="app-header">
      <div class="header-content">
        <div class="d-flex align-items-center">
          <button 
            class="btn btn-link sidebar-toggle d-lg-none" 
            @click="toggleSidebar"
          >
            <i class="bi bi-list fs-4"></i>
          </button>
          <div class="d-flex align-items-center gap-2">
            <span class="fs-4">🥬</span>
            <h3 class="text-gradient-green mb-0 d-none d-md-block">FoodSaver</h3>
          </div>
        </div>
        
        <div class="header-actions d-flex align-items-center gap-3">
          <button 
            class="btn btn-header position-relative" 
            @click="setView('notifications')"
            :class="{ 'active': currentView === 'notifications' }"
          >
            <i class="bi bi-bell fs-5"></i>
            <span class="badge bg-danger notification-badge" v-if="unreadNotifications > 0">
              {{ unreadNotifications }}
            </span>
          </button>
          
          <button 
            class="btn btn-header" 
            @click="setView('profile')"
            :class="{ 'active': currentView === 'profile' }"
          >
            <div class="avatar-sm">{{ userInitials }}</div>
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar overlay for mobile -->
    <div
      class="sidebar-overlay"
      :class="{ 'show': sidebarOpen }"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <Sidebar
      :current-view="currentView"
      :sidebar-open="sidebarOpen"
      @set-view="setView"
    />

    <!-- Main content -->
    <main class="main-content">
      <Transition name="fade" mode="out-in">
        <DashboardView v-if="currentView === 'dashboard'" />
        <RecipesView v-else-if="currentView === 'recipes'" />
        <ChatView v-else-if="currentView === 'chat'" />
        <CommunityView v-else-if="currentView === 'community'" />
        <AnalyticsView v-else-if="currentView === 'analytics'" />
        <LeaderboardView v-else-if="currentView === 'leaderboard'" />
        <ProfileView v-else-if="currentView === 'profile'" @back="setView('dashboard')" />
        <NotificationsView v-else-if="currentView === 'notifications'" @back="setView('dashboard')" />
      </Transition>
    </main>
  </div>
</template>

<style>
@import './style.css';
</style>
