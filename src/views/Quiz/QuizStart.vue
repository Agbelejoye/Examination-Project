<template>
  <div class="container py-3" style="max-width: 480px;">
    <h4 class="mb-2">{{ quiz?.title || 'Module' }} — Assessment</h4>
    <p class="text-muted">15 questions • Passing score: {{ quiz?.passingPercent || 70 }}%</p>

    <div class="card shadow-sm">
      <div class="card-body">
        <ol class="small text-muted">
          <li>Select the best answer for each question.</li>
          <li>You can jump to any question using the Q1..Q15 buttons.</li>
          <li>Submit to see your results and review answers.</li>
        </ol>
        <div class="d-grid gap-2">
          <router-link :to="{ name: 'QuestionView', params: { quizId: quizId, qId: 1 } }" class="btn btn-primary">Start</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchQuizWithQuestions, clearAnswersFromSession } from '@/services/api'

const route = useRoute()
const router = useRouter()

function toSafeInt(val, fallback = 1) {
  const n = parseInt(val, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

const quizId = computed(() => toSafeInt(route.params.quizId, 1))
const quiz = ref(null)

onMounted(async () => {
  clearAnswersFromSession(quizId.value)
  try {
    quiz.value = await fetchQuizWithQuestions(quizId.value)
  } catch {
    // if invalid quiz id in URL, redirect to /quiz/1/start
    if (quizId.value !== 1) router.replace({ name: 'QuizStart', params: { quizId: 1 } })
  }
})
</script>
