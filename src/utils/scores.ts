import { Fixture, Player } from '@/backend/router'
import { User } from '@prisma/client'

// This file makes me doubt my ability as a software engineer

export const getCurrentScores = (
  players: Player[],
  fixtures: Fixture[]
): Player[] => {
  const playersWithScores = players.map((p) => {
    let tally = 0
    if (p?.selections?.length) {
      p.selections.forEach((s, idx) => {
        if (s === -1) return
        // Potential issue here for a double gameweek – think it would grab the first of 2 games played by a team in a GW
        const fixture = getFixtureFromSelectionAndGameweek(
          fixtures,
          s + 1,
          idx + 1
        )
        if (fixture === undefined) return

        const points = getPointsFromFixtureAndSelection(fixture, s + 1)
        if (points === undefined) return
        tally += points
      })
    }
    return {
      ...p,
      score: tally,
    }
  })

  return playersWithScores
}

const getPointsFromFixtureAndSelection = (
  fixture: Fixture,
  selection: number
): number | undefined => {
  if (!fixture) return
  console.log(fixture)
  if (selection === -1) return
  if (!fixture.finished_provisional) return
  const { team_a_score, team_h_score, team_a, team_h } = fixture

  console.log('team h: ', team_h, ' score: ', team_h_score)
  console.log('team a: ', team_a, ' score: ', team_a_score)
  console.log('selection: ', selection)

  if (team_a_score === null || team_h_score === null) {
    return
  }

  const homeVictory = team_h_score > team_a_score
  const awayVictory = team_h_score < team_a_score

  if (selection === team_h) {
    if (homeVictory) return 1
    else return -1
  } else {
    if (awayVictory) return 1
    else return -1
  }
}

/* 
            [draw] [team a win] [team b win]
    [team a] 0      1           -1
    [team b] 0     -1            1

*/

const getFixtureFromSelectionAndGameweek = (
  fixtures: Fixture[],
  selection: number,
  gameweek: number
): Fixture | undefined => {
  const fixture = fixtures.find((f) => {
    const isCorrectGameweek = f.event === gameweek
    const containsSelectedTeam =
      f.team_a === selection || f.team_h === selection
    return isCorrectGameweek && containsSelectedTeam
  })
  return fixture
}
