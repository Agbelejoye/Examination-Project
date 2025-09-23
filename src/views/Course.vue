<template>
  <div class="container py-3" style="max-width: 480px;">
    <img :src="image" class="img-fluid rounded mb-3 shadow-sm" alt="Course cover">
    <h3 class="mb-2">{{ course.title }}</h3>
    <p class="text-muted">{{ course.description }}</p>
    <div class="d-grid">
      <router-link :to="`/quiz/${course.id}/start`" class="btn btn-primary">Start Quiz</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchQuizWithQuestions } from '@/services/api'

const route = useRoute()
const course = ref({ title: 'Loading...', description: '' })
const image = 'https://picsum.photos/seed/module/640/360'

onMounted(async () => {
  const data = await fetchQuizWithQuestions(route.params.id)
  course.value = data
})
</script>
