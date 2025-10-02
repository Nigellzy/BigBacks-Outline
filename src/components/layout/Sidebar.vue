<script setup>
const props = defineProps({
  currentView: {
    type: String,
    required: true
  },
  sidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['setView'])
</script>

<template>
  <div class="sidebar" :class="{ 'show': sidebarOpen }">
    <div class="p-4">
      <nav class="d-flex flex-column gap-1 mb-4">
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'dashboard' }"
          @click.prevent="emit('setView', 'dashboard')"
        >
          <i class="bi bi-house-door"></i>
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'recipes' }"
          @click.prevent="emit('setView', 'recipes')"
        >
          <i class="bi bi-egg-fried"></i>
          <span>Recipes</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'chat' }"
          @click.prevent="emit('setView', 'chat')"
        >
          <i class="bi bi-robot"></i>
          <span>AI Chat</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'community' }"
          @click.prevent="emit('setView', 'community')"
        >
          <i class="bi bi-people"></i>
          <span>Community</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'analytics' }"
          @click.prevent="emit('setView', 'analytics')"
        >
          <i class="bi bi-bar-chart"></i>
          <span>Analytics</span>
        </a>
        <a
          href="#"
          class="nav-link"
          :class="{ 'active': currentView === 'leaderboard' }"
          @click.prevent="emit('setView', 'leaderboard')"
        >
          <i class="bi bi-trophy"></i>
          <span>Leaderboard</span>
        </a>
      </nav>
    </div>
  </div>
</template>
