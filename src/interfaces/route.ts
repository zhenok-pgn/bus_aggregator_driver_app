import type { ICarrier } from './carrier'
import type { IBaseObject } from './baseObject'

export const periodicity = [
  { id: 1, name: 'Ежедневно' },
  { id: 2, name: 'По числам' },
  { id: 3, name: 'По дням недели' },
]

export const daysOfWeek = [
  { id: 1, name: 'Понедельник' },
  { id: 2, name: 'Вторник' },
  { id: 3, name: 'Среда' },
  { id: 4, name: 'Четверг' },
  { id: 5, name: 'Пятница' },
  { id: 6, name: 'Суббота' },
  { id: 7, name: 'Воскресенье' },
]

export const seatingType = [
  { id: 1, name: 'Свободная рассадка' },
  { id: 2, name: 'Есть выбор мест' },
]

//Короткая информация
export interface IRouteSummary {
  id: number
  name: string
  number: number
  /*stopsCount: number
  tarffisCount: number
  schedulesCount: number
  travelTimeInMinutes: number
  distanceInKm: number*/
}

//Полная информация
export interface IRouteNew extends IBaseObject {
  name: string
  number: number
  carrier: ICarrier
  stops: RouteStop[]
  tariffs: Tariff[]
  schedules: RouteSchedule[]
}

export interface IRouteExisted extends IBaseObject {
  id: number
  name: string
  number: number
  carrier: ICarrier
  stops: RouteStop[]
  tariffs: Tariff[]
  schedules: RouteSchedule[]
}

export interface IRouteStopNew extends IBaseObject {
  busStop: BusStop
  boardingTimeInMinutes: number
  travelTimeInMinutes: number
  distanceInKm: number
  order: number
}

export interface IRouteStopExisted extends IBaseObject {
  id: number
  busStop: BusStop
  boardingTimeInMinutes: number
  travelTimeInMinutes: number
  distanceInKm: number
  order: number
}

export interface ISegmentPriceNew extends IBaseObject {
  from: RouteStop
  to: RouteStop
  price: number
}

export interface ISegmentPriceExisted extends IBaseObject {
  id: number
  from: RouteStop
  to: RouteStop
  price: number
}

export interface IBusStopNew extends IBaseObject {
  name: string
}

export interface IBusStopExisted extends IBaseObject {
  id: number
  name: string
}

export interface IRouteScheduleNew extends IBaseObject {
  tariff: Tariff
  startDate: Date
  endDate: Date
  periodicity: number
  departureTimes: string[]
  daysOfWeek: number[]
  startWith: Date
  interval: number
  baseSeatingPlan: string
  seatingType: number
}

export interface IRouteScheduleExisted extends IBaseObject {
  id: number
  tariff: Tariff
  startDate: Date
  endDate: Date
  periodicity: number
  departureTimes: string[]
  daysOfWeek: number[]
  startWith: Date
  interval: number
  baseSeatingPlan: string
  seatingType: number
}

export interface ITariffNew extends IBaseObject {
  name: string
  prices: SegmentPrice[]
}

export interface ITariffExisted extends IBaseObject {
  id: number
  name: string
  prices: SegmentPrice[]
}

export type Route = IRouteNew | IRouteExisted
export type RouteStop = IRouteStopNew | IRouteStopExisted
export type BusStop = IBusStopNew | IBusStopExisted
export type RouteSchedule = IRouteScheduleNew | IRouteScheduleExisted
export type Tariff = ITariffNew | ITariffExisted
export type SegmentPrice = ISegmentPriceNew | ISegmentPriceExisted
