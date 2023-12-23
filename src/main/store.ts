import Store from 'electron-store'
import { DownloadResult, StationWithProgram } from '../shared/types'

interface StoreType {
  stationProgramList: StationWithProgram[]
  downloadResult: Record<string, DownloadResult>
}

// NOTE : electron-storeへのアクセスこのファイルのみで行う
const store = new Store<StoreType>({ name: 'data' })

export const getStationProgramList = () => {
  // TODO areaIdが変わったときに全て取り直す機能が必要

  // TODO これだと、保存データの定義が変わったときにおかしくなるので、型チェック関数を定義する
  return store.get('stationProgramList', [])
}
export const setStationProgramList = (stationProgramList: StationWithProgram[]) => {
  store.set('stationProgramList', stationProgramList)
}

export const getDownloadResult = (
  stationId: string,
  startAt: string
): DownloadResult | undefined => {
  const key = `${stationId}-${startAt}`
  const resultStore = store.get('downloadResult') ?? {}
  return resultStore[key]
}

export const setDownloadResult = (
  stationId: string,
  startAt: string,
  downloadResult: DownloadResult
) => {
  const resultStore = store.get('downloadResult') ?? {}
  const key = `${stationId}-${startAt}`
  resultStore[key] = downloadResult
  store.set('downloadResult', resultStore)
}
