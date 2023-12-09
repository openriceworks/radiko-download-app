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
  // TODO 本当は5:00区切りで日付を変えたい 2023/01/02 1:00 -> 2023/01/01 25:00 みたいな
  const fromDatePattern = 'YYYY/MM/DD hh:mm'
  let toDatePattern = 'YYYY/MM/DD hh:mm'

  if (fromDate.get('year') === toDate.get('year')) {
    toDatePattern = 'MM/DD hh:mm'
    if (fromDate.get('month') === toDate.get('month')) {
      toDatePattern = 'DD hh:mm'
      if (fromDate.get('day') == toDate.get('day')) {
        toDatePattern = 'hh:mm'
      }
    }
  }

  return `${fromDate.format(fromDatePattern)} - ${toDate.format(toDatePattern)}`
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

  const FooterContent = () => {
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
