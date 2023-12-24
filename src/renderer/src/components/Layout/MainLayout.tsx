import { makeStyles, Spinner } from '@fluentui/react-components'
import { useStationProgramList } from '@renderer/hooks/useStationProgramList'
import { useStationList } from '@renderer/hooks/useStationList'
import HomeScreen from '../Screen/HomeScreen'

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

  const isFetching = isFetchingStation || isFetchingProgram

  // = 全体の高さ(100vh) - classesの上下のpadding(2rem)
  const screenHeight = 'calc(100vh - 2rem)'

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
        <HomeScreen
          screenHeight={screenHeight}
          stationList={stationList}
          stationProgramList={stationProgramList}
        />
      </div>
    )
  }
}
