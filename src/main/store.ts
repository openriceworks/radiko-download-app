import Store from 'electron-store'
import {
  DownloadResult,
  DownloadHistory,
  StationWithProgram,
  Settings,
  getDefaultSettings
} from '../shared/types'
import dayjs from 'dayjs'
import { getDayjs } from '../shared/util'

interface StoreType {
  stationProgramList: StationWithProgram[]
  downloadResult: Record<string, DownloadResult>
  settings: Settings
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

export const getDownloadResultList = (): DownloadHistory[] => {
  const resultStore = store.get('downloadResult') ?? {}

  // 2週間分取得する
  const limitDate = dayjs().subtract(14, 'day')

  return Object.entries(resultStore)
    .filter(([key, value]) => {
      if (value.downloadDate == null) {
        return true
      }
      return getDayjs(value.downloadDate, 'YYYYMMDDhhmmss').isAfter(limitDate)
    })
    .map(([key, value]) => {
      const [stationId, startAt] = key.split('-')
      return {
        stationId,
        startAt,
        ...value
      } satisfies DownloadHistory
    })
    .sort((a, b) => {
      const aDate = a.downloadDate != null ? getDayjs(a.downloadDate, 'YYYYMMDDhhmmss') : dayjs()
      const bDate = b.downloadDate != null ? getDayjs(b.downloadDate, 'YYYYMMDDhhmmss') : dayjs()
      return bDate.diff(aDate, 'second')
    })
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

export const getSettings = () => {
  return store.get('settings', getDefaultSettings())
}
export const setSettings = (settings: Settings) => {
  store.set('settings', settings)
}

export const reset = () => {
  store.set('settings', getDefaultSettings())
  store.set('downloadResult', [])
  store.set('stationProgramList', [])
}
