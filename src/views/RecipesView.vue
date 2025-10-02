<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFoodItems } from '../composables/useFoodItems'

const { activeFoodItems } = useFoodItems()

const activeTab = ref('search')
const searchQuery = ref('')
const isLoading = ref(false)
const searchResults = ref([])
const suggestedRecipes = ref([])
const bookmarkedRecipes = ref([])
const selectedRecipe = ref(null)
const showRecipeModal = ref(false)

// Get user's ingredients for suggestions
const userIngredients = computed(() => {
  return activeFoodItems.value.map(item => item.name.toLowerCase())
})

// Search recipes from TheMealDB API
const searchRecipes = async (query) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
    const data = await response.json()
    
    if (data.meals) {
      searchResults.value = data.meals.map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb,
        category: meal.strCategory,
        area: meal.strArea,
        instructions: meal.strInstructions,
        ingredients: getIngredientsList(meal),
        video: meal.strYoutube,
        source: meal.strSource,
        isBookmarked: bookmarkedRecipes.value.some(r => r.id === meal.idMeal)
      }))
    } else {
      searchResults.value = []
    }
  } catch (error) {
    console.error('Error searching recipes:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

// Get suggested recipes based on user ingredients
const getSuggestedRecipes = async () => {
  if (userIngredients.value.length === 0) return

  isLoading.value = true
  try {
    const suggestions = []
    
    // Search for recipes using the first few ingredients
    for (const ingredient of userIngredients.value.slice(0, 3)) {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(ingredient)}`)
      const data = await response.json()
      
      if (data.meals) {
        suggestions.push(...data.meals.slice(0, 2)) // Take first 2 results per ingredient
      }
    }

    // Remove duplicates and format
    const uniqueSuggestions = suggestions.filter((meal, index, self) => 
      self.findIndex(m => m.idMeal === meal.idMeal) === index
    )

    suggestedRecipes.value = uniqueSuggestions.map(meal => ({
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      ingredients: getIngredientsList(meal),
      video: meal.strYoutube,
      source: meal.strSource,
      matchPercentage: calculateMatchPercentage(getIngredientsList(meal), userIngredients.value),
      isBookmarked: bookmarkedRecipes.value.some(r => r.id === meal.idMeal)
    })).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 6)
    
  } catch (error) {
    console.error('Error getting suggested recipes:', error)
  } finally {
    isLoading.value = false
  }
}

// Extract ingredients list from TheMealDB response
const getIngredientsList = (meal) => {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`)
    }
  }
  return ingredients
}

// Calculate match percentage with user ingredients
const calculateMatchPercentage = (recipeIngredients, userIngredients) => {
  if (!recipeIngredients.length) return 0
  
  const matches = recipeIngredients.filter(ingredient =>
    userIngredients.some(userIng => 
      ingredient.toLowerCase().includes(userIng) || userIng.includes(ingredient.toLowerCase())
    )
  )
  return Math.round((matches.length / recipeIngredients.length) * 100)
}

// Handle search input
const handleSearch = async () => {
  await searchRecipes(searchQuery.value)
}

// Handle recipe view
const viewRecipe = (recipe) => {
  selectedRecipe.value = recipe
  showRecipeModal.value = true
}

// Toggle bookmark
const toggleBookmark = (recipe) => {
  const existingIndex = bookmarkedRecipes.value.findIndex(r => r.id === recipe.id)
  if (existingIndex >= 0) {
    bookmarkedRecipes.value.splice(existingIndex, 1)
    recipe.isBookmarked = false
  } else {
    bookmarkedRecipes.value.push({ ...recipe, isBookmarked: true })
    recipe.isBookmarked = true
  }
  
  // Update in search results and suggestions
  const updateInList = (list) => {
    const item = list.find(r => r.id === recipe.id)
    if (item) item.isBookmarked = recipe.isBookmarked
  }
  
  updateInList(searchResults.value)
  updateInList(suggestedRecipes.value)
  
  // Save to localStorage
  localStorage.setItem('bookmarked_recipes', JSON.stringify(bookmarkedRecipes.value))
}

// Load bookmarked recipes
const loadBookmarkedRecipes = () => {
  const stored = localStorage.getItem('bookmarked_recipes')
  if (stored) {
    bookmarkedRecipes.value = JSON.parse(stored)
  }
}

// Get displayed recipes based on active tab
const displayedRecipes = computed(() => {
  switch (activeTab.value) {
    case 'search':
      return searchResults.value
    case 'suggested':
      return suggestedRecipes.value
    case 'bookmarked':
      return bookmarkedRecipes.value
    default:
      return []
  }
})

// Initialize
onMounted(() => {
  loadBookmarkedRecipes()
  getSuggestedRecipes()
})
</script>

<template>
  <div class="container-fluid p-4">
    <div class="mb-4">
      <h1 class="h2 mb-2">Recipe Discovery</h1>
      <p class="text-muted">Search recipes and get suggestions based on your ingredients</p>
    </div>

    <!-- Search Section -->
    <div class="glass-card p-4 mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-8">
          <label class="form-label">Search for any recipe</label>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Enter recipe name, ingredient, or cuisine..."
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="col-md-4">
          <button @click="handleSearch" class="btn btn-primary w-100" :disabled="isLoading">
            <i class="bi bi-search me-2"></i>
            {{ isLoading ? 'Searching...' : 'Search Recipes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="glass-card p-4 mb-4">
      <ul class="nav nav-tabs border-0 mb-4">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'search' }"
            @click="activeTab = 'search'"
          >
            <i class="bi bi-search me-2"></i>
            Search Results
            <span v-if="searchResults.length" class="badge bg-primary ms-2">{{ searchResults.length }}</span>
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'suggested' }"
            @click="activeTab = 'suggested'"
          >
            <i class="bi bi-lightbulb me-2"></i>
            Suggested for You
            <span v-if="suggestedRecipes.length" class="badge bg-success ms-2">{{ suggestedRecipes.length }}</span>
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'bookmarked' }"
            @click="activeTab = 'bookmarked'"
          >
            <i class="bi bi-bookmark-heart me-2"></i>
            Bookmarked
            <span v-if="bookmarkedRecipes.length" class="badge bg-warning ms-2">{{ bookmarkedRecipes.length }}</span>
          </button>
        </li>
      </ul>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-3">Finding delicious recipes...</p>
      </div>

      <!-- Empty States -->
      <div v-else-if="displayedRecipes.length === 0" class="text-center py-5">
        <div v-if="activeTab === 'search'">
          <i class="bi bi-search display-1 text-muted mb-3"></i>
          <h5>Search for recipes</h5>
          <p class="text-muted">Enter a recipe name, ingredient, or cuisine type to get started</p>
        </div>
        <div v-else-if="activeTab === 'suggested'">
          <i class="bi bi-lightbulb display-1 text-muted mb-3"></i>
          <h5>No suggestions yet</h5>
          <p class="text-muted">Add some ingredients to your inventory to get personalized recipe suggestions</p>
        </div>
        <div v-else-if="activeTab === 'bookmarked'">
          <i class="bi bi-bookmark display-1 text-muted mb-3"></i>
          <h5>No bookmarked recipes</h5>
          <p class="text-muted">Bookmark recipes you like to save them for later</p>
        </div>
      </div>

      <!-- Recipe Grid -->
      <div v-else class="row g-4">
        <div v-for="recipe in displayedRecipes" :key="recipe.id" class="col-md-6 col-lg-4">
          <div class="recipe-card">
            <div class="recipe-image-container">
              <img :src="recipe.image" :alt="recipe.name" class="recipe-image" />
              <button 
                @click="toggleBookmark(recipe)"
                class="bookmark-btn"
                :class="{ bookmarked: recipe.isBookmarked }"
              >
                <i :class="recipe.isBookmarked ? 'bi bi-bookmark-heart-fill' : 'bi bi-bookmark-heart'"></i>
              </button>
              <div v-if="recipe.matchPercentage && activeTab === 'suggested'" class="match-badge">
                {{ recipe.matchPercentage }}% match
              </div>
            </div>
            
            <div class="recipe-content">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="recipe-title mb-0">{{ recipe.name }}</h6>
              </div>
              
              <div class="recipe-meta mb-3">
                <span class="badge bg-light text-dark me-2">{{ recipe.category }}</span>
                <span class="badge bg-outline-secondary">{{ recipe.area }}</span>
              </div>
              
              <div class="recipe-ingredients mb-3">
                <small class="text-muted">
                  <strong>Ingredients:</strong> 
                  {{ recipe.ingredients.slice(0, 3).join(', ') }}
                  <span v-if="recipe.ingredients.length > 3">...</span>
                </small>
              </div>
              
              <button @click="viewRecipe(recipe)" class="btn btn-primary btn-sm w-100">
                <i class="bi bi-eye me-2"></i>
                View Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Detail Modal -->
    <div v-if="showRecipeModal && selectedRecipe" class="modal fade show d-block" tabindex="-1" style="z-index: 1055;">
      <div class="modal-backdrop fade show" @click="showRecipeModal = false" style="z-index: 1050;"></div>
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" style="z-index: 1060;">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedRecipe.name }}</h5>
            <button type="button" class="btn-close" @click="showRecipeModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-5">
                <img :src="selectedRecipe.image" :alt="selectedRecipe.name" class="img-fluid rounded mb-3" />
                
                <div class="mb-3">
                  <h6>Category & Origin</h6>
                  <p class="mb-1"><strong>Category:</strong> {{ selectedRecipe.category }}</p>
                  <p class="mb-0"><strong>Origin:</strong> {{ selectedRecipe.area }}</p>
                </div>

                <div class="mb-3">
                  <h6>Ingredients</h6>
                  <ul class="list-unstyled">
                    <li v-for="ingredient in selectedRecipe.ingredients" :key="ingredient" class="mb-1">
                      <small>• {{ ingredient }}</small>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div class="col-md-7">
                <h6>Instructions</h6>
                <div class="instructions-text">
                  <p style="white-space: pre-line; line-height: 1.6;">{{ selectedRecipe.instructions }}</p>
                </div>
                
                <div class="mt-4">
                  <div class="d-flex gap-2 flex-wrap">
                    <button 
                      @click="toggleBookmark(selectedRecipe)"
                      class="btn"
                      :class="selectedRecipe.isBookmarked ? 'btn-warning' : 'btn-outline-warning'"
                    >
                      <i :class="selectedRecipe.isBookmarked ? 'bi bi-bookmark-heart-fill' : 'bi bi-bookmark-heart'"></i>
                      {{ selectedRecipe.isBookmarked ? 'Bookmarked' : 'Bookmark' }}
                    </button>
                    
                    <a v-if="selectedRecipe.video" :href="selectedRecipe.video" target="_blank" class="btn btn-outline-danger">
                      <i class="bi bi-play-circle me-2"></i>
                      Watch Video
                    </a>
                    
                    <a v-if="selectedRecipe.source" :href="selectedRecipe.source" target="_blank" class="btn btn-outline-primary">
                      <i class="bi bi-link-45deg me-2"></i>
                      Source
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.recipe-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bookmark-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.2s ease;
}

.bookmark-btn:hover,
.bookmark-btn.bookmarked {
  background: #fff;
  color: #dc3545;
}

.match-badge {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.recipe-content {
  padding: 1rem;
}

.recipe-title {
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.recipe-ingredients {
  font-size: 0.875rem;
  line-height: 1.4;
}

.instructions-text {
  max-height: 300px;
  overflow-y: auto;
}

.nav-tabs .nav-link {
  border: none;
  background: none;
  color: #6c757d;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.75rem 1rem;
}

.nav-tabs .nav-link.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.nav-tabs .nav-link:hover:not(.active) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}
</style>