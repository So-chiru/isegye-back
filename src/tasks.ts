import * as melon from './api/melon'
import * as bugs from './api/bugs'
import { filterBugsIsedolId, filterMelonIsedolId, getTimestamp } from './utils'

import * as db from './db'
import { ChartData } from './types/rank'

const buildTopDatabase = async () => {
  const M_realtime = await melon.top100Realtime()
  const M_filteredRealtime = filterMelonIsedolId(M_realtime)

  const B_realtime = await bugs.top100Realtime()
  const B_filteredRealtime = filterBugsIsedolId(B_realtime)

  const current: ChartData = {
    providers: {
      melon: M_filteredRealtime,
      bugs: B_filteredRealtime,
    },
    date: getTimestamp(),
  }

  const key = current.date.substring(0, 8)

  console.log(`Writing records,`, current)

  const result = await db.append(`r.${key}`, current)
  await db.setCurrentData(current, 'hourly')

  if (result.error) {
    console.log(`Error occurred : ${result.error}`)
  }
}

const buildHourlyTopDatabase = async () => {
  const m_daily = await melon.top100Daily()
  const M_filteredDaily = filterMelonIsedolId(m_daily)

  const b_daily = await bugs.top100Daily()
  const B_filteredDaily = filterBugsIsedolId(b_daily)

  const hourly = {
    providers: {
      melon: M_filteredDaily,
      bugs: B_filteredDaily,
    },
    date: getTimestamp(),
  }

  const key = hourly.date.substring(0, 6)

  console.log(`Writing hourly records,`, hourly)

  const result = await db.append(`d.${key}`, hourly)
  await db.setCurrentData(hourly, 'daily')

  if (result.error) {
    console.log(`Error occurred : ${result.error}`)
  }
}

// const buildDailyTopDatabase = async () => {
//   const m_weekly = await melon.top100Weekly()
//   const M_filteredWeekly = filterMelonIsedolId(m_weekly)

//   const b_weekly = await bugs.top100Weekly()
//   const B_filteredWeekly = filterBugsIsedolId(b_weekly)

//   const hourly = {
//     providers: {
//       melon: M_filteredWeekly,
//       bugs: B_filteredWeekly,
//     },
//     date: getTimestamp(),
//   }

//   const key = hourly.date.substring(0, 6)

//   console.log(`Writing hourly records,`, hourly)

//   const result = await db.append(`h.${key}`, hourly)

//   if (result.error) {
//     console.log(`Error occurred : ${result.error}`)
//   }
// }

const buildChartAPICache = async (hourly: boolean) => {
  
}

/**
 * 2분 마다 실행하는 작업을 정의합니다. (절대적임. EX: 1시 2분, 1시 4분... 1시 58분)
 */
export const twoMinute = async () => {
  await buildTopDatabase()
  await buildChartAPICache(false)
}

/**
 * 매 시간마다 실행하는 작업을 정의합니다.
 */
export const hour = async () => {
  await buildHourlyTopDatabase()
  await buildChartAPICache(true)
}

// export const daily = async () => {
//   await buildDailyTopDatabase()
//   await buildChartAPICache(true)
// }
