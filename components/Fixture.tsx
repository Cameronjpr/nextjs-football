import React from 'react'
import classNames from 'classnames'
import { format } from 'date-fns'
import { teams } from '../data/teams'
import { Fixture, FixtureProps, TeamNuggetProps } from './Fixture.types'

enum FixtureOutcomes {
  Win = 'win',
  Loss = 'loss',
  Draw = 'draw',
}

const TeamNugget: React.FC<{ team: TeamNuggetProps }> = ({ team }) => {
  const { id, club, score, isHome, result, isSelectable, handleSelection } =
    team

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
      onClick={() => handleSelection(String(id - 1))}
      disabled={!isSelectable}
    >
      <span className="font-bold px-2">{club}</span>
      <span>{score}</span>
    </button>
  )
}

const FixtureCard = ({ fixture, handleSelection }: FixtureProps) => {
  const {
    id,
    team_h,
    team_h_score,
    team_a_score,
    team_a,
    started,
    kickoff_time,
  } = fixture
  return (
    <>
      <div className="flex place-content-center gap-1">
        <TeamNugget
          team={{
            id: team_h,
            club: teams[team_h - 1],
            score: team_h_score,
            isHome: true,
            result: getResultFromScores(team_h_score, team_a_score),
            isSelectable: started,
            handleSelection,
          }}
        />
        <TeamNugget
          team={{
            id: team_a,
            club: teams[team_a - 1],
            score: team_a_score,
            isHome: false,
            result: getResultFromScores(team_a_score, team_h_score),
            isSelectable: started,
            handleSelection,
          }}
        />
      </div>
    </>
  )
}

const getResultFromScores = (team: number, opponent: number): string => {
  if (team > opponent) return FixtureOutcomes.Win
  if (team < opponent) return FixtureOutcomes.Loss

  return FixtureOutcomes.Draw
}

export default FixtureCard
