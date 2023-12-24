import { useHistoryList } from '@renderer/hooks/useHistoryList'
import { ScreenBaseProps } from '.'
import HistoryTable from '../Elements/HistoryTable'

interface Props extends ScreenBaseProps {
  screenHeightPx: number
}
export default function HistoryScreen(props: Props) {
  const { historyList } = useHistoryList()

  return (
    <div>
      <HistoryTable list={historyList} height={props.screenHeightPx} />
    </div>
  )
}
