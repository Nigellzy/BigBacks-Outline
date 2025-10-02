<script setup>
import { ref, computed } from 'vue'
import { useNotifications } from '../composables/useNotifications'

const { 
  sortedNotifications, 
  unreadCount, 
  markAsRead, 
  markAllAsRead, 
  getRelativeTime 
} = useNotifications()

const selectedFilter = ref('all')

const filteredNotifications = computed(() => {
  if (selectedFilter.value === 'all') {
    return sortedNotifications.value
  }
  if (selectedFilter.value === 'unread') {
    return sortedNotifications.value.filter(n => !n.isRead)
  }
  return sortedNotifications.value.filter(n => n.type === selectedFilter.value)
})

const filterCounts = computed(() => ({
  all: sortedNotifications.value.length,
  unread: sortedNotifications.value.filter(n => !n.isRead).length,
  expiration: sortedNotifications.value.filter(n => n.type === 'expiration').length,
  achievement: sortedNotifications.value.filter(n => n.type === 'achievement').length,
  reminder: sortedNotifications.value.filter(n => n.type === 'reminder').length
}))

const getNotificationIcon = (type) => {
  switch (type) {
    case 'expiration':
      return 'bi-exclamation-triangle-fill'
    case 'achievement':
      return 'bi-trophy-fill'
    case 'reminder':
      return 'bi-bell-fill'
    default:
      return 'bi-info-circle-fill'
  }
}

const getNotificationColor = (type) => {
  switch (type) {
    case 'expiration':
      return 'text-warning'
    case 'achievement':
      return 'text-success'
    case 'reminder':
      return 'text-primary'
    default:
      return 'text-info'
  }
}

const getBadgeClass = (type) => {
  switch (type) {
    case 'expiration':
      return 'bg-warning'
    case 'achievement':
      return 'bg-success'
    case 'reminder':
      return 'bg-primary'
    default:
      return 'bg-info'
  }
}

const handleNotificationClick = (notificationId) => {
  markAsRead(notificationId)
}
</script>

<template>
  <div class="container-fluid p-4">
    <div class="notifications-overview mb-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h2 mb-2">Notifications</h1>
          <p class="text-muted mb-0">Stay updated on your food items and achievements</p>
        </div>
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="btn btn-primary"
        >
          <i class="bi bi-check-all me-2"></i>
          Mark All Read ({{ unreadCount }})
        </button>
      </div>

      <!-- Stats Overview -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
          <div class="glass-card stat-card p-3">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-bell text-primary"></i>
              <small class="text-muted">Total</small>
            </div>
            <h3 class="h4">{{ filterCounts.all }}</h3>
            <small class="text-muted">notifications</small>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="glass-card stat-card p-3">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-bell-fill text-info"></i>
              <small class="text-muted">Unread</small>
            </div>
            <h3 class="h4 text-info">{{ filterCounts.unread }}</h3>
            <small class="text-muted">new items</small>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="glass-card stat-card p-3">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-exclamation-triangle text-warning"></i>
              <small class="text-muted">Expiring</small>
            </div>
            <h3 class="h4 text-warning">{{ filterCounts.expiration }}</h3>
            <small class="text-muted">alerts</small>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="glass-card stat-card p-3">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-trophy text-success"></i>
              <small class="text-muted">Achievements</small>
            </div>
            <h3 class="h4 text-success">{{ filterCounts.achievement }}</h3>
            <small class="text-muted">earned</small>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <!-- Desktop Sidebar Filters -->
      <div class="col-lg-3 d-none d-lg-block">
        <div class="glass-card p-4">
          <h3 class="h5 mb-3">Filter Notifications</h3>
          <div class="d-flex flex-column gap-2">
            <button
              @click="selectedFilter = 'all'"
              :class="[
                'btn text-start',
                selectedFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'
              ]"
            >
              <i class="bi bi-list me-2"></i>
              All Notifications
              <span class="badge bg-light text-dark ms-auto">{{ filterCounts.all }}</span>
            </button>
            
            <button
              @click="selectedFilter = 'unread'"
              :class="[
                'btn text-start',
                selectedFilter === 'unread' ? 'btn-info' : 'btn-outline-info'
              ]"
            >
              <i class="bi bi-bell-fill me-2"></i>
              Unread
              <span class="badge bg-light text-dark ms-auto">{{ filterCounts.unread }}</span>
            </button>
            
            <button
              @click="selectedFilter = 'expiration'"
              :class="[
                'btn text-start',
                selectedFilter === 'expiration' ? 'btn-warning' : 'btn-outline-warning'
              ]"
            >
              <i class="bi bi-exclamation-triangle me-2"></i>
              Food Expiring
              <span class="badge bg-light text-dark ms-auto">{{ filterCounts.expiration }}</span>
            </button>
            
            <button
              @click="selectedFilter = 'achievement'"
              :class="[
                'btn text-start',
                selectedFilter === 'achievement' ? 'btn-success' : 'btn-outline-success'
              ]"
            >
              <i class="bi bi-trophy me-2"></i>
              Achievements
              <span class="badge bg-light text-dark ms-auto">{{ filterCounts.achievement }}</span>
            </button>
            
            <button
              @click="selectedFilter = 'reminder'"
              :class="[
                'btn text-start',
                selectedFilter === 'reminder' ? 'btn-secondary' : 'btn-outline-secondary'
              ]"
            >
              <i class="bi bi-bell me-2"></i>
              Reminders
              <span class="badge bg-light text-dark ms-auto">{{ filterCounts.reminder }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Filters -->
      <div class="col-12 d-lg-none">
        <div class="glass-card p-3 mb-4">
          <div class="row g-2">
            <div class="col-6">
              <button
                @click="selectedFilter = 'all'"
                :class="[
                  'btn w-100',
                  selectedFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'
                ]"
              >
                All
                <span class="badge bg-light text-dark ms-2">{{ filterCounts.all }}</span>
              </button>
            </div>
            <div class="col-6">
              <button
                @click="selectedFilter = 'unread'"
                :class="[
                  'btn w-100',
                  selectedFilter === 'unread' ? 'btn-info' : 'btn-outline-info'
                ]"
              >
                Unread
                <span class="badge bg-light text-dark ms-2">{{ filterCounts.unread }}</span>
              </button>
            </div>
            <div class="col-4">
              <button
                @click="selectedFilter = 'expiration'"
                :class="[
                  'btn w-100',
                  selectedFilter === 'expiration' ? 'btn-warning' : 'btn-outline-warning'
                ]"
              >
                <i class="bi bi-exclamation-triangle"></i>
                <span class="d-none d-sm-inline ms-1">Expiring</span>
                <span class="badge bg-light text-dark ms-2">{{ filterCounts.expiration }}</span>
              </button>
            </div>
            <div class="col-4">
              <button
                @click="selectedFilter = 'achievement'"
                :class="[
                  'btn w-100',
                  selectedFilter === 'achievement' ? 'btn-success' : 'btn-outline-success'
                ]"
              >
                <i class="bi bi-trophy"></i>
                <span class="d-none d-sm-inline ms-1">Awards</span>
                <span class="badge bg-light text-dark ms-2">{{ filterCounts.achievement }}</span>
              </button>
            </div>
            <div class="col-4">
              <button
                @click="selectedFilter = 'reminder'"
                :class="[
                  'btn w-100',
                  selectedFilter === 'reminder' ? 'btn-secondary' : 'btn-outline-secondary'
                ]"
              >
                <i class="bi bi-bell"></i>
                <span class="d-none d-sm-inline ms-1">Reminders</span>
                <span class="badge bg-light text-dark ms-2">{{ filterCounts.reminder }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="col-lg-9">
        <div class="glass-card p-4">
          <div class="d-flex align-items-center gap-2 mb-4">
            <i class="bi bi-bell"></i>
            <h2 class="h4 mb-0">
              {{ selectedFilter === 'all' ? 'All Notifications' : 
                  selectedFilter === 'unread' ? 'Unread Notifications' :
                  selectedFilter === 'expiration' ? 'Food Expiring Soon' :
                  selectedFilter === 'achievement' ? 'Your Achievements' :
                  'Reminders' }}
            </h2>
            <span class="badge bg-primary">{{ filteredNotifications.length }}</span>
          </div>

          <div v-if="filteredNotifications.length === 0" class="text-center py-5">
            <i class="bi bi-bell-slash display-4 text-muted mb-3"></i>
            <h5 class="text-muted">No notifications found</h5>
            <p class="text-muted mb-0">
              {{ selectedFilter === 'unread' ? 'All caught up! No unread notifications.' : 'No notifications matching your filter.' }}
            </p>
          </div>

          <div v-else class="notifications-container">
            <div
              v-for="notification in filteredNotifications"
              :key="notification.id"
              @click="handleNotificationClick(notification.id)"
              :class="[
                'notification-item p-4 mb-3 border rounded',
                !notification.isRead ? 'notification-unread' : '',
                'cursor-pointer'
              ]"
            >
              <div class="d-flex align-items-start">
                <!-- Icon -->
                <div class="notification-icon me-3">
                  <i 
                    :class="[
                      getNotificationIcon(notification.type),
                      getNotificationColor(notification.type),
                      'fs-3'
                    ]"
                  ></i>
                </div>

                <!-- Content -->
                <div class="flex-grow-1 min-width-0">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="fw-semibold mb-0 pe-2">
                      {{ notification.title }}
                    </h5>
                    <div class="d-flex align-items-center gap-2 flex-shrink-0">
                      <span 
                        :class="[
                          'badge text-capitalize',
                          getBadgeClass(notification.type)
                        ]"
                      >
                        {{ notification.type }}
                      </span>
                      <div v-if="!notification.isRead" class="unread-indicator"></div>
                    </div>
                  </div>
                  
                  <p class="text-muted mb-3">
                    {{ notification.message }}
                  </p>
                  
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                      <i class="bi bi-clock me-1"></i>
                      {{ getRelativeTime(notification.createdAt) }}
                    </small>
                    <small 
                      v-if="!notification.isRead"
                      class="text-primary fw-medium"
                    >
                      <i class="bi bi-circle-fill me-1"></i>
                      New
                    </small>
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
/* Stats Cards */
.stat-card {
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Notification Cards */
.notification-item {
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff !important;
  backdrop-filter: blur(10px);
  position: relative;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(13, 110, 253, 0.3);
}

.notification-unread {
  border-left: 4px solid #0d6efd;
  background: #ffffff !important;
}

.notification-unread:hover {
  background: rgba(13, 110, 253, 0.02) !important;
}

/* Notification Icon */
.notification-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.unread-indicator {
  width: 10px;
  height: 10px;
  background: #0d6efd;
  border-radius: 50%;
  display: inline-block;
}

.cursor-pointer {
  cursor: pointer;
}

.min-width-0 {
  min-width: 0;
}

/* Desktop Sidebar Styles */
@media (min-width: 992px) {
  .btn.text-start {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 500;
  }
  
  .btn.text-start .badge {
    margin-left: auto;
    margin-right: 0;
  }
  
  .notifications-container {
    max-height: calc(100vh - 400px);
    overflow-y: auto;
    padding-right: 0.5rem;
  }
  
  .notification-item {
    border-radius: 12px;
  }
  
  .notification-item h5 {
    font-size: 1.1rem;
    line-height: 1.3;
  }
  
  .notification-item p {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
}

/* Mobile Styles */
@media (max-width: 991px) {
  .container-fluid {
    padding: 1rem !important;
  }
  
  .notification-item {
    padding: 1rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  .notification-icon {
    width: 40px;
    height: 40px;
  }
  
  .badge {
    font-size: 0.7rem;
  }
  
  .btn {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }
  
  .btn .badge {
    font-size: 0.7rem;
  }
  
  .btn i {
    font-size: 0.875rem;
  }
}

/* Filter Button Styles */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Custom Scrollbar */
.notifications-container::-webkit-scrollbar {
  width: 6px;
}

.notifications-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.notifications-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.notifications-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Animations */
.notification-item {
  animation: fadeInUp 0.3s ease-in-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Enhanced Visual Elements */
.glass-card {
  background: #ffffff !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
}

/* Badge Improvements */
.badge {
  border-radius: 6px;
  font-weight: 500;
  padding: 0.35rem 0.6rem;
}

/* Button Group Spacing */
.btn-group .btn + .btn {
  margin-left: 0;
}

/* Typography Enhancements */
h1, h2, h3, h4, h5, h6 {
  color: var(--primary-text-color, #1f2937);
}

.text-muted {
  color: var(--secondary-text-color, #6b7280) !important;
}

/* Cohesive Color Scheme */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-1px);
}

.btn-outline-primary {
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.btn-outline-primary:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
  color: #667eea;
}

.btn-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  border: none;
  color: white;
}

.btn-outline-info {
  border-color: rgba(23, 162, 184, 0.3);
  color: #17a2b8;
  background: rgba(23, 162, 184, 0.1);
}

.btn-warning {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  border: none;
  color: #212529;
}

.btn-outline-warning {
  border-color: rgba(255, 193, 7, 0.3);
  color: #ffc107;
  background: rgba(255, 193, 7, 0.1);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  border: none;
  color: white;
}

.btn-outline-success {
  border-color: rgba(40, 167, 69, 0.3);
  color: #28a745;
  background: rgba(40, 167, 69, 0.1);
}

/* Focus Accessibility */
.notification-item:focus-within {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

/* Loading States */
.notification-item.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Dark Theme Compatibility */
@media (prefers-color-scheme: dark) {
  .glass-card {
    background: rgba(31, 41, 55, 0.95);
    border-color: rgba(75, 85, 99, 0.3);
  }
  
  .notification-item {
    background: rgba(31, 41, 55, 0.95);
    border-color: rgba(75, 85, 99, 0.3);
  }
  
  .notification-icon {
    background: rgba(75, 85, 99, 0.3);
    border-color: rgba(75, 85, 99, 0.5);
  }
}

/* Print Styles */
@media print {
  .btn, .unread-indicator {
    display: none !important;
  }
  
  .notification-item {
    break-inside: avoid;
    margin-bottom: 1rem;
  }
}
</style>
