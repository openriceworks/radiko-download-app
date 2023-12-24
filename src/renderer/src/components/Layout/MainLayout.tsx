import {
  makeStyles,
  SelectTabData,
  SelectTabEvent,
  Spinner,
  Tab,
  TabList
} from '@fluentui/react-components'
import { useStationProgramList } from '@renderer/hooks/useStationProgramList'
import { useStationList } from '@renderer/hooks/useStationList'
import { CalendarPlayRegular, FluentIcon, HistoryRegular } from '@fluentui/react-icons'
import { useEffect, useRef, useState } from 'react'
import HomeScreen from '../Screen/HomeScreen'
import HistoryScreen from '../Screen/HistoryScreen'
import { useWindowSize } from '@renderer/hooks/useWindosSize'

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

type Menu = 'home' | 'history'
const menuMap: Record<Menu, { label: string; Icon: FluentIcon }> = {
  home: {
    label: '番組',
    Icon: CalendarPlayRegular
  },
  history: {
    label: '履歴',
    Icon: HistoryRegular
  }
}

function TabSelect(props: { value: Menu; onTabSelect: (menu: Menu) => void }) {
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    props.onTabSelect(data.value as Menu)
  }

  return (
    <TabList size="large" selectedValue={props.value} onTabSelect={onTabSelect}>
      {Object.entries(menuMap).map(([key, value]) => {
        return (
          <Tab key={key} id={key} icon={<value.Icon />} value={key}>
            {value.label}
          </Tab>
        )
      })}
    </TabList>
  )
}

export default function MainLayout(): JSX.Element {
  const [menu, setMenu] = useState<Menu>('home')

  const { isFetching: isFetchingStation, stationList } = useStationList()
  const { isFetching: isFetchingProgram, stationProgramList } = useStationProgramList()

  const isFetching = isFetchingStation || isFetchingProgram

  // = 全体の高さ(100vh) - classesの上下のpadding(2rem) - TabListの高さ(56px) - TabList下のmargin(1rem)
  const screenHeight = 'calc(100vh - 2rem - 56px - 1rem)'

  const Screen = (props: { menu: Menu }) => {
    const { size } = useWindowSize()
    const ref = useRef<HTMLDivElement>(null!)
    const [heightPx, setHeightPx] = useState<number>()

    useEffect(() => {
      setHeightPx(ref.current?.offsetHeight)
    }, [size])

    // TODO タブ切り替え前の状態にしたければmemo化する必要がある
    let currentScreen = (
      <HomeScreen
        screenHeight={screenHeight}
        stationList={stationList}
        stationProgramList={stationProgramList}
      />
    )

    if (props.menu === 'history') {
      currentScreen = <HistoryScreen screenHeight={screenHeight} screenHeightPx={heightPx ?? 0} />
    }

    return (
      <div ref={ref} style={{ height: screenHeight }}>
        {currentScreen}
      </div>
    )
  }

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
        <div style={{ marginLeft: '-0.75rem', marginBottom: '1rem' }}>
          <TabSelect value={menu} onTabSelect={setMenu} />
        </div>
        <Screen menu={menu} />
      </div>
    )
  }
}
