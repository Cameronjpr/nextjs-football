import { Fixture, Fixtures } from '@/backend/router'
import { format } from 'date-fns'
import { Matchday } from '../components/Fixture/Fixture.types'

export const groupFixturesByDate = (fixtures: Fixture[]): Matchday[] => {
  const dates: Matchday[] = []

  fixtures.forEach((f) => {
    const date = format(new Date(f.kickoff_time), 'P')
    const idx = dates.findIndex((d) => d.date === date)
    if (idx >= 0) {
      dates[idx].fixtures.push(f)
    } else {
      dates.push({
        gameweekId: f.event,
        date: date,
        fixtures: [f],
      })
    }
  })

  return dates
}

export const getActiveGameweekFromFixtures = (fixtures: Fixtures): number => {
  const firstUnfinishedGame = fixtures.find((f) => {
    return !f.finished && f.event !== null
  })

  console.log(firstUnfinishedGame)

  console.log(fixtures.map((f) => f.event))

  const firstUnfinishedGw = firstUnfinishedGame?.event

  console.log(firstUnfinishedGw)

  if (firstUnfinishedGw === undefined) return 38

  return firstUnfinishedGw
}
