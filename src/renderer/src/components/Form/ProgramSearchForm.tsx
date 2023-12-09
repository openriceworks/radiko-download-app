import { Search24Regular } from '@fluentui/react-icons'
import dayjs from 'dayjs'
import LabeledSelect from '../Elements/LabeledSelect'
import LabeledInput from '../Elements/LabledInput'
import { makeStyles, shorthands } from '@fluentui/react-components'
import { SearchParam, StationWithProgram } from 'src/shared/types'


interface Props {
  stationList: StationWithProgram[]
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
  const programMap = props.stationList[0]?.programMap ?? {}
  const optionList = Object.keys(programMap).map((date) => (
    <option key={date} value={date}>
      {dayjs(date).format('MM月DD日')}
    </option>
  ))

  const setKeyword = (keyword: string) => {
    props.setValue({
      keyword,
      date: props.value.date
    })
  }

  const setDate = (date: string) => {
    props.setValue({
      keyword: props.value.keyword,
      date
    })
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <LabeledInput
        label="キーワード"
        contentBefore={<Search24Regular />}
        value={props.value.keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <LabeledSelect
        label="日付"
        value={props.value.date}
        onChange={(e) => setDate(e.target.value)}
        defaultValue=""
      >
        <option value=""></option>
        {optionList}
      </LabeledSelect>
    </div>
  )
}

export default ProgramSearchForm
