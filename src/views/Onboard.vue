<template>
  <div class="container py-5" style="max-width: 480px;">
    <div class="text-center my-5">
      <h1 class="mb-3">Welcome to Quizzo</h1>
      <p class="text-muted">Learn fast. Practice smarter. Track your progress.</p>
      <img src="https://picsum.photos/seed/learn/320/180" class="img-fluid rounded shadow-sm my-3" alt="Onboarding"/>
      <div class="d-grid gap-2 mt-4">
        <router-link to="/auth" class="btn btn-primary">Get Started</router-link>
        <router-link to="/home" class="btn btn-outline-secondary">Continue as Guest</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
