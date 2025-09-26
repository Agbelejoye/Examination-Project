import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { signInUser, signUpUser } from '@/services/api'

const STORAGE_KEY = 'quizzo_user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(loadUser())
  const isAuthenticated = computed(() => !!user.value)

  function loadUser() {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  }

  function persist() {
    if (user.value) localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    else localStorage.removeItem(STORAGE_KEY)
  }

  async function signIn(email, password) {
    const u = await signInUser(email, password)
    user.value = u
    persist()
    return u
  }

  async function signUp(payload) {
    // payload: { name, email, password, schoolId, classId }
    const u = await signUpUser({ role: 'student', ...payload })
    user.value = u
    persist()
    return u
  }

  function signOut() {
    user.value = null
    persist()
  }

  return { user, isAuthenticated, signIn, signUp, signOut }
})
