import { auth, get, set } from '@upstash/redis'
import { ChartData, ChartDatasAPI, DataTypeKey } from './types/rank'

auth(process.env.REDIS_ENDPOINT, process.env.REDIS_PASS)

export const append = async (key: string, data: ChartData) => {
  const existKey = await get(key)
  if (existKey.error) {
    return existKey
  }

  let results: ChartData[] = []

  if (existKey.data !== null) {
    results = JSON.parse(existKey.data)
  }

  results = results.filter((v) => v.date !== data.date)
  results.push(data)

  return set(key, JSON.stringify(results))
}

export const setCurrentData = async (data: ChartData, t: DataTypeKey) => {
  const existKey = await get('chartDatas')
  if (existKey.error) {
    return existKey
  }

  let results: Partial<ChartDatasAPI> = {}

  if (existKey.data !== null) {
    results = JSON.parse(existKey.data)
  }

  if (!results.current) {
    results.current = {
      hourly: undefined,
      daily: undefined,
      updateAt: Date.now(),
    }
  }

  if (t === 'hourly') {
    results.current!.hourly = data
  } else if (t === 'daily') {
    results.current!.daily = data
  }

  return set('chartDatas', JSON.stringify(results))
}

export const appendChart = async (data: Partial<ChartDatasAPI>) => {
  const existKey = await get('chartDatas')

  if (existKey.error) {
    return existKey
  }

  let result: Partial<ChartDatasAPI> = {}

  if (existKey.data !== null) {
    result = existKey.data
  }

  const keys = Object.keys(data)

  keys.forEach((key) => {
    const kd = key as keyof ChartDatasAPI
    data[kd]!.updateAt = Date.now()

    // @ts-ignore
    result[kd] = data[kd]
  })

  result = Object.assign({}, result, data)

  return set('chartDatas', JSON.stringify(result))
}
