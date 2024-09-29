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
  shorthands,
  tokens
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
  cardPreview: {
    // CardPreviewコンポーネントの左右のpaddingを含めた幅
    width: `calc(100% + ${tokens.spacingHorizontalL} * 2)`
  }
})

const useHeaderTitleStyles = makeStyles({
  // タイトルが2行に収まらないときに、「...」で省略
  root: {
    textOverflow: 'ellipsis',
    ...shorthands.overflow('hidden'),
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: '2'
  }
})

const useDescriptionStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalS
  },
  stationName: {
    flexGrow: '1'
  }
})

const useFooterStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingHorizontalS,
    justifyContent: 'start',
    alignItems: 'start'
  },
  button: {
    width: '100%'
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
  const classes = useDescriptionStyles()
  return (
    <Caption1 className={classes.root}>
      <span className={classes.stationName}>{program.stationName}</span>
      <span>{formatDateRange(startDateTime, endDateTime)}</span>
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
          <Button className={classes.button} icon={<ArrowDownload24Regular />} onClick={onDownload}>
            ダウンロード
          </Button>
          <Caption1>{dateText}にダウンロード済み</Caption1>
        </>
      )
    }

    return (
      <Button className={classes.button} icon={<ArrowDownload24Regular />} onClick={onDownload}>
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
    <Card size="large" style={{ height: '100%' }}>
      <CardPreview className={styles.cardPreview}>
        <Image src={props.program.imgPath ?? undefined} loading="lazy" fit="contain" />
      </CardPreview>
      <div>
        <CardHeader
          style={{ rowGap: tokens.spacingVerticalXS }}
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
