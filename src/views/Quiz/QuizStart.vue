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
          <router-link :to="`/quiz/${quizId}/question/1`" class="btn btn-primary">Start</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchQuizWithQuestions, clearAnswersFromSession } from '@/services/api'

const route = useRoute()
const quizId = Number(route.params.quizId)
const quiz = ref(null)

onMounted(async () => {
  clearAnswersFromSession(quizId)
  quiz.value = await fetchQuizWithQuestions(quizId)
})
</script>
