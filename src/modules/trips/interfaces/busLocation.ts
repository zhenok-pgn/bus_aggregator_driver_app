import type { DateTime } from 'luxon'

export interface IBusLocation {
  latitude: number
  longitude: number
  timestamp: string // ISO 8601 format
  tripId: string
}
