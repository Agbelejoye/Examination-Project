<template>
  <div class="container py-3" style="max-width: 960px;">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h4 class="mb-0">Featured Courses</h4>
      <div class="text-end small text-muted" v-if="auth.user">
        Hi, {{ auth.user.name }}
        <span v-if="auth.user.schoolId && auth.user.classId"> · Class {{ classLabel }}</span>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-6 col-md-4 col-lg-3" v-for="c in courses" :key="c.id">
        <CourseCard :id="c.id" :title="c.title" :description="c.description" :image="c.image"/>
      </div>
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

onMounted(async () => {
  const data = await fetchQuizzes()
  courses.value = data.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description || 'Self-paced learning module',
    image: q.image || 'https://picsum.photos/seed/course/400/240'
  }))
})
</script>
