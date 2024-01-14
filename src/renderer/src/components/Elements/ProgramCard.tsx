import {
  Body1,
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  makeStyles,
  Image,
  ProgressBar,
  Field,
  shorthands
} from '@fluentui/react-components'
import { ArrowDownload24Regular } from '@fluentui/react-icons'
import { DownloadResult, ProgramForCard } from 'src/shared/types'
import { getDayjs } from '../../../../shared/util'
import dayjs, { Dayjs } from 'dayjs'
import { useDownloadAudio } from '@renderer/hooks/useDownloadAudio'
import { useEffect, useRef } from 'react'

interface Props {
  program: ProgramForCard
}

const useStyles = makeStyles({
  card: {
    width: '320px',
    // タイトルが2行に改行されても収まる高さ
    height: '326px'
  }
})

const useHeaderTitleStyles = makeStyles({
  // タイトルが2行に収まらないときに、「...」で省略
  root: {
    textOverflow: 'ellipsis',
    ...shorthands.overflow('hidden'),
    // タイトル2行分の高さ
    maxHeight: '40px',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: '2'
  }
})

const useFooterStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    columnGap: '0.5rem',
    justifyContent: 'start',
    alignItems: 'center'
  }
})

function ProgramCardHeader(program: ProgramForCard): JSX.Element {
  const classes = useHeaderTitleStyles()
  return (
    <Body1 className={classes.root}>
      <b>{program.title}</b>
    </Body1>
  )
}

function formatDateRange(fromDate: Dayjs, toDate: Dayjs): string {
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

function ProgramCardDescription(program: ProgramForCard): JSX.Element {
  const startDateTime = getDayjs(program.ft, 'YYYYMMDDhhmmss')
  const endDateTime = getDayjs(program.to, 'YYYYMMDDhhmmss')
  return (
    <Caption1>
      {program.stationName} | {formatDateRange(startDateTime, endDateTime)}
    </Caption1>
  )
}

function ProgramCardFooter(props: {
  result: Partial<DownloadResult>
  onDownload: () => void
}): JSX.Element {
  const { result, onDownload } = props

  const classes = useFooterStyles()

  const Content = (): JSX.Element => {
    if (result.progress != null && result.progress < 100) {
      return (
        <Field validationMessage="ダウンロード中" validationState="none" style={{ width: '100%' }}>
          <ProgressBar value={result.progress / 100} />
        </Field>
      )
    }

    if (result.progress === 100 && result.downloadDate != null) {
      const now = dayjs()
      const downloadDate = getDayjs(result.downloadDate, 'YYYYMMDDhhmmss')
      const dateText = downloadDate.isSame(now, 'day')
        ? downloadDate.format('HH:mm')
        : downloadDate.format('DD日')

      return (
        <>
          <Button icon={<ArrowDownload24Regular />} onClick={onDownload}>
            ダウンロード
          </Button>
          <Caption1>{dateText}にダウンロード済み</Caption1>
        </>
      )
    }

    return (
      <Button icon={<ArrowDownload24Regular />} onClick={onDownload}>
        ダウンロード
      </Button>
    )
  }

  return (
    <div className={classes.root}>
      <Content />
    </div>
  )
}

export default function ProgramCard(props: Props): JSX.Element {
  const styles = useStyles()
  const { downloadAudio, result, getProgress } = useDownloadAudio(props.program)

  const ref = useRef<HTMLDivElement>(null!)

  // 表示領域に入ってからダウンロード済み情報を取得する
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        getProgress()
        observer.unobserve(entry.target)
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      <Card className={styles.card}>
        {/* 16:10のアスペクト比の画像に合わせている */}
        <CardPreview style={{ width: '320px', height: '200px' }}>
          <Image src={props.program.imgPath ?? undefined} loading="lazy" />
        </CardPreview>
        <div style={{ height: '56px' }}>
          <CardHeader
            header={ProgramCardHeader(props.program)}
            description={ProgramCardDescription(props.program)}
          />
        </div>

        <CardFooter>
          <ProgramCardFooter result={result} onDownload={downloadAudio} />
        </CardFooter>
      </Card>
    </div>
  )
}
