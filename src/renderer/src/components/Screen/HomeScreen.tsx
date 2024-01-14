import { ScrollToInterface } from '@fluentui/react-components/dist/unstable'
import { useState, useRef, useEffect } from 'react'
import { SearchParam } from 'src/shared/types'
import { filterProgramList } from '../../../../shared/util'
import ProgramScrollView from '../Elements/ProgramScrollView'
import ProgramSearchForm from '../Form/ProgramSearchForm'
import { ScreenBaseProps } from '.'
import LoadingSpinner from '../Elements/LoadingSpinner'
import { useStationList } from '@renderer/hooks/useStationList'
import { useStationProgramList } from '@renderer/hooks/useStationProgramList'

interface Props extends ScreenBaseProps {}

export default function HomeScreen(props: Props) {
  const [searchParam, setSearchParam] = useState<SearchParam>({
    keyword: '',
    date: '',
    stationId: ''
  })

  const { isFetching: isFetchingStation, stationList } = useStationList()
  const { isFetching: isFetchingProgram, stationProgramList } = useStationProgramList()

  const isFetching = isFetchingStation || isFetchingProgram

  const programList = filterProgramList(stationProgramList, searchParam)

  // = screenHeight - ProgramSearchFormの高さ(54px) - ProgramScrollViewのmarginTop(1rem)
  const programScrollViewHeight = `calc(${props.screenHeight} - 54px - 1rem)`

  // 検索フィルターの条件が変わったら、一番上に戻す
  const scrollRef = useRef<ScrollToInterface>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0)
    }
  }, [searchParam])

  if (isFetching) {
    return <LoadingSpinner label="radikoの番組を取得しています" />
  }

  return (
    <div>
      <ProgramSearchForm
        stationsList={stationList}
        stationProgramList={stationProgramList}
        value={searchParam}
        setValue={setSearchParam}
      />
      <div style={{ marginTop: '1rem' }}>
        <ProgramScrollView
          scrollRef={scrollRef}
          programList={programList}
          height={programScrollViewHeight}
        />
      </div>
    </div>
  )
}
