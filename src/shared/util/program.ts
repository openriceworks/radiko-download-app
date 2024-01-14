import { ProgramForCard, SearchParam, StationWithProgram } from '../types'

export const filterProgramList = (stationList: StationWithProgram[], searchParam: SearchParam) => {
  let programList: ProgramForCard[] = []

  const filterStationList =
    searchParam.stationId !== ''
      ? stationList.filter((station) => station.stationId === searchParam.stationId)
      : stationList

  if (searchParam.date !== '') {
    programList.push(
      ...filterStationList.flatMap((station) =>
        station.programMap[searchParam.date].flatMap((val) => ({
          ...val,
          stationId: station.stationId,
          stationName: station.stationName
        }))
      )
    )
  } else {
    programList.push(
      ...filterStationList.flatMap((station) =>
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
