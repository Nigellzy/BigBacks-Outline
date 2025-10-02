<script setup>
import { ref, computed } from 'vue'
import { useUser } from '../composables/useUser'
import { useFoodItems } from '../composables/useFoodItems'
import { useActivities } from '../composables/useActivities'
import AddFoodModal from '../components/dashboard/AddFoodModal.vue'
import EditFoodModal from '../components/dashboard/EditFoodModal.vue'
import UseFoodModal from '../components/dashboard/UseFoodModal.vue'

const { user } = useUser()
const {
  activeFoodItems,
  expiringSoon,
  expired,
  potentialLoss,
  getDaysUntilExpiration,
  getExpirationBadgeClass,
  getExpirationText,
  deleteFoodItem
} = useFoodItems()
const { getRecentActivities, getRelativeTime } = useActivities()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showUseModal = ref(false)
const selectedFood = ref(null)

const searchQuery = ref('')
const selectedCategory = ref('All Categories')
const sortBy = ref('expiration')

const categories = [
  'All Categories',
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Poultry',
  'Bakery',
  'Snacks',
  'Beverages',
  'Condiments & Sauces',
  'Frozen Foods',
  'Grains & Pasta',
  'Other'
]

const filteredFoodItems = computed(() => {
  let items = activeFoodItems.value

  if (searchQuery.value) {
    items = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value !== 'All Categories') {
    items = items.filter(item => item.category === selectedCategory.value)
  }

  if (sortBy.value === 'expiration') {
    items = [...items].sort((a, b) =>
      new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
    )
  } else if (sortBy.value === 'name') {
    items = [...items].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'category') {
    items = [...items].sort((a, b) => a.category.localeCompare(b.category))
  }

  return items
})

const recentActivities = computed(() => getRecentActivities(5))

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleDateString('en-SG', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const openEditModal = (item) => {
  selectedFood.value = item
  showEditModal.value = true
}

const openUseModal = (item) => {
  selectedFood.value = item
  showUseModal.value = true
}

const getItemBackgroundClass = (item) => {
  const days = getDaysUntilExpiration(item.expirationDate)
  if (days < 0) return 'food-item-expired'
  if (days <= 3) return 'food-item-expiring'
  return ''
}

const handleDeleteItem = (item) => {
  if (confirm(`Are you sure you want to delete ${item.name}?`)) {
    deleteFoodItem(item.id)
  }
}

const resetData = () => {
  if (confirm('This will clear all data and reload sample data. Continue?')) {
    localStorage.clear()
    window.location.reload()
  }
}
</script>

<template>
  <div class="container-fluid p-4">
    <div class="dashboard-overview">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 class="h2 mb-2">Dashboard</h1>
          <p class="text-muted mb-0">Track your food inventory and reduce waste</p>
        </div>
        <button @click="resetData" class="btn btn-outline-danger btn-sm">
          <i class="bi bi-arrow-clockwise me-1"></i>
          Reset Data
        </button>
      </div>

      <div class="row g-3">
        <div class="col-6 col-lg-3">
          <div class="glass-card stat-card p-3">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-graph-up-arrow text-success"></i>
              <small class="text-muted">Food Score</small>
            </div>
            <h3 class="h4">{{ user.currentScore }}</h3>
            <small class="text-muted">points</small>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="glass-card stat-card p-3">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-exclamation-triangle text-warning"></i>
              <small class="text-muted">Expiring Soon</small>
            </div>
            <h3 class="h4">{{ expiringSoon }}</h3>
            <small class="text-muted">items</small>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="glass-card stat-card p-3">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-currency-dollar text-success"></i>
              <small class="text-muted">Potential Loss</small>
            </div>
            <h3 class="h4">${{ potentialLoss.toFixed(2) }}</h3>
            <small class="text-muted">if expired</small>
          </div>
        </div>

        <div class="col-6 col-lg-3">
          <div class="glass-card stat-card p-3">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-calendar-x text-danger"></i>
              <small class="text-muted">Expired</small>
            </div>
            <h3 class="h4 text-danger">{{ expired }}</h3>
            <small class="text-muted">items</small>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="glass-card p-4">
          <div class="d-flex align-items-center gap-2 mb-4">
            <i class="bi bi-search"></i>
            <h2 class="h4 mb-0">Food Inventory</h2>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-12 col-md-4">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Search food items..."
              />
            </div>
            <div class="col-6 col-md-4">
              <select v-model="selectedCategory" class="form-select">
                <option v-for="cat in categories" :key="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="col-6 col-md-4">
              <select v-model="sortBy" class="form-select">
                <option value="expiration">Expiration Date</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          <div v-if="filteredFoodItems.length === 0" class="text-center py-5">
            <i class="bi bi-search fs-1 text-muted"></i>
            <p class="text-muted mt-3">No food items found</p>
          </div>

          <div v-else class="d-flex flex-column gap-2">
            <div
              v-for="item in filteredFoodItems"
              :key="item.id"
              class="p-3 border rounded"
              :class="getItemBackgroundClass(item)"
            >
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="mb-1">
                    {{ item.name }}
                    <span
                      class="badge ms-2"
                      :class="getExpirationBadgeClass(getDaysUntilExpiration(item.expirationDate))"
                    >
                      {{ getExpirationText(getDaysUntilExpiration(item.expirationDate)) }}
                    </span>
                  </h5>
                  <small class="text-muted">{{ item.category }}</small>
                </div>
                <div class="text-end">
                  <div class="fw-bold">${{ item.price.toFixed(2) }}</div>
                  <small class="text-muted">{{ item.quantity }} {{ item.unit }}</small>
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Expires: {{ formatDate(item.expirationDate) }}</small>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary btn-sm action-btn edit-btn" @click="openEditModal(item)">
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button class="btn btn-success btn-sm action-btn use-btn" @click="openUseModal(item)">
                    <i class="bi bi-check2"></i> Use
                  </button>
                  <button class="btn btn-outline-danger btn-sm action-btn delete-btn" @click="handleDeleteItem(item)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 d-none d-lg-block">
        <div class="glass-card p-4">
          <h3 class="h5 mb-3">Recent Activity</h3>
          <div v-if="recentActivities.length === 0" class="text-center py-4">
            <p class="text-muted">No recent activity</p>
          </div>
          <div v-else class="d-flex flex-column gap-3">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="pb-3 border-bottom"
            >
              <p class="mb-1 small">{{ activity.description }}</p>
              <small class="text-muted">{{ getRelativeTime(activity.createdAt) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Add Button -->
    <button
      class="floating-add-btn"
      @click="showAddModal = true"
      title="Add Food Item"
    >
      <i class="bi bi-plus-lg"></i>
    </button>

    <AddFoodModal v-if="showAddModal" @close="showAddModal = false" />
    <EditFoodModal
      v-if="showEditModal && selectedFood"
      :food-item="selectedFood"
      @close="showEditModal = false"
    />
    <UseFoodModal
      v-if="showUseModal && selectedFood"
      :food-item="selectedFood"
      @close="showUseModal = false"
    />
  </div>
</template>

<style scoped>
.action-btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.edit-btn {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  border-color: rgba(108, 117, 125, 0.3);
}

.edit-btn:hover {
  background: rgba(108, 117, 125, 0.2);
  color: #495057;
  transform: translateY(-1px);
}

.use-btn {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border-color: rgba(40, 167, 69, 0.3);
}

.use-btn:hover {
  background: rgba(40, 167, 69, 0.2);
  color: #1e7e34;
  transform: translateY(-1px);
}

.delete-btn {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border-color: rgba(220, 53, 69, 0.3);
}

.delete-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  color: #c82333;
  transform: translateY(-1px);
}

.floating-add-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
  cursor: pointer;
}

.floating-add-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.floating-add-btn:active {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .floating-add-btn {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    font-size: 20px;
  }
}
</style>
