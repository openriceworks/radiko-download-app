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
  Field
} from '@fluentui/react-components'
import { ArrowDownload24Regular } from '@fluentui/react-icons'
import { ProgramForCard } from 'src/shared/types'
import { getDayjs } from '../../../../shared/util'
import { Dayjs } from 'dayjs'
import { useDownloadAudio } from '@renderer/hooks/useDownloadAudio'

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

function ProgramCardHeader(program: ProgramForCard): JSX.Element {
  return (
    <Body1>
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
      {program.stationName} - {formatDateRange(startDateTime, endDateTime)}
    </Caption1>
  )
}

export default function ProgramCard(props: Props): JSX.Element {
  const styles = useStyles()
  const { downloadAudio, progress, isDownloading } = useDownloadAudio()

  const FooterContent = (): JSX.Element => {
    if (isDownloading) {
      return (
        <Field validationMessage="ダウンロード中" validationState="none" style={{ width: '100%' }}>
          <ProgressBar value={progress / 100} />
        </Field>
      )
    }

    if (progress === 100) {
      return (
        <Field
          validationMessage="ダウンロードしました"
          validationState="success"
          style={{ width: '100%' }}
        >
          <ProgressBar value={progress / 100} />
        </Field>
      )
    }

    return (
      <Button icon={<ArrowDownload24Regular />} onClick={() => downloadAudio(props.program)}>
        ダウンロード
      </Button>
    )
  }

  return (
    <Card className={styles.card}>
      {/* 16:10のアスペクト比の画像に合わせている */}
      <CardPreview style={{ width: '320px', height: '200px' }}>
        <Image src={props.program.imgPath ?? undefined} />
      </CardPreview>
      <div style={{ height: '56px' }}>
        <CardHeader
          header={ProgramCardHeader(props.program)}
          description={ProgramCardDescription(props.program)}
        />
      </div>

      <CardFooter>
        <FooterContent />
      </CardFooter>
    </Card>
  )
}
