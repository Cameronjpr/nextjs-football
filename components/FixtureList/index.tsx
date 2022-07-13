import axios from 'axios'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import router from 'next/router'
import React, { createContext, useState } from 'react'
import { Status } from '../../domains/account/types'
import FixtureCard from '../Fixture/Fixture'
import { Fixture } from '../Fixture/Fixture.types'
import ResultCard from '../Result/Result'

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
          <ul key={idx} className="border-t-2 border-black/20">
            <h2 className="my-2 p-2 px-4 rounded-full text-lg text-center text-slate-800 font-bold w-full">
              {format(new Date(date.date), 'PPPP')}
            </h2>
            {date.fixtures.map((f: Fixture) => (
              <li key={f.id} className="list-none">
                {f.started ? (
                  <ResultCard
                    fixture={f}
                    isLoading={isLoading}
                    handleSelection={handleTeamSelect}
                  />
                ) : (
                  <FixtureCard
                    fixture={f}
                    isLoading={isLoading}
                    handleSelection={handleTeamSelect}
                  />
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </SelectionContext.Provider>
  )
}

export default FixtureList
