import {
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuProps,
  MenuTrigger,
  makeStyles,
  shorthands,
  tokens
} from '@fluentui/react-components'
import { useCallback, useMemo } from 'react'
import { AreaDictionaly, GroupedAreaDictionary } from '../../../../shared/constant/area'

export interface AreaSelectProps extends Omit<MenuProps, 'children'> {
  placeholder: string
  icon?: MenuButtonProps['icon']
  appearance?: MenuButtonProps['appearance']
  value: string
  onValueChange: (string) => void
}

const AreaList = Object.entries(AreaDictionaly).map(([areaCode, areaName]) => {
  return {
    name: areaCode,
    label: areaName
  }
})

const useStyles = makeStyles({
  popover: {
    maxWidth: 'calc(75lwh)'
  },
  menuList: {
    ...shorthands.margin(tokens.spacingVerticalL, tokens.spacingHorizontalL)
  },
  rootMenuGroup: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM
  },
  allMenuItem: {
    width: 'fit-content'
  },
  areaMenuGroup: {
    display: 'flex'
  },
  divider: {
    width: '0',
    ...shorthands.margin(tokens.spacingVerticalXXS, tokens.spacingHorizontalS),
    ...shorthands.borderWidth(tokens.strokeWidthThin, tokens.strokeWidthThin, '0', '0'),
    ...shorthands.borderStyle('solid'),
    ...shorthands.borderColor(tokens.colorNeutralStroke2)
  }
})

const useGroupAreaMenuGroupStyles = makeStyles({
  areaMenuGroup: {
    display: 'flex',
    flexDirection: 'column',
    columnGap: tokens.spacingVerticalM
  }
})

function GroupedAreaMenuGroup({
  groupName,
  areaList
}: {
  groupName: string
  areaList: { name: string; label: string }[]
}) {
  const classes = useGroupAreaMenuGroupStyles()
  return (
    <MenuGroup key={groupName}>
      <MenuGroupHeader>{groupName}</MenuGroupHeader>
      <MenuGroup className={classes.areaMenuGroup}>
        {areaList.map((item) => (
          <MenuItemRadio key={item.name} name="name" value={item.name}>
            {item.label}
          </MenuItemRadio>
        ))}
      </MenuGroup>
    </MenuGroup>
  )
}

export default function AreaSelect({
  placeholder,
  icon,
  appearance,
  value,
  onValueChange,
  ...menuProps
}: AreaSelectProps) {
  const checkedValues = useMemo(() => {
    return {
      name: [value]
    } satisfies Record<string, string[]>
  }, [value])

  const setCheckedValues = useCallback(
    (checkedValues: Record<string, string[]>) => {
      const value = checkedValues?.name[0] ?? ''
      onValueChange(value)
    },
    [onValueChange]
  )

  const onChange: MenuProps['onCheckedValueChange'] = (e, { name, checkedItems }) => {
    setCheckedValues({ [name]: checkedItems })
  }

  const selected = useMemo(() => AreaList.some((item) => item.name === value), [name])
  const menuButtonTextStyle = useMemo(() => {
    return {
      fontWeight: selected ? tokens.fontFamilyBase : tokens.fontWeightRegular
    }
  }, [selected])

  const visibleLabel = useMemo(() => {
    const found = AreaList.find((item) => item.name === value)
    return found?.label ?? placeholder
  }, [placeholder, value])

  const groupedAreaList = useMemo(() => {
    return Object.entries(GroupedAreaDictionary).map((item) => {
      const [groupName, areaCodeList] = item
      const areaList = areaCodeList.map((code) => ({
        name: code,
        label: AreaDictionaly[code]
      }))

      return {
        groupName,
        areaList
      }
    })
  }, [])

  const classes = useStyles()

  return (
    <Menu {...menuProps} checkedValues={checkedValues} onCheckedValueChange={onChange}>
      <MenuTrigger>
        <MenuButton icon={icon} appearance={appearance}>
          <span style={menuButtonTextStyle}>{visibleLabel}</span>
        </MenuButton>
      </MenuTrigger>
      <MenuPopover className={classes.popover}>
        <MenuList className={classes.menuList}>
          <MenuGroup className={classes.rootMenuGroup}>
            <MenuItemRadio name="name" value="" className={classes.allMenuItem}>
              すべて
            </MenuItemRadio>

            <MenuDivider />

            <MenuGroup className={classes.areaMenuGroup}>
              {groupedAreaList.map(({ groupName, areaList }, index) => (
                <>
                  {index > 0 ? <div className={classes.divider} /> : <></>}
                  <GroupedAreaMenuGroup key={groupName} groupName={groupName} areaList={areaList} />
                </>
              ))}
            </MenuGroup>
          </MenuGroup>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
