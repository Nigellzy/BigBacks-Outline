<script setup lang="ts">
import { inject } from 'vue'
import { type Ref } from 'vue'
import { useUser } from '../../composables/useUser'
import { useNotifications } from '../../composables/useNotifications'

const emit = defineEmits<{
  toggleSidebar: []
}>()

const { initials } = useUser()
const { unreadCount } = useNotifications()
const currentView = inject<Ref<string>>('currentView')
</script>

<template>
  <div class="mobile-header">
    <div class="d-flex align-items-center gap-3">
      <button
        class="btn btn-link text-dark p-0"
        @click="emit('toggleSidebar')"
      >
        <i class="bi bi-list fs-3"></i>
      </button>
      <div class="d-flex align-items-center gap-2">
        <span class="fs-5">🥬</span>
        <h5 class="text-gradient-green mb-0">FoodSaver</h5>
      </div>
    </div>
    <div class="d-flex align-items-center gap-3">
      <button
        v-if="currentView !== 'notifications'"
        class="btn btn-link text-dark p-0 position-relative"
        @click="$emit('toggleSidebar')"
      >
        <i class="bi bi-bell fs-5"></i>
        <span v-if="unreadCount > 0" class="badge-dot">{{ unreadCount }}</span>
      </button>
      <div class="avatar">{{ initials }}</div>
    </div>
  </div>
</template>
