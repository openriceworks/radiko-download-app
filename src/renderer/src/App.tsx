import { FluentProvider, webLightTheme, webDarkTheme, Theme } from '@fluentui/react-components'
import { makeStyles, tokens } from '@fluentui/react-components'
import MainLayout from './components/Layout/MainLayout'
import { useSystemTheme } from './hooks/useSystemTheme'
import { useSettings } from './hooks/useSettings'

const useStyles = makeStyles({
  root: {
    width: '100lvw',
    height: '100lvh',
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground2
  }
})

const changeFontFamily = (theme: Theme) => {
  return {
    ...theme,
    // Segoe Fontにライセンスの問題があるので除外した設定に変更
    fontFamilyBase: "-apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
    fontFamilyMonospace: "Consolas, 'Courier New', Courier, monospace",
    fontFamilyNumeric:
      "Bahnschrift, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif"
  } satisfies Theme
}

function App(): JSX.Element {
  const classes = useStyles()

  const { settings } = useSettings()
  const { systemTheme } = useSystemTheme()
  const themeName =
    settings?.theme != null && settings.theme != 'system' ? settings.theme : systemTheme
  const theme = changeFontFamily(themeName === 'dark' ? webDarkTheme : webLightTheme)

  return (
    <FluentProvider theme={theme}>
      <div className={classes.root}>{settings == null ? <></> : <MainLayout />}</div>
    </FluentProvider>
  )
}

export default App
