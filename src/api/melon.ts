import cheerio, { CheerioAPI } from 'cheerio'
import fetch from 'node-fetch'

import { RankSongData } from '@/types/rank'
import { getTimestamp } from '../utils'

const parseChart = ($: CheerioAPI, t: string) => {
  const result: RankSongData[] = []

  $('.service_list_song tbody tr').each((i, e) => {
    const id = Number($(e).attr('data-song-no')!)
    const rank = Number($(e).find('.rank').text())
    const title = $(e).find('.wrap_song_info .ellipsis.rank01').text().trim()
    const artist = $(e)
      .find('.wrap_song_info .ellipsis.rank02 .checkEllipsis')
      .text()
      .trim()

    result.push({
      id,
      title,
      artist,
      rank,
      cname: t
    })
  })

  return result
}

interface GuysomeChartData {
  melon: number
  date: number
  songname: string
  artist: string
  currank: number
}

interface GuysomeAPI {
  chartTime: string
  year: number
  month: number
  date: number
  hour: number
  data: GuysomeChartData[]
}

interface GuysomeRootAPI {
  pageProps: GuysomeAPI
}

// https://가이섬.com/_next/data/4GilucH_wzWeuRq8mmei6/melon/realchart/chart.json?year=2021&month=12&date=17&hour=19
const guysomeParseChart = (data: GuysomeRootAPI) => {
  const result: RankSongData[] = []

  data.pageProps.data.map(v => {
    const id = v.melon
    const title = v.songname
    const artist = v.artist
    const rank = v.currank

    result.push({
      id,
      title,
      artist,
      rank,
      cname: '멜론 실시간 차트'
    })
  })

  return result
}

export const top100Realtime = () => {
  const ts = getTimestamp()

  return fetch(
    `https://가이섬.com/_next/data/4GilucH_wzWeuRq8mmei6/melon/realchart/chart.json?year=20${ts.substring(
      0,
      2
    )}&month=${ts.substring(2, 4)}&date=${ts.substring(4,6)}&hour=${ts.substring(6,8)}`
  )
    .then(v => v.json())
    .then(guysomeParseChart)
}

top100Realtime()

export const top10024H = () => {
  return fetch(`https://www.melon.com/chart/index.htm`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(v => parseChart(v, '멜론 Top 100'))
}


export const top100Daily = () => {
  return fetch(`https://www.melon.com/chart/day/index.htm?classCd=GN0000`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(v => parseChart(v, '멜론 일간'))
}

export const top100Weekly = () => {
  return fetch(`https://www.melon.com/chart/week/index.htm`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(v => parseChart(v, '멜론 주간'))
}
