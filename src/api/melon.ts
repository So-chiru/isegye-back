import cheerio, { CheerioAPI } from 'cheerio'
import fetch from 'node-fetch'

import { RankSongData } from '@/types/rank'

const parseChart = ($: CheerioAPI) => {
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
    })
  })

  return result
}

export const top100Realtime = () => {
  return fetch(`https://www.melon.com/chart/index.htm`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(parseChart)
}

export const top100Daily = () => {
  return fetch(`https://www.melon.com/chart/day/index.htm?classCd=GN0000`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(parseChart)
}

export const top100Weekly = () => {
  return fetch(`https://www.melon.com/chart/week/index.htm`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(parseChart)
}
