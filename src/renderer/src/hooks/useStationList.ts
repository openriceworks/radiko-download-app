import { useQuery } from '@tanstack/react-query'
import { StationInfo } from 'src/shared/types'

export const useStationList = () => {
  const { isFetching, data: stationList } = useQuery({
    queryKey: ['stationList'],
    queryFn: async (): Promise<StationInfo[]> =>
      window.electron.ipcRenderer.invoke('getStationList'),
    initialData: [],
    refetchInterval: Infinity
  })

  return {
    isFetching,
    stationList
  }
}
