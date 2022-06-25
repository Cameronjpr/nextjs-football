import React from 'react'
import classNames from 'classnames'
import { format } from 'date-fns'
import { teams } from '../data/teams'
import {
  Fixture,
  FixtureOutcomes,
  FixtureProps,
  TeamNuggetProps,
} from './Fixture.types'

const TeamNugget = ({
  id,
  club,
  score,
  isHome,
  result,
  isSelectable,
  isSelected,
  handleSelection,
}: TeamNuggetProps) => {
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
        'p-2 w-full flex justify-end items-center rounded-sm',
        'hover:bg-yellow-100',
        isHome ? 'flex-row' : 'flex-row-reverse',
        isSelected && 'bg-yellow-200'
      )}
      onClick={() => handleSelection(String(id - 1))}
      disabled={!isSelectable}
    >
      <span className="font-medium px-2 truncate">{club}</span>
      <span className={classNames('p-2 w-10 h-10 rounded-full', resultStyling)}>
        {score}
      </span>
    </button>
  )
}

const FixtureCard = ({
  fixture,
  handleSelection,
  selectedTeam,
}: FixtureProps) => {
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
      <div className="grid grid-cols-2 gap-1">
        <TeamNugget
          id={team_h}
          club={teams[team_h - 1]}
          score={team_h_score}
          isHome={true}
          result={getResultFromScores(team_h_score, team_a_score)}
          isSelectable={started}
          isSelected={team_h === Number(selectedTeam) + 1}
          handleSelection={handleSelection}
        />
        <TeamNugget
          id={team_a}
          club={teams[team_a - 1]}
          score={team_a_score}
          isHome={false}
          result={getResultFromScores(team_a_score, team_h_score)}
          isSelectable={started}
          isSelected={team_a === Number(selectedTeam) + 1}
          handleSelection={handleSelection}
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
