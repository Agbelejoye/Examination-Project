<template>
  <div class="p-3" style="max-width: 480px; margin: auto;">
    <QuestionButtons
      :questions="questions"
      :quizId="quizId"
      :active="qId"
    />

    <div v-if="loading" class="text-center my-5">Loading…</div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="!currentQuestion" class="text-center my-5">
      <p class="text-muted">Question not found.</p>
      <router-link :to="{ name: 'QuestionView', params: { quizId: quizId, qId: 1 } }" class="btn btn-outline-secondary btn-sm">Go to Q1</router-link>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="mb-0">Q{{ currentQuestion.id }}. {{ currentQuestion.text }}</h5>
        <span class="badge" :class="timeLeft <= 10 ? 'bg-danger' : 'bg-secondary'">{{ timeLeft }}s</span>
      </div>

      <div class="list-group mb-3">
        <OptionRow
          v-for="(opt, i) in currentQuestion.options"
          :key="i"
          :text="opt"
          :selected="selected === opt"
          @select="select(opt)"
        />
      </div>

      <div class="d-flex justify-content-between gap-2">
        <router-link :to="prevLink" class="btn btn-outline-secondary" :class="{ disabled: !prevLink }">Prev</router-link>
        <button @click="submit" class="btn btn-success" :disabled="!selected">Submit</button>
        <button @click="goNext" class="btn btn-primary" :disabled="!selected">{{ isLast ? 'Finish' : 'Next' }}</button>
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

function toSafeInt(val, fallback = 1) {
  const n = parseInt(val, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

const quizId = computed(() => toSafeInt(route.params.quizId, 1))

const loading = ref(true)
const quizMeta = ref(null)
const questions = ref([])
const selected = ref(null)
const error = ref('')
const timeLeft = ref(60)
let timer = null

const qId = computed(() => toSafeInt(route.params.qId, 1))
const currentQuestion = computed(() => questions.value.find(q => q.id === qId.value))
const currentIndex = computed(() => questions.value.findIndex(q => q.id === qId.value))
const isLast = computed(() => currentIndex.value === questions.value.length - 1)

const prevLink = computed(() => {
  const prev = questions.value[currentIndex.value - 1]
  return prev ? { name: 'QuestionView', params: { quizId: quizId.value, qId: prev.id } } : null
})

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    // Primary: fetch questions list for this quiz
    const qs = await fetchQuestionsForQuiz(quizId.value)
    // Remove randomness: always sort ascending by numeric ID
    questions.value = (qs || []).slice().sort((a, b) => a.id - b.id)
    // Clean any legacy shuffle order
    try { sessionStorage.removeItem(`quiz_${quizId.value}_order`) } catch {}

    // Optional: fetch quiz meta (passingPercent, title). If this fails, don't block questions.
    try {
      const [meta, qs] = await Promise.all([
        fetchQuizWithQuestions(quizId.value),
        fetchQuestionsForQuiz(quizId.value)
      ])
      quizMeta.value = meta
    } catch (e) {
      // Non-blocking
      console.warn('Quiz meta fetch failed:', e)
    }

    const saved = readAnswersFromSession(quizId.value)
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
  saveAnswerToSession(quizId.value, qId.value, opt)
}

function goNext() {
  if (isLast.value) {
    // Use same confirmation as Submit on Finish
    const go = () => router.push({ name: 'QuizResult', params: { quizId: quizId.value } })
    const Swal = window.Swal || window.swal
    if (Swal) {
      Swal.fire({
        title: 'Finish Quiz?',
        text: 'Are you sure you want to submit and view your results?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, finish',
        cancelButtonText: 'Review again'
      }).then(res => { if (res.isConfirmed) go() })
    } else { go() }
    return
  }
  const next = questions.value[currentIndex.value + 1]
  router.push({ name: 'QuestionView', params: { quizId: quizId.value, qId: next.id } })
}

function submit() {
  // Ensure current selection is saved (select() already saves, but this is safe)
  if (selected.value) {
    saveAnswerToSession(quizId.value, qId.value, selected.value)
  }
  // Confirm with SweetAlert2 if available
  const go = () => router.push({ name: 'QuizResult', params: { quizId: quizId.value } })
  const Swal = window.Swal || window.swal
  if (Swal) {
    Swal.fire({
      title: 'Submit Quiz?',
      text: 'Are you sure you want to submit your answers?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit',
      cancelButtonText: 'Review again'
    }).then(res => { if (res.isConfirmed) go() })
  } else {
    go()
  }
}

onMounted(loadData)

watch(() => route.params.qId, (newId) => {
  const saved = readAnswersFromSession(quizId.value)
  selected.value = saved[toSafeInt(newId, 1)] ?? null
  // reset timer on question change
  startTimer()
})

function startTimer(){
  if (timer) clearInterval(timer)
  timeLeft.value = 60
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0){
      clearInterval(timer)
      // mark as skipped if not answered
      try {
        const key = `quiz_${quizId.value}_skips`
        const raw = sessionStorage.getItem(key)
        const list = raw ? JSON.parse(raw) : []
        if (!selected.value && !list.includes(qId.value)) {
          list.push(qId.value)
          sessionStorage.setItem(key, JSON.stringify(list))
        }
      } catch {}
      goNext()
    }
  }, 1000)
}

watch(loading, (v)=>{ if (!v) startTimer() })
</script>
