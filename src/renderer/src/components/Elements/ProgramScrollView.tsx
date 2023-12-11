import { VirtualizerScrollView } from '@fluentui/react-components/unstable'
import { Body2, Title3, makeStyles } from '@fluentui/react-components'
import { ProgramForCard } from 'src/shared/types'
import ProgramCard from './ProgramCard'

interface Props {
  programList: ProgramForCard[]
  height: string
}

const useStyles = makeStyles({
  child: {
    height: '400px',
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    columnGap: '0.5rem',
    // 左端のカードのborderが切れるので1pxずらす
    marginLeft: '1px',
    marginRight: '1px'
  }
})

const useEmptyStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default function ProgramScrollView(props: Props): JSX.Element {
  if (props.programList.length === 0) {
    const classes = useEmptyStyles()
    return (
      <div className={classes.root} style={{ height: props.height }}>
        <Title3>番組が見つかりませんでした。</Title3>
        <Body2>条件を変えて探してみてください。</Body2>
      </div>
    )
  }

  const classes = useStyles()

  const programListList: ProgramForCard[][] = []
  // TODO widthによって一行のカード数を変えたい
  props.programList.forEach((program) => {
    if (programListList.length === 0 || programListList[programListList.length - 1].length == 3) {
      programListList.push([])
    }

    programListList[programListList.length - 1].push(program)
  })

  // TODO 変更が即時反映されてしまうが、アニメーションはあった方がいいのだろうか。
  return (
    <VirtualizerScrollView
      numItems={programListList.length}
      // height: 400px
      itemSize={400}
      container={{
        role: 'list',
        style: { width: 'fit-content', height: props.height, gap: '0.5rem' }
      }}
    >
      {(index: number) => {
        return (
          <div
            role={'listitem'}
            aria-posinset={index}
            aria-setsize={programListList.length}
            key={programListList[index][0].programId}
            className={classes.child}
          >
            {programListList[index].map((program) => (
              <ProgramCard key={program.programId} program={program} />
            ))}
          </div>
        )
      }}
    </VirtualizerScrollView>
  )
}
