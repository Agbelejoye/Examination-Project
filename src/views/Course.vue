<template>
  <div class="container py-5" style="max-width: 800px;">
    <div class="row">
      <div class="col-md-6 mb-4">
        <img :src="image" class="img-fluid rounded shadow-lg" alt="Course cover" style="width: 100%; height: 300px; object-fit: cover;">
      </div>
      <div class="col-md-6 d-flex flex-column justify-content-center">
        <h1 class="display-5 fw-bold mb-3 text-primary">{{ course.title }}</h1>
        <p class="lead text-muted mb-4">{{ course.description }}</p>
        <div class="mb-3">
          <span class="badge bg-success fs-6 me-2">Passing Score: {{ course.passingPercent }}%</span>
          <span class="badge bg-info fs-6">Interactive Quiz</span>
        </div>
        <div class="d-grid gap-2">
          <router-link :to="`/quiz/${course.id}/start`" class="btn btn-primary btn-lg">
            <i class="bi bi-play-circle-fill me-2"></i>Start Quiz
          </router-link>
          <router-link to="/home" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Back to Courses
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="!course.title" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading course details...</p>
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
