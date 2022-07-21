import classNames from 'classnames'

type GameweekNavigationProps = {
  activeGameweek: number
  selectedGameweek: number
  setSelectedGameweek: (gw: number) => void
}

export const GameweekNavigation = ({
  activeGameweek,
  selectedGameweek,
  setSelectedGameweek,
}: GameweekNavigationProps) => {
  return (
    <section className="flex w-full place-content-between py-2">
      <ul className="text-md flex w-full flex-row justify-between items-center">
        <button
          disabled={selectedGameweek <= 1}
          className={classNames(
            'h-10 w-20 rounded-md p-1 text-center drop-shadow font-semibold',
            selectedGameweek <= 1
              ? 'cursor-not-allowed bg-slate-100 text-slate-600'
              : ' bg-orange-200 text-amber-900 hover:bg-orange-300'
          )}
          onClick={() => setSelectedGameweek(selectedGameweek - 1)}
        >
          Prev.
        </button>
        <div>
          <h2 className="w-36 text-center text-lg font-semibold text-emerald-800">
            Gameweek {selectedGameweek}
          </h2>
        </div>
        <button
          disabled={selectedGameweek > 37}
          className={classNames(
            'h-10 w-20 rounded-md p-1 drop-shadow font-semibold',
            selectedGameweek > 37
              ? 'cursor-not-allowed  bg-slate-100 text-slate-600'
              : 'bg-orange-200 hover:bg-orange-300 text-orange-900'
          )}
          onClick={() => setSelectedGameweek(selectedGameweek + 1)}
        >
          Next
        </button>
      </ul>
    </section>
  )
}
