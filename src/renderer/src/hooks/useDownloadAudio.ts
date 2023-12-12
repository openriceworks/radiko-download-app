import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { DownloadResult, ProgramForCard } from 'src/shared/types'

export const useDownloadAudio = (program: ProgramForCard) => {
  const [enabled, setEnabled] = useState(false)

  const downloadAudio = async () => {
    await window.electron.ipcRenderer.invoke('downloadAudio', program)
    setEnabled(true)
  }

  const { data: downloadResult } = useQuery<Partial<DownloadResult>>({
    enabled,
    queryKey: ['downloadProgress', program.stationId, program.ft, enabled],
    queryFn: async (context) => {
      return window.electron.ipcRenderer.invoke('getProgress', program).then((res) => res ?? {})
    },
    initialData: {},
    refetchInterval: ({ state }) => {
      if (state.data == null || state.data.path == null) {
        return 100
      }
      return Infinity
    }
  })

  return {
    downloadAudio,
    result: downloadResult
  }
}
