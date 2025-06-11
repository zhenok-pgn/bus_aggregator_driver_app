import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../modules/auth/stores/auth'
import { headerButtonType, type IHeaderButton } from '@/interfaces/headerButton'

const router = createRouter({
  history: createWebHistory('driver'),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/AuthenticatedLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../modules/home/views/HomeView.vue'),
          meta: { pageHeader: 'Главная' },
        },
        {
          path: 'profile',
          name: 'driver-info',
          component: () => import('../modules/driverProfile/views/DriverInfoView.vue'),
          meta: { pageHeader: 'Профиль' },
        },
        {
          path: 'trips',
          meta: { pageHeader: 'Расписание рейсов' },
          children: [
            {
              path: '',
              name: 'trips-schedule-list',
              component: () => import('../modules/trips/views/TripScheduleView.vue'),
            },
            {
              path: ':tripIdParam',
              name: 'trip-details',
              component: () => import('../modules/trips/views/TripDetailsView.vue'),
              props: true,
              meta: {
                backButton: {
                  name: 'назад',
                  to: '.',
                  type: headerButtonType.back,
                } as IHeaderButton,
              },
            },
            {
              path: ':tripIdParam/tracking',
              name: 'trip-tracking',
              component: () => import('../modules/trips/views/TripTrackingView.vue'),
              props: true,
              meta: {
                pageHeader: 'Выполнение рейса',
                backButton: {
                  name: 'назад',
                  to: { name: 'home' },
                  type: headerButtonType.back,
                } as IHeaderButton,
              },
            },
          ],
        },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../modules/auth/views/LoginView.vue'),
      meta: { loginForm: true },
    },
  ],
})

// check for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated) {
      authStore
        .fetchUser()
        .then(() => next())
        .catch(() => {
          authStore.isAuthenticated = false
          next('/login')
        })
    } else {
      next('/login')
    }
  } else if (to.meta.loginForm && authStore.isAuthenticated) {
    // Если авторизован и пытается на форму входа
    next('/') // Возвращаем обратно или на главную
  } else {
    next()
  }
})

export default router
