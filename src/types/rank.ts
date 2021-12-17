export interface AppendData {
  date: string
  [key: string]: unknown
}

export interface RankSongData {
  id: number
  rank: number
  title: string
  artist: string
  cname?: string
}

export interface ChartData {
  providers: {
    [key: string]: RankSongData[]
  }
  date: string
}

export type DataTypeKey = 'hourly' | 'daily'

export interface ChartDatasAPI {
  current: {
    hourly?: ChartData
    daily?: ChartData,
    updateAt: number
  },
  top: {
    hourly?: ChartData
    daily?: ChartData,
    updateAt: number
  },
  history: {
    hourly?: ChartData[]
    daily?: ChartData[],
    updateAt: number
  }
}
