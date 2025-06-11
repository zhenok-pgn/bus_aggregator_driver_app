import { useAuthStore } from '@/modules/auth/stores/auth'
import axios from '@/plugins/axios'
import { DateTime } from 'luxon'

export const tripsApi = {
  getTrips: (filteredOptions) =>
    axios.get('/trips', {
      params: {
        departureDateFrom: filteredOptions.startDate,
        departureDateTo: filteredOptions.endDate,
        routes: filteredOptions.selectedRoutes,
        carrierId: useAuthStore().user!.id,
      },
    }),
  getTripById: (id: string) => axios.get(`/trips/${id}`),
  createTrip: (data: any) => axios.post('/trips', data),
  updateTrip: (id: string, data: any) => axios.put(`/trips/${id}`, data),
  getMyTrips: () => axios.get('/trips/driver'),
  getTripExecutionInfo: (tripId: string) => axios.get(`/trips/${tripId}/segments`),
  confirmArrival: (tripId: string, segmentId: string, timestamp: DateTime) =>
    axios.post(`/trips/${tripId}/segments/${segmentId}/confirm-arrival`, {
      timestamp: timestamp.toISO(),
    }),
  confirmDeparture: (tripId: string, segmentId: string, timestamp: DateTime) =>
    axios.post(`/trips/${tripId}/segments/${segmentId}/confirm-departure`, {
      timestamp: timestamp.toISO(),
    }),
}
