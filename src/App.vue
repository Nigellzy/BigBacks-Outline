<template>
  <Layout 
    :activeTab="activeTab" 
    @tab-change="setActiveTab"
    :notifications="notifications"
    :userProfile="userProfile"
  >
    <component 
      :is="currentComponent" 
      v-bind="currentProps"
    />
  </Layout>

  <!-- Add Food Modal -->
  <AddFoodModal 
    v-if="showAddFoodModal"
    @close="showAddFoodModal = false"
    @add-food="handleAddFood"
  />

  <!-- Edit Food Modal -->
  <EditFoodModal 
    v-if="showEditFoodModal && editingFood"
    :food="editingFood"
    @close="showEditFoodModal = false"
    @update-food="handleUpdateFood"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Layout from './components/Layout.vue'
import Dashboard from './components/Dashboard.vue'
import Recipes from './components/Recipes.vue'
import Analytics from './components/Analytics.vue'
import Leaderboard from './components/Leaderboard.vue'
import Profile from './components/Profile.vue'
import Notifications from './components/Notifications.vue'
import Tools from './components/Tools.vue'
import Community from './components/Community.vue'
import AddFoodModal from './components/AddFoodModal.vue'
import EditFoodModal from './components/EditFoodModal.vue'
import { useFoodItems } from './composables/useFoodItems'
import { useUserData } from './composables/useUserData'
import { useNotifications } from './composables/useNotifications'

// Composables
const { foodItems, addFood, updateFood, useItem } = useFoodItems()
const { userScore, userProfile, wasteHistory, usageHistory, updateScore, addToHistory } = useUserData()
const { notifications, markAsRead, addNotification } = useNotifications()

// UI State
const activeTab = ref('dashboard')
const showAddFoodModal = ref(false)
const showEditFoodModal = ref(false)
const editingFood = ref(null)

// Recipes state
const customRecipes = ref([])
const bookmarkedRecipes = ref([])

// Component mapping
const componentMap = {
  'dashboard': Dashboard,
  'recipes': Recipes,
  'analytics': Analytics,
  'leaderboard': Leaderboard,
  'profile': Profile,
  'tools': Tools,
  'community': Community,
  'notifications': Notifications
}

const currentComponent = computed(() => {
  return componentMap[activeTab.value] || Dashboard
})

const currentProps = computed(() => {
  const baseProps = {
    foodItems: foodItems.value,
    userScore: userScore.value,
    userProfile: userProfile.value
  }

  switch (activeTab.value) {
    case 'dashboard':
      return {
        ...baseProps,
        onUseItem: handleUseItem,
        onAddFood: () => showAddFoodModal.value = true,
        onEditFood: handleEditFood,
        onFindRecipe: () => setActiveTab('recipes')
      }
    case 'recipes':
      return {
        ...baseProps,
        customRecipes: customRecipes.value,
        bookmarkedRecipes: bookmarkedRecipes.value,
        onAddCustomRecipe: handleAddCustomRecipe,
        onBookmarkRecipe: handleBookmarkRecipe
      }
    case 'analytics':
      return {
        ...baseProps,
        wasteHistory: wasteHistory.value,
        usageHistory: usageHistory.value
      }
    case 'leaderboard':
      return {
        ...baseProps,
        userRank: 5
      }
    case 'profile':
      return {
        ...baseProps,
        onUpdateProfile: (newProfile) => userProfile.value = { ...userProfile.value, ...newProfile }
      }
    case 'notifications':
      return {
        ...baseProps,
        notifications: notifications.value,
        onMarkAsRead: markAsRead
      }
    default:
      return baseProps
  }
})

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab
}

const handleAddFood = (newFood) => {
  addFood(newFood)
  updateScore(25) // Points for adding food
  showAddFoodModal.value = false
}

const handleEditFood = (food) => {
  editingFood.value = food
  showEditFoodModal.value = true
}

const handleUpdateFood = (updatedFood) => {
  updateFood(updatedFood)
  showEditFoodModal.value = false
  editingFood.value = null
}

const handleUseItem = (itemId, usedQuantity) => {
  const item = foodItems.value.find(f => f.id === itemId)
  if (item) {
    const quantityUsed = usedQuantity || item.quantity
    const proportionalValue = (item.price * quantityUsed) / item.quantity
    
    // Add to usage history
    addToHistory('usage', {
      date: new Date(),
      itemName: item.name,
      value: proportionalValue,
      category: item.category
    })
    
    useItem(itemId, quantityUsed)
    
    // Add points for using food before expiration
    updateScore(Math.floor(proportionalValue))
  }
}

const handleAddCustomRecipe = (recipe) => {
  const newRecipe = {
    ...recipe,
    id: Math.random().toString(36).substr(2, 9),
    isCustom: true
  }
  customRecipes.value.push(newRecipe)
  updateScore(25) // Points for adding recipe
}

const handleBookmarkRecipe = (recipeId) => {
  const index = bookmarkedRecipes.value.indexOf(recipeId)
  if (index > -1) {
    bookmarkedRecipes.value.splice(index, 1)
  } else {
    bookmarkedRecipes.value.push(recipeId)
  }
}

// Initialize sample data
onMounted(() => {
  // Sample data will be initialized by composables
})
</script>

<style>
/* Global styles will be handled by globals.css */
</style>