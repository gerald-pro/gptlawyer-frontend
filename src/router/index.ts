import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import SignUp from '@/views/SignUp.vue'
import Dashboard from '@/views/Dashboard.vue'
import StudyCases from '@/views/StudyCases.vue'
import ShowStudyCase from '@/views/ShowStudyCase.vue'
import Users from '@/views/Users.vue'
import Forms from '@/views/Forms.vue'
import Card from '@/views/Card.vue'
import Tables from '@/views/Tables.vue'
import Modal from '@/views/Modal.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { layout: 'empty', requiresAuth: false },
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      meta: { layout: 'empty', requiresAuth: false },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/study-cases',
      name: 'StudyCases',
      component: StudyCases,
      meta: { requiresAuth: true },
    },
    {
      path: '/study-cases/:id',
      name: 'StudyCase',
      component: ShowStudyCase,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'Usuarios',
      component: Users,
      meta: { requiresAuth: true },
    },
    {
      path: '/forms',
      name: 'Forms',
      component: Forms,
      meta: { requiresAuth: true },
    },
    {
      path: '/cards',
      name: 'Cards',
      component: Card,
      meta: { requiresAuth: true },
    },
    {
      path: '/tables',
      name: 'Tables',
      component: Tables,
      meta: { requiresAuth: true },
    },
    {
      path: '/modal',
      name: 'Modal',
      component: Modal,
      meta: { requiresAuth: true },
    },

    {
      path: '/blank',
      name: 'blank',
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.getToken) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router
