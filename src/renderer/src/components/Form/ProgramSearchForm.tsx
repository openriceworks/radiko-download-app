import {
  CalendarDate24Regular,
  Map24Regular,
  Search24Regular,
  SoundWaveCircle20Regular
} from '@fluentui/react-icons'
import dayjs from 'dayjs'
import { Input, makeStyles, tokens } from '@fluentui/react-components'
import { SearchParam, StationInfo, StationWithProgram } from 'src/shared/types'
import { AreaDictionaly } from '../../../../shared/constant/area'
import { ReactNode } from 'react'
import MenuSelect from '../Elements/MenuSelect'

interface Props {
  stationsList: StationInfo[]
  stationProgramList: StationWithProgram[]
  value: SearchParam
  setValue: (SearchParam) => void

  suffixContainer?: ReactNode
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalM,
    textAlign: 'start'
  }
})

const ProgramSearchForm = (props: Props) => {
  const stationList = props.stationsList.map((station) => {
    return {
      name: station.stationId,
      label: station.stationName
    }
  })

  const areaList = Object.entries(AreaDictionaly).map(([areaCode, areaName]) => {
    return {
      name: areaCode,
      label: areaName
    }
  })

  const programMap = props.stationProgramList[0]?.programMap ?? {}
  const dateList = Object.keys(programMap).map((date) => {
    return {
      name: date,
      label: dayjs(date).format('MM月DD日')
    }
  })

  const setValue = (key: keyof SearchParam, value: string) => {
    props.setValue({
      ...props.value,
      [key]: value
    })
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Input
        placeholder="キーワード"
        contentBefore={<Search24Regular />}
        value={props.value.keyword}
        onChange={(e) => setValue('keyword', e.target.value)}
      />

      <hr />

      <MenuSelect
        placeholder="放送日"
        icon={<CalendarDate24Regular />}
        value={props.value.date}
        onValueChange={(value) => setValue('date', value)}
        list={dateList}
      />

      <MenuSelect
        placeholder="地域"
        icon={<Map24Regular />}
        value={props.value.areaId}
        onValueChange={(value) => setValue('areaId', value)}
        list={areaList}
      />

      <MenuSelect
        placeholder="放送局"
        icon={<SoundWaveCircle20Regular />}
        value={props.value.stationId}
        onValueChange={(value) => setValue('stationId', value)}
        list={stationList}
      />

      <div style={{ flexGrow: '1' }}>{props.suffixContainer}</div>
    </div>
  )
}

export default ProgramSearchForm
