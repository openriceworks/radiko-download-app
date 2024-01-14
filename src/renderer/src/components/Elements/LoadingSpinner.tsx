import { Spinner, makeStyles } from '@fluentui/react-components'

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default function LoadingSpinner(props: { label: string }): JSX.Element {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Spinner labelPosition="before" label={props.label} />
    </div>
  )
}
