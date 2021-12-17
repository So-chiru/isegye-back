import { config } from 'dotenv'
config()

import cron from 'node-cron'

import * as tasks from './tasks'

cron.schedule(`${new Array(30).fill(0).map((v, i) => i * 2).join(',')} * * * *`, () => {
  console.log('running task - two minute')

  tasks.twoMinute()
})

cron.schedule(`0 ${new Array(24).fill(0).map((v, i) => i).join(',')} * * *`, () => {
  console.log('running task - hour')

  tasks.hour()
})

