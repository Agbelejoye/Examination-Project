<template>
  <div class="container py-5" style="max-width: 700px;">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary mb-3">{{ quiz?.title || 'Module' }} Assessment</h1>
      <p class="lead text-muted">Test your knowledge and track your progress</p>
      <div class="d-flex justify-content-center gap-4 mt-4">
        <div class="stat-card">
          <div class="stat-number">{{ questionsCount }}</div>
          <div class="stat-label">Questions</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ quiz?.passingPercent || 70 }}%</div>
          <div class="stat-label">Passing Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">~15</div>
          <div class="stat-label">Minutes</div>
        </div>
      </div>
    </div>

    <div class="card shadow-lg border-0">
      <div class="card-header bg-gradient-primary text-white">
        <h5 class="mb-0"><i class="bi bi-info-circle-fill me-2"></i>Quiz Instructions</h5>
      </div>
      <div class="card-body p-4">
        <div class="row">
          <div class="col-md-8">
            <ol class="mb-4">
              <li class="mb-3">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <strong>Read carefully:</strong> Select the best answer for each question.
              </li>
              <li class="mb-3">
                <i class="bi bi-arrows-move text-primary me-2"></i>
                <strong>Navigate freely:</strong> Use the question buttons (Q1-Q15) to jump between questions.
              </li>
              <li class="mb-3">
                <i class="bi bi-graph-up text-info me-2"></i>
                <strong>Review results:</strong> Submit to see your score and detailed review.
              </li>
              <li class="mb-3">
                <i class="bi bi-clock text-warning me-2"></i>
                <strong>Take your time:</strong> There's no time limit, but aim to complete within 15-20 minutes.
              </li>
            </ol>
          </div>
          <div class="col-md-4 text-center">
            <div class="ready-card">
              <i class="bi bi-rocket-takeoff fs-1 text-primary mb-3"></i>
              <h6 class="fw-bold">Ready to Begin?</h6>
              <p class="text-muted small">Good luck on your assessment!</p>
            </div>
          </div>
        </div>

        <div class="d-flex gap-3 justify-content-center mt-4">
          <router-link to="/home" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Back to Courses
          </router-link>
          <router-link :to="{ name: 'QuestionView', params: { quizId: quizId, qId: 1 } }" class="btn btn-primary btn-lg px-5">
            <i class="bi bi-play-circle-fill me-2"></i>Start Quiz
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="!quiz" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading quiz details...</p>
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

const questionsCount = computed(() => quiz.value?.questions?.length || 15)

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

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 100px;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ready-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #6610f2);
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 123, 255, 0.3);
}

.btn-outline-secondary {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  transform: translateY(-1px);
}

.card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  border: none;
}

ol li {
  padding: 0.5rem 0;
  line-height: 1.6;
}
</style>
