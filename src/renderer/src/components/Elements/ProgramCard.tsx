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
import { getDayjs, formatDateRange } from '../../../../shared/util'
import dayjs from 'dayjs'

export interface ProgramCardProps {
  program: ProgramForCard
  downloadResult: Partial<DownloadResult>
  onDownloadClick: () => void
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
        : downloadDate.format('D日')

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

export default function ProgramCard(props: ProgramCardProps): JSX.Element {
  const styles = useStyles()

  return (
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
        <ProgramCardFooter result={props.downloadResult} onDownload={props.onDownloadClick} />
      </CardFooter>
    </Card>
  )
}
