import {
  Menu,
  MenuButton,
  MenuGroup,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuProps,
  MenuTrigger,
  Slot,
  tokens
} from '@fluentui/react-components'
import { useCallback, useMemo } from 'react'

export interface MenuSelectProps extends Omit<MenuProps, 'children'> {
  placeholder: string
  icon?: Slot<'span'>
  value: string
  onValueChange: (string) => void
  emptyValueLabel?: string
  list: {
    name: string
    label: string
  }[]
}

export default function MenuSelect({
  placeholder,
  icon,
  value,
  onValueChange,
  emptyValueLabel,
  list,
  ...menuProps
}: MenuSelectProps) {
  // 空文字は予約しているので使えない
  if (list.some((item) => item.name === '')) {
    throw Error('Invalid list.')
  }

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

  const selected = useMemo(() => list.some((item) => item.name === value), [list, name])
  const menuButtonTextStyle = useMemo(() => {
    return {
      fontWeight: selected ? tokens.fontFamilyBase : tokens.fontWeightRegular
    }
  }, [selected])

  const visibleLabel = useMemo(() => {
    const found = list.find((item) => item.name === value)
    return found?.label ?? placeholder
  }, [placeholder, list, value])

  return (
    <Menu {...menuProps} checkedValues={checkedValues} onCheckedValueChange={onChange}>
      <MenuTrigger>
        <MenuButton icon={icon}>
          <span style={menuButtonTextStyle}>{visibleLabel}</span>
        </MenuButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuGroup>
            <MenuItemRadio name="name" value="">
              {emptyValueLabel ?? 'すべて'}
            </MenuItemRadio>
            {list.map((item) => (
              <MenuItemRadio key={item.name} name="name" value={item.name}>
                {item.label}
              </MenuItemRadio>
            ))}
          </MenuGroup>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
