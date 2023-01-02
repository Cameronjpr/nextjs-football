import classNames from 'classnames'
import { format } from 'date-fns'
import React, { useContext } from 'react'

import { Team } from '@/backend/router'

import { SelectionContext } from '../FixtureList'
import { FixtureCardProps } from './Fixture.types'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'

const FixtureCard = ({
  fixture,
  handleSelection,
  isLoading,
  isPartOfActiveGameweek,
  activeGameweek,
  mostPopularSelection,
}: FixtureCardProps) => {
  const { id, teams, started, finished, kickoff_time, event } = fixture
  const selections = useContext(SelectionContext)

  const { data: session, status } = useSession()
  const userInfo = trpc.useQuery([
    'getUser',
    { email: session?.user?.email ?? '' },
  ])

  if (userInfo?.data?.user) {
    userInfo.data.user.codes
  }

  return (
    <div
      className={classNames(
        'w-full',
        isLoading && 'animate-pulse text-slate-600'
      )}
    >
      <div className="flex w-full flex-row place-content-stretch justify-between gap-2 text-center">
        {started || finished ? (
          <Scoreboard teams={teams} started={started} finished={finished} />
        ) : (
          <KickoffTime time={kickoff_time} />
        )}
        {teams.map((t, idx) => {
          const selectionOccurrences = selections.filter(
            (s) => s === t.basic_id
          )
          return (
            <button
              key={idx}
              disabled={isPartOfActiveGameweek}
              onClick={() =>
                !started &&
                !finished &&
                !isLoading &&
                handleSelection(
                  t.basic_id,
                  fixture?.code,
                  selectionOccurrences.length >= 2
                )
              }
              className={classNames(
                'my-2 flex flex-col w-full items-center justify-between rounded-b-md sm:w-64 drop-shadow-lg font-rubik antialiased',
                !isLoading &&
                  !started &&
                  !finished &&
                  !isPartOfActiveGameweek &&
                  selectionOccurrences.length < 2
                  ? 'sm:hover:bg-orange-100 sm:hover:text-black'
                  : '',
                selections?.length &&
                  t.basic_id === selections[event - 1] &&
                  fixture.code === userInfo?.data?.user?.codes?.[event - 1]
                  ? 'text-white bg-slate-900'
                  : 'bg-white',
                t.isHome
                  ? 'order-first justify-start'
                  : 'order-last justify-end',
                // selectionOccurrences.length >= 2 ? 'text-slate-700' : '',
                // don't think the first two are necessary here
                isPartOfActiveGameweek && 'cursor-not-allowed'
              )}
              // style={{
              //   borderColor: t.primaryColor,
              // }}
            >
              <div
                className="w-full flex flex-row justify-between border-t-2"
                style={{
                  borderColor: t.primaryColor,
                }}
              >
                <SelectionOccurrenceIndicator
                  selectionOccurrences={selectionOccurrences}
                  isHome={t.isHome}
                  color={t.primaryColor}
                />
                {mostPopularSelection === t.basic_id && (
                  <span className="pt-1 px-2 w-max text-orange-600">
                    Popular 🔥
                  </span>
                )}
              </div>
              <div
                className={classNames(
                  'font-medium text-md pb-1',
                  t.isHome ? 'pr-3 self-end' : 'pl-3 self-start'
                )}
              >
                <span className="text-lg hidden sm:inline">{t.name}</span>
                <span className="sm:hidden">{t.shortName}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const KickoffTime = ({ time }: { time: string }) => (
  <h2 className="order-2 w-20 flex place-content-center place-items-center text-sm font-medium">
    <time>{format(new Date(time), 'HH:mm')}</time>
  </h2>
)

type ScoreboardProps = {
  teams: Team[]
  started: boolean
  finished: boolean
}

const Scoreboard = ({ teams, started, finished }: ScoreboardProps) => {
  return (
    <div
      className={classNames(
        'order-2 flex w-20 place-content-center text-md items-center font-medium'
      )}
    >
      <span>
        {teams[0].score} : {teams[1].score}
      </span>
    </div>
  )
}

type SelectionOccurrenceIndicatorProps = {
  selectionOccurrences: number[]
  isHome: boolean
  color: string
}

const SelectionOccurrenceIndicator = ({
  selectionOccurrences,
  isHome,
  color,
}: SelectionOccurrenceIndicatorProps) => (
  <div
    className={classNames(
      'flex space-betweenh-8 gap-2 p-1 h-8',
      isHome ? 'pl-1 flex-row' : 'flex-row-reverse pr-1'
    )}
  >
    {selectionOccurrences.map((_o, idx) => (
      <div
        key={idx}
        style={{
          backgroundColor: color,
        }}
        className={classNames(
          'h-4 w-4 sm:w-5 sm:h-5 place-self-start border-2 rounded-md'
        )}
      ></div>
    ))}
    <span className="sr-only">
      You have {2 - selectionOccurrences.length} seletions remaining for this
      team.
    </span>
  </div>
)

export default FixtureCard
