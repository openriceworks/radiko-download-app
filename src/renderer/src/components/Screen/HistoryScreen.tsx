import { useHistoryList } from '@renderer/hooks/useHistoryList'
import { ScreenBaseProps } from '.'
import HistoryTable from '../Elements/HistoryTable'
import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from '@renderer/hooks/useWindosSize'

interface Props extends ScreenBaseProps {}

export default function HistoryScreen(props: Props) {
  const { historyList } = useHistoryList()

  const [heightPx, setHeightPx] = useState(0)
  const { size } = useWindowSize()
  const screenRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setHeightPx(screenRef.current?.clientHeight ?? 0)
  }, [size])

  return (
    <div ref={screenRef}>
      <HistoryTable list={historyList} height={heightPx} />
    </div>
  )
}
