import { ref, computed } from 'vue'

const recipes = ref([])
const STORAGE_KEY = 'foodsaver_recipes'

export function useRecipes() {
  const bookmarkedRecipes = computed(() =>
    recipes.value.filter(r => r.isBookmarked)
  )

  const customRecipes = computed(() =>
    recipes.value.filter(r => r.isCustom)
  )

  const suggestedRecipes = computed(() =>
    recipes.value.filter(r => !r.isCustom)
  )

  const loadRecipes = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      recipes.value = JSON.parse(stored)
    } else {
      initializeSampleRecipes()
    }
  }

  const saveRecipes = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes.value))
  }

  const addRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      id: Date.now().toString()
    }
    recipes.value.push(newRecipe)
    saveRecipes()
    return newRecipe
  }

  const toggleBookmark = (id) => {
    const recipe = recipes.value.find(r => r.id === id)
    if (recipe) {
      recipe.isBookmarked = !recipe.isBookmarked
      saveRecipes()
    }
  }

  const deleteRecipe = (id) => {
    recipes.value = recipes.value.filter(r => r.id !== id)
    saveRecipes()
  }

  const calculateMatchPercentage = (ingredients, userIngredients) => {
    const recipeIngredients = ingredients.toLowerCase().split(',').map(i => i.trim())
    const matches = recipeIngredients.filter(ri =>
      userIngredients.some(ui => ri.includes(ui.toLowerCase()))
    )
    return Math.round((matches.length / recipeIngredients.length) * 100)
  }

  const initializeSampleRecipes = () => {
    const samples = [
      {
        id: '1',
        name: 'Apple Cinnamon Oatmeal',
        ingredients: 'apples, oats, cinnamon, milk, honey',
        instructions: '1. Cook oats with milk\n2. Add diced apples and cinnamon\n3. Drizzle with honey',
        prepTime: '10 mins',
        servings: 2,
        isBookmarked: false,
        isCustom: false,
        matchPercentage: 75
      },
      {
        id: '2',
        name: 'Creamy Chicken Pasta',
        ingredients: 'chicken breast, pasta, milk, garlic, herbs',
        instructions: '1. Cook pasta\n2. Pan-fry chicken\n3. Add milk and herbs for sauce\n4. Combine',
        prepTime: '25 mins',
        servings: 4,
        isBookmarked: false,
        isCustom: false,
        matchPercentage: 80
      },
      {
        id: '3',
        name: 'French Toast',
        ingredients: 'bread, milk, eggs, cinnamon, butter',
        instructions: '1. Beat eggs with milk and cinnamon\n2. Dip bread slices\n3. Fry in butter until golden',
        prepTime: '15 mins',
        servings: 2,
        isBookmarked: false,
        isCustom: false,
        matchPercentage: 90
      },
      {
        id: '4',
        name: 'Chicken Sandwich',
        ingredients: 'bread, chicken breast, lettuce, tomato, mayo',
        instructions: '1. Grill chicken\n2. Toast bread\n3. Assemble with toppings',
        prepTime: '20 mins',
        servings: 2,
        isBookmarked: true,
        isCustom: false,
        matchPercentage: 85
      },
      {
        id: '5',
        name: 'Berry Yogurt Parfait',
        ingredients: 'yogurt, berries, granola, honey',
        instructions: '1. Layer yogurt in glass\n2. Add berries\n3. Top with granola and honey',
        prepTime: '5 mins',
        servings: 1,
        isBookmarked: false,
        isCustom: false,
        matchPercentage: 70
      }
    ]

    recipes.value = samples
    saveRecipes()
  }

  return {
    recipes,
    bookmarkedRecipes,
    customRecipes,
    suggestedRecipes,
    loadRecipes,
    addRecipe,
    toggleBookmark,
    deleteRecipe,
    calculateMatchPercentage
  }
}
