<script setup>
import { ref, computed } from 'vue'
import { Bar, Pie, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js'
import { useUser } from '../composables/useUser'
import { useFoodItems } from '../composables/useFoodItems'
import { useActivities } from '../composables/useActivities'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement
)

const { user } = useUser()
const { activeFoodItems } = useFoodItems()
const { activities } = useActivities()

// Calculate analytics metrics
const analytics = computed(() => {
  const items = activeFoodItems.value
  const wasteActivities = activities.value.filter(a => a.actionType === 'expired')
  const usedActivities = activities.value.filter(a => a.actionType === 'used')
  
  // Total waste calculation
  const totalWasteItems = wasteActivities.length
  const totalWasteMoney = totalWasteItems * 5 // Assume $5 average per wasted item
  
  // Total saved calculation  
  const totalSavedItems = usedActivities.length
  const totalSavedMoney = totalSavedItems * 5 // Assume $5 average per saved item
  
  // Reduction percentage - items used before expiry vs total items
  const totalItemsHandled = totalWasteItems + totalSavedItems
  const reductionPercentage = totalItemsHandled > 0 ? Math.round((totalSavedItems / totalItemsHandled) * 100) : 0
  
  // Current inventory
  const inventoryValue = items.reduce((sum, item) => sum + item.price, 0)
  const inventoryItems = items.length
  
  return {
    totalWaste: { money: totalWasteMoney, items: totalWasteItems },
    totalSaved: { money: totalSavedMoney, items: totalSavedItems },
    reduction: reductionPercentage,
    inventory: { value: inventoryValue, items: inventoryItems }
  }
})

// Chart data
const wasteVsSavingsChart = computed(() => ({
  labels: ['Waste', 'Savings'],
  datasets: [{
    label: 'Money ($)',
    data: [analytics.value.totalWaste.money, analytics.value.totalSaved.money],
    backgroundColor: ['#ef4444', '#10b981'],
    borderWidth: 0
  }]
}))

const wasteByCategoryChart = computed(() => {
  // Create a mapping of food names to categories
  const foodCategoryMap = {
    'Eggs': 'Dairy & Eggs',
    'Greek Yogurt': 'Dairy & Eggs', 
    'Cheese': 'Dairy & Eggs',
    'Milk': 'Dairy & Eggs',
    'Ground Beef': 'Meat & Poultry',
    'Chicken Breast': 'Meat & Poultry',
    'Salmon Fillet': 'Meat & Poultry',
    'Spinach': 'Fruits & Vegetables',
    'Carrots': 'Fruits & Vegetables',
    'Lettuce': 'Fruits & Vegetables',
    'Bananas': 'Fruits & Vegetables',
    'Apples': 'Fruits & Vegetables',
    'Strawberries': 'Fruits & Vegetables',
    'Whole Wheat Bread': 'Bakery',
    'Bagels': 'Bakery',
    'Croissants': 'Bakery',
    'Orange Juice': 'Beverages',
    'Tomato Sauce': 'Condiments & Sauces'
  }
  
  const wasteByCategory = activities.value
    .filter(a => a.actionType === 'expired')
    .reduce((acc, activity) => {
      const category = foodCategoryMap[activity.foodName] || 'Other'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})
  
  const labels = Object.keys(wasteByCategory)
  const data = Object.values(wasteByCategory)
  
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: [
        '#ef4444', // red
        '#f59e0b', // orange  
        '#8b5cf6', // purple
        '#06b6d4', // cyan
        '#10b981', // green
        '#6b7280'  // gray
      ],
      borderWidth: 0
    }]
  }
})

const monthlySpendingChart = computed(() => {
  // Generate sample monthly data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const spending = [250, 180, 220, 190, 160, 140] // Decreasing trend showing improvement
  
  return {
    labels: months,
    datasets: [{
      label: 'Monthly Food Spending ($)',
      data: spending,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    }
  }
}
</script>

<template>
  <div class="container-fluid p-4">
    <div class="mb-4">
      <h1 class="h2 mb-2">Analytics</h1>
      <p class="text-muted">Track your food waste reduction progress</p>
    </div>

    <!-- Key Metrics -->
    <div class="row g-3 mb-4">
      <div class="col-md-6 col-lg-3">
        <div class="glass-card stat-card p-4">
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-trash text-danger"></i>
            <small class="text-muted">Total Waste</small>
          </div>
          <h3 class="h4 text-danger mb-1">${{ analytics.totalWaste.money }}</h3>
          <small class="text-muted">{{ analytics.totalWaste.items }} items</small>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3">
        <div class="glass-card stat-card p-4">
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-piggy-bank text-success"></i>
            <small class="text-muted">Total Saved</small>
          </div>
          <h3 class="h4 text-success mb-1">${{ analytics.totalSaved.money }}</h3>
          <small class="text-muted">{{ analytics.totalSaved.items }} items</small>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3">
        <div class="glass-card stat-card p-4">
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-arrow-up text-primary"></i>
            <small class="text-muted">Reduction</small>
          </div>
          <h3 class="h4 text-primary mb-1">{{ analytics.reduction }}%</h3>
          <small class="text-muted">food used before expiry</small>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3">
        <div class="glass-card stat-card p-4">
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-box text-info"></i>
            <small class="text-muted">Inventory</small>
          </div>
          <h3 class="h4 text-info mb-1">${{ analytics.inventory.value.toFixed(2) }}</h3>
          <small class="text-muted">{{ analytics.inventory.items }} items</small>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row g-4">
      <!-- Waste vs Savings Bar Chart -->
      <div class="col-lg-4">
        <div class="glass-card p-4">
          <h5 class="mb-4">
            <i class="bi bi-bar-chart me-2"></i>
            Waste vs Savings
          </h5>
          <div style="height: 300px;">
            <Bar :data="wasteVsSavingsChart" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Waste by Category Pie Chart -->
      <div class="col-lg-4">
        <div class="glass-card p-4">
          <h5 class="mb-4">
            <i class="bi bi-pie-chart me-2"></i>
            Waste by Category
          </h5>
          <div style="height: 300px;">
            <Pie :data="wasteByCategoryChart" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Monthly Spending Trend -->
      <div class="col-lg-4">
        <div class="glass-card p-4">
          <h5 class="mb-4">
            <i class="bi bi-graph-up me-2"></i>
            Monthly Spending Trend
          </h5>
          <div style="height: 300px;">
            <Line :data="monthlySpendingChart" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>