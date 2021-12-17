import cheerio, { CheerioAPI } from 'cheerio'
import fetch from 'node-fetch'

import { RankSongData } from '@/types/rank'

const parseChart = ($: CheerioAPI) => {
  const result: RankSongData[] = []

  $('.trackList tbody tr').each((i, e) => {
    const id = Number($(e).attr('trackid')!)
    const rank = Number($(e).find('.ranking strong').text())
    const title = $(e).find('.title').text().trim()
    const artist = $(e).find('.artist').text().trim()

    result.push({
      id,
      title,
      artist,
      rank,
    })
  })

  return result
}

export const top100Realtime = () => {
  return fetch(`https://music.bugs.co.kr/chart/track/realtime/total`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(parseChart)
}

export const top100Daily = () => {
  return fetch(`https://music.bugs.co.kr/chart/track/day/total`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(parseChart)
}

export const top100Weekly = () => {
  return fetch(`https://music.bugs.co.kr/chart/track/week/total`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(parseChart)
}
