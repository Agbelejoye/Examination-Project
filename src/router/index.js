import { createRouter, createWebHistory } from 'vue-router'
import Onboard from '@/views/Onboard.vue'
import Auth from '@/views/Auth.vue'
import Home from '@/views/Home.vue'
import Course from '@/views/Course.vue'
import QuizStart from '@/views/Quiz/QuizStart.vue'
import QuestionView from '@/views/Quiz/QuestionView.vue'
import QuizResult from '@/views/Quiz/QuizResult.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  { path: '/', name: 'Onboard', component: Onboard },
  { path: '/auth', name: 'Auth', component: Auth },
  { path: '/home', name: 'Home', component: Home },
  { path: '/course/:id', name: 'Course', component: Course, props: true },
  { path: '/quiz/:quizId/start', name: 'QuizStart', component: QuizStart, props: true },
  { path: '/quiz/:quizId/question/:qId', name: 'QuestionView', component: QuestionView, props: true },
  { path: '/quiz/:quizId/result', name: 'QuizResult', component: QuizResult, props: true },
  { path: '/profile', name: 'Profile', component: Profile }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
