import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components'
import { makeStyles, tokens } from '@fluentui/react-components'
import MainLayout from './components/Layout/MainLayout'
import { useSystemTheme } from './hooks/useSystemTheme'

const useStyles = makeStyles({
  root: {
    maxWidth: '1080px',
    height: '100lvh',
    marginTop: '0',
    marginBottom: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center'
  }
})

const useRootStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground2
  }
})

function App(): JSX.Element {
  const classes = useStyles()
  const rootClasses = useRootStyles()

  const { systemTheme } = useSystemTheme()
  const theme = systemTheme === 'dark' ? webDarkTheme : webLightTheme

  return (
    <FluentProvider theme={theme}>
      <div className={rootClasses.root}>
        <div className={classes.root}>
          <MainLayout />
        </div>
      </div>
    </FluentProvider>
  )
}

export default App
