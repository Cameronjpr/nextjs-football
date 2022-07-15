import React, { useContext } from 'react'
import classNames from 'classnames'
import { format, parse } from 'date-fns'
import { teams } from '../../data/teams'
import { FixtureProps } from './Fixture.types'
import { SelectionContext } from '../FixtureList'

const FixtureCard = ({ fixture, handleSelection, isLoading }: FixtureProps) => {
  const { id, teams, started, finished, kickoff_time } = fixture
  const selection = useContext(SelectionContext)
  return (
    <div
      className={classNames(
        'p-2 w-full',
        isLoading && 'text-slate-500 animate-pulse'
      )}
    >
      <div className="w-full flex flex-row place-content-stretch justify-between text-center h-12 gap-4">
        <h2 className="order-2 flex place-items-center place-content-center font-semibold">
          <time>{format(new Date(kickoff_time), 'HH:mm')}</time>
        </h2>
        {teams.map((t, idx) => {
          console.log(t.primaryColor)
          return (
            <button
              key={idx}
              onClick={() => !isLoading && handleSelection(t.basic_id)}
              className={classNames(
                'w-2/5 p-1 flex place-items-center rounded-lg ',
                t.basic_id === selection ? 'bg-blue-100' : '',
                !isLoading
                  ? 'hover:bg-blue-100 hover:scale-105 click:scale-95'
                  : '',
                t.isHome
                  ? 'justify-start order-first'
                  : 'justify-end order-last'
              )}
            >
              <div
                style={{
                  backgroundColor: t.primaryColor,
                }}
                className={`w-4 h-4 bg-slate-400 rounded-full m-2 ${
                  idx ? 'order-last' : ''
                }`}
              ></div>
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
