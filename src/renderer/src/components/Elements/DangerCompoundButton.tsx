import {
  CompoundButton,
  CompoundButtonProps,
  makeStyles,
  shorthands,
  tokens
} from '@fluentui/react-components'
import { DeleteRegular } from '@fluentui/react-icons'

const useStyle = makeStyles({
  root: {
    backgroundColor: tokens.colorStatusDangerBackground1,
    color: tokens.colorStatusDangerForeground1,
    ...shorthands.borderColor(tokens.colorStatusDangerBorder1),
    ':hover': {
      // hover用の色が定義されていなかったので2で代用
      backgroundColor: tokens.colorStatusDangerBackground2,
      color: tokens.colorStatusDangerForeground1,
      ...shorthands.borderColor(tokens.colorStatusDangerBorder1)
    },
    ':active': {
      // active用の色が定義されていなかったので代用
      backgroundColor: tokens.colorStatusDangerForegroundInverted + ' !important',
      color: tokens.colorStatusDangerForeground1 + ' !important',
      ...shorthands.borderColor(tokens.colorStatusDangerBorderActive)
    }
  },
  secodaryContent: {
    backgroundColor: 'transparent',
    color: tokens.colorStatusDangerForeground1
  }
})

export default function DangerCompoundButton(props: CompoundButtonProps) {
  const classes = useStyle()

  const SecondaryContent = () => {
    // eslint-disable-next-line react/prop-types
    const { secondaryContent } = props
    if (secondaryContent != null && typeof secondaryContent === 'string') {
      return <span className={classes.secodaryContent}>{secondaryContent}</span>
    }
    return undefined
  }

  return (
    <CompoundButton
      icon={<DeleteRegular />}
      className={classes.root}
      {...props}
      secondaryContent={<SecondaryContent />}
    ></CompoundButton>
  )
}
