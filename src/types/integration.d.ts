
declare interface IIntegrationApp {
  id?: number,
  uid?: string,
  key?: string,
  name?: string,
  version?: string,
  utm_source?: string
}

declare interface IIntegrationCabinet {
  id: number,
  uid: string,
  name:string,
  factor: number,
  access_get_statistic: boolean
  account?: IIntegrationUser
}

declare interface IIntegrationUser {
  id?: number,
  uid?: string,
  name?: string,
  token?: string,
  token_date_update?: string
  app?: IIntegrationApp,
  user?: IUser,
  cabinets?: IIntegrationCabinet[]
}