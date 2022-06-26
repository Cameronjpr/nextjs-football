import { format } from "date-fns"
import { Fixture, Gameweek, Matchday } from "../components/Fixture.types"

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