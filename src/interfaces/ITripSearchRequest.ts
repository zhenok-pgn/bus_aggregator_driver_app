import type { ISelectedAddress } from './ISelectedAddress'

export interface ITripSearchRequest {
  from: ISelectedAddress
  to: ISelectedAddress
  passangersCount: number
  date: string
}
