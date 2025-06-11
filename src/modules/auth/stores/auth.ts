import { defineStore } from 'pinia'
import { authApi } from '../api/authApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
    user: null as null | { id: string; username: string; role: string },
    isAuthenticated: false,
    loading: false,
  }),
  actions: {
    setAccessToken(jwt_token: string) {
      this.accessToken = jwt_token
    },
    async login(username: string, password: string) {
      const res = await authApi.login(username, password)
      this.accessToken = res.data.accessToken
      this.isAuthenticated = true
    },
    async fetchUser() {
      const res = await authApi.getMe()
      this.user = res.data
      this.isAuthenticated = true
    },

    async logout() {
      authApi
        .logout()
        .catch(() => {})
        .finally(() => {
          this.accessToken = ''
          this.user = null
          this.isAuthenticated = false
        })
    },
  },
  persist: true,
})
