<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUser } from '../composables/useUser'

const emit = defineEmits(['back'])

const { user, initials, updateUser } = useUser()

const showEditModal = ref(false)
const showExportModal = ref(false)

const editForm = ref({
  fullName: user.value.fullName,
  email: user.value.email,
  location: 'Singapore',
  timezone: 'GMT+8',
  language: 'English'
})



const achievements = [
  { id: 1, name: 'First Save', icon: 'bi-star-fill', unlocked: true, color: 'text-warning', description: 'Saved your first food item' },
  { id: 2, name: 'Week Warrior', icon: 'bi-calendar-check-fill', unlocked: true, color: 'text-success', description: '7-day streak achieved' },
  { id: 3, name: '$100 Saver', icon: 'bi-currency-dollar', unlocked: true, color: 'text-primary', description: 'Saved $100 in total' },
  { id: 4, name: 'Recipe Master', icon: 'bi-egg-fried', unlocked: false, color: 'text-muted', description: 'Use 25 different recipes' },
  { id: 5, name: 'Community Hero', icon: 'bi-people-fill', unlocked: false, color: 'text-muted', description: 'Share 10 food items' },
  { id: 6, name: 'Zero Waste', icon: 'bi-recycle', unlocked: false, color: 'text-muted', description: 'Zero waste for 30 days' }
]

const stats = computed(() => [
  { label: 'Current Streak', value: user.value.currentStreak, unit: 'days', icon: 'bi-fire', color: 'text-warning' },
  { label: 'Total Saved', value: `$${user.value.totalSaved.toFixed(2)}`, unit: '', icon: 'bi-currency-dollar', color: 'text-success' },
  { label: 'Waste Reduction', value: user.value.wasteReductionPercentage, unit: '%', icon: 'bi-graph-up', color: 'text-primary' },
  { label: 'Current Score', value: user.value.currentScore, unit: 'pts', icon: 'bi-trophy', color: 'text-warning' },
  { label: 'Items Saved', value: '47', unit: 'items', icon: 'bi-box', color: 'text-info' },
  { label: 'CO₂ Reduced', value: '25', unit: 'kg', icon: 'bi-leaf', color: 'text-success' }
])

const handleShareProgress = () => {
  alert('Share feature coming soon!')
}

const handleSaveProfile = () => {
  updateUser({ 
    fullName: editForm.value.fullName,
    email: editForm.value.email
  })
  showEditModal.value = false
  alert('Profile updated successfully!')
}

const handleExportData = () => {
  const data = {
    user: user.value,
    settings: settingsForm.value,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `foodsaver-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  showExportModal.value = false
  alert('Data exported successfully!')
}

const handleDeleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    alert('Account deletion requested. You will receive an email confirmation.')
  }
}

onMounted(() => {
  editForm.value.fullName = user.value.fullName
  editForm.value.email = user.value.email
})
</script>

<template>
  <div class="container-fluid p-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-2">Profile</h1>
        <p class="text-muted mb-0">Manage your account and preferences</p>
      </div>
      <button class="btn btn-outline-secondary" @click="emit('back')">
        <i class="bi bi-arrow-left me-2"></i>
        Back to Dashboard
      </button>
    </div>

    <!-- Profile Card -->
    <div class="glass-card p-4 mb-4">
      <div class="row align-items-center">
        <div class="col-md-8">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-lg">{{ initials }}</div>
            <div class="flex-1">
              <h4 class="mb-1">{{ user.fullName }}</h4>
              <p class="text-muted mb-1">{{ user.email }}</p>
              <small class="text-muted">
                <i class="bi bi-calendar me-1"></i>
                Member since {{ new Date().getFullYear() - 1 }}
              </small>
            </div>
          </div>
        </div>
        <div class="col-md-4 text-md-end mt-3 mt-md-0">
          <div class="d-flex gap-2 justify-content-md-end">
            <button class="btn btn-outline-primary" @click="showEditModal = true">
              <i class="bi bi-pencil me-2"></i>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Grid -->
    <div class="row g-3 mb-4">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="col-6 col-lg-2"
      >
        <div class="glass-card stat-card p-3 text-center h-100">
          <i :class="[stat.icon, 'fs-3', stat.color]"></i>
          <h4 class="mt-2 mb-1">{{ stat.value }}<small v-if="stat.unit">{{ stat.unit }}</small></h4>
          <small class="text-muted">{{ stat.label }}</small>
        </div>
      </div>
    </div>

    <!-- Achievements Section -->
    <div class="glass-card p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="h5 mb-0">
          <i class="bi bi-trophy me-2"></i>
          Achievements
        </h3>
        <small class="text-muted">
          {{ achievements.filter(a => a.unlocked).length }} of {{ achievements.length }} unlocked
        </small>
      </div>
      <div class="row g-3">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="col-6 col-md-4 col-lg-2"
        >
          <div 
            class="achievement-card text-center p-3 border rounded h-100" 
            :class="{ 'unlocked': achievement.unlocked, 'locked': !achievement.unlocked }"
            :title="achievement.description"
          >
            <i :class="[achievement.icon, 'fs-1', achievement.color]"></i>
            <p class="mb-2 mt-2 small fw-medium">{{ achievement.name }}</p>
            <div class="achievement-status">
              <i v-if="achievement.unlocked" class="bi bi-check-circle-fill text-success"></i>
              <i v-else class="bi bi-lock-fill text-muted"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="glass-card p-4">
      <h3 class="h5 mb-4">
        <i class="bi bi-lightning me-2"></i>
        Quick Actions
      </h3>
      <div class="row g-3">
        <div class="col-md-4">
          <button class="btn btn-outline-primary w-100 p-3" @click="showExportModal = true">
            <i class="bi bi-download fs-4 d-block mb-2"></i>
            <div class="fw-medium">Export Data</div>
            <small class="text-muted">Download your data</small>
          </button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-outline-info w-100 p-3" @click="handleShareProgress">
            <i class="bi bi-share fs-4 d-block mb-2"></i>
            <div class="fw-medium">Share Progress</div>
            <small class="text-muted">Share your achievements</small>
          </button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-outline-danger w-100 p-3" @click="handleDeleteAccount">
            <i class="bi bi-trash fs-4 d-block mb-2"></i>
            <div class="fw-medium">Delete Account</div>
            <small class="text-muted">Permanently remove account</small>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-person-circle me-2"></i>
              Edit Profile
            </h5>
            <button type="button" class="btn-close" @click="showEditModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSaveProfile">
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input
                  v-model="editForm.fullName"
                  type="text"
                  class="form-control"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email Address</label>
                <div class="input-group">
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="form-control"
                    placeholder="Enter your email"
                    required
                  />
                  <span class="input-group-text">
                    <i class="bi bi-envelope"></i>
                  </span>
                </div>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label">Location</label>
                  <input
                    v-model="editForm.location"
                    type="text"
                    class="form-control"
                    placeholder="Your location"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Timezone</label>
                  <select v-model="editForm.timezone" class="form-select">
                    <option value="GMT+8">GMT+8 (Singapore)</option>
                    <option value="GMT+0">GMT+0 (London)</option>
                    <option value="GMT-5">GMT-5 (New York)</option>
                    <option value="GMT-8">GMT-8 (Los Angeles)</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showEditModal = false">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="handleSaveProfile">
              <i class="bi bi-check me-2"></i>
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>

    <!-- Export Data Modal -->
    <div v-if="showExportModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-download me-2"></i>
              Export Your Data
            </h5>
            <button type="button" class="btn-close" @click="showExportModal = false"></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">Download a copy of all your FoodSaver data including:</p>
            <ul class="mb-4">
              <li>Profile information</li>
              <li>Food inventory history</li>
              <li>Usage statistics</li>
              <li>Achievement progress</li>
              <li>Community interactions</li>
            </ul>
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              Your data will be exported as a JSON file that you can download and keep for your records.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showExportModal = false">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="handleExportData">
              <i class="bi bi-download me-2"></i>
              Download Data
            </button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </div>
</template>

<style scoped>
.avatar-lg {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.stat-card {
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.achievement-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.achievement-card.unlocked {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.achievement-card.locked {
  opacity: 0.6;
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border-radius: 0.75rem;
}

@media (max-width: 768px) {
  .avatar-lg {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 1rem !important;
  }
  
  .achievement-card {
    padding: 1rem !important;
  }
}
</style>
