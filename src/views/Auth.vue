<template>
  <div class="container py-4" style="max-width: 420px;">
    <h3 class="mb-3">Sign in</h3>
    <div class="mb-3">
      <label class="form-label">Email</label>
      <input class="form-control" type="email" placeholder="you@example.com">
    </div>
    <div class="mb-3">
      <label class="form-label">Password</label>
      <input class="form-control" type="password" placeholder="••••••••">
    </div>
    <button class="btn btn-primary w-100">Sign in</button>
    <div class="text-center mt-3">
      <router-link to="/home">Skip for now</router-link>
    </div>
  </div>
</template>

<script setup>
</script>
