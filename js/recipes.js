// Import Lucide icons library
import lucide from "lucide"

// Initialize Lucide icons
lucide.createIcons()

// Sample recipe data
const recipes = [
  {
    id: 1,
    name: "Banana Smoothie",
    ingredients: ["Bananas", "Milk", "Yogurt"],
    category: "Breakfast",
    difficulty: "Easy",
    time: "5 min",
  },
  {
    id: 2,
    name: "Vegetable Stir Fry",
    ingredients: ["Lettuce", "Tomatoes", "Chicken Breast"],
    category: "Dinner",
    difficulty: "Medium",
    time: "20 min",
  },
  {
    id: 3,
    name: "Bread Pudding",
    ingredients: ["Bread", "Milk", "Yogurt"],
    category: "Dessert",
    difficulty: "Easy",
    time: "45 min",
  },
]

function renderRecipes(recipesToShow = recipes) {
  const container = document.getElementById("recipeList")

  if (recipesToShow.length === 0) {
    container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <p>No recipes found.</p>
                <p class="text-sm">Try a different search term.</p>
            </div>
        `
    return
  }

  container.innerHTML = recipesToShow
    .map(
      (recipe) => `
        <div class="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
            <h3 class="font-medium mb-2">${recipe.name}</h3>
            <p class="text-sm text-gray-600 mb-3">
                <span class="inline-flex items-center gap-1">
                    <i data-lucide="clock" class="w-3 h-3"></i>
                    ${recipe.time}
                </span>
                <span class="ml-3 inline-flex items-center gap-1">
                    <i data-lucide="chef-hat" class="w-3 h-3"></i>
                    ${recipe.difficulty}
                </span>
            </p>
            <div class="mb-3">
                <p class="text-xs text-gray-500 mb-1">Ingredients:</p>
                <div class="flex flex-wrap gap-1">
                    ${recipe.ingredients
                      .map(
                        (ingredient) =>
                          `<span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">${ingredient}</span>`,
                      )
                      .join("")}
                </div>
            </div>
            <button onclick="viewRecipe(${recipe.id})" class="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors">
                View Recipe
            </button>
        </div>
    `,
    )
    .join("")

  // Re-initialize Lucide icons
  lucide.createIcons()
}

function searchRecipes() {
  const searchTerm = document.getElementById("recipeSearch").value.toLowerCase()
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTerm)),
  )
  renderRecipes(filteredRecipes)
}

function viewRecipe(recipeId) {
  const recipe = recipes.find((r) => r.id === recipeId)
  if (recipe) {
    alert(
      `Recipe: ${recipe.name}\n\nIngredients: ${recipe.ingredients.join(", ")}\n\nThis would normally show detailed cooking instructions!`,
    )
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons()
  renderRecipes()
})
