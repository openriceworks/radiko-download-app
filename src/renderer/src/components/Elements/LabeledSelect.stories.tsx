import type { Meta, StoryObj } from '@storybook/react'

import LabeledSelect from './LabeledSelect'
import { DecoratorsHelper } from '../../util/storybook'

const meta = {
  title: 'Elements/LabeledSelect',
  component: LabeledSelect,
  decorators: [
    DecoratorsHelper
  ],
  parameters: {},
  tags: []
} satisfies Meta<typeof LabeledSelect>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'ラベル',
    children: (
      <>
        <option value="a">a</option>
        <option value="b">b</option>
        <option value="c">c</option>
      </>
    )
  }
}
