<template>
  <div class="p-3" style="max-width: 480px; margin: auto;">
    <QuestionButtons
      :questions="questions"
      :quizId="quizId"
      :active="Number(route.params.qId)"
    />

    <div v-if="loading" class="text-center my-5">Loading…</div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="!currentQuestion" class="text-center my-5">
      <p class="text-muted">Question not found.</p>
      <router-link :to="`/quiz/${quizId}/question/1`" class="btn btn-outline-secondary btn-sm">Go to Q1</router-link>
    </div>

    <div v-else>
      <h5 class="mb-3">Q{{ currentQuestion.id }}. {{ currentQuestion.text }}</h5>

      <div class="list-group mb-3">
        <OptionRow
          v-for="(opt, i) in currentQuestion.options"
          :key="i"
          :text="opt"
          :selected="selected === opt"
          @select="select(opt)"
        />
      </div>

      <div class="d-flex justify-content-between">
        <router-link :to="prevLink" class="btn btn-outline-secondary" :class="{ disabled: !prevLink }">Prev</router-link>
        <button @click="goNext" class="btn btn-primary">{{ isLast ? 'Finish' : 'Next' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchQuestionsForQuiz, fetchQuizWithQuestions, saveAnswerToSession, readAnswersFromSession } from '@/services/api'
import QuestionButtons from '@/components/QuestionButtons.vue'
import OptionRow from '@/components/OptionRow.vue'

const route = useRoute()
const router = useRouter()
const quizId = Number(route.params.quizId)

const loading = ref(true)
const quizMeta = ref(null)
const questions = ref([])
const selected = ref(null)
const error = ref('')

const qId = computed(() => Number(route.params.qId))
const currentQuestion = computed(() => questions.value.find(q => q.id === qId.value))
const currentIndex = computed(() => questions.value.findIndex(q => q.id === qId.value))
const isLast = computed(() => currentIndex.value === questions.value.length - 1)

const prevLink = computed(() => {
  const prev = questions.value[currentIndex.value - 1]
  return prev ? { name: 'QuestionView', params: { quizId, qId: prev.id } } : null
})

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    // Primary: fetch questions list for this quiz
    const qs = await fetchQuestionsForQuiz(quizId)
    questions.value = (qs || []).sort((a, b) => a.id - b.id)

    // Optional: fetch quiz meta (passingPercent, title). If this fails, don't block questions.
    try {
      quizMeta.value = await fetchQuizWithQuestions(quizId)
    } catch (e) {
      // Non-blocking
      console.warn('Quiz meta fetch failed:', e)
    }

    const saved = readAnswersFromSession(quizId)
    selected.value = saved[qId.value] ?? null

    if (!questions.value.length) {
      error.value = 'No questions found. Ensure json-server is running and db.json has questions for this quiz.'
    }
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load questions. Please check your connection and json-server.'
  } finally {
    loading.value = false
  }
}

function select(opt) {
  selected.value = opt
  saveAnswerToSession(quizId, qId.value, opt)
}

function goNext() {
  if (isLast.value) {
    router.push({ name: 'QuizResult', params: { quizId } })
    return
  }
  const next = questions.value[currentIndex.value + 1]
  router.push({ name: 'QuestionView', params: { quizId, qId: next.id } })
}

onMounted(loadData)

watch(() => route.params.qId, (newId) => {
  const saved = readAnswersFromSession(quizId)
  selected.value = saved[Number(newId)] ?? null
})
</script>
