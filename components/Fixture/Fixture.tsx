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
    <div className="p-2">
      <div className="flex place-content-center text-center"></div>
      <div className="grid grid-cols-3 text-center h-12">
        <h2 className="order-2 flex place-items-center place-content-center">
          <time>{format(new Date(kickoff_time), 'HH:mm')}</time>
        </h2>
        {teams.map((t, idx) => {
          return (
            <button
              key={idx}
              onClick={() => handleSelection(t.basic_id)}
              className={classNames(
                'p-2 rounded-md bg-slate-100 hover:bg-blue-100',
                t.basic_id === selection
                  ? 'bg-blue-100 outline outline-2 outline-blue-300 outline-offset-2'
                  : '',
                idx ? 'text-left order-first' : 'text-right order-last'
              )}
            >
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
