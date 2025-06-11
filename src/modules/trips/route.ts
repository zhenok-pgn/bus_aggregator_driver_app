import type { ICarrier } from '../modules/organization/interfaces/carrier'
import type { IBaseObject } from '../utils/baseObject'
import type { ILocality } from './locality'
import { DateOnly, TimeOnly } from '@/utils/dateTime'
import { useAuthStore } from '@/modules/auth/stores/auth'

//Короткая информация
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

export const createBusStop = (order: number): IRouteStop => {
  return {
    busStop: {
      id: crypto.randomUUID(),
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      locality: {
        id: crypto.randomUUID(),
        name: '',
        osmId: '',
        region: '',
        country: '',
        district: '',
        timezone: '',
        offsetMinutes: 0,
      },
    },
    departureTime: new TimeOnly().toString(),
    arrivalTime: new TimeOnly().toString(),
    arrivalDayNumber: 0,
    order: order,
  }
}

export const createRouteSchedule = (): IRouteSchedule => {
  {
    return {
      id: crypto.randomUUID(),
      schedulePattern: {
        id: crypto.randomUUID(),
        startDate: new DateOnly().toString(),
        endDate: new DateOnly().toString(),
        daysOfWeek: 0,
      },
      departureTime: new TimeOnly().toString(),
      routeSegmentSchedules: [],
    }
  }
}

export const createRoute = (): IRoute => {
  return {
    id: crypto.randomUUID(),
    name: '',
    number: '',
    registrationNumber: '',
    carrierId: useAuthStore().user.id,
    routeSchedules: [],
  }
}
