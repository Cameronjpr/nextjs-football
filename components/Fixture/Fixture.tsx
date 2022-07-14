import React, { useContext } from 'react'
import classNames from 'classnames'
import { format, parse } from 'date-fns'
import { teams } from '../../data/teams'
import { FixtureProps } from './Fixture.types'
import { SelectionContext } from '../FixtureList'

const FixtureCard = ({ fixture, handleSelection, isLoading }: FixtureProps) => {
  const { id, teams, started, finished, kickoff_time } = fixture
  const selection = useContext(SelectionContext)
  console.log(isLoading)
  return (
    <div className={classNames('p-2 w-full', isLoading && 'animate-pulse')}>
      <div className="w-full flex flex-row place-content-stretch justify-between text-center h-12 gap-4">
        <h2 className="order-2 flex place-items-center place-content-center font-semibold">
          <time>{format(new Date(kickoff_time), 'HH:mm')}</time>
        </h2>
        {teams.map((t, idx) => {
          return (
            <button
              key={idx}
              onClick={() => !isLoading && handleSelection(t.basic_id)}
              className={classNames(
                'w-2/5 p-1 flex place-items-center rounded-lg ',
                t.basic_id === selection
                  ? 'bg-blue-100 outline outline-2 outline-blue-300 outline-offset-2'
                  : '',
                !isLoading
                  ? 'hover:bg-blue-100 hover:scale-105 click:scale-95'
                  : '',
                t.isHome
                  ? 'justify-start order-first'
                  : 'justify-end order-last'
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
