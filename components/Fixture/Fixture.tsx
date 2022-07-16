import React, { useContext } from 'react'
import classNames from 'classnames'
import { format, parse } from 'date-fns'
import { teams } from '../../data/teams'
import { FixtureProps } from './Fixture.types'
import { SelectionContext } from '../FixtureList'
import { TeamColorTab } from '../Result/Result'

const FixtureCard = ({ fixture, handleSelection, isLoading }: FixtureProps) => {
  const { id, teams, started, finished, kickoff_time } = fixture
  const selection = useContext(SelectionContext)
  return (
    <div
      className={classNames(
        'w-full',
        isLoading && 'text-slate-500 animate-pulse'
      )}
    >
      <div className="w-full flex flex-row place-content-stretch justify-between text-center h-14 gap-2">
        <h2 className="order-2 flex place-items-center place-content-center font-semibold text-sm">
          <time>{format(new Date(kickoff_time), 'HH:mm')}</time>
        </h2>
        {teams.map((t, idx) => {
          console.log(t.primaryColor)
          return (
            <button
              key={idx}
              onClick={() => !isLoading && handleSelection(t.basic_id)}
              className={classNames(
                'my-2 rounded-md w-36 sm:w-60 flex items-center border',
                t.basic_id === selection ? 'bg-yellow-300' : '',
                !isLoading
                  ? 'hover:bg-blue-100 hover:scale-105 click:scale-95'
                  : '',
                t.isHome
                  ? 'justify-start order-first'
                  : 'justify-end order-last'
              )}
              style={{
                borderColor: t.primaryColor,
              }}
            >
              <TeamColorTab color={t.primaryColor} isHome={t.isHome} />
              <span className="hidden sm:inline">{t.name}</span>
              <span className="sm:hidden">{t.shortName}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FixtureCard
