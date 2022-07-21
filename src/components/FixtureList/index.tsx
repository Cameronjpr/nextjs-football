import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import router from 'next/router'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { Fixture } from '@/backend/router'
import { groupFixturesByDate } from '@/utils/fixtures'
import { trpc } from '@/utils/trpc'

import { Status } from '../../account/types'
import { UserContext } from '../../pages'
import FixtureCard from '../Fixture/Fixture'
import { Matchday } from '../Fixture/Fixture.types'
import { richTeams } from '@/data/teams'

export const SelectionContext = createContext<number[]>([])

const FixtureList = ({
  fixtures,
  selectedGameweek,
  activeGameeweek,
}: {
  fixtures: Fixture[]
  selectedGameweek: number
  activeGameeweek: number
}) => {
  const [selections, setSelections] = useState<number[]>([])
  const [error, setError] = useState('')
  const { data: session, status } = useSession()

  console.log(session?.user?.email)

  const userInfo = trpc.useQuery([
    'getUser',
    { email: session?.user?.email ?? '' },
  ])

  const makeGameweekSpecificSelection = trpc.useMutation(
    ['makeGameweekSpecificSelection'],
    {
      onSuccess: (res) => {
        setSelections(res?.selections)
      },
      onError: (data) => {
        setError(data.message)
      },
    }
  )

  useEffect(() => {
    // this stops the userInfo stuff overwriting the selection but I hate it
    if (!userInfo?.data?.user?.selections.length || selections.length) return
    // if (userInfo?.)
    setSelections(userInfo?.data?.user?.selections)
  }, [userInfo, selections, selectedGameweek])

  useEffect(() => {
    console.log(selections)
  }, [selectedGameweek, selections])

  const handleTeamSelect = async (id: number, deselect = false) => {
    console.log('HANDLE SELECT')
    if (status === Status.Unauthenticated) {
      router.push(encodeURI('/auth/signin'))
      return
    }
    console.log(session?.user?.email)

    if (!session?.user?.email) return

    if (deselect) {
      console.log('deselect!')
    }

    makeGameweekSpecificSelection.mutate({
      email: session?.user?.email ?? '',
      selection: deselect ? -1 : id,
      selections: selections.length ? selections : Array(38).fill(-1),
      gameweek: selectedGameweek,
    })
  }

  return (
    <SelectionContext.Provider value={selections}>
      <div className="flex flex-col gap-8 py-4">
        {groupFixturesByDate(
          fixtures.filter((f: Fixture) => f.event === selectedGameweek)
        ).map((m: Matchday, idx: number) => (
          <ul key={idx} className="mb-1">
            <h2 className="mb-1 w-full text-left font-medium text-slate-800 italic">
              {format(new Date(m.date), 'EEEE do MMMM')}
            </h2>
            {m.fixtures.map((f: Fixture) => {
              return (
                <li key={f.id} className="list-none">
                  <FixtureCard
                    fixture={f}
                    isLoading={makeGameweekSpecificSelection.isLoading}
                    isPartOfActiveGameweek={activeGameeweek === f.event}
                    handleSelection={handleTeamSelect}
                  />
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </SelectionContext.Provider>
  )
}

export default FixtureList
