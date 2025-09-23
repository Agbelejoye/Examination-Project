<template>
  <div class="card h-100 shadow-sm">
    <img v-if="image" :src="image" class="card-img-top" :alt="title"/>
    <div class="card-body">
      <h5 class="card-title mb-1">{{ title }}</h5>
      <p class="card-text text-muted small">{{ description }}</p>
      <router-link :to="`/course/${id}`" class="btn btn-primary btn-sm">View</router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: [String, Number],
  title: String,
  description: { type: String, default: '' },
  image: { type: String, default: '' }
})
</script>
