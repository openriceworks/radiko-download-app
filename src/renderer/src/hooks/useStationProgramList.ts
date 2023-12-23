import { useQuery } from '@tanstack/react-query'
import { StationWithProgram } from 'src/shared/types'

export const useStationProgramList = () => {
  const { isFetching, data: stationProgramList } = useQuery({
    queryKey: ['stationProgramList'],
    queryFn: async (): Promise<StationWithProgram[]> =>
      window.electron.ipcRenderer.invoke('getStationProgramList'),
    initialData: [],
    refetchInterval: Infinity
  })

  return {
    isFetching,
    stationProgramList
  }
}
