import { Input, InputProps, Label, makeStyles, shorthands, useId } from '@fluentui/react-components'

// https://react.fluentui.dev/?path=/docs/components-input--default#default
const useStyles = makeStyles({
  root: {
    // Stack the label above the field
    display: 'flex',
    flexDirection: 'column',
    // Use 2px gap below the label (per the design system)
    ...shorthands.gap('2px'),
    // Prevent the example from taking the full width of the page (optional)
    maxWidth: '200px',
    textAlign: 'start'
  }
})

function LabeledInput(props: InputProps & { label: string }): JSX.Element {
  const inputId = useId('input')
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Label htmlFor={inputId} size={props.size} disabled={props.disabled}>
        {props.label}
      </Label>
      <Input id={inputId} {...props} />
    </div>
  )
}

export default LabeledInput
