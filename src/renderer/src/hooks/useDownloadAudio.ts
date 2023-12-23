import * as ReactQuery from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { DownloadResult, ProgramForCard } from 'src/shared/types'

export const useDownloadAudio = (program: ProgramForCard) => {
  const [enabled, setEnabled] = useState(false)

  const downloadAudio = async () => {
    const isStarted = await window.electron.ipcRenderer.invoke('downloadAudio', program)
    setEnabled(isStarted)
  }

  const { data: downloadResult, refetch } = ReactQuery.useQuery<Partial<DownloadResult>>({
    enabled,
    queryKey: ['downloadProgress', program.stationId, program.ft],
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

  useEffect(() => {
    if (!enabled) {
      if (
        downloadResult.progress != null &&
        0 < downloadResult.progress &&
        downloadResult.progress < 100
      ) {
        setEnabled(true)
      }
    }
  }, [downloadResult])

  return {
    downloadAudio,
    getProgress: refetch,
    result: downloadResult
  }
}
