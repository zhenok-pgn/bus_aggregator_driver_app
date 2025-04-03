import { defineStore } from 'pinia'
import { type AuthState } from '@/interfaces/IAuthState'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    expires: null,
  }),
  actions: {
    setAccessToken(jwt_token: AuthState) {
      this.token = jwt_token.token
      this.expires = jwt_token.expires
    },
    clearAccessToken() {
      this.token = null
      this.expires = null
    },
    async checkAuth(): Promise<boolean> {
      if (!this.token) {
        return false // Пользователь не авторизован
      }

      // Проверка валидности Access Token
      const isTokenValid = await this.validateAccessToken()
      if (!isTokenValid) {
        // Попытка обновить Access Token с помощью Refresh Token
        const isRefreshed = await this.refreshAccessToken()
        if (!isRefreshed) {
          this.clearAccessToken()
          return false
        }
      }

      return true // Пользователь авторизован
    },
    async validateAccessToken(): Promise<boolean> {
      // Логика проверки валидности Access Token
      return true // Заглушка
    },
    async refreshAccessToken(): Promise<boolean> {
      try {
        const response = await fetch('/passenger/Auth/refresh', {
          method: 'POST',
          credentials: 'include', // Отправляем Refresh Token из кук
        })
        const data = await response.json()
        this.setAccessToken(data)
        return true
      } catch (error) {
        console.error('Ошибка при обновлении Access Token:', error)
        return false
      }
    },
  },
  getters: {
    isAuthenticated: (state: AuthState) => {
      console.log('isAuthenticated:', !!state.token)
      return true //!!state.token
    },
  },
})
