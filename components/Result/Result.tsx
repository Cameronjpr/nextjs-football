import React from 'react'
import classNames from 'classnames'
import { FixtureOutcomes, FixtureProps } from '../Fixture/Fixture.types'

const ResultCard = ({ fixture }: FixtureProps) => {
  const { id, teams, started, finished } = fixture

  console.log(started, finished)
  return (
    <div className="p-2 w-full">
      <div className="flex flex-row place-content-stretch justify-between text-center h-12 gap-4">
        <div
          className={classNames(
            'order-2 flex items-center place-content-center font-semibold gap-2 text-md',
            started && !finished ? 'text-red-700' : ''
          )}
        >
          <span className="p-2">{teams[0].score}</span>
          <span className="p-2">{teams[1].score}</span>
        </div>
        {teams.map((t, idx) => {
          return (
            <div
              key={idx}
              className={classNames(
                'p-2 rounded-md w-2/5 font-bold flex items-center',
                idx ? 'justify-start order-first' : 'justify-end order-last'
              )}
            >
              <span className="hidden sm:inline">{t.name}</span>
              <span className="sm:hidden">{t.shortName}</span>
            </div>
          )
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
