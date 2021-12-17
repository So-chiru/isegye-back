import { RankSongData } from './types/rank'

const MELON_ID = [34421197, 34421198]
const BUGS_ID = [32416798, 32416799]
const FLO_ID = [407131364, 449786135]
const APPLE_TITLE = ['이세계 아이돌']

export const filterMelonIsedolId = (data: RankSongData[]) => {
  return data.filter((v) => MELON_ID.includes(v.id))
}

export const filterBugsIsedolId = (data: RankSongData[]) => {
  return data.filter((v) => BUGS_ID.includes(v.id))
}

export const filterFLOIsedolId = (data: RankSongData[]) => {
  return data.filter((v) => FLO_ID.includes(v.id))
}

export const filterAppleIsedolId = (data: RankSongData[]) => {
  return data.filter((v) => APPLE_TITLE.includes(v.artist))
}

const padding = (a: number) => {
  return `${a < 10 ? '0' : ''}${a}`
}

export const getTimestamp = () => {
  const date = new Date()

  return `${date.getFullYear().toString().substring(2, 4)}${padding(
    date.getMonth() + 1
  )}${padding(date.getDate())}${padding(date.getHours())}${padding(date.getMinutes())}`
}
