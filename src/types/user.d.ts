type Tariff = 'FREE' | 'PAID'

declare interface IUser {
  id?: number
  email: string
  username?: string
  password?: string
  avatar?: string
  token?: string
  isConfirmEmail?: boolean
  twoAuth?: boolean
  balance?: number
  tariff: Tariff
  date_tariff_end: Date
  isLoading?: boolean
}