import * as ReactQuery from '@tanstack/react-query'
import { DownloadHistory } from 'src/shared/types'

export const useHistoryList = () => {
  const {
    isFetching,
    data: historyList,
    refetch
  } = ReactQuery.useQuery({
    queryKey: ['historyList'],
    queryFn: async (): Promise<DownloadHistory[]> =>
      window.electron.ipcRenderer.invoke('getHistoryList'),
    initialData: [],
    refetchInterval: ({ state }) => {
      if (state.data == null || state.data.some((history) => history.progress < 100)) {
        return 500
      }

      return Infinity
    }
  })

  return {
    isFetching,
    historyList,
    getHistoryList: refetch
  }
}
