import cheerio, { CheerioAPI } from 'cheerio'
import fetch from 'node-fetch'

import { RankSongData } from '@/types/rank'

interface FLOArtist {
  id: number
  name: string
  type: string
}

interface FLOTrackData {
  id: number
  name: string
  updateDateTime: string
  representationArtist: FLOArtist
  artistList: FLOArtist[]
  album: unknown
  rank: {
    newYn: 'Y' | 'N'
    rankBadge: number
  }
}

interface FLORootAPIData {
  type: string
  name: string
  trackList: FLOTrackData[]
  basedOnUpdate: string
}

interface FLOAPI {
  code: string
  data: FLORootAPIData
  traceId: string
}

const parseChart = (data: FLOAPI) => {
  const result: RankSongData[] = []

  data.data.trackList.map((v, i) => {
    const id = v.id
    const rank = i + 1
    const title = v.name
    const artist = v.artistList.map((n) => n.name).join(', ')

    result.push({
      id,
      rank,
      title,
      artist,
    })
  })

  return result
}

export const top100Daily = () => {
  return fetch(
    `https://www.music-flo.com/api/display/v1/browser/chart/1/track/list?size=100`
  )
    .then((v) => v.json())
    .then(parseChart)
}

export const top100Weekly = () => {
  return fetch(
    `https://www.music-flo.com/api/display/v1/browser/chart/2/track/list?size=100`
  )
    .then((v) => v.json())
    .then(parseChart)
}
