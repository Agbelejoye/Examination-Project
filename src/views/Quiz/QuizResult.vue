<template>
  <div class="container py-4" style="max-width: 520px;">
    <div class="d-flex flex-column align-items-center mb-4">
      <ProgressRing :percent="score.percent" :label="'Your Score'" />
      <h4 class="mt-3">{{ pass ? 'Passed ✅' : 'Try Again ❌' }}</h4>
      <p class="text-muted">Correct: {{ score.correct }}/{{ score.total }}</p>
    </div>

    <div class="d-grid gap-2 mb-4">
      <button class="btn btn-outline-secondary" @click="reset">Retake Quiz</button>
      <button class="btn btn-primary" @click="toggleReview">{{ review ? 'Hide Review' : 'Review Assessment' }}</button>
    </div>

    <div v-if="review" class="card shadow-sm">
      <div class="card-body">
        <h6 class="mb-3">Review</h6>
        <div v-for="q in questions" :key="q.id" class="mb-3">
          <div class="fw-semibold mb-1 d-flex justify-content-between align-items-center">
            <span>Q{{ q.id }}. {{ q.text }}</span>
            <div class="d-flex align-items-center gap-2">
              <span v-if="isSkipped(q.id)" class="badge bg-warning text-dark">Skipped</span>
              <span class="badge" :class="isCorrect(q.id) ? 'bg-success' : 'bg-danger'">{{ isCorrect(q.id) ? '100%' : '0%' }}</span>
            </div>
          </div>
          <div class="list-group mb-2">
            <OptionRow
              v-for="(opt, i) in q.options"
              :key="i"
              :text="opt"
              :selected="selectedMap[q.id] === opt"
              :review="true"
              :correct="answersMap[q.id] === opt"
            />
          </div>
          <div class="small">
            <div>
              <span class="text-muted">Your answer:</span>
              <span :class="isCorrect(q.id) ? 'text-success' : 'text-danger'">{{ selectedMap[q.id] ?? '—' }}</span>
            </div>
            <div class="text-success">Correct answer: {{ answersMap[q.id] ?? '—' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-4">
      <router-link to="/home" class="btn btn-link">Back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchQuestionsForQuiz, fetchAnswersForQuiz, fetchQuizWithQuestions, readAnswersFromSession, clearAnswersFromSession } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import OptionRow from '@/components/OptionRow.vue'
import ProgressRing from '@/components/ProgressRing.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

function toSafeInt(val, fallback = 1) {
  const n = parseInt(val, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

const quizId = computed(() => toSafeInt(route.params.quizId, 1))

const questions = ref([])
const answers = ref([])
const quizMeta = ref(null)
const review = ref(false)

function readSelectedWithMigration(qid) {
  // migrate any older keys like quiz_NaN_answers or quiz_undefined_answers
  const current = readAnswersFromSession(qid)
  const legacyNaN = sessionStorage.getItem('quiz_NaN_answers')
  const legacyUndef = sessionStorage.getItem('quiz_undefined_answers')
  let merged = { ...(current || {}) }
  try { if (legacyNaN) merged = { ...JSON.parse(legacyNaN), ...merged } } catch {}
  try { if (legacyUndef) merged = { ...JSON.parse(legacyUndef), ...merged } } catch {}
  // write back to the proper key to ensure subsequent reads are consistent
  sessionStorage.setItem(`quiz_${qid}_answers`, JSON.stringify(merged))
  return merged
}

const selectedMap = computed(() => {
  const raw = readSelectedWithMigration(quizId.value) || {}
  // normalize keys to numbers for safer lookups
  const norm = {}
  Object.keys(raw).forEach(k => { norm[Number(k)] = raw[k] })
  return norm
})
const answersMap = computed(() => {
  const m = {}
  answers.value.forEach(a => { m[a.questionId] = a.correct })
  return m
})

const score = computed(() => calculateScore(selectedMap.value, answersMap.value, questions.value))
const pass = computed(() => (score.value.percent >= (quizMeta.value?.passingPercent || 70)))

function calculateScore(selectedMap, answersMap, questions) {
  if (!Array.isArray(questions)) return { correct: 0, total: 0, percent: 0 }
  let correct = 0
  const total = questions.length
  questions.forEach(q => {
    const selected = selectedMap[q.id]
    const correctAns = answersMap[q.id]
    if (selected != null && correctAns != null && selected === correctAns) correct++
  })
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0
  return { correct, total, percent }
}

function toggleReview() { review.value = !review.value }

const skippedSet = computed(() => {
  try {
    const raw = sessionStorage.getItem(`quiz_${quizId.value}_skips`)
    const arr = raw ? JSON.parse(raw) : []
    return new Set(arr)
  } catch { return new Set() }
})

function isSkipped(qid) { return skippedSet.value.has(qid) }

function isCorrect(qid) {
  return selectedMap.value[qid] != null && answersMap.value[qid] != null && selectedMap.value[qid] === answersMap.value[qid]
}

function reset() {
  clearAnswersFromSession(quizId.value)
  router.push({ name: 'QuizStart', params: { quizId: quizId.value } })
}

onMounted(async () => {
  let [qs, ans, meta] = await Promise.all([
    fetchQuestionsForQuiz(quizId.value),
    fetchAnswersForQuiz(quizId.value),
    fetchQuizWithQuestions(quizId.value)
  ])
  // Fallback retry if empty questions for any reason
  if (!Array.isArray(qs) || qs.length === 0) {
    try { qs = await fetchQuestionsForQuiz(quizId.value) } catch {}
  }
  questions.value = (qs || []).sort((a, b) => a.id - b.id)
  answers.value = ans || []
  quizMeta.value = meta || null

  // Persist result history for Profile page
  try {
    const historyKey = auth.user ? `quiz_history_user_${auth.user.id}` : 'quiz_history_guest'
    const raw = localStorage.getItem(historyKey)
    const list = raw ? JSON.parse(raw) : []
    const entry = {
      quizId: quizId.value,
      title: meta?.title || `Quiz ${quizId.value}`,
      correct: score.value.correct,
      total: score.value.total,
      percent: score.value.percent,
      passed: pass.value,
      timestamp: Date.now()
    }
    list.push(entry)
    localStorage.setItem(historyKey, JSON.stringify(list))
  } catch {}
})
</script>
