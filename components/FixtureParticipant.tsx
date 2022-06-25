import classNames from 'classnames'
import { FixtureOutcomes, FixtureParticipantProps } from './Fixture.types'

export const FixtureParticipant = ({
  id,
  club,
  shortName,
  score,
  isHome,
  result,
  isSelectable,
  isSelected,
  selectedBy,
  handleSelection,
}: FixtureParticipantProps) => {
  let resultStyling

  switch (result) {
    case FixtureOutcomes.Win:
      resultStyling = 'bg-green-400'
      break
    case FixtureOutcomes.Loss:
      resultStyling = 'bg-red-400'
      break
    default:
      resultStyling = 'bg-stone-300	'
  }

  return (
    <div className="flex flex-col">
      <button
        className={classNames(
          'p-2 w-full flex justify-end items-center rounded-full',
          'hover:bg-yellow-200',
          isHome ? 'flex-row' : 'flex-row-reverse',
          isSelected && 'bg-yellow-200'
        )}
        onClick={() => handleSelection(String(id - 1))}
        disabled={!isSelectable}
      >
        <span className="hidden sm:inline font-medium px-2 w-min break-all truncate">
          {club}
        </span>
        <span className="sm:hidden font-medium px-2 w-min">{shortName}</span>
        <span
          className={classNames('p-2 w-10 h-10 rounded-full', resultStyling)}
        >
          {score}
        </span>
      </button>
      {selectedBy ? (
        selectedBy > 1 ? (
          <span className="px-2 text-sm">
            This team has been picked by {selectedBy} players 👀
          </span>
        ) : (
          <span className="px-2 text-sm">
            This team has been picked by {selectedBy} player 👀
          </span>
        )
      ) : null}
    </div>
  )
}
