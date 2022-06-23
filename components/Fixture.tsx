import React from 'react'
import Router from 'next/router'
import classNames from 'classnames'

export type FixtureProps = {
  id: string
  event: number
  team_h: number
  team_h_score: number
  team_a: number
  team_a_score: number
  started: boolean
}

const teams = [
  'Arsenal',
  'Aston Villa',
  'Brentford',
  'Aston Villa',
  'Arsenal',
  'Aston Villa',
  'Crystal Palace',
  'Everton',
  'Leeds United',
  'Leicester City',
  'Liverpool',
  'Manchester City',
  'Manchester United',
  'Newcastle United',
  'Norwich City',
  'Southampton',
  'Tottenham Hotspur',
  'Watford',
  'West Ham United',
  'Wolves',
]

type TeamNuggetProps = {
  club: string
  score: number
  isHome: boolean
  result: string
  isSelectable: boolean
}

enum FixtureOutcomes {
  Win = 'win',
  Loss = 'loss',
  Draw = 'draw',
}

const TeamNugget: React.FC<{ team: TeamNuggetProps }> = ({ team }) => {
  const { club, score, isHome, result, isSelectable } = team

  let resultStyling

  switch (result) {
    case FixtureOutcomes.Win:
      resultStyling = 'bg-green-400'
      break
    case FixtureOutcomes.Loss:
      resultStyling = 'bg-red-400'
      break
    default:
      resultStyling = 'bg-stone-300	'
  }

  return (
    <button
      className={classNames(
        'p-2 w-52 flex place-content-between rounded-sm',
        'hover:bg-sky-700',
        isHome ? 'flex-row' : 'flex-row-reverse',
        resultStyling
      )}
      onClick={() => console.log(team)}
      disabled={!isSelectable}
    >
      <span className="font-bold px-2">{club}</span>
      <span>{score}</span>
    </button>
  )
}

const Fixture: React.FC<{ fixture: FixtureProps }> = ({ fixture }) => {
  const { id, team_h, team_h_score, team_a_score, team_a, started } = fixture
  return (
    <div className="flex place-content-center gap-1">
      <TeamNugget
        team={{
          club: teams[team_h - 1],
          score: team_h_score,
          isHome: true,
          result: getResultFromScores(team_h_score, team_a_score),
          isSelectable: !started,
        }}
      />
      <TeamNugget
        team={{
          club: teams[team_a - 1],
          score: team_a_score,
          isHome: false,
          result: getResultFromScores(team_a_score, team_h_score),
          isSelectable: !started,
        }}
      />
    </div>
  )
}

const getResultFromScores = (team: number, opponent: number): string => {
  if (team > opponent) return FixtureOutcomes.Win
  if (team < opponent) return FixtureOutcomes.Loss

  return FixtureOutcomes.Draw
}

export default Fixture
