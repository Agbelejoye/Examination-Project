import { createRouter, createWebHistory } from 'vue-router'
import Onboard from '@/views/Onboard.vue'
import Auth from '@/views/Auth.vue'
import Home from '@/views/Home.vue'
import Course from '@/views/Course.vue'
import QuizStart from '@/views/Quiz/QuizStart.vue'
import QuestionView from '@/views/Quiz/QuestionView.vue'
import QuizResult from '@/views/Quiz/QuizResult.vue'
import Profile from '@/views/Profile.vue'
import AdminImport from '@/views/AdminImport.vue'

const routes = [
  { path: '/', name: 'Onboard', component: Onboard },
  { path: '/auth', name: 'Auth', component: Auth },
  { path: '/home', name: 'Home', component: Home },
  { path: '/course/:id', name: 'Course', component: Course, props: true },
  { path: '/quiz/:quizId/start', name: 'QuizStart', component: QuizStart, props: true },
  { path: '/quiz/:quizId/question/:qId', name: 'QuestionView', component: QuestionView, props: true },
  { path: '/quiz/:quizId/result', name: 'QuizResult', component: QuizResult, props: true },
  { path: '/profile', name: 'Profile', component: Profile }
  ,{ path: '/admin/import', name: 'AdminImport', component: AdminImport }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// Admin route guard and safety for NaN quiz params
router.beforeEach((to, from, next) => {
  // Normalize quiz params
  if (to.name === 'QuestionView' || to.name === 'QuizStart' || to.name === 'QuizResult') {
    const quizId = parseInt(to.params.quizId, 10)
    const qId = to.params.qId != null ? parseInt(to.params.qId, 10) : undefined
    const fixed = {}
    if (!Number.isFinite(quizId) || quizId <= 0) fixed.quizId = 1
    if (qId !== undefined && (!Number.isFinite(qId) || qId <= 0)) fixed.qId = 1
    if (Object.keys(fixed).length) return next({ name: to.name, params: { ...to.params, ...fixed }, replace: true })
  }

  // Protect admin route
  if (to.name === 'AdminImport') {
    try {
      const raw = localStorage.getItem('quizzo_user')
      const user = raw ? JSON.parse(raw) : null
      if (!user || user.role !== 'admin') return next('/home')
    } catch { return next('/home') }
  }

  return next()
})

export default router
