import { makeStyles, SelectTabData, SelectTabEvent, Tab, TabList } from '@fluentui/react-components'
import {
  CalendarPlayRegular,
  FluentIcon,
  HistoryRegular,
  LauncherSettingsRegular
} from '@fluentui/react-icons'
import { useEffect, useRef, useState } from 'react'
import HomeScreen from '../Screen/HomeScreen'
import HistoryScreen from '../Screen/HistoryScreen'
import { useWindowSize } from '@renderer/hooks/useWindosSize'
import ConfigScreen from '../Screen/ConfigScreen'

const useStyles = makeStyles({
  root: {
    height: 'max-content',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  }
})

type Menu = 'home' | 'history' | 'config'
const menuMap: Record<Menu, { label: string; Icon: FluentIcon }> = {
  home: {
    label: '番組',
    Icon: CalendarPlayRegular
  },
  history: {
    label: '履歴',
    Icon: HistoryRegular
  },
  config: {
    label: '設定',
    Icon: LauncherSettingsRegular
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
    let currentScreen = <HomeScreen screenHeight={screenHeight} />

    if (props.menu === 'history') {
      currentScreen = <HistoryScreen screenHeight={screenHeight} screenHeightPx={heightPx ?? 0} />
    }

    if (props.menu === 'config') {
      currentScreen = <ConfigScreen screenHeight={screenHeight} />
    }

    return (
      <div ref={ref} style={{ height: screenHeight }}>
        {currentScreen}
      </div>
    )
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div style={{ marginLeft: '-0.75rem', marginBottom: '1rem' }}>
        <TabSelect value={menu} onTabSelect={setMenu} />
      </div>
      <Screen menu={menu} />
    </div>
  )
}
