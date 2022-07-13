import React from 'react'
import classNames from 'classnames'
import { teams } from '../../data/teams'
import {
  Fixture,
  FixtureOutcomes,
  FixtureProps,
} from '../Fixture/Fixture.types'
import { FixtureParticipant } from '../Fixture/FixtureParticipant'

const ResultCard = ({ fixture, handleSelection, isLoading }: FixtureProps) => {
  const { id, teams, started, finished, kickoff_time } = fixture

  const disabled = started || finished
  return (
    <div className="p-2">
      <div className="grid grid-cols-3 text-center h-12">
        <div className="order-2 flex place-items-center place-content-center font-bold gap-4">
          <span className="p-3 rounded-md bg-slate-100">{teams[0].score}</span>
          <span className="p-3 rounded-md bg-slate-100">{teams[1].score}</span>
        </div>
        {teams.map((t, idx) => {
          return (
            <div
              key={idx}
              className={classNames(
                'p-2 rounded-md bg-slate-100',
                idx ? 'text-left order-first' : 'text-right order-last'
              )}
            >
              <span className="hidden sm:inline">{t.name}</span>
              <span className="sm:hidden">{t.shortName}</span>
            </div>
          )
          {
            /* {teams.map((t, idx) => (
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
              isSelectable={!started}
              isLoading={isLoading}
              handleSelection={handleSelection}
            />
          ))} */
          }
        })}
      </div>
    </div>
  )
}

const getResultFromScores = (team: number, opponent: number): string => {
  if (team > opponent) return FixtureOutcomes.Win
  if (team < opponent) return FixtureOutcomes.Loss

  return FixtureOutcomes.Draw
}

export default ResultCard
