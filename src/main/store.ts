import Store from 'electron-store'
import { StationWithProgram } from '../shared/types'

// NOTE : electron-storeへのアクセスこのファイルのみで行う
const store = new Store({ name: 'data' })

export const getStationList = () => {
  // TODO これだと、保存データの定義が変わったときにおかしくなるので、型チェック関数を定義する
  return store.get('stationList', []) as StationWithProgram[]
}
export const setStationList = (stationList: StationWithProgram[]) => {
  store.set('stationList', stationList)
}
