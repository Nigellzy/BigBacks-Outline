<script setup>
import { ref } from 'vue'
import { useFoodItems } from '../../composables/useFoodItems'
import { useUser } from '../../composables/useUser'
import { useActivities } from '../../composables/useActivities'

const emit = defineEmits(['close'])

const { addFoodItem } = useFoodItems()
const { addActivity } = useActivities()

const form = ref({
  name: '',
  category: 'Fruits & Vegetables',
  expirationDate: '',
  quantity: 1,
  unit: 'pieces',
  price: 0
})

const categories = [
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

const units = ['pieces', 'kg', 'grams', 'liters', 'ml', 'cups', 'loaf', 'pack']

const handleSubmit = () => {
  if (!form.value.name || !form.value.expirationDate || form.value.price <= 0) {
    alert('Please fill in all required fields')
    return
  }

  addFoodItem({
    name: form.value.name,
    category: form.value.category,
    expirationDate: form.value.expirationDate,
    quantity: form.value.quantity,
    unit: form.value.unit,
    price: form.value.price,
    status: 'active'
  })

  addActivity({
    actionType: 'added',
    description: `Added ${form.value.name} to inventory`
  })

  emit('close')
}

const showBarcodeAlert = () => {
  alert('Barcode scanner feature coming soon!')
}
</script>

<template>
  <div class="modal fade show d-block" tabindex="-1" @click.self="emit('close')">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Food Item</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Food Name <span class="text-danger">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Category <span class="text-danger">*</span></label>
              <select v-model="form.category" class="form-select" required>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Expiration Date <span class="text-danger">*</span></label>
              <input
                v-model="form.expirationDate"
                type="date"
                class="form-control"
                required
              />
            </div>

            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label">Quantity <span class="text-danger">*</span></label>
                <input
                  v-model.number="form.quantity"
                  type="number"
                  class="form-control"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Unit</label>
                <select v-model="form.unit" class="form-select">
                  <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Price (SGD) <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input
                  v-model.number="form.price"
                  type="number"
                  class="form-control"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <button type="button" class="btn btn-outline-secondary w-100" @click="showBarcodeAlert">
                <i class="bi bi-upc-scan"></i> Scan Barcode
              </button>
            </div>

            <button type="submit" class="btn btn-primary-gradient w-100">
              Add to Inventory
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>
