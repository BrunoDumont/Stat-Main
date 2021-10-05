export function to_datetime_format(date: Date) {
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  return `${hours}:${minutes} ${to_date_format(date)}`
}

export function to_date_format(date: Date) {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)
  return `${day}.${month}.${date.getFullYear()}`
}

export function get_today_range(date: Date) {
  const today = new Date(date);
  return {
    date_start: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0)),
    date_end: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
  }
}

export function get_yesterday_range(date: Date) {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return {
    date_start: new Date(Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0,0,0)),
    date_end: new Date(Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23,59,59))
  }
}

export function get_current_week(date: Date) {
  const startDay = 1
  return {
    date_start: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + startDay, 0, 0, 0)),
    date_end: new Date(date),
  }
}

export function get_previously_week(date: Date) {
  const now = new Date(date);
  now.setDate(now.getDate() - date.getDay())
  const date_end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59))
  const date_start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 6))
  return {
    date_start,
    date_end,
  }
}

export function get_current_month(date: Date) {
  return {
    date_start: new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)),
    date_end: date,
  }
}

export function get_previously_month(date: Date) {
  const now = new Date(date)
  now.setDate(0)
  return {
    date_start: new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)),
    date_end: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)),
  }
}

export function get_current_year(date: Date) {
  return {
    date_start: new Date(Date.UTC(date.getFullYear(), 0, 1)),
    date_end: new Date(date),
  }
}