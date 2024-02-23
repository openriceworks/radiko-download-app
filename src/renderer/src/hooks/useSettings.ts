import * as ReactQuery from '@tanstack/react-query'
import { useEffect } from 'react'
import { Settings } from 'src/shared/types'

const mutationFn = async (settings: Settings) => {
  await window.electron.ipcRenderer.invoke('setSettings', settings)
}
const queryFn = async (): Promise<Settings> =>
  await window.electron.ipcRenderer.invoke('getSettings')

export const useSettings = () => {
  const { data: settings, refetch } = ReactQuery.useQuery({
    queryKey: ['settings'],
    queryFn
  })

  const { mutate, isPending } = ReactQuery.useMutation({
    mutationKey: ['settings'],
    mutationFn,
    onSuccess: () => {
      refetch()
    }
  })

  const update = (settings: Settings) => {
    mutate(settings)
  }

  useEffect(() => {
    if (settings == null) {
      refetch
    }
  }, [])

  const reset = async () => {
    await window.electron.ipcRenderer.invoke('resetSettings')
  }

  const openLoginPage = async () => {
    await window.electron.ipcRenderer.invoke('openLoginPage')
  }

  return {
    settings,
    isPending,
    update,
    reset,
    openLoginPage
  }
}
