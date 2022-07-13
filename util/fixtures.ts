import { format } from "date-fns"
import { Fixture, Gameweek, Matchday } from "../components/Fixture/Fixture.types"

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

export const getSelectionFixtureInGameweek = (gw: any, selection: number) => {
  const fixture = gw.filter((f: any) => {
    console.log(selection)
    return f.team_a == selection || f.team_h == selection
  })

  return fixture
}

export const getResultFromFixture = (f: any, selection: number) => {
  console.log(f.team_h_score > f.team_a_score)
  if (f.team_h_score === f.team_a_score) return 'draw'

  if (selection === f.team_h) {
    if (f.team_h_score > f.team_a_score) return 'win'
    else return 'loss'
  } 

  if (selection === f.team_a) {
    if (f.team_a_score > f.team_h_score) return 'win'
    else return 'loss'
  }
}