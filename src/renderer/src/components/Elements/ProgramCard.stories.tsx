import type { Meta, StoryObj } from '@storybook/react'

import ProgramCard, { ProgramCardProps } from './ProgramCard'
import { DecoratorsHelper } from '../../util/storybook'

const meta = {
  title: 'Elements/ProgramCard',
  component: ProgramCard,
  decorators: [DecoratorsHelper],
  parameters: {},
  tags: []
} satisfies Meta<typeof ProgramCard>

export default meta

type Story = StoryObj<typeof meta>

const downloadResultMap: Record<string, ProgramCardProps['downloadResult']> = {
  NO_DOWNLOAD: {},
  DOWNLOADING: {
    path: '~/Downloads/AAA.wav',
    progress: 33,
    downloadDate: null
  },
  DOWNLOAD_COMPLETE: {
    path: '~/Downloads/AAA.wav',
    progress: 100,
    downloadDate: '20240403123456'
  }
}

export const Default: Story = {
  args: {
    program: {
      programId: 'id',
      ft: '20240401010000',
      to: '20240401013000',
      title:
        '未来都市放送局プレゼンツ: タイムワープ・エクスプローラー・ラジオ - 時空を越える冒険と音楽の旅',
      info: '',
      imgPath: 'https://source.unsplash.com/320x200',
      stationId: 'MFC',
      stationName: '未来都市放送局'
    },
    downloadResult: downloadResultMap['NO_DOWNLOAD']
  },
  argTypes: {
    downloadResult: {
      options: Object.keys(downloadResultMap),
      mapping: downloadResultMap
    }
  }
}
