<script setup>
import { ref } from 'vue'
import { useFoodItems } from '../../composables/useFoodItems'
import { useUser } from '../../composables/useUser'
import { useActivities } from '../../composables/useActivities'

const props = defineProps({
  foodItem: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const { updateFoodItem, deleteFoodItem, getDaysUntilExpiration } = useFoodItems()
const { addPoints } = useUser()
const { addActivity } = useActivities()

const useType = ref('partial')
const partialQuantity = ref(Math.min(1, props.foodItem.quantity))

const handleUse = () => {
  const daysUntilExpiration = getDaysUntilExpiration(props.foodItem.expirationDate)
  const isBeforeExpiry = daysUntilExpiration >= 0

  if (useType.value === 'all' || partialQuantity.value >= props.foodItem.quantity) {
    // Only add points if food is used before expiry
    if (isBeforeExpiry) {
      const points = Math.round(props.foodItem.price)*10
      addPoints(points)
    }

    addActivity({
      actionType: 'used',
      foodName: props.foodItem.name,
      value: props.foodItem.price,
      description: `Used ${props.foodItem.name} ${isBeforeExpiry ? 'before expiration' : 'after expiration'}`
    })

    deleteFoodItem(props.foodItem.id)
  } else {
    if (partialQuantity.value <= 0) {
      alert('Quantity must be greater than 0')
      return
    }

    const remainingQuantity = props.foodItem.quantity - partialQuantity.value
    const usedValue = (partialQuantity.value / props.foodItem.quantity) * props.foodItem.price
    
    // Only add points if food is used before expiry
    if (isBeforeExpiry) {
      const points = Math.round(usedValue)
      addPoints(points)
    }

    addActivity({
      actionType: 'used',
      foodName: props.foodItem.name,
      value: usedValue,
      description: `Used ${partialQuantity.value} ${props.foodItem.unit} of ${props.foodItem.name} ${isBeforeExpiry ? 'before expiration' : 'after expiration'}`
    })

    updateFoodItem(props.foodItem.id, { 
      quantity: remainingQuantity,
      price: props.foodItem.price - usedValue
    })
  }

  emit('close')
}
</script>

<template>
  <div class="modal fade show d-block" tabindex="-1" @click.self="emit('close')">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Use {{ foodItem.name }}</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <h6>How much would you like to use?</h6>
            <div class="d-flex gap-3 mt-3">
              <div class="form-check">
                <input
                  v-model="useType"
                  class="form-check-input"
                  type="radio"
                  value="partial"
                  id="partial"
                />
                <label class="form-check-label" for="partial">
                  Use Some ({{ partialQuantity }} {{ foodItem.unit }})
                </label>
              </div>
              <div class="form-check">
                <input
                  v-model="useType"
                  class="form-check-input"
                  type="radio"
                  value="all"
                  id="all"
                />
                <label class="form-check-label" for="all">
                  Use All ({{ foodItem.quantity }} {{ foodItem.unit }})
                </label>
              </div>
            </div>
          </div>

          <div v-if="useType === 'partial'" class="mb-4">
            <label class="form-label">Quantity to use</label>
            <div class="input-group">
              <input
                v-model.number="partialQuantity"
                type="number"
                class="form-control"
                :min="0.01"
                :max="foodItem.quantity"
                step="0.01"
              />
              <span class="input-group-text">{{ foodItem.unit }}</span>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="emit('close')">
              Cancel
            </button>
            <button type="button" class="btn btn-success" @click="handleUse">
              <i class="bi bi-check2 me-2"></i>
              Use Food
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>
