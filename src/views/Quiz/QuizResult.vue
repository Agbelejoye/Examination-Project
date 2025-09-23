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
        <div v-for="q in questions" :key="q.id" class="mb-2">
          <div class="fw-semibold mb-1">Q{{ q.id }}. {{ q.text }}</div>
          <div class="list-group">
            <OptionRow
              v-for="(opt, i) in q.options"
              :key="i"
              :text="opt"
              :selected="selectedMap[q.id] === opt"
              :review="true"
              :correct="answersMap[q.id] === opt"
            />
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
import OptionRow from '@/components/OptionRow.vue'
import ProgressRing from '@/components/ProgressRing.vue'

const route = useRoute()
const router = useRouter()
const quizId = Number(route.params.quizId)

const questions = ref([])
const answers = ref([])
const quizMeta = ref(null)
const review = ref(false)

const selectedMap = computed(() => readAnswersFromSession(quizId))
const answersMap = computed(() => {
  const m = {}
  answers.value.forEach(a => { m[a.questionId] = a.correct })
  return m
})

const score = computed(() => calculateScore(selectedMap.value, answers.value))
const pass = computed(() => (score.value.percent >= (quizMeta.value?.passingPercent || 70)))

function calculateScore(selectedMap, answers) {
  let correct = 0
  answers.forEach(a => {
    if (selectedMap[a.questionId] === a.correct) correct++
  })
  const total = answers.length || 1
  return { correct, total, percent: Math.round((correct / total) * 100) }
}

function toggleReview() { review.value = !review.value }

function reset() {
  clearAnswersFromSession(quizId)
  router.push({ name: 'QuizStart', params: { quizId } })
}

onMounted(async () => {
  const [qs, ans, meta] = await Promise.all([
    fetchQuestionsForQuiz(quizId),
    fetchAnswersForQuiz(quizId),
    fetchQuizWithQuestions(quizId)
  ])
  questions.value = qs.sort((a, b) => a.id - b.id)
  answers.value = ans
  quizMeta.value = meta
})
</script>
