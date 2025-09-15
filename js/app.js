// Import Lucide icons library
const lucide = require("lucide")

// Initialize Lucide icons
lucide.createIcons()

// Mock data
let inventory = [
  { id: 1, name: "Bananas", category: "Fruits", quantity: 6, unit: "pieces", expiryDate: "2024-01-15", daysLeft: 2 },
  { id: 2, name: "Milk", category: "Dairy", quantity: 1, unit: "carton", expiryDate: "2024-01-18", daysLeft: 5 },
  { id: 3, name: "Bread", category: "Grains", quantity: 1, unit: "loaf", expiryDate: "2024-01-14", daysLeft: 1 },
  {
    id: 4,
    name: "Chicken Breast",
    category: "Meat",
    quantity: 500,
    unit: "grams",
    expiryDate: "2024-01-16",
    daysLeft: 3,
  },
  { id: 5, name: "Yogurt", category: "Dairy", quantity: 2, unit: "cups", expiryDate: "2024-01-13", daysLeft: -1 },
  { id: 6, name: "Lettuce", category: "Vegetables", quantity: 1, unit: "head", expiryDate: "2024-01-14", daysLeft: 1 },
  {
    id: 7,
    name: "Tomatoes",
    category: "Vegetables",
    quantity: 4,
    unit: "pieces",
    expiryDate: "2024-01-17",
    daysLeft: 4,
  },
]

let currentConsumeItem = null
let currentTab = "inventory"

// Authentication functions
function login() {
  document.getElementById("loginScreen").classList.add("hidden")
  document.getElementById("mainApp").classList.remove("hidden")
  renderInventory()
}

function logout() {
  document.getElementById("mainApp").classList.add("hidden")
  document.getElementById("loginScreen").classList.remove("hidden")
  toggleProfileMenu() // Close menu
}

function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu")
  menu.classList.toggle("hidden")
}

// Tab navigation
function showTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden")
  })

  // Remove active class from all tabs
  document.querySelectorAll('[id$="Tab"]').forEach((tab) => {
    tab.classList.remove("bg-emerald-600", "text-white")
    tab.classList.add("text-gray-600", "hover:text-gray-900")
  })

  // Show selected tab content
  document.getElementById(tabName + "Content").classList.remove("hidden")

  // Add active class to selected tab
  const activeTab = document.getElementById(tabName + "Tab")
  activeTab.classList.add("bg-emerald-600", "text-white")
  activeTab.classList.remove("text-gray-600", "hover:text-gray-900")

  currentTab = tabName

  // Load content based on tab
  if (tabName === "inventory") {
    renderInventory()
  } else if (tabName === "analytics") {
    loadAnalytics()
  } else if (tabName === "recipes") {
    loadRecipes()
  } else if (tabName === "achievements") {
    loadAchievements()
  } else if (tabName === "advanced") {
    loadAdvancedFeatures()
  }
}

// Modal functions
function openAddItemModal() {
  document.getElementById("addItemModal").classList.remove("hidden")
}

function closeAddItemModal() {
  document.getElementById("addItemModal").classList.add("hidden")
  document.getElementById("addItemModal").querySelector("form").reset()
}

function openConsumeModal(itemId) {
  const item = inventory.find((i) => i.id === itemId)
  if (!item) return

  currentConsumeItem = item
  document.getElementById("consumeItemName").textContent = item.name
  document.getElementById("consumeItemQuantity").textContent = item.quantity
  document.getElementById("consumeItemUnit").textContent = item.unit
  document.getElementById("consumeQuantity").max = item.quantity
  document.getElementById("consumeQuantity").value = Math.min(1, item.quantity)
  document.getElementById("consumeModal").classList.remove("hidden")
}

function closeConsumeModal() {
  document.getElementById("consumeModal").classList.add("hidden")
  currentConsumeItem = null
}

function confirmConsume() {
  if (!currentConsumeItem) return

  const consumeQuantity = Number.parseInt(document.getElementById("consumeQuantity").value)
  if (consumeQuantity <= 0 || consumeQuantity > currentConsumeItem.quantity) return

  if (consumeQuantity >= currentConsumeItem.quantity) {
    inventory = inventory.filter((item) => item.id !== currentConsumeItem.id)
  } else {
    const itemIndex = inventory.findIndex((item) => item.id === currentConsumeItem.id)
    inventory[itemIndex].quantity -= consumeQuantity
  }

  // Award points based on expiry status
  const points = currentConsumeItem.daysLeft <= 1 ? 50 : currentConsumeItem.daysLeft <= 3 ? 30 : 20
  updateUserPoints(points)

  closeConsumeModal()
  renderInventory()
  updateStats()
}

// Add item function
function addItem(event) {
  event.preventDefault()

  const name = document.getElementById("itemName").value
  const category = document.getElementById("itemCategory").value
  const quantity = Number.parseInt(document.getElementById("itemQuantity").value)
  const unit = document.getElementById("itemUnit").value
  const expiryDate = document.getElementById("itemExpiryDate").value

  const daysLeft = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const newItem = {
    id: Math.max(...inventory.map((i) => i.id), 0) + 1,
    name,
    category,
    quantity,
    unit,
    expiryDate,
    daysLeft,
  }

  inventory.push(newItem)
  updateUserPoints(10)
  closeAddItemModal()
  renderInventory()
  updateStats()
}

// Remove item function
function removeItem(itemId) {
  inventory = inventory.filter((item) => item.id !== itemId)
  renderInventory()
  updateStats()
}

function findRecipe(itemName) {
  const recipesByIngredient = {
    Bananas: [
      {
        name: "Banana Bread",
        time: "45 mins",
        difficulty: "Easy",
        description: "Classic moist banana bread perfect for overripe bananas",
      },
      {
        name: "Banana Smoothie",
        time: "5 mins",
        difficulty: "Easy",
        description: "Creamy breakfast smoothie with banana and yogurt",
      },
      {
        name: "Banana Pancakes",
        time: "20 mins",
        difficulty: "Medium",
        description: "Fluffy pancakes with mashed banana",
      },
      { name: "Banana Muffins", time: "30 mins", difficulty: "Easy", description: "Sweet muffins perfect for snacks" },
    ],
    Milk: [
      {
        name: "Creamy Mushroom Soup",
        time: "25 mins",
        difficulty: "Medium",
        description: "Rich and creamy soup using fresh milk",
      },
      { name: "Milk Bread", time: "3 hours", difficulty: "Hard", description: "Soft Japanese-style milk bread" },
      { name: "Custard", time: "20 mins", difficulty: "Medium", description: "Smooth vanilla custard dessert" },
      { name: "Milk Tea", time: "10 mins", difficulty: "Easy", description: "Aromatic spiced milk tea" },
    ],
    Bread: [
      { name: "Bread Pudding", time: "40 mins", difficulty: "Easy", description: "Sweet dessert using day-old bread" },
      {
        name: "French Toast",
        time: "15 mins",
        difficulty: "Easy",
        description: "Classic breakfast with crispy exterior",
      },
      { name: "Croutons", time: "20 mins", difficulty: "Easy", description: "Crunchy salad topping from stale bread" },
      { name: "Breadcrumbs", time: "10 mins", difficulty: "Easy", description: "Homemade breadcrumbs for coating" },
    ],
    "Chicken Breast": [
      { name: "Chicken Curry", time: "35 mins", difficulty: "Medium", description: "Spicy and aromatic chicken curry" },
      {
        name: "Chicken Stir Fry",
        time: "15 mins",
        difficulty: "Easy",
        description: "Quick and healthy stir-fried chicken",
      },
      { name: "Chicken Soup", time: "45 mins", difficulty: "Easy", description: "Comforting homemade chicken soup" },
      { name: "Grilled Chicken", time: "25 mins", difficulty: "Easy", description: "Juicy grilled chicken breast" },
    ],
    Yogurt: [
      {
        name: "Yogurt Parfait",
        time: "5 mins",
        difficulty: "Easy",
        description: "Layered yogurt with fruits and granola",
      },
      { name: "Smoothie Bowl", time: "10 mins", difficulty: "Easy", description: "Thick smoothie bowl with toppings" },
      { name: "Yogurt Sauce", time: "5 mins", difficulty: "Easy", description: "Creamy sauce for grilled meats" },
      { name: "Frozen Yogurt", time: "4 hours", difficulty: "Easy", description: "Homemade frozen yogurt dessert" },
    ],
    Lettuce: [
      {
        name: "Caesar Salad",
        time: "15 mins",
        difficulty: "Easy",
        description: "Classic salad with homemade dressing",
      },
      {
        name: "Lettuce Wraps",
        time: "20 mins",
        difficulty: "Easy",
        description: "Healthy wraps with seasoned filling",
      },
      { name: "Green Smoothie", time: "5 mins", difficulty: "Easy", description: "Nutritious green smoothie" },
      {
        name: "Vietnamese Spring Rolls",
        time: "30 mins",
        difficulty: "Medium",
        description: "Fresh rolls with lettuce and herbs",
      },
    ],
    Tomatoes: [
      { name: "Tomato Sauce", time: "30 mins", difficulty: "Easy", description: "Fresh homemade tomato sauce" },
      { name: "Tomato Soup", time: "25 mins", difficulty: "Easy", description: "Creamy tomato soup with basil" },
      { name: "Bruschetta", time: "15 mins", difficulty: "Easy", description: "Italian appetizer with fresh tomatoes" },
      {
        name: "Caprese Salad",
        time: "10 mins",
        difficulty: "Easy",
        description: "Simple salad with tomatoes and mozzarella",
      },
    ],
  }

  const recipes = recipesByIngredient[itemName] || [
    {
      name: `${itemName} Smoothie`,
      time: "10 mins",
      difficulty: "Easy",
      description: `Healthy smoothie featuring ${itemName.toLowerCase()}`,
    },
    {
      name: `${itemName} Soup`,
      time: "30 mins",
      difficulty: "Medium",
      description: `Warming soup with ${itemName.toLowerCase()}`,
    },
    {
      name: `${itemName} Stir Fry`,
      time: "15 mins",
      difficulty: "Easy",
      description: `Quick stir fry with ${itemName.toLowerCase()}`,
    },
    {
      name: `${itemName} Salad`,
      time: "10 mins",
      difficulty: "Easy",
      description: `Fresh salad featuring ${itemName.toLowerCase()}`,
    },
  ]

  const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]

  // Create a more detailed recipe suggestion modal
  const modalContent = `
    🍳 Recipe Suggestion: ${randomRecipe.name}
    
    ⏱️ Cook Time: ${randomRecipe.time}
    📊 Difficulty: ${randomRecipe.difficulty}
    
    ${randomRecipe.description}
    
    💡 This recipe is perfect for using up your ${itemName.toLowerCase()}!
    
    Click OK to see more recipes or Cancel to close.
  `

  if (confirm(modalContent)) {
    // Show additional recipes
    const otherRecipes = recipes.filter((r) => r.name !== randomRecipe.name).slice(0, 2)
    const additionalRecipes = otherRecipes.map((r) => `• ${r.name} (${r.time})`).join("\n")
    alert(
      `More recipes with ${itemName}:\n\n${additionalRecipes}\n\nIn a real app, this would open a detailed recipe page with step-by-step instructions!`,
    )
  }
}

// Render inventory
function renderInventory() {
  renderInventoryItems(inventory)
}

function renderInventoryItems(items) {
  const container = document.getElementById("inventoryList")

  if (items.length === 0) {
    container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p>No items found.</p>
                <p class="text-sm">Try adjusting your search or filters.</p>
            </div>
        `
    return
  }

  container.innerHTML = items
    .map((item) => {
      const { color, icon, text } = getExpiryStatus(item.daysLeft)
      const categoryColor = getCategoryColor(item.category)
      const isExpired = item.daysLeft < 0

      return `
            <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow slide-up">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="font-medium">${item.name}</h3>
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${categoryColor}">
                                ${item.category}
                            </span>
                        </div>
                        <div class="flex items-center gap-4 text-sm text-gray-600">
                            <span>${item.quantity} ${item.unit}</span>
                            <div class="flex items-center gap-1">
                                <i data-lucide="${icon}" class="w-3 h-3"></i>
                                <span class="${color}">${text}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <!-- Recipe button now appears for ALL items, not just expired ones -->
                        <button onclick="findRecipe('${item.name}')" class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors flex items-center gap-1">
                            <i data-lucide="chef-hat" class="w-3 h-3"></i>
                            Recipe
                        </button>
                        <!-- Consumed button available for all items with quantity selection -->
                        <button onclick="openConsumeModal(${item.id})" class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200 transition-colors flex items-center gap-1">
                            <i data-lucide="check" class="w-3 h-3"></i>
                            Consumed
                        </button>
                        <button onclick="removeItem(${item.id})" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
    })
    .join("")

  // Re-initialize Lucide icons for new content
  lucide.createIcons()
}

// Helper functions
function getExpiryStatus(daysLeft) {
  if (daysLeft < 0)
    return { color: "text-red-600", icon: "alert-triangle", text: `Expired ${Math.abs(daysLeft)} days ago` }
  if (daysLeft === 0) return { color: "text-red-600", icon: "alert-triangle", text: "Expires today" }
  if (daysLeft <= 3) return { color: "text-orange-600", icon: "clock", text: `${daysLeft} days left` }
  return { color: "text-gray-600", icon: "clock", text: `${daysLeft} days left` }
}

function getCategoryColor(category) {
  const colors = {
    Fruits: "bg-orange-100 text-orange-800",
    Vegetables: "bg-green-100 text-green-800",
    Dairy: "bg-blue-100 text-blue-800",
    Meat: "bg-red-100 text-red-800",
    Grains: "bg-yellow-100 text-yellow-800",
    Pantry: "bg-purple-100 text-purple-800",
    Frozen: "bg-cyan-100 text-cyan-800",
    Other: "bg-gray-100 text-gray-800",
  }
  return colors[category] || colors["Other"]
}

function updateUserPoints(points) {
  const currentPoints = Number.parseInt(document.getElementById("userPoints").textContent)
  document.getElementById("userPoints").textContent = currentPoints + points
}

function updateStats() {
  document.getElementById("totalItems").textContent = inventory.length
  const expiringCount = inventory.filter((item) => item.daysLeft >= 0 && item.daysLeft <= 3).length
  document.getElementById("expiringItems").textContent = expiringCount
}

// Placeholder functions for other tabs
function loadAnalytics() {
  document.getElementById("analyticsContent").innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">Analytics Dashboard</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Waste Reduction Trend</h3>
                    <p class="text-sm text-gray-600">Chart showing your progress over time</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Category Breakdown</h3>
                    <p class="text-sm text-gray-600">Which categories you waste most</p>
                </div>
            </div>
        </div>
    `
}

function loadRecipes() {
  document.getElementById("recipesContent").innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">Recipe Suggestions</h2>
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Based on Expiring Items</h3>
                    <p class="text-sm text-gray-600">Recipes using your soon-to-expire ingredients</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Popular Recipes</h3>
                    <p class="text-sm text-gray-600">Trending recipes from the community</p>
                </div>
            </div>
        </div>
    `
}

function loadAchievements() {
  document.getElementById("achievementsContent").innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">Achievements & Gamification</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Your Level: 8</h3>
                    <p class="text-sm text-gray-600">Progress to next level</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Achievements</h3>
                    <p class="text-sm text-gray-600">Badges and milestones</p>
                </div>
            </div>
        </div>
    `
}

function loadAdvancedFeatures() {
  document.getElementById("advancedContent").innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">Smart Tools</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Barcode Scanner</h3>
                    <p class="text-sm text-gray-600">Scan products to add automatically</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">AI Assistant</h3>
                    <p class="text-sm text-gray-600">Get personalized food waste tips</p>
                </div>
            </div>
        </div>
    `
}

// Close dropdowns when clicking outside
document.addEventListener("click", (event) => {
  const profileMenu = document.getElementById("profileMenu")
  const profileButton = event.target.closest('button[onclick="toggleProfileMenu()"]')

  if (!profileButton && !profileMenu.contains(event.target)) {
    profileMenu.classList.add("hidden")
  }
})

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons()
  showTab("inventory") // Show inventory tab by default
})
