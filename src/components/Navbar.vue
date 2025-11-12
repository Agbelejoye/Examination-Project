<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
    <div class="container-fluid" style="max-width: 1200px;">
      <router-link to="/home" class="navbar-brand d-flex align-items-center">
        <div class="brand-icon me-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#007bff"/>
            <path d="M2 17L12 22L22 17" stroke="#007bff" stroke-width="2"/>
            <path d="M2 12L12 17L22 12" stroke="#007bff" stroke-width="2"/>
          </svg>
        </div>
        <span class="fw-bold fs-4">Quizzo</span>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/home" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link to="/admin/import" class="nav-link">Admin</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">Profile</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center">
          <router-link v-if="!isAuthenticated" to="/auth" class="btn btn-primary btn-sm me-2">Sign In</router-link>
          <button v-else class="btn btn-outline-danger btn-sm" @click="logout">Sign Out</button>
        </div>
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

<style scoped>
.navbar {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.brand-icon {
  background: linear-gradient(135deg, #007bff, #6610f2);
  border-radius: 8px;
  padding: 4px;
}

.navbar-brand:hover {
  text-decoration: none;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #007bff !important;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #6610f2);
  border: none;
  transition: transform 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}
</style>
