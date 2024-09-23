import { useQuery } from '@tanstack/react-query'
import { StationWithProgram } from 'src/shared/types'

export const useStationProgramList = (areaId: string) => {
  const { isFetching, data: stationProgramList } = useQuery({
    queryKey: ['stationProgramList', areaId],
    queryFn: async (): Promise<StationWithProgram[]> =>
      window.electron.ipcRenderer.invoke('getStationProgramList', areaId),
    initialData: [],
    refetchInterval: Infinity
  })

  return {
    isFetching,
    stationProgramList
  }
}
