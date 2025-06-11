import { defineStore } from 'pinia'
import type { IBusLocation } from '../interfaces/busLocation'
import { DateTime } from 'luxon'
import { busLocationApi } from '../api/busLocationApi'

let intervalId: number | null = null

export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    tripId: null as string | null,
    tracking: false,
    currentCoords: null as GeolocationCoordinates | null,
  }),
  actions: {
    startTracking(tripId: string) {
      this.tripId = tripId
      this.tracking = true

      this.sendLocation()
      intervalId = window.setInterval(() => this.sendLocation(), 10_000)
    },

    stopTracking() {
      this.tracking = false
      this.tripId = null
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    },

    sendLocation() {
      if (!this.tracking) return

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const busLocation: IBusLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: DateTime.utc().toISO(),
            tripId: this.tripId!,
          }
          console.log('geolocation', busLocation)
          try {
            // отправка на сервер:
            await busLocationApi.updateLocation(busLocation)
            this.currentCoords = position.coords
          } catch (error) {
            console.error('Ошибка отправки геолокации:', error)
          }
        },
        (error) => {
          console.error('Ошибка получения геолокации:', error)
        },
      )
    },
  },
  persist: true,
})
