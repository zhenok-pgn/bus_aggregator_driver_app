import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
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
              path: 'details/:tripIdParam',
              name: 'trip-details',
              component: () => import('../modules/trips/views/TripDetailsView.vue'),
              props: true,
              meta: {
                pageHeader: 'Информация о рейсе',
                backButton: {
                  name: 'назад к рейсам',
                  to: '..',
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
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.loginForm && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
