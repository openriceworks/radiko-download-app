import { ScrollToInterface } from '@fluentui/react-components/dist/unstable'
import { useState, useRef, useEffect } from 'react'
import { SearchParam, StationInfo, StationWithProgram } from 'src/shared/types'
import { filterProgramList } from '../../../../shared/util'
import ProgramScrollView from '../Elements/ProgramScrollView'
import ProgramSearchForm from '../Form/ProgramSearchForm'

interface Props {
  screenHeight: string

  stationList: StationInfo[]
  stationProgramList: StationWithProgram[]
}

export default function HomeScreen(props: Props) {
  const [searchParam, setSearchParam] = useState<SearchParam>({
    keyword: '',
    date: '',
    stationId: ''
  })

  const programList = filterProgramList(props.stationProgramList, searchParam)

  // = screenHeight - ProgramSearchFormの高さ(54px) - ProgramScrollViewのmarginTop(1rem)
  const programScrollViewHeight = `calc(${props.screenHeight} - 54px - 1rem)`

  // 検索フィルターの条件が変わったら、一番上に戻す
  const scrollRef = useRef<ScrollToInterface>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0)
    }
  }, [searchParam])

  return (
    <div>
      <ProgramSearchForm
        stationsList={props.stationList}
        stationProgramList={props.stationProgramList}
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
