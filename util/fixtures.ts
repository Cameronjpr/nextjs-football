import { format } from "date-fns"
import { Fixture, Gameweek } from "../components/Fixture.types"

export const groupFixturesByDate = (fixtures: Fixture[]): Gameweek[] => {
  const dates: Gameweek[] = []

  fixtures.forEach((f) => {
    const date = format(new Date(f.kickoff_time), 'P')
    const idx = dates.findIndex((d) => d.date === date)
    if (idx >= 0) {
      dates[idx].fixtures.push(f)
    } else {
      dates.push({
        date: date,
        fixtures: [f],
      })
    }
  })

  return dates
}