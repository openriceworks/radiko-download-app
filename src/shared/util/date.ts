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

export const formatDateRange = (fromDate: Dayjs, toDate: Dayjs): string => {
  const fromDatePattern = 'YYYY/MM/DD '

  const fromDateVisible = fromDate.clone().subtract(fromDate.get('hour') < 5 ? 1 : 0, 'day')
  const fromTimeVisible = {
    hour: fromDate.get('hour') + (fromDate.get('hour') < 5 ? 24 : 0),
    minutes: fromDate.get('minute')
  }

  const toDateVisible = toDate.clone().subtract(toDate.get('hour') < 5 ? 1 : 0, 'day')
  const toTimeVisible = {
    hour: toDate.get('hour') + (toDate.get('hour') < 5 ? 24 : 0),
    minutes: toDate.get('minute')
  }

  let toDatePattern = 'YYYY/MM/DD '
  if (fromDateVisible.get('year') === toDateVisible.get('year')) {
    toDatePattern = 'MM/DD '
    if (fromDateVisible.get('month') === toDateVisible.get('month')) {
      // 月だけの省略はしない
      if (fromDateVisible.get('day') == toDateVisible.get('day')) {
        toDatePattern = ''
      }
    }
  }
  const fromDateStr = fromDateVisible.format(fromDatePattern)
  const fromHourStr =
    fromTimeVisible.hour > 9 ? `${fromTimeVisible.hour}` : `0${fromTimeVisible.hour}`
  const fromMinuteHour =
    fromTimeVisible.minutes > 9 ? `${fromTimeVisible.minutes}` : `0${fromTimeVisible.minutes}`

  const toDateStr = toDatePattern !== '' ? toDateVisible.format(toDatePattern) : ''
  const toHourStr = toTimeVisible.hour > 9 ? `${toTimeVisible.hour}` : `0${toTimeVisible.hour}`
  const toMinuteHour =
    toTimeVisible.minutes > 9 ? `${toTimeVisible.minutes}` : `0${toTimeVisible.minutes}`

  return `${fromDateStr}${fromHourStr}:${fromMinuteHour} - ${toDateStr}${toHourStr}:${toMinuteHour}`
}

export const includesDate = (dateList: Dayjs[], date: Dayjs) => {
  return dateList.some((d) => d.isSame(date))
}
