<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <Navbar />
    <main class="flex-grow-1">
      <router-view />
    </main>
    <BottomNav />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import BottomNav from '@/components/BottomNav.vue'
import Footer from '@/components/Footer.vue'
</script>

<style>
/* Global overrides (keep minimal, Bootstrap-first) */
body { background-color: #f8f9fa; }
</style>
