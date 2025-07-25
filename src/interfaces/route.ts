import type { IBaseObject } from '@/utils/baseObject'

export interface IRouteSummary extends IBaseObject {
  name: string
  number: string
  registrationNumber: string
  carrierId: string
}

/*export class Route implements IRoute {
  id: string = crypto.randomUUID()
  name: string = ''
  number: string = ''
  registrationNumber: string = ''
  carrierId: string = ''
  routeSchedules: IRouteSchedule[] = []

  constructor(init?: Partial<Route>) {
    Object.assign(this, init)
  }
}*/

export interface IRoute extends IBaseObject, IRouteSummary {
  routeSchedules: IRouteSchedule[]
}

export interface IRouteStop {
  busStop: IBusStop
  departureTime: string
  arrivalTime: string
  arrivalDayNumber: number
  order: number
}

export interface IRouteSegment extends IBaseObject {
  from: IBusStop
  to: IBusStop
}

export interface IRouteSegmentSchedule extends IBaseObject {
  segmentNumber: string
  routeSegment: IRouteSegment
  departureTime: string
  arrivalTime: string
  arrivalDayNumber: number
  price: number
}

export interface IBusStop extends IBaseObject {
  name: string
  address: string
  latitude: number
  longitude: number
  locality: ILocality
}

export interface IRouteSchedule extends IBaseObject {
  schedulePattern: ISchedulePattern
  departureTime: string
  routeSegmentSchedules: IRouteSegmentSchedule[]
}

export interface IRouteScheduleSummary extends IBaseObject {
  startDate: string
  endDate: string
  daysOfWeek: number
  departureTime: string
  route: IRouteSummary
}

export interface ISchedulePattern extends IBaseObject {
  startDate: string
  endDate: string
  daysOfWeek: number
}

export interface ILocality extends IBaseObject {
  name: string
  region: string
  country: string
  district: string
  osmId: string
  timezone: string
  offsetMinutes: number
}
