<template>
  <div class="container py-4" style="max-width: 460px;">
    <ul class="nav nav-pills mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: mode==='signin' }" @click="mode='signin'">Sign In</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: mode==='signup' }" @click="mode='signup'">Sign Up</button>
      </li>
    </ul>

    <div v-if="mode==='signin'">
      <h4 class="mb-3">Welcome back</h4>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="signin.email" class="form-control" type="email" placeholder="you@example.com"/>
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="signin.password" class="form-control" type="password" placeholder="••••••••"/>
      </div>
      <button class="btn btn-primary w-100" :disabled="loading" @click="doSignIn">{{ loading ? 'Signing in…' : 'Sign In' }}</button>
      <div class="text-center mt-3">
        <router-link to="/home">Continue as Guest</router-link>
      </div>
    </div>

    <div v-else>
      <h4 class="mb-3">Create your account</h4>
      <div class="mb-2">
        <label class="form-label">Full name</label>
        <input v-model="signup.name" class="form-control" type="text" placeholder="Your name"/>
      </div>
      <div class="mb-2">
        <label class="form-label">Email</label>
        <input v-model="signup.email" class="form-control" type="email" placeholder="you@example.com"/>
      </div>
      <div class="mb-2">
        <label class="form-label">Password</label>
        <input v-model="signup.password" class="form-control" type="password" placeholder="••••••••"/>
      </div>
      <div class="mb-2">
        <label class="form-label">School</label>
        <select v-model.number="signup.schoolId" class="form-select">
          <option value="" disabled>Select school</option>
          <option v-for="s in schools" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div class="mb-2">
        <label class="form-label">Class</label>
        <select v-model.number="signup.classId" class="form-select" :disabled="!classes.length">
          <option value="" disabled>Select class</option>
          <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Role</label>
        <select v-model="signup.role" class="form-select">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <div class="form-text">Default is student. Choose admin only for staff.</div>
      </div>
      <button class="btn btn-primary w-100" :disabled="loading" @click="doSignUp">{{ loading ? 'Creating…' : 'Create Account' }}</button>
      <div class="text-center mt-3">
        <router-link to="/home">Skip for now</router-link>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { fetchSchools, fetchClasses } from '@/services/api'

const router = useRouter()
const auth = useAuthStore()

const mode = ref('signin')
const loading = ref(false)
const error = ref('')

const signin = ref({ email: '', password: '' })
const signup = ref({ name: '', email: '', password: '', schoolId: '', classId: '', role: 'student' })

const schools = ref([])
const classes = ref([])

onMounted(async () => {
  try {
    schools.value = await fetchSchools()
  } catch (e) {
    console.warn('Failed to load schools', e)
  }
})

watch(() => signup.value.schoolId, async (id) => {
  if (!id) { classes.value = []; signup.value.classId = '' ; return }
  try { classes.value = await fetchClasses(id) } catch {}
})

async function doSignIn() {
  error.value = ''
  loading.value = true
  try {
    await auth.signIn(signin.value.email, signin.value.password)
    router.push('/home')
  } catch (e) {
    error.value = e?.message || 'Sign in failed'
  } finally { loading.value = false }
}

async function doSignUp() {
  error.value = ''
  loading.value = true
  try {
    const payload = { ...signup.value }
    payload.schoolId = Number(payload.schoolId)
    payload.classId = Number(payload.classId)
    if (!payload.role) payload.role = 'student'
    await auth.signUp(payload)
    router.push('/home')
  } catch (e) {
    error.value = e?.message || 'Sign up failed'
  } finally { loading.value = false }
}
</script>
