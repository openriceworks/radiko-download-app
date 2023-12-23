import { Search24Regular } from '@fluentui/react-icons'
import dayjs from 'dayjs'
import LabeledSelect from '../Elements/LabeledSelect'
import LabeledInput from '../Elements/LabledInput'
import { makeStyles, shorthands } from '@fluentui/react-components'
import { SearchParam, StationInfo, StationWithProgram } from 'src/shared/types'

interface Props {
  stationsList: StationInfo[]
  stationProgramList: StationWithProgram[]
  value: SearchParam
  setValue: (SearchParam) => void
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    ...shorthands.gap('4px'),
    textAlign: 'start'
  }
})

const ProgramSearchForm = (props: Props) => {
  const stationOptionList = props.stationsList.map((station) => (
    <option key={station.stationId} value={station.stationId}>
      {station.stationName}
    </option>
  ))

  const programMap = props.stationProgramList[0]?.programMap ?? {}
  const dateOptionList = Object.keys(programMap).map((date) => (
    <option key={date} value={date}>
      {dayjs(date).format('MM月DD日')}
    </option>
  ))

  const setValue = (key: keyof SearchParam, value: string) => {
    props.setValue({
      ...props.value,
      [key]: value
    })
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <LabeledInput
        label="キーワード"
        contentBefore={<Search24Regular />}
        value={props.value.keyword}
        onChange={(e) => setValue('keyword', e.target.value)}
      />
      <LabeledSelect
        label="日付"
        value={props.value.date}
        onChange={(e) => setValue('date', e.target.value)}
        defaultValue=""
      >
        <option value="">すべて</option>
        {dateOptionList}
      </LabeledSelect>
      <LabeledSelect
        label="放送局"
        value={props.value.stationId}
        onChange={(e) => setValue('stationId', e.target.value)}
        defaultValue=""
      >
        <option value="">すべて</option>
        {stationOptionList}
      </LabeledSelect>
    </div>
  )
}

export default ProgramSearchForm
