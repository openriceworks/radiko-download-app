import dayjs, { Dayjs } from 'dayjs'
import {
  Program,
  ProgramListForApi,
  StationInfo,
  StationInfoForApi,
  StationWithProgram,
  isProgramListForApi
} from '../shared/types'
import { XMLParser } from 'fast-xml-parser'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import os from 'os'
import { formatDayjs, getDateList, getDayjs, includesDate } from '../shared/util'
import * as store from './store'

/**
 * radikoの認証処理を行う
 * @returns 認証情報の入ったリクエストヘッダーと地方のID
 */
export const authenticate = async () => {
  const authKey = 'bcd151073c03b352e1ef2fd66c32209da9ca0afa'

  const headers = {
    'User-Agent': 'curl/7.52.1',
    Accept: '*/*',
    'x-radiko-user': 'user',
    'x-radiko-app': 'pc_html5',
    'x-radiko-app-version': '0.0.1',
    'x-radiko-device': 'pc'
  }

  const res = await fetch('https://radiko.jp/v2/api/auth1', {
    method: 'GET',
    headers
  }).catch((error) => {
    console.error(error)
    return null
  })
  if (res == null) {
    throw new Error('authenticate failed!')
  }

  // PartialKey生成
  const authHeaders = res.headers
  const length = Number(authHeaders.get('x-radiko-keylength'))
  const offset = Number(authHeaders.get('x-radiko-keyoffset'))
  const partialkey = Buffer.from(authKey.slice(offset, offset + length)).toString('base64')

  headers['x-radiko-authtoken'] = authHeaders.get('x-radiko-authtoken')
  headers['x-radiko-partialkey'] = partialkey
  const areaText = await fetch('https://radiko.jp/v2/api/auth2', {
    method: 'GET',
    headers
  })
    .then((res2) => res2.text())
    .catch((error) => {
      console.error(error)
      return null
    })
  if (areaText == null) {
    throw new Error('authenticate failed!')
  }

  // areaIdのみ取り出す(areaTextは'areaId,文字列,文字列'のようなフォーマットになっている)
  const [areaId, ...rest] = areaText.split(',')

  return {
    headers,
    areaId
  }
}

export const getStationInfoList = async (): Promise<StationInfo[]> => {
  const { headers, areaId } = await authenticate()
  const url = `https://radiko.jp/v3/station/list/${areaId}.xml`

  const stationList = await fetch(url, {
    method: 'GET',
    headers
  })
  const stationXml = await stationList.text()
  const stationJson = new XMLParser({ ignoreAttributes: false }).parse(
    stationXml
  ) as StationInfoForApi

  return stationJson.stations.station.map((station) => {
    return {
      stationId: station.id,
      stationName: station.name,
      bannerImgPath: station.banner
    } satisfies StationInfo
  })
}

export const getStationProgramList = async (): Promise<StationWithProgram[]> => {
  const { headers, areaId } = await authenticate()

  // radikoのタイムフリーがダウンロードできる範囲
  const minDate = dayjs().add(-7, 'day').startOf('day')
  const maxDate = dayjs().startOf('day')

  const stationProgramList = store.getStationProgramList()

  // ダウンロードできなくなった日付の番組表を消す
  stationProgramList.forEach((station) => {
    const keyValueList = Object.entries(station.programMap)
    // minDateよりも前の日付を除く
    const filtered = keyValueList.filter(([key, _]) => {
      const keyDate = getDayjs(key, 'YYYYMMDD')
      return keyDate.isSame(minDate) || keyDate.isAfter(minDate)
    })
    // 元の構造に戻す
    station.programMap = Object.fromEntries(filtered)
  })

  // ローカルに番組表が保存されている日付リスト(今は、日付ごとに全ての放送局の番組表を取得しているので、stationList[0].programMapだけ見ておけば、全ての日付を取れる)
  const storedDateList =
    stationProgramList.length > 0
      ? Object.keys(stationProgramList[0].programMap).map((key) => getDayjs(key, 'YYYYMMDD'))
      : []

  // 保存されていない日付リスト(storedDateListにないのでダウンロードが必要)
  const dateList = getDateList(minDate, maxDate).filter(
    (date) => !includesDate(storedDateList, date)
  )
  // 並列ダウンロード
  const programListList = await Promise.all(
    dateList.map((date) => getProgramList(headers, areaId, date))
  )

  // APIの仕様上、日付ごとに全ての放送局の番組リストが取得できる。
  // StationWithProgramに変換する。

  programListList.forEach((programList, index) => {
    programList.forEach((item) => {
      let station = stationProgramList.find((r) => r.stationId === item['@_id'])
      if (station == null) {
        // 放送局データがなかったので追加
        stationProgramList.push({
          stationId: item['@_id'],
          stationName: item['name'],
          programMap: {}
        })
        station = stationProgramList.find((r) => r.stationId === item['@_id'])
      }

      // 番組リストを追加する
      const progList = item?.progs?.prog ?? []
      const programList = progList.map((program) => {
        return {
          programId: program['@_id'],
          ft: program['@_ft'],
          to: program['@_to'],
          title: program['title'],
          info: program['info'] ?? '',
          imgPath: program['img'] ?? null
        } satisfies Program
      })
      const date = dateList[index]
      const dateStr = formatDayjs(date, 'YYYYMMDD')

      station!.programMap[dateStr] = programList
    })
  })

  store.setStationProgramList(stationProgramList)

  return stationProgramList
}

const getProgramList = async (
  headers: HeadersInit,
  areaId: string,
  date: Dayjs
): Promise<ProgramListForApi[]> => {
  // 取得する番組表の日付(番組表は5時区切りになっているので、開始時刻の五時間前の日付の番組表を取ると番組の情報がある)
  const programDate = date.subtract(5, 'hour')
  const programDateStr = formatDayjs(programDate, 'YYYYMMDD')

  // 番組表を取得
  const programList = await fetch(
    `https://radiko.jp/v3/program/date/${programDateStr}/${areaId}.xml`,
    {
      method: 'GET',
      headers
    }
  )
  const programXml = await programList.text()
  const programJson = new XMLParser({ ignoreAttributes: false }).parse(programXml)

  const stationList = programJson?.radiko?.stations?.station ?? []

  if (Array.isArray(stationList) && stationList.every(isProgramListForApi)) {
    return stationList
  } else {
    console.error(`failed parse ${areaId}.xml `)
  }
  return []
}

/**
 * m3u8ファイルをダウンロードするファイルを取得する
 * @param {*} stationId
 * @param {*} startAt
 * @param {*} endAt
 * @param {*} seek
 * @returns
 */
const getMasterPlayList = async (stationId, startAt, endAt) => {
  const params = new URLSearchParams()
  params.set('station_id', stationId)
  params.set('start_at', startAt)
  params.set('ft', startAt)
  params.set('end_at', endAt)
  params.set('to', endAt)
  // 固定で大丈夫か?
  params.set('l', '15')
  params.set('lsid', 'a9ed540183dde886192a9095546ae668')
  params.set('type', 'b')

  return `https://radiko.jp/v2/api/ts/playlist.m3u8?${params.toString()}`
}

export const downloadAudio = async (stationId, startAt, endAt, outputFileName) => {
  // m3u8ファイルを取得する
  // ただし、m3u8ファイルには「音声ファイルのリンク」はなく、「音声ファイルのリンクへのリンク」が記述されている。
  const { headers } = await authenticate()
  const playListUrl = await getMasterPlayList(stationId, startAt, endAt)

  store.setDownloadResult(stationId, startAt, {
    path: outputFileName,
    progress: 0,
    downloadDate: null
  })

  const tmpdir = fs.mkdtempSync(`${os.tmpdir()}/${stationId}-${startAt}`)
  const tmpFile = `${tmpdir}/test.wav`

  let totalTime

  ffmpeg()
    .input(playListUrl)
    .inputOption('-headers', `X-Radiko-Authtoken: ${headers['x-radiko-authtoken']}`)
    .output(tmpFile)

    .on('codecData', (data) => {
      totalTime = parseInt(data.duration.replace(/:/g, ''))
    })
    .on('progress', (progress) => {
      const time = parseInt(progress.timemark.replace(/:/g, ''))
      const percent = (time / totalTime) * 100
      store.setDownloadResult(stationId, startAt, {
        path: outputFileName,
        progress: percent,
        downloadDate: null
      })
    })
    .on('end', async () => {
      fs.copyFileSync(tmpFile, outputFileName)
      fs.rmSync(tmpdir, {
        recursive: true,
        force: true
      })

      store.setDownloadResult(stationId, startAt, {
        path: outputFileName,
        progress: 100,
        downloadDate: formatDayjs(dayjs(), 'YYYYMMDDhhmmss')
      })
    })
    .run()

  return true
}
