import cheerio, { CheerioAPI } from 'cheerio'
import fetch from 'node-fetch'

import { RankSongData } from '@/types/rank'

const externalParseChart = ($: CheerioAPI) => {
  const result: RankSongData[] = []

 $('.container .sortable tbody tr').each((i, e) => {
    const id = 0
   const rank = Number($(e).find('td:first-child').text())

   const ta = $(e).find('td.text').text().trim().split(' - ')

    const title = ta[1]
    const artist = ta[0]

    result.push({
      id,
      title,
      artist,
      rank,
    })
  })

  return result
}


const parseChart = ($: CheerioAPI) => {
  const result: RankSongData[] = []

 $('.songs-list .songs-list-row').each((i, e) => {
    const id = Number($(e).attr('data-song-no')!)
    const rank = Number($(e).find('.songs-list-row__rank').text())
    const title = $(e).find('.songs-list-row__song-name').text().trim()
    const artist = $(e)
      .find('.songs-list__col--artist .songs-list-row__link')
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
  return fetch(`https://kworb.net/charts/apple_s/kr.html`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(externalParseChart)
}

export const top100Daily = () => {
  return fetch(`https://music.apple.com/kr/playlist/%EC%98%A4%EB%8A%98%EC%9D%98-top-100-%EA%B8%80%EB%A1%9C%EB%B2%8C/pl.d25f5d1181894928af76c85c967f8f31`)
    .then(async (v) => cheerio.load(await v.text()))
    .then(parseChart)
}