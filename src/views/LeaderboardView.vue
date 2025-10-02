<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '../composables/useUser'

const { user, initials } = useUser()

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  streak: number
  avatar: string
  isCurrentUser: boolean
}

const leaderboard = ref<LeaderboardEntry[]>([
  { rank: 1, name: 'Sarah Chen', score: 3450, streak: 28, avatar: 'SC', isCurrentUser: false },
  { rank: 2, name: 'Michael Tan', score: 3120, streak: 21, avatar: 'MT', isCurrentUser: false },
  { rank: 3, name: 'Emily Wong', score: 2890, streak: 15, avatar: 'EW', isCurrentUser: false },
  { rank: 4, name: 'David Lim', score: 2340, streak: 12, avatar: 'DL', isCurrentUser: false },
  { rank: 5, name: user.value.fullName, score: user.value.currentScore, streak: user.value.currentStreak, avatar: initials.value, isCurrentUser: true },
  { rank: 6, name: 'Jessica Lee', score: 1820, streak: 9, avatar: 'JL', isCurrentUser: false },
  { rank: 7, name: 'Ryan Ng', score: 1650, streak: 7, avatar: 'RN', isCurrentUser: false },
  { rank: 8, name: 'Amanda Koh', score: 1490, streak: 6, avatar: 'AK', isCurrentUser: false },
  { rank: 9, name: 'Kevin Teo', score: 1280, streak: 5, avatar: 'KT', isCurrentUser: false },
  { rank: 10, name: 'Lisa Chan', score: 1150, streak: 4, avatar: 'LC', isCurrentUser: false }
])

const getRankBadgeClass = (rank: number) => {
  if (rank === 1) return 'rank-badge-gold'
  if (rank === 2) return 'rank-badge-silver'
  if (rank === 3) return 'rank-badge-bronze'
  return ''
}
</script>

<template>
  <div class="container-fluid p-4">
    <div class="mb-4">
      <h1 class="h2 mb-2">Leaderboard</h1>
      <p class="text-muted">Top food savers in Singapore</p>
    </div>

    <div class="glass-card p-4 mb-4" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%);">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-lg">{{ initials }}</div>
          <div>
            <h4 class="mb-1">Your Rank: #{{ leaderboard.find(e => e.isCurrentUser)?.rank }}</h4>
            <p class="mb-0 text-muted">Score: {{ user.currentScore }}</p>
          </div>
        </div>
        <div class="text-end">
          <span class="badge bg-warning text-dark">
            <i class="bi bi-fire"></i> {{ user.currentStreak }} day streak
          </span>
        </div>
      </div>
    </div>

    <div class="glass-card p-4">
      <h3 class="h5 mb-4">Top Users</h3>
      <div class="d-flex flex-column gap-3">
        <div
          v-for="entry in leaderboard"
          :key="entry.rank"
          class="d-flex align-items-center gap-3 p-3 border rounded"
          :class="{ 'bg-light': entry.isCurrentUser }"
        >
          <div
            class="d-flex align-items-center justify-content-center fw-bold"
            style="min-width: 40px; height: 40px;"
            :class="getRankBadgeClass(entry.rank)"
            v-if="entry.rank <= 3"
          >
            #{{ entry.rank }}
          </div>
          <div
            v-else
            class="d-flex align-items-center justify-content-center fw-bold text-muted"
            style="min-width: 40px;"
          >
            #{{ entry.rank }}
          </div>

          <div class="avatar">{{ entry.avatar }}</div>

          <div class="flex-1">
            <h6 class="mb-1">
              {{ entry.name }}
              <span v-if="entry.isCurrentUser" class="badge bg-primary ms-2">You</span>
            </h6>
            <small class="text-muted">
              <i class="bi bi-fire text-warning"></i> {{ entry.streak }} day streak
            </small>
          </div>

          <div class="text-end">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-trophy text-warning"></i>
              <span class="fw-bold">{{ entry.score.toLocaleString() }} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
