import React from 'react'
import classNames from 'classnames'
import { format } from 'date-fns'
import { teams } from '../data/teams'
import { Fixture, FixtureOutcomes, FixtureProps } from './Fixture.types'
import { FixtureParticipant } from './FixtureParticipant'

const FixtureCard = ({ fixture, handleSelection, isLoading }: FixtureProps) => {
  const { id, teams, started, kickoff_time } = fixture
  return (
    <>
      <div className={classNames('grid grid-cols-2 gap-1')}>
        {teams.map((t, idx) => (
          <FixtureParticipant
            club={t.name}
            shortName={t.shortName}
            score={t.score}
            selectedBy={t.selectedBy}
            isHome={t.isHome}
            key={idx}
            id={Number(t.basic_id)}
            result={
              idx
                ? getResultFromScores(teams[1].score, teams[0].score)
                : getResultFromScores(teams[0].score, teams[1].score)
            }
            isSelectable={started}
            isLoading={isLoading}
            handleSelection={handleSelection}
          />
        ))}
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
