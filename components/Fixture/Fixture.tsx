import React from 'react'
import classNames from 'classnames'
import { format, parse } from 'date-fns'
import { teams } from '../../data/teams'
import { Fixture, FixtureOutcomes, FixtureProps } from './Fixture.types'
import { FixtureParticipant } from './FixtureParticipant'

const FixtureCard = ({ fixture, handleSelection, isLoading }: FixtureProps) => {
  const { id, teams, started, kickoff_time } = fixture
  return (
    <div className="p-2">
      <div className="flex place-content-center text-center"></div>
      <div className="grid grid-cols-3 text-center">
        <h2 className="order-2">{format(new Date(kickoff_time), 'HH:mm')}</h2>
        {teams.map((t, idx) => (
          <>
            <span
              className={`hidden sm:inline ${
                idx ? 'text-left order-first' : 'text-right order-last'
              }`}
            >
              {t.name}
            </span>
            <span
              className={`sm:hidden ${
                idx ? 'text-left order-first' : 'text-right order-last'
              }`}
            >
              {t.shortName}
            </span>
          </>
          //         <span className="hidden sm:inline font-medium px-2 w-min break-all truncate">
          //   {club}
          // </span>
          // <span className="sm:hidden font-medium px-2 w-min">{shortName}</span>
          // {!isSelectable && (
          //   <span
          //     className={classNames('p-2 w-10 h-10 rounded-full', resultStyling)}
          //   >
          //     {score}
          //   </span>
          // )}
          //   <FixtureParticipant
          //     club={t.name}
          //     shortName={t.shortName}
          //     selectedBy={t.selectedBy}
          //     isHome={t.isHome}
          //     key={idx}
          //     id={Number(t.basic_id)}
          //     isSelectable={!started}
          //     isLoading={isLoading}
          //     handleSelection={handleSelection}
          //   />
        ))}
      </div>
    </div>
  )
}

const getResultFromScores = (team: number, opponent: number): string => {
  if (team > opponent) return FixtureOutcomes.Win
  if (team < opponent) return FixtureOutcomes.Loss

  return FixtureOutcomes.Draw
}

export default FixtureCard
