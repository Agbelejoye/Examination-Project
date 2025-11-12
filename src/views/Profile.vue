<template>
  <div class="container py-5" style="max-width: 900px;">
    <div class="row">
      <div class="col-lg-4 mb-4">
        <div class="card shadow-lg border-0">
          <div class="card-body text-center p-4">
            <div class="avatar-circle mx-auto mb-3">
              <i class="bi bi-person-fill fs-1 text-primary"></i>
            </div>
            <h4 class="card-title mb-1">{{ auth.user?.name || 'Guest User' }}</h4>
            <p class="text-muted mb-3" v-if="auth.user">{{ schoolClassLabel }}</p>
            <div class="progress-circle">
              <ProgressRing :percent="overallPercent" :size="140" :stroke="12" label="Overall Score"/>
            </div>
            <p class="text-muted small mt-3">Average performance across all quizzes</p>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card shadow-lg border-0">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="bi bi-trophy-fill me-2"></i>Recent Quiz Results</h5>
          </div>
          <div class="card-body">
            <div v-if="!history.length" class="text-center py-5">
              <i class="bi bi-clipboard-x fs-1 text-muted mb-3"></i>
              <h6 class="text-muted">No quiz attempts yet</h6>
              <p class="text-muted small">Start taking quizzes to see your progress here!</p>
              <router-link to="/home" class="btn btn-primary mt-3">
                <i class="bi bi-play-circle me-2"></i>Browse Courses
              </router-link>
            </div>
            <div v-else class="list-group list-group-flush">
              <div v-for="(h, i) in historySorted" :key="i" class="list-group-item px-0 py-3 border-0">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">{{ h.title }}</h6>
                    <small class="text-muted">
                      <i class="bi bi-calendar-event me-1"></i>{{ new Date(h.timestamp).toLocaleDateString() }} at {{ new Date(h.timestamp).toLocaleTimeString() }}
                    </small>
                  </div>
                  <div class="text-end">
                    <span class="badge fs-6 px-3 py-2" :class="h.passed ? 'bg-success' : 'bg-danger'">
                      {{ h.percent }}%
                    </span>
                    <div class="text-muted small mt-1">
                      {{ h.passed ? 'Passed' : 'Failed' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
