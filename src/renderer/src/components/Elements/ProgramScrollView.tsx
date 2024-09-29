import { ScrollToInterface, VirtualizerScrollView } from '@fluentui/react-components/unstable'
import { Body2, Title3, makeStyles, tokens } from '@fluentui/react-components'
import { ProgramForCard } from 'src/shared/types'
import ProgramCard, { ProgramCardProps } from './ProgramCard'
import { RefObject, useEffect, useMemo, useRef } from 'react'
import { useDownloadAudio } from '@renderer/hooks/useDownloadAudio'
import { useWindowSize } from '@renderer/hooks/useWindosSize'

interface Props {
  programList: ProgramForCard[]
  scrollRef?: RefObject<ScrollToInterface>
}

const useStyles = makeStyles({
  child: {
    height: '100%',
    width: 'fit-content',
    // 行ごとの余白
    // 親要素のrowGapを使用していない理由
    // VirtualScrollViewリストは最初と最後に見えないタグが作られる実装なので
    // rowGapを適用すると、最初のアイテムの上部と最後のアイテムの下部にもrowGapの空間が開いてしまうため
    marginBottom: tokens.spacingVerticalXL,
    display: 'grid',
    columnGap: tokens.spacingHorizontalXL,
    // 左端のカードのborderが切れるので1pxずらす
    marginLeft: '1px',
    marginRight: '1px'
  }
})

const useEmptyStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export function ProgramCardWrapper(props: Pick<ProgramCardProps, 'program'>): JSX.Element {
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
      <ProgramCard
        program={props.program}
        downloadResult={result}
        onDownloadClick={downloadAudio}
      />
    </div>
  )
}

function Empty() {
  const classes = useEmptyStyles()

  return (
    <div className={classes.root}>
      <Title3>番組が見つかりませんでした。</Title3>
      <Body2>条件を変えて探してみてください。</Body2>
    </div>
  )
}

export default function ProgramScrollView(props: Props): JSX.Element {
  const classes = useStyles()

  const { size } = useWindowSize()
  // 1列に表示するProgramCardの数
  // TODO 実際にはこのコンポーネントの高さから求めるのが正しい
  const columnCount = useMemo(() => {
    // ウィンドウの幅
    const width = size[0]
    // ProgramCardの最小幅200pxよりも大きい値で区切る
    return Math.min(Math.floor(width / 240), 5)
  }, [size])

  const programListList = useMemo(() => {
    const programListList: ProgramForCard[][] = []
    props.programList.forEach((program) => {
      if (
        programListList.length === 0 ||
        programListList[programListList.length - 1].length == columnCount
      ) {
        programListList.push([])
      }
      programListList[programListList.length - 1].push(program)
    })
    return programListList
  }, [props.programList, columnCount])

  if (props.programList.length === 0) {
    return <Empty />
  }

  // TODO 変更が即時反映されてしまうが、アニメーションはあった方がいいのだろうか。
  return (
    <VirtualizerScrollView
      imperativeRef={props.scrollRef}
      numItems={programListList.length}
      // height: 200px
      itemSize={200}
      container={{
        role: 'list'
      }}
    >
      {(index: number) => {
        return (
          <div
            role={'listitem'}
            aria-posinset={index}
            aria-setsize={programListList.length}
            key={index}
            className={classes.child}
            style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
          >
            {programListList[index].map((program, programIndex) => (
              <ProgramCardWrapper key={`${index}-${programIndex}`} program={program} />
            ))}
          </div>
        )
      }}
    </VirtualizerScrollView>
  )
}
