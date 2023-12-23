export interface SearchParam {
  keyword: string
  date: string
  stationId: string
}

export interface StationInfo {
  stationId: string
  stationName: string

  bannerImgPath: string
}

// 放送局の情報
export interface StationWithProgram {
  stationId: string
  stationName: string

  programMap: Record<string, Program[]>
}

// 番組の情報
export interface Program {
  // ユニークキー
  programId: string
  // 開始時間
  ft: string
  // 終了時間
  to: string
  // 番組名
  title: string
  // 説明
  info: string
  // 画像
  imgPath: string | null
  // TODO タグ
  // TODO ジャンル
}

export interface ProgramForCard extends Program {
  stationId: string
  stationName: string
}

// radiko放送局リストのxmlをjsonに変換した時の型
export interface StationInfoForApi {
  stations: {
    '@_area_id': string
    station: {
      id: string
      name: string
      banner: string
    }[]
  }
}

// TODO isStationInfoApi

// radiko番組表xmlをjsonに変換した時の型
export interface ProgramListForApi {
  // 放送局ID
  '@_id': string
  // 放送局名
  name: string
  // 番組リスト
  progs: {
    prog: ProgramForApi[]
  }
}

export interface ProgramForApi {
  '@_id': string
  '@_ft': string
  '@_to': string
  title: string
  info: string | null
  img: string | null
}

export const isProgramListForApi = (data: unknown): data is ProgramListForApi => {
  if (data == null || typeof data !== 'object') {
    return false
  }
  if (typeof data['@_id'] !== 'string') {
    return false
  }

  if (typeof data['progs'] !== 'object' || typeof data['progs']['prog'] !== 'object') {
    return false
  }
  const progList = data['progs']['prog']
  if (!Array.isArray(progList)) {
    return false
  }
  if (!progList.every(isProgramForApi)) {
    return false
  }

  return true
}

export const isProgramForApi = (data: unknown): data is ProgramForApi => {
  if (data == null || typeof data !== 'object') {
    return false
  }
  if (typeof data['@_id'] !== 'string') {
    return false
  }
  if (typeof data['@_ft'] !== 'string') {
    return false
  }
  if (typeof data['@_to'] !== 'string') {
    return false
  }

  if (typeof data['title'] !== 'string') {
    return false
  }
  if (typeof data['info'] !== 'string') {
    return false
  }
  if (typeof data['img'] !== 'string') {
    return false
  }

  return true
}

export interface DownloadResult {
  path: string | undefined
  progress: number
  downloadDate: string | null
}
