<script setup>
import { ref } from 'vue'
import { useFoodItems } from '../../composables/useFoodItems'

const props = defineProps({
  foodItem: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const { updateFoodItem } = useFoodItems()

const form = ref({
  name: props.foodItem.name,
  category: props.foodItem.category,
  expirationDate: props.foodItem.expirationDate,
  quantity: props.foodItem.quantity,
  unit: props.foodItem.unit,
  price: props.foodItem.price
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
  updateFoodItem(props.foodItem.id, form.value)
  emit('close')
}
</script>

<template>
  <div class="modal fade show d-block" tabindex="-1" @click.self="emit('close')">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Food Item</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Food Name</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Category</label>
              <select v-model="form.category" class="form-select" required>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Expiration Date</label>
              <input
                v-model="form.expirationDate"
                type="date"
                class="form-control"
                required
              />
            </div>

            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label">Quantity</label>
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
              <label class="form-label">Price (SGD)</label>
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

            <button type="submit" class="btn btn-primary-gradient w-100">
              Update Item
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>
