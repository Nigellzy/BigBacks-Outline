import { ref } from 'vue'

const activities = ref([])
const STORAGE_KEY = 'foodsaver_activities'

export function useActivities() {
  const loadActivities = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      activities.value = JSON.parse(stored)
    } else {
      initializeSampleActivities()
    }
  }

  const saveActivities = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities.value))
  }

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      userId: '1',
      createdAt: new Date().toISOString()
    }
    activities.value.push(newActivity)
    saveActivities()
  }

  const getRecentActivities = (limit = 5) => {
    return [...activities.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const initializeSampleActivities = () => {
    const baseTime = Date.now()
    const samples = [
      // Recent activities (last few days)
      {
        actionType: 'used',
        foodName: 'Eggs',
        value: 3.49,
        description: 'Used Eggs before expiration'
      },
      {
        actionType: 'used',
        foodName: 'Greek Yogurt',
        value: 4.99,
        description: 'Used Greek Yogurt before expiration'
      },
      {
        actionType: 'used',
        foodName: 'Ground Beef',
        value: 6.99,
        description: 'Used Ground Beef before expiration'
      },
      {
        actionType: 'expired',
        foodName: 'Spinach',
        value: 2.99,
        description: 'Spinach expired'
      },
      {
        actionType: 'used',
        foodName: 'Chicken Breast',
        value: 8.99,
        description: 'Used Chicken Breast before expiration'
      },
      {
        actionType: 'expired',
        foodName: 'Cheese',
        value: 5.99,
        description: 'Cheese expired'
      },
      {
        actionType: 'used',
        foodName: 'Whole Wheat Bread',
        value: 2.99,
        description: 'Used Whole Wheat Bread before expiration'
      },
      {
        actionType: 'expired',
        foodName: 'Salmon Fillet',
        value: 12.99,
        description: 'Salmon Fillet expired'
      },
      {
        actionType: 'used',
        foodName: 'Bananas',
        value: 2.49,
        description: 'Used Bananas before expiration'
      },
      {
        actionType: 'expired',
        foodName: 'Bagels',
        value: 3.99,
        description: 'Bagels expired'
      },
      {
        actionType: 'used',
        foodName: 'Orange Juice',
        value: 3.99,
        description: 'Used Orange Juice before expiration'
      },
      {
        actionType: 'used',
        foodName: 'Apples',
        value: 3.99,
        description: 'Used Apples before expiration'
      },
      // Older activities (last week)
      {
        actionType: 'used',
        foodName: 'Milk',
        value: 2.49,
        description: 'Used Milk before expiration'
      },
      {
        actionType: 'used',
        foodName: 'Carrots',
        value: 1.99,
        description: 'Used Carrots before expiration'
      },
      {
        actionType: 'expired',
        foodName: 'Lettuce',
        value: 2.49,
        description: 'Lettuce expired'
      },
      {
        actionType: 'used',
        foodName: 'Tomato Sauce',
        value: 2.49,
        description: 'Used Tomato Sauce before expiration'
      },
      {
        actionType: 'used',
        foodName: 'Croissants',
        value: 4.49,
        description: 'Used Croissants before expiration'
      },
      {
        actionType: 'expired',
        foodName: 'Strawberries',
        value: 4.99,
        description: 'Strawberries expired'
      }
    ]

    samples.forEach((sample, index) => {
      const activity = {
        ...sample,
        id: (baseTime - index * 3600000).toString(), // Every hour for more recent spread
        userId: '1',
        createdAt: new Date(baseTime - (index + 1) * 3600000).toISOString()
      }
      activities.value.push(activity)
    })
    saveActivities()
  }

  return {
    activities,
    loadActivities,
    addActivity,
    getRecentActivities,
    getRelativeTime
  }
}
