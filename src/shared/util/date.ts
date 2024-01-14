import dayjs, { Dayjs } from 'dayjs'

type DateTimeFormat = 'YYYYMMDDhhmmss'
type DateFormat = 'YYYYMMDD'

export const getDateList = (minDate: Dayjs, maxDate: Dayjs) => {
  const retList: Dayjs[] = []
  let date = minDate.clone()
  while (date.isBefore(maxDate) || date.isSame(maxDate)) {
    retList.push(date)
    date = date.add(1, 'day')
  }
  return retList
}

export const getDayjs = (date: string, format: DateFormat | DateTimeFormat) => {
  // TODO dateがformatになっているかの確認
  return dayjs(date, format)
}

export const formatDayjs = (date: Dayjs, format: DateFormat | DateTimeFormat) => {
  return date.format(format)
}

export const includesDate = (dateList: Dayjs[], date: Dayjs) => {
  return dateList.some((d) => d.isSame(date))
}
