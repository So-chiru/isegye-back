// 

import cheerio, { CheerioAPI } from 'cheerio'
import fetch from 'node-fetch'

import { RankSongData } from '@/types/rank'

interface VIBEArtist {
  artistId: number
  artistName: string
  isGroup: boolean
  imageUrl: string
  shareUrl: string
  likeCount: number
}

interface VIBETrackItem {
  trackId: number
  trackTitle: string
  represent: boolean
  discNumber: number
  trackNumber: number
  artistTotalCount: number
  artists: VIBEArtist[]
  rank: {
    currentRank: number,
    rankVariation: number,
    isNew: boolean
  }
  // TOO many wak
}

interface VIBEChartAPI {
  id: string
  type: string
  code: string
  description: string
  title: string
  emojiCode: string
  chartDate: string
  date: number
  duration: string
  chartTotalCount: number
  itemType: string
  items: {
    trackTotalCount: number
    tracks: VIBETrackItem[]
  }
}

interface VIBEAPI {
  response: {
    result: {
      chart: VIBEChartAPI
    }
  }
}

const parseChart = (data: VIBEAPI, t: string) => {
  const result: RankSongData[] = []

  data.response.result.chart.items.tracks.map((v, i) => {
    const id = v.trackId
    const rank = v.rank.currentRank
    const title = v.trackTitle
    const artist = v.artists.map((n) => n.artistName).join(', ')

    result.push({
      id,
      rank,
      title,
      artist,
      cname: t
    })
  })

  return result
}

export const top100Realtime = () => {
  return fetch(
    `https://apis.naver.com/vibeWeb/musicapiweb/vibe/v1/chart/track/domestic`
  )
    .then((v) => v.json())
    .then(v => parseChart(v, 'VIBE 급상승'))
}

export const top100Daily = () => {
  return fetch(
    `https://apis.naver.com/vibeWeb/musicapiweb/vibe/v1/chart/track/total`
  )
    .then((v) => v.json())
    .then(v => parseChart(v, 'VIBE 오늘 Top 100'))
}
