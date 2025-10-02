import { ref, computed } from 'vue'

const notifications = ref([])
const STORAGE_KEY = 'foodsaver_notifications'

export function useNotifications() {
  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.isRead).length
  )

  const sortedNotifications = computed(() =>
    [...notifications.value].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  )

  const loadNotifications = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      notifications.value = JSON.parse(stored)
    } else {
      initializeSampleNotifications()
    }
  }

  const saveNotifications = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.value))
  }

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      userId: '1',
      createdAt: new Date().toISOString()
    }
    notifications.value.push(newNotification)
    saveNotifications()
  }

  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
      saveNotifications()
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
    saveNotifications()
  }

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  const initializeSampleNotifications = () => {
    const samples = [
      {
        type: 'expiration',
        title: 'Food Expiring Soon!',
        message: 'Your milk expires in 1 day',
        isRead: false
      },
      {
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You saved $50 this month',
        isRead: false
      },
      {
        type: 'reminder',
        title: 'Recipe Suggestion',
        message: 'Try apple pie with your expiring apples',
        isRead: true
      }
    ]

    const baseTime = Date.now()
    samples.forEach((sample, index) => {
      const notification = {
        ...sample,
        id: (baseTime - index * 7200000).toString(),
        userId: '1',
        createdAt: new Date(baseTime - index * 7200000).toISOString()
      }
      notifications.value.push(notification)
    })
    saveNotifications()
  }

  return {
    notifications,
    sortedNotifications,
    unreadCount,
    loadNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getRelativeTime
  }
}
