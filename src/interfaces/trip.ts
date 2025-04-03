import type { ISelectedAddress } from './ISelectedAddress'
import type { Route } from './route'
import type { ICarrier } from './carrier'

export interface ITrip {
  id: number
  from: ISelectedAddress
  to: ISelectedAddress
  route: Route
  carrier: ICarrier
  dispatchDate: string
  arrivalDate: string
  price: number
}
