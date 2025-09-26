<template>
  <div class="container py-4" style="max-width: 520px;">
    <h3 class="mb-3">Your Profile</h3>

    <div class="card shadow-sm mb-3">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <div class="fw-semibold">{{ auth.user?.name || 'Guest' }}</div>
          <div class="text-muted small" v-if="auth.user">{{ schoolClassLabel }}</div>
        </div>
        <ProgressRing :percent="overallPercent" :size="120" :stroke="10" label="Overall"/>
      </div>
    </div>

    <h6 class="mb-2">Recent Results</h6>
    <div v-if="!history.length" class="text-muted small">No attempts yet.</div>
    <ul v-else class="list-group">
      <li v-for="(h, i) in historySorted" :key="i" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-semibold">{{ h.title }}</div>
          <div class="text-muted small">{{ new Date(h.timestamp).toLocaleString() }}</div>
        </div>
        <span class="badge rounded-pill" :class="h.passed ? 'bg-success' : 'bg-danger'">{{ h.percent }}%</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ProgressRing from '@/components/ProgressRing.vue'

const auth = useAuthStore()

const historyKey = computed(() => auth.user ? `quiz_history_user_${auth.user.id}` : 'quiz_history_guest')
const history = computed(() => {
  try {
    const raw = localStorage.getItem(historyKey.value)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
})

const historySorted = computed(() => [...history.value].sort((a,b)=> b.timestamp - a.timestamp))

const overallPercent = computed(() => {
  if (!history.value.length) return 0
  const sum = history.value.reduce((acc, h) => acc + (h.percent || 0), 0)
  return Math.round(sum / history.value.length)
})

const schoolClassLabel = computed(() => {
  const classMap = { 1: 'JSS 1', 2: 'JSS 2', 3: 'JSS 3', 4: 'SS 1', 5: 'SS 2', 6: 'SS 3' }
  return `Class ${classMap[auth.user?.classId] || ''}`
})
</script>
