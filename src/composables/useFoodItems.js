import { ref, computed } from 'vue'

// Global state - singleton pattern to ensure all components share the same data
const foodItems = ref([])
const STORAGE_KEY = 'foodsaver_food_items'
let isInitialized = false

export function useFoodItems() {
  const activeFoodItems = computed(() =>
    foodItems.value.filter(item => item.status === 'active')
  )

  const getDaysUntilExpiration = (expirationDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expDate = new Date(expirationDate)
    expDate.setHours(0, 0, 0, 0)
    const diff = expDate.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getExpirationBadgeClass = (days) => {
    if (days <= 1) return 'badge-expired'
    if (days <= 3) return 'badge-warning-orange'
    if (days <= 7) return 'badge-warning-yellow'
    return 'badge-safe'
  }

  const getExpirationText = (days) => {
    if (days < 0) return 'Expired'
    if (days === 0) return 'Today'
    if (days === 1) return '1 day'
    return `${days} days`
  }

  const expiringSoon = computed(() =>
    activeFoodItems.value.filter(item => {
      const days = getDaysUntilExpiration(item.expirationDate)
      return days >= 0 && days <= 7
    }).length
  )

  const expired = computed(() =>
    activeFoodItems.value.filter(item =>
      getDaysUntilExpiration(item.expirationDate) < 0
    ).length
  )

  const potentialLoss = computed(() =>
    activeFoodItems.value
      .filter(item => {
        const days = getDaysUntilExpiration(item.expirationDate)
        return days >= 0 && days <= 7
      })
      .reduce((sum, item) => sum + item.price, 0)
  )

  const loadFoodItems = () => {
    if (isInitialized) return
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const loadedItems = JSON.parse(stored)
      // Remove duplicates based on ID
      const uniqueItems = loadedItems.filter((item, index, self) => 
        index === self.findIndex(i => i.id === item.id)
      )
      foodItems.value = uniqueItems
      
      // If we found duplicates, save the cleaned data
      if (uniqueItems.length !== loadedItems.length) {
        saveFoodItems()
      }
    } else {
      initializeSampleData()
    }
    isInitialized = true
  }

  const saveFoodItems = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foodItems.value))
  }

  const addFoodItem = (item) => {
    const newItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    foodItems.value.push(newItem)
    saveFoodItems()
    return newItem
  }

  const updateFoodItem = (id, updates) => {
    const index = foodItems.value.findIndex(item => item.id === id)
    if (index !== -1) {
      foodItems.value[index] = {
        ...foodItems.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveFoodItems()
    }
  }

  const deleteFoodItem = (id) => {
    foodItems.value = foodItems.value.filter(item => item.id !== id)
    saveFoodItems()
  }

  const initializeSampleData = () => {
    const today = new Date()
    const samples = [
      // Fruits & Vegetables
      {
        name: 'Apples',
        category: 'Fruits & Vegetables',
        expirationDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 6,
        unit: 'pieces',
        price: 3.99,
        status: 'active'
      },
      {
        name: 'Bananas',
        category: 'Fruits & Vegetables',
        expirationDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 8,
        unit: 'pieces',
        price: 2.49,
        status: 'active'
      },
      {
        name: 'Spinach',
        category: 'Fruits & Vegetables',
        expirationDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expired
        quantity: 1,
        unit: 'bag',
        price: 2.99,
        status: 'active'
      },
      {
        name: 'Carrots',
        category: 'Fruits & Vegetables',
        expirationDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 12,
        unit: 'pieces',
        price: 1.99,
        status: 'active'
      },
      
      // Dairy & Eggs
      {
        name: 'Milk',
        category: 'Dairy & Eggs',
        expirationDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'liter',
        price: 2.49,
        status: 'active'
      },
      {
        name: 'Greek Yogurt',
        category: 'Dairy & Eggs',
        expirationDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 4,
        unit: 'cups',
        price: 4.99,
        status: 'active'
      },
      {
        name: 'Eggs',
        category: 'Dairy & Eggs',
        expirationDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 12,
        unit: 'pieces',
        price: 3.49,
        status: 'active'
      },
      {
        name: 'Cheese',
        category: 'Dairy & Eggs',
        expirationDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expired
        quantity: 1,
        unit: 'pack',
        price: 5.99,
        status: 'active'
      },

      // Meat & Poultry
      {
        name: 'Chicken Breast',
        category: 'Meat & Poultry',
        expirationDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 500,
        unit: 'grams',
        price: 8.99,
        status: 'active'
      },
      {
        name: 'Ground Beef',
        category: 'Meat & Poultry',
        expirationDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 450,
        unit: 'grams',
        price: 6.99,
        status: 'active'
      },
      {
        name: 'Salmon Fillet',
        category: 'Meat & Poultry',
        expirationDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expired
        quantity: 300,
        unit: 'grams',
        price: 12.99,
        status: 'active'
      },

      // Bakery
      {
        name: 'Whole Wheat Bread',
        category: 'Bakery',
        expirationDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'loaf',
        price: 2.99,
        status: 'active'
      },
      {
        name: 'Croissants',
        category: 'Bakery',
        expirationDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 6,
        unit: 'pieces',
        price: 4.49,
        status: 'active'
      },
      {
        name: 'Bagels',
        category: 'Bakery',
        expirationDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expired
        quantity: 6,
        unit: 'pieces',
        price: 3.99,
        status: 'active'
      },

      // Snacks
      {
        name: 'Potato Chips',
        category: 'Snacks',
        expirationDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'bag',
        price: 2.99,
        status: 'active'
      },
      {
        name: 'Crackers',
        category: 'Snacks',
        expirationDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'box',
        price: 3.49,
        status: 'active'
      },

      // Beverages
      {
        name: 'Orange Juice',
        category: 'Beverages',
        expirationDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'liter',
        price: 3.99,
        status: 'active'
      },
      {
        name: 'Sparkling Water',
        category: 'Beverages',
        expirationDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 12,
        unit: 'cans',
        price: 4.99,
        status: 'active'
      },

      // Condiments & Sauces
      {
        name: 'Tomato Sauce',
        category: 'Condiments & Sauces',
        expirationDate: new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'jar',
        price: 2.49,
        status: 'active'
      },
      {
        name: 'Mayonnaise',
        category: 'Condiments & Sauces',
        expirationDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'jar',
        price: 3.99,
        status: 'active'
      },

      // Frozen Foods
      {
        name: 'Frozen Pizza',
        category: 'Frozen Foods',
        expirationDate: new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 2,
        unit: 'pieces',
        price: 7.99,
        status: 'active'
      },
      {
        name: 'Ice Cream',
        category: 'Frozen Foods',
        expirationDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'tub',
        price: 4.99,
        status: 'active'
      },

      // Grains & Pasta
      {
        name: 'Brown Rice',
        category: 'Grains & Pasta',
        expirationDate: new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 1,
        unit: 'kg',
        price: 3.99,
        status: 'active'
      },
      {
        name: 'Spaghetti',
        category: 'Grains & Pasta',
        expirationDate: new Date(today.getTime() + 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 500,
        unit: 'grams',
        price: 1.99,
        status: 'active'
      }
    ]

    const baseTime = Date.now()
    samples.forEach((sample, index) => {
      const newItem = {
        ...sample,
        id: `${baseTime + index}-${Math.random().toString(36).substr(2, 9)}`,
        userId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      foodItems.value.push(newItem)
    })
    saveFoodItems()
  }

  return {
    foodItems,
    activeFoodItems,
    expiringSoon,
    expired,
    potentialLoss,
    getDaysUntilExpiration,
    getExpirationBadgeClass,
    getExpirationText,
    loadFoodItems,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem
  }
}
