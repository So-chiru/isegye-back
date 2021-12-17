import { RankSongData } from './types/rank'

const MELON_ID = [34421197, 34421198]

export const filterMelonIsedolId = (data: RankSongData[]) => {
  return data.filter((v) => MELON_ID.includes(v.id))
}

const BUGS_ID = [32416798, 32416799]

export const filterBugsIsedolId = (data: RankSongData[]) => {
  return data.filter((v) => BUGS_ID.includes(v.id))
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
