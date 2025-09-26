<template>
  <nav class="navbar navbar-light bg-white shadow-sm">
    <div class="container-fluid" style="max-width: 480px;">
      <span class="navbar-brand mb-0 h1">Quizzo</span>
      <div class="d-flex align-items-center gap-2">
        <router-link to="/home" class="btn btn-link">Home</router-link>
        <router-link v-if="isAdmin" to="/admin/import" class="btn btn-link">Admin</router-link>
        <router-link to="/profile" class="btn btn-link">Profile</router-link>
        <router-link v-if="!isAuthenticated" to="/auth" class="btn btn-primary btn-sm">Sign In</router-link>
        <button v-else class="btn btn-outline-danger btn-sm" @click="logout">Sign Out</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const isAuthenticated = computed(() => auth.isAuthenticated)
const isAdmin = computed(() => auth.user?.role === 'admin')
function logout(){ auth.signOut() }
</script>
