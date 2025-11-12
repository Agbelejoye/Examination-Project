<template>
  <div class="auth-container">
    <div class="container py-5" style="max-width: 500px;">
      <div class="card shadow-lg border-0">
        <div class="card-header bg-gradient-primary text-white text-center py-4">
          <h2 class="mb-0 fw-bold">Welcome to Quizzo</h2>
          <p class="mb-0 opacity-75">Your learning journey starts here</p>
        </div>
        <div class="card-body p-4">
          <ul class="nav nav-pills nav-justified mb-4" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link fw-semibold" :class="{ active: mode==='signin' }" @click="mode='signin'" role="tab">Sign In</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link fw-semibold" :class="{ active: mode==='signup' }" @click="mode='signup'" role="tab">Sign Up</button>
            </li>
          </ul>

    <div v-if="mode==='signin'">
      <h4 class="mb-3">Welcome back</h4>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model.trim="signin.email" class="form-control" type="email" placeholder="you@example.com"/>
        <div v-if="signin.email && !isEmail(signin.email)" class="text-danger small mt-1">Enter a valid email.</div>
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="signin.password" class="form-control" type="password" placeholder="••••••••"/>
        <div v-if="signin.password && signin.password.length < 5" class="text-danger small mt-1">Minimum 5 characters.</div>
      </div>
      <button class="btn btn-primary w-100" :disabled="loading || !signinValid" @click="doSignIn">{{ loading ? 'Signing in…' : 'Sign In' }}</button>
      <div class="text-center mt-3">
        <button class="btn btn-link" @click="doGuest">Continue as Guest</button>
      </div>
    </div>

    <div v-else>
      <h4 class="mb-3">Create your account</h4>
      <div class="mb-2">
        <label class="form-label">Full name</label>
        <input v-model.trim="signup.name" class="form-control" type="text" placeholder="Your name"/>
        <div v-if="signup.name && signup.name.length < 2" class="text-danger small mt-1">Enter your full name.</div>
      </div>
      <div class="mb-2">
        <label class="form-label">Email</label>
        <input v-model.trim="signup.email" class="form-control" type="email" placeholder="you@example.com"/>
        <div v-if="signup.email && !isEmail(signup.email)" class="text-danger small mt-1">Enter a valid email.</div>
      </div>
      <div class="mb-2">
        <label class="form-label">Password</label>
        <input v-model="signup.password" class="form-control" type="password" placeholder="••••••••"/>
        <div v-if="signup.password && signup.password.length < 5" class="text-danger small mt-1">Minimum 5 characters.</div>
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
        <div v-if="classes.length && !signup.classId" class="text-danger small mt-1">Please select a class.</div>
      </div>
      <div class="mb-3">
        <label class="form-label">Role</label>
        <select v-model="signup.role" class="form-select">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <div class="form-text">Default is student. Choose admin only for staff.</div>
      </div>
      <button class="btn btn-primary w-100" :disabled="loading || !signupValid" @click="doSignUp">{{ loading ? 'Creating…' : 'Create Account' }}</button>
      <div class="text-center mt-3">
        <button class="btn btn-link" @click="doGuest">Skip for now</button>
      </div>
    </div>

          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
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

// Helpers and validators (moved into <script> so SFC compiles correctly)
function isEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

const signinValid = computed(() => isEmail(signin.value.email) && (signin.value.password?.length >= 5))
const signupValid = computed(() => {
  const s = signup.value
  const base = !!s.name && s.name.length >= 2 && isEmail(s.email) && (s.password?.length >= 5) && Number(s.schoolId) > 0
  // Require class only if classes list is present for the chosen school
  const classOk = classes.value.length === 0 ? true : Number(s.classId) > 0
  return base && classOk
})

onMounted(async () => {
  try {
    schools.value = await fetchSchools()
  } catch (e) {
    console.warn('Failed to load schools', e)
  }
})

watch(() => signup.value.schoolId, async (id) => {
  if (!id) { classes.value = []; signup.value.classId = '' ; return }
  try {
    classes.value = await fetchClasses(id)
    // Auto-select first class to make UX smoother
    if (Array.isArray(classes.value) && classes.value.length > 0) {
      signup.value.classId = classes.value[0].id
    }
  } catch {}
})

async function doSignIn() {
  error.value = ''
  loading.value = true
  try {
    await auth.signIn(signin.value.email, signin.value.password)
    router.push('/home')
  } catch (e) {
    if (e?.code === 'ERR_NETWORK') {
      error.value = `Cannot reach API at ${import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:3000'}. Please start json-server.`
    } else {
      error.value = e?.message || 'Sign in failed'
    }
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
    if (e?.code === 'ERR_NETWORK') {
      error.value = `Cannot reach API at ${import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:3000'}. Please start json-server.`
    } else {
      error.value = e?.message || 'Sign up failed'
    }
  } finally { loading.value = false }
}

function doGuest() {
  try { auth.continueAsGuest() } catch {}
  router.push('/home')
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
}

.nav-pills .nav-link {
  border-radius: 8px;
  margin: 0 2px;
  transition: all 0.3s ease;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #007bff, #6610f2);
  border: none;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.form-control {
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #6610f2);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 123, 255, 0.3);
}

.btn-link {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.btn-link:hover {
  color: #6610f2;
}

.alert {
  border-radius: 8px;
  border: none;
}
</style>
