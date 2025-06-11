import axios from '@/plugins/axios'

export const authApi = {
  login: (username: string, password: string) =>
    axios.post('/auth/login', { username, password }, { withCredentials: true }),

  refresh: () => axios.post('/auth/refresh', null, { withCredentials: true }),

  logout: () => axios.post('/auth/logout', null, { withCredentials: true }),

  getMe: () => axios.get('/auth/me', { withCredentials: true }),
}
