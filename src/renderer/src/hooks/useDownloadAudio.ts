import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ProgramForCard } from 'src/shared/types'

export const useDownloadAudio = () => {
  const [progressId, setProgressId] = useState<string | undefined>()

  const downloadAudio = async (program: ProgramForCard) => {
    const key = await window.electron.ipcRenderer.invoke('downloadAudio', program)
    setProgressId(key)
  }

  const { data: progress } = useQuery({
    queryKey: ['downloadProgress', progressId],
    queryFn: async (context) => {
      const key = context.queryKey[1]
      if (key != null) {
        return window.electron.ipcRenderer.invoke('getProgress', key)
      }
      return undefined
    },
    initialData: 0,
    refetchInterval: ({ queryKey, state }) => {
      if (queryKey[1] != null && state.data < 100) {
        return 100
      }
      return Infinity
    }
  })

  return {
    downloadAudio,
    progress,
    isDownloading: progressId != null && progress < 100
  }
}
