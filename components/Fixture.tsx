import React from 'react'
import classNames from 'classnames'
import { format } from 'date-fns'
import { teams } from '../data/teams'
import { Fixture, FixtureOutcomes, FixtureProps } from './Fixture.types'
import { FixtureParticipant } from './FixtureParticipant'

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
        <FixtureParticipant
          id={Number(team_h.basic_id)}
          club={team_h.name}
          shortName={team_h.shortName}
          score={team_h_score}
          isHome={true}
          result={getResultFromScores(team_h_score, team_a_score)}
          isSelectable={started}
          isSelected={Number(team_h.basic_id) === Number(selectedTeam) + 1}
          selectedBy={team_h.selectedBy}
          handleSelection={handleSelection}
        />
        <FixtureParticipant
          id={Number(team_a.basic_id)}
          club={team_a.name}
          shortName={team_a.shortName}
          score={team_a_score}
          isHome={false}
          result={getResultFromScores(team_a_score, team_h_score)}
          isSelectable={started}
          isSelected={Number(team_a.basic_id) === Number(selectedTeam) + 1}
          selectedBy={team_a.selectedBy}
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
