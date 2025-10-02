<script setup>
import { ref } from 'vue'
import { useRecipes } from '../../composables/useRecipes'
import { useUser } from '../../composables/useUser'

const emit = defineEmits(['close'])

const { addRecipe } = useRecipes()
const { addPoints } = useUser()

const form = ref({
  name: '',
  ingredients: '',
  instructions: '',
  prepTime: '',
  servings: 1
})

const handleSubmit = () => {
  if (!form.value.name || !form.value.ingredients || !form.value.instructions) {
    alert('Please fill in all required fields')
    return
  }

  addRecipe({
    userId: '1',
    name: form.value.name,
    ingredients: form.value.ingredients,
    instructions: form.value.instructions,
    prepTime: form.value.prepTime,
    servings: form.value.servings,
    isBookmarked: false,
    isCustom: true
  })

  addPoints(25)
  emit('close')
}
</script>

<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-backdrop fade show" @click="emit('close')"></div>
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Custom Recipe</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Recipe Name <span class="text-danger">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Ingredients (comma-separated) <span class="text-danger">*</span></label>
              <textarea
                v-model="form.ingredients"
                class="form-control"
                rows="3"
                required
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Instructions <span class="text-danger">*</span></label>
              <textarea
                v-model="form.instructions"
                class="form-control"
                rows="5"
                required
              ></textarea>
            </div>

            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label">Prep Time</label>
                <input
                  v-model="form.prepTime"
                  type="text"
                  class="form-control"
                  placeholder="e.g., 30 mins"
                />
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">Servings</label>
                <input
                  v-model.number="form.servings"
                  type="number"
                  class="form-control"
                  min="1"
                />
              </div>
            </div>

            <button type="submit" class="btn btn-primary-gradient w-100">
              Add Recipe
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>
