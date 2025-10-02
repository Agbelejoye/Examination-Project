<template>
  <div class="d-flex flex-wrap gap-2 mb-3 justify-content-center">
    <router-link
      v-for="q in questions"
      :key="q.id"
      :to="`/quiz/${quizId}/question/${q.id}`"
      class="btn btn-outline-secondary btn-sm position-relative"
      :class="{ 'btn-pink-outline': q.id===active, 'btn-answered': isAnswered(q.id) }"
    >
      Q{{ q.id }}
      <span
        v-if="isAnswered(q.id)"
        class="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
        style="width: 8px; height: 8px;"
      ></span>
    </router-link>
    <button @click="confirmResult" class="btn btn-success btn-sm">Result</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  questions: { type: Array, default: () => [] },
  quizId: { type: [Number, String], default: 1 },
  active: { type: Number, default: null }
})

const answeredMap = computed(() => {
  const raw = sessionStorage.getItem(`quiz_${props.quizId}_answers`)
  return raw ? JSON.parse(raw) : {}
})

function isAnswered(qid) {
  return answeredMap.value[qid] != null
}

const router = useRouter()
function confirmResult(){
  const go = () => router.push({ name: 'QuizResult', params: { quizId: props.quizId } })
  const Swal = window.Swal || window.swal
  if (Swal) {
    Swal.fire({
      title: 'Go to Results?',
      text: 'Make sure you have answered the questions you want. Proceed to calculate your score?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, show results',
      cancelButtonText: 'Stay on quiz'
    }).then(res => { if (res.isConfirmed) go() })
  } else { go() }
}
</script>

<style scoped>
.btn-pink-outline { border-color: hotpink !important; color: hotpink !important; }
.btn-answered { border-color: #198754 !important; }
</style>
