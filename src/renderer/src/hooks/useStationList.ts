import { useQuery } from '@tanstack/react-query'
import { StationInfo } from 'src/shared/types'

export const useStationList = (areaId: string) => {
  console.log(areaId)
  const { isFetching, data: stationList } = useQuery({
    queryKey: ['stationList', areaId],
    queryFn: async (): Promise<StationInfo[]> =>
      window.electron.ipcRenderer.invoke('getStationList', areaId),
    initialData: [],
    refetchInterval: Infinity
  })

  return {
    isFetching,
    stationList
  }
}
