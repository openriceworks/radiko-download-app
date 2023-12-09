import dayjs, { Dayjs } from 'dayjs'
import { ProgramForCard, SearchParam, StationWithProgram } from '../types'

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

export const filterProgramList = (stationList: StationWithProgram[], searchParam: SearchParam) => {
  let programList: ProgramForCard[] = []
  if (searchParam.date !== '') {
    programList.push(
      ...stationList.flatMap((station) =>
        station.programMap[searchParam.date].flatMap((val) => ({
          ...val,
          stationId: station.stationId,
          stationName: station.stationName
        }))
      )
    )
  } else {
    programList.push(
      ...stationList.flatMap((station) =>
        Object.values(station.programMap)
          .flatMap((val) => val)
          .map((val) => ({
            ...val,
            stationId: station.stationId,
            stationName: station.stationName
          }))
      )
    )
  }

  // TODO アルファベットの大小無視で比較させたい
  // TODO 正規表現に関連する文字のエスケープが必要
  const keywordPattern = new RegExp(`${searchParam.keyword}`)
  programList = programList.filter((program) => {
    if (program.title.match(keywordPattern)) {
      return true
    }
    return false
  })
  return programList
}
