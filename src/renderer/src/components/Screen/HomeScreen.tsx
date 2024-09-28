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
import { makeStyles, tokens } from '@fluentui/react-components'

interface Props extends ScreenBaseProps {}

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    rowGap: tokens.spacingVerticalXL
  }
})

export default function HomeScreen(props: Props) {
  const [searchParam, setSearchParam] = useState<SearchParam>({
    keyword: '',
    date: '',
    areaId: '',
    stationId: ''
  })

  const { isFetching: isFetchingStation, stationList } = useStationList(searchParam.areaId)
  const { isFetching: isFetchingProgram, stationProgramList } = useStationProgramList(
    searchParam.areaId
  )

  const isFetching = isFetchingStation || isFetchingProgram

  const programList = filterProgramList(stationProgramList, searchParam)

  // 検索フィルターの条件が変わったら、一番上に戻す
  const scrollRef = useRef<ScrollToInterface>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0)
    }
  }, [searchParam])

  const classes = useStyles()

  if (isFetching) {
    return <LoadingSpinner label="radikoの番組を取得しています" />
  }

  return (
    <div className={classes.root}>
      <ProgramSearchForm
        stationsList={stationList}
        stationProgramList={stationProgramList}
        value={searchParam}
        setValue={setSearchParam}
      />
      <div style={{ height: '100%', overflowY: 'hidden' }}>
        <ProgramScrollView scrollRef={scrollRef} programList={programList} />
      </div>
    </div>
  )
}
