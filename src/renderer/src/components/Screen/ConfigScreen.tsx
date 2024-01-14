import {
  Radio,
  RadioGroup,
  Title3,
  makeStyles,
  Caption1,
  Body2,
  Body1
} from '@fluentui/react-components'
import { ScreenBaseProps } from '.'
import { useSettings } from '@renderer/hooks/useSettings'
import { useSystemTheme } from '@renderer/hooks/useSystemTheme'
import DangerCompoundButton from '../Elements/DangerCompoundButton'
import { ThemeType } from 'src/shared/types'
import { ReactNode, useState } from 'react'
import ConfirmDialog from '../Elements/ConfirmDialog'

interface Props extends ScreenBaseProps {}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    rowGap: '0.5rem'
  }
})

const useSectionStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    columnGap: '0.25rem'
  }
})

function SectionBase(props: { title: string; children: ReactNode }) {
  const sectionClasses = useSectionStyles()

  return (
    <>
      <Title3> {props.title} </Title3>
      <div className={sectionClasses.root}>{props.children}</div>
    </>
  )
}

function ThemeSection(props: { value: ThemeType; onChange: (value: ThemeType) => void }) {
  const { systemTheme } = useSystemTheme()
  const systemThemeLabel = systemTheme === 'dark' ? 'ダーク' : 'ライト'

  const themeList = [
    {
      label: (
        <div>
          システム
          <br />
          <Caption1>({systemThemeLabel})</Caption1>
        </div>
      ),
      value: 'system'
    },
    { label: <div>ライト</div>, value: 'light' },
    { label: <div>ダーク</div>, value: 'dark' }
  ]

  const RadioList = () =>
    themeList.map((item) => {
      return <Radio key={item.value} value={item.value} label={item.label}></Radio>
    })

  return (
    <SectionBase title="テーマ">
      <RadioGroup
        value={props.value}
        onChange={(_, data) => props.onChange(data.value as ThemeType)}
        layout="horizontal"
      >
        {<RadioList />}
      </RadioGroup>
    </SectionBase>
  )
}

function ResetSection(props: { onReset: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <SectionBase title="リセット">
      <DangerCompoundButton
        secondaryContent="番組・履歴・設定の情報をリセットします"
        onClick={() => setOpen(true)}
      >
        リセット
      </DangerCompoundButton>

      <ConfirmDialog
        title="リセットしますか?"
        open={open}
        changeOpen={setOpen}
        onYes={props.onReset}
        yesText="リセット"
        noText="キャンセル"
      >
        <Body2>
          このパソコンに記憶した番組情報・ダウンロード履歴・設定を削除してリセットします。
        </Body2>
        <br />
        <Body1>ダウンロードした番組は削除されません。</Body1>
      </ConfirmDialog>
    </SectionBase>
  )
}

export default function ConfigScreen(props: Props) {
  const classes = useStyles()

  const { settings, update, reset } = useSettings()

  const onChangeTheme = (value) =>
    update({
      ...settings,
      theme: value
    })

  const onReset = () => {
    reset()
  }

  // 読み込み終わるまでは表示しない
  if (settings == null) {
    return <div></div>
  }

  return (
    <div className={classes.root} style={{ height: props.screenHeight }}>
      <ThemeSection value={settings.theme} onChange={onChangeTheme} />
      <ResetSection onReset={onReset} />
    </div>
  )
}
