<template>
  <div class="container py-3" style="max-width: 960px;">
    <h4 class="mb-3">Featured Courses</h4>
    <div class="row g-3">
      <div class="col-6 col-md-4 col-lg-3" v-for="c in courses" :key="c.id">
        <CourseCard :id="c.id" :title="c.title" :description="c.description" :image="c.image"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CourseCard from '@/components/CourseCard.vue'
import { fetchQuizzes } from '@/services/api'

const courses = ref([])

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
