import type { IRouteSegmentSchedule, IRouteSummary } from '@/interfaces/route'
import type { IBaseObject } from '@/utils/baseObject'
import type { IBus, IDriver } from './transport'

export interface ITrip extends IBaseObject {
  departureDate: string
  schedule: IRouteSegmentSchedule
  route: IRouteSummary
  bus: IBus
  driver: IDriver
  tripStatus: string
}

export interface ITripExecution {
  trip: ITrip
  segmentExecutions: ITripExecutionSegment[]
}

export interface ITripExecutionSegment {
  segment: IRouteSegmentSchedule
  departure: string
  arrival: string
  status: string
}

export interface IStop {
  id: string
  name: string
  segmentId: string
  isFirst: boolean
  isLast: boolean
  status: string
  plannedArrival: string | null
  actualArrival: string | null
  plannedDeparture: string | null
  actualDeparture: string | null
}

export const TripStatusLocale: Record<string, string> = {
  Cancelled: 'Отменён',
  Scheduled: 'Запланирован',
  InProgress: 'В пути',
  Finished: 'Завершён',
}

export const TripStatusColor: Record<string, string> = {
  Cancelled: 'red',
  Scheduled: 'grey',
  InProgress: 'orange',
  Finished: 'green',
}
