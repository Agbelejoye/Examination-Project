<template>
  <!-- Hero Section -->
  <div class="hero-section bg-gradient-primary text-white py-5">
    <div class="container text-center">
      <h1 class="display-4 fw-bold mb-3">Welcome to Quizzo</h1>
      <p class="lead mb-4">
        Master your subjects with interactive quizzes and personalized learning paths.
      </p>
      <div v-if="auth.user" class="alert alert-light text-dark mx-auto" style="max-width: 400px">
        <strong>Hi, {{ auth.user.name }}!</strong>
        <span v-if="auth.user.schoolId && auth.user.classId"> · Class {{ classLabel }}</span>
      </div>
      <div v-else class="mb-3">
        <router-link to="/auth" class="btn btn-light btn-lg me-2">Get Started</router-link>
        <button class="btn btn-outline-light btn-lg" @click="scrollToCourses">
          Explore Courses
        </button>
      </div>
    </div>
  </div>

  <!-- Featured Courses Section -->
  <div class="container py-5" style="max-width: 1200px">
    <div class="row mb-4">
      <div class="col-12 text-center">
        <h2 class="fw-bold text-primary mb-3">Featured Courses</h2>
        <p class="text-muted">
          Choose from our curated selection of quizzes to boost your knowledge.
        </p>
      </div>
    </div>

    <div class="row g-4" id="courses-section">
      <div class="col-6 col-md-4 col-lg-3" v-for="c in courses" :key="c.id">
        <CourseCard :id="c.id" :title="c.title" :description="c.description" :image="c.image" />
      </div>
    </div>

    <div v-if="!courses.length" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading courses...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import CourseCard from '@/components/CourseCard.vue'
import { fetchQuizzes } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const courses = ref([])

const classLabel = computed(() => {
  // Simple label display; in a real app we would resolve names via API
  const map = { 1: 'JSS 1', 2: 'JSS 2', 3: 'JSS 3', 4: 'SS 1', 5: 'SS 2', 6: 'SS 3' }
  return map[auth.user?.classId] || ''
})

function scrollToCourses() {
  const element = document.getElementById('courses-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(async () => {
  const data = await fetchQuizzes()
  courses.value = data.map((q) => ({
    id: q.id,
    title: q.title,
    description: q.description || 'Self-paced learning module',
    image: q.image || 'https://picsum.photos/seed/course/400/240',
  }))
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
}

.display-4 {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.2;
}

.lead {
  font-size: 1.25rem;
  font-weight: 300;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  border-radius: 0.5rem;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
</style>
