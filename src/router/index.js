import { createRouter, createWebHistory } from "vue-router"
import store from "@/store"

import HomePage from '../components/pages/HomePage.vue'
const QuizPage = () => import('../components/pages/QuizPage.vue'),
  NotFound = () => import('../components/errorHandlers/NotFound.vue'),
  LoginPage = () => import('../components/pages/LoginPage.vue'),
  CreateQuiz = () => import('../components/pages/CreateQuiz.vue'),
  CreateQuestions = () => import('../components/pages/CreateQuestions.vue')

const routes = [
  {
    path: "/",
    redirect: '/home',
  },
  {
    path: '/home',
    component: HomePage,
  },
  {
    path: "/quiz/:id",
    component: QuizPage,
    props: true,
    beforeEnter: (to, _, next) => {
      const storedQuestions = store.getters.questions, id = to.params.id
      if (!storedQuestions[id]) {
        next('/notfound')
      } else {
        next()
      }
    }
  },
  {
    path: '/create',
    component: CreateQuiz,
  },
  {
    path: '/create/:id',
    component: CreateQuestions,
    props: true,
    beforeEnter: (_, from, next) => {
      if (from.path !== '/create') {
        next('/create')
      } else {
        next()
      }
    }
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/:notFound(.*)',
    name: 'notFoundPage',
    props: true,
    component: NotFound,
  },

]


const router = createRouter({
  history: createWebHistory(),
  routes,
})


export default router
