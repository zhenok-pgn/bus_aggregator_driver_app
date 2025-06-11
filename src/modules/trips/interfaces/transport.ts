import type { IBaseObject } from '@/utils/baseObject'

export interface IDriver extends IBaseObject {
  userName: string
  password: string
  surname: string
  name: string
  patronymic: string
  licenseNumber: string
  employeeNumber: string
  dayOfBirth: string
  carrierId: string
}

export interface IBus extends IBaseObject {
  model: string
  stateNumber: string
  vin: string
  carrierId: string
  seats: string[]
}
