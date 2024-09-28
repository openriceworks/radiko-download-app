import {
  makeStyles,
  tokens,
  shorthands,
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList
} from '@fluentui/react-components'
import {
  CalendarPlayRegular,
  FluentIcon,
  HistoryRegular,
  LauncherSettingsRegular
} from '@fluentui/react-icons'
import { useState } from 'react'
import HomeScreen from '../Screen/HomeScreen'
import HistoryScreen from '../Screen/HistoryScreen'
import ConfigScreen from '../Screen/ConfigScreen'

const useStyles = makeStyles({
  root: {
    height: '100%',
    boxSizing: 'border-box',
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL)
  },
  gridContainer: {
    height: '100%',
    display: 'grid',
    gridTemplateRows: 'auto minmax(0,1fr)',
    gridAutoColumns: 'minmax(0,1fr)',
    rowGap: tokens.spacingVerticalXXL
  },
  tabSelect: {
    // ネガティブマージンで<TabSelect>の見た目上の開始位置をウィンドウ上部に設定
    marginTop: `calc(-1 * ${tokens.spacingHorizontalL})`,
    // ネガティブマージンで<TabSelect>の見た目上の開始位置を<Screen>と揃える
    marginLeft: `calc(-1 * ${tokens.spacingVerticalM})`
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

interface TabSelectProps {
  value: Menu
  onTabSelect: (menu: Menu) => void
  className?: string
}

function TabSelect(props: TabSelectProps) {
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    props.onTabSelect(data.value as Menu)
  }

  return (
    <TabList
      size="large"
      selectedValue={props.value}
      onTabSelect={onTabSelect}
      className={props.className}
    >
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

  const Screen = (props: { menu: Menu }) => {
    // TODO タブ切り替え前の状態にしたければmemo化する必要がある
    let currentScreen = <HomeScreen />

    if (props.menu === 'history') {
      currentScreen = <HistoryScreen />
    }

    if (props.menu === 'config') {
      currentScreen = <ConfigScreen />
    }

    return <>{currentScreen}</>
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.gridContainer}>
        <TabSelect value={menu} onTabSelect={setMenu} className={classes.tabSelect} />
        <Screen menu={menu} />
      </div>
    </div>
  )
}
