import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components'
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

function App(): JSX.Element {
  const classes = useStyles()

  const { settings } = useSettings()
  const { systemTheme } = useSystemTheme()
  const themeName =
    settings?.theme != null && settings.theme != 'system' ? settings.theme : systemTheme
  const theme = themeName === 'dark' ? webDarkTheme : webLightTheme

  return (
    <FluentProvider theme={theme}>
      <div className={classes.root}>{settings == null ? <></> : <MainLayout />}</div>
    </FluentProvider>
  )
}

export default App
