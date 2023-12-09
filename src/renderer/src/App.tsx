import { makeStyles } from '@fluentui/react-components'
import MainLayout from './components/Layout/MainLayout'

const useStyles = makeStyles({
  root: {
    maxWidth: '1080px',
    height: '100lvh',
    marginTop: '0',
    marginBottom: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    color: '#605e5c'
  }
})

function App(): JSX.Element {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MainLayout />
    </div>
  )
}

export default App
