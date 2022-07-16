import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../src/pages'
import { FixtureOutcomes, FixtureParticipantProps } from './Fixture.types'
import { SelectionContext } from '../FixtureList'

export const FixtureParticipant = ({
  id,
  club,
  shortName,
  score,
  isHome,
  result,
  isSelectable,
  selectedBy,
  handleSelection,
  isLoading,
}: FixtureParticipantProps) => {
  let resultStyling
  const [wasTapped, setWasTapped] = useState(false)
  const user = useContext(UserContext)
  const selectedTeam = useContext(SelectionContext)

  switch (result) {
    case FixtureOutcomes.Win:
      resultStyling = 'bg-green-400'
      break
    case FixtureOutcomes.Loss:
      resultStyling = 'bg-red-400'
      break
    default:
      resultStyling = 'bg-stone-200	'
  }

  useEffect(() => {
    if (!isLoading) setWasTapped(false)
  }, [isLoading])

  return (
    <div className="flex flex-col">
      <button
        className={classNames(
          'p-2 w-full flex justify-end items-center rounded-full',
          'hover:underline',
          isHome ? 'flex-row' : 'flex-row-reverse',
          selectedTeam === id && 'bg-yellow-200'
        )}
        onClick={() => {
          console.log('clicked')
          setWasTapped(true)
          handleSelection(id)
        }}
        disabled={!isSelectable}
      >
        {isLoading && wasTapped && (
          <div
            className={classNames(
              'grow flex',
              isHome ? 'flex-row' : 'flex-row-reverse'
            )}
          >
            <div className="loader border-4 border-yellow-500 p-2 w-5 h-5 rounded-full"></div>
          </div>
        )}
        {!isLoading && selectedTeam === id && (
          <div
            className={classNames(
              'px-1 grow flex',
              isHome ? 'flex-row' : 'flex-row-reverse'
            )}
          >
            <div className="border-2 border-yellow-900 bg-yellow-500 p-3 w-5 h-5 rounded-full"></div>
          </div>
        )}
        <span className="hidden sm:inline font-medium px-2 w-min break-all truncate">
          {club}
        </span>
        <span className="sm:hidden font-medium px-2 w-min">{shortName}</span>
        {!isSelectable && (
          <span
            className={classNames('p-2 w-10 h-10 rounded-full', resultStyling)}
          >
            {score}
          </span>
        )}
      </button>
    </div>
  )
}
