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

<style scoped>
.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card-img-top {
  height: 180px;
  object-fit: cover;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #6610f2);
  border: none;
  border-radius: 6px;
  transition: transform 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}
</style>
