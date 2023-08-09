import { Button } from '@/components/ui/button'

type GameweekNavigationProps = {
  activeGameweek: number
  selectedGameweek: number
  setSelectedGameweek: (gw: number) => void
}

export const GameweekNavigation = ({
  selectedGameweek,
  setSelectedGameweek,
}: GameweekNavigationProps) => {
  return (
    <section className="flex w-full place-content-between py-2">
      <ul className="text-md flex w-full flex-row justify-between items-center">
        <Button
          disabled={selectedGameweek <= 1}
          onClick={() => setSelectedGameweek(selectedGameweek - 1)}
        >
          Prev.
        </Button>
        <h2 className="w-36 text-center text-lg font-semibold text-emerald-800">
          Gameweek {selectedGameweek}
        </h2>
        <Button
          disabled={selectedGameweek > 37}
          onClick={() => setSelectedGameweek(selectedGameweek + 1)}
        >
          Next
        </Button>
      </ul>
    </section>
  )
}
