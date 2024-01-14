import {
  Dialog,
  DialogTrigger,
  Button,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@fluentui/react-components'
import { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  open: boolean
  changeOpen: (boolean) => void
  onYes: () => void
  yesText?: string
  noText?: string
}

export default function ConfirmDialog(props: Props) {
  const yesText = props.yesText ?? 'yes'
  const noText = props.noText ?? 'cancel'

  return (
    <Dialog
      open={props.open}
      onOpenChange={(event, data) => props.changeOpen(data.open)}
      modalType="alert"
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent>{props.children}</DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">{noText}</Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={props.onYes}>
              {yesText}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
