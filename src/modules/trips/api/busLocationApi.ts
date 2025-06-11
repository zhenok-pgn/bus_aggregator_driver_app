import axios from '@/plugins/axios'

export const busLocationApi = {
  getLatestLocation: (id: string) => axios.get(`/location/${id}`),
  updateLocation: (data: any) => axios.post('/location', data),
}
