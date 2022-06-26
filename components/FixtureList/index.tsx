import axios from 'axios'
import { format } from 'date-fns'
import { SessionProvider, useSession } from 'next-auth/react'
import router from 'next/router'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Status } from '../../domains/account/types'
import { UserContext } from '../../pages'
import FixtureCard from '../Fixture'
import { Fixture } from '../Fixture.types'

export const SelectionContext = createContext<undefined | number>(undefined)

const FixtureList = ({ groupedFixtures }: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<undefined | number>(
    undefined
  )
  const { data: session, status } = useSession()

  const handleTeamSelect = async (id: string) => {
    if (status === Status.Unauthenticated) {
      router.push(
        encodeURI('/login?message=Please sign in to make a selection.')
      )
      return
    }
    setIsLoading(true)
    const res = await axios
      .post('/api/selection', {
        id: id,
      })
      .then((response) => {
        setSelectedTeam(Number(id))
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        console.log(error)
      })
  }

  return (
    <SelectionContext.Provider value={selectedTeam}>
      <div className="flex flex-col gap-1">
        {groupedFixtures.map((date: any, idx: number) => (
          <ul key={idx}>
            <h2 className="my-2 p-2 px-4 rounded-full text-lg text-slate-800 font-bold bg-green-100 w-full">
              {format(new Date(date.date), 'PPPP')}
            </h2>
            {date.fixtures.map((f: Fixture) => (
              <li key={f.id} className="list-none">
                <FixtureCard
                  fixture={f}
                  isLoading={isLoading}
                  handleSelection={handleTeamSelect}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </SelectionContext.Provider>
  )
}

export default FixtureList
