import { makeStyles, Spinner } from '@fluentui/react-components'
import { useStationProgramList } from '@renderer/hooks/useStationProgramList'
import { useState } from 'react'
import { SearchParam } from '../../../../shared/types'
import { filterProgramList } from '../../../../shared/util'
import ProgramScrollView from '../Elements/ProgramScrollView'
import ProgramSearchForm from '../Form/ProgramSearchForm'
import { useStationList } from '@renderer/hooks/useStationList'

const useStyles = makeStyles({
  root: {
    height: 'max-content',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  }
})

const useLoadingStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default function MainLayout(): JSX.Element {
  const { isFetching: isFetchingStation, stationList } = useStationList()
  const { isFetching: isFetchingProgram, stationProgramList } = useStationProgramList()
  const [searchParam, setSearchParam] = useState<SearchParam>({ keyword: '', date: '', stationId: '' })

  const programList = filterProgramList(stationProgramList, searchParam)

  // = 全体の高さ - ProgramSearchFormの高さ(54px) - classesの上下のpadding(2rem) - ProgramScrollViewのmarginTop(1rem)
  const programScrollViewHeight = 'calc(100vh - 54px - 2rem - 1rem)'

  const isFetching = isFetchingStation || isFetchingProgram

  if (isFetching) {
    const classes = useLoadingStyles()
    return (
      <div className={classes.root}>
        <Spinner labelPosition="before" label="radikoの番組を取得しています" />
      </div>
    )
  } else {
    return (
      <div className={useStyles().root}>
        <ProgramSearchForm
          stationsList={stationList}
          stationProgramList={stationProgramList}
          value={searchParam}
          setValue={setSearchParam}
        />
        <div style={{ marginTop: '1rem' }}>
          <ProgramScrollView programList={programList} height={programScrollViewHeight} />
        </div>
      </div>
    )
  }
}
