import { makeStyles, Spinner } from '@fluentui/react-components'
import { useStationList } from '@renderer/hooks/useStationList'
import { useState } from 'react'
import { SearchParam } from '../../../../shared/types'
import { filterProgramList } from '../../../../shared/util'
import ProgramScrollView from '../Elements/ProgramScrollView'
import ProgramSearchForm from '../Form/ProgramSearchForm'

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
  const { isFetching, stationList } = useStationList()
  const [searchParam, setSearchParam] = useState<SearchParam>({ keyword: '', date: '' })

  const programList = filterProgramList(stationList, searchParam)

  // = 全体の高さ - ProgramSearchFormの高さ(54px) - classesの上下のpadding(2rem) - ProgramScrollViewのmarginTop(1rem)
  const programScrollViewHeight = 'calc(100vh - 54px - 2rem - 1rem)'

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
          stationList={stationList}
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
