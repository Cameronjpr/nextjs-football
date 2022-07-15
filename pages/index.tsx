import React, { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../components/Layout/Layout'
import {
  Fixture,
  Gameweek,
  Matchday,
} from '../components/Fixture/Fixture.types'
import prisma from '../lib/prisma'
import { useSession } from 'next-auth/react'
import { tallyUserSelections } from '../util/index'
import { groupFixturesByDate } from '../util/fixtures'
import { Status } from '../domains/account/types'
import FixtureList from '../components/FixtureList'
import { Session } from 'next-auth/core/types'
import { finished, active } from '../data/__mocks/gameweekfixtures'

type HomeProps = {
  fixtures: Fixture[]
  users: any
}

type User = {
  session: Session | null
  status: string
}

export const UserContext = createContext<User>({
  session: null,
  status: Status.Unauthenticated,
})

export const CurrentGameweekContext = createContext<Gameweek>({
  id: 1,
  fixtures: [],
})

const Home = ({ fixtures }: HomeProps) => {
  const { data: session, status } = useSession()
  const [selectedGameweek, setSelectedGameweek] = useState(1)
  const [currentGameweek, setCurrentGameweek] = useState<Gameweek>({
    id: selectedGameweek,
    fixtures: [],
  })

  const [user, setUser] = useState<User>({
    session,
    status,
  })

  useEffect(() => {
    setUser({
      session,
      status,
    })
  }, [session, status])

  const gameweeks = Array.from({ length: 38 }, (v, k) => k + 1)
  const groupedFixtures: Matchday[] = groupFixturesByDate(
    fixtures.filter((f: Fixture) => f.event === selectedGameweek)
  )

  console.log(selectedGameweek)

  return (
    <UserContext.Provider value={user}>
      <CurrentGameweekContext.Provider value={currentGameweek}>
        <Layout>
          <h1 className="text-4xl mb-2 italic text-teal-900">
            Soccer Selector
          </h1>
          <h2 className="mb-10 text-teal-800">
            Pick a team from the list of fixtures below!
          </h2>
          <div className="flex flex-col place-content-center w-full sm:w-xl">
            <section className="pb-2 w-full flex place-content-between">
              <ul className="flex flex-row place-content-between justify-between w-full text-md">
                <button
                  disabled={selectedGameweek <= 1}
                  className={selectedGameweek <= 1 ? 'text-slate-500' : ''}
                  onClick={() => setSelectedGameweek(selectedGameweek - 1)}
                >
                  Previous
                </button>
                <label className="hidden" htmlFor="gameweek-select">
                  Select a gameweek
                </label>
                <select
                  name="gameweek"
                  id="gameweek-select"
                  className=""
                  value={selectedGameweek}
                  onChange={(event) => {
                    setSelectedGameweek(parseInt(event.target.value))
                  }}
                >
                  {gameweeks.map((gw, idx) => (
                    <option key={idx} value={gw}>
                      Gameweek {gw}
                    </option>
                  ))}
                </select>
                <button
                  disabled={selectedGameweek > 37}
                  className={selectedGameweek > 37 ? 'text-slate-500' : ''}
                  onClick={() => setSelectedGameweek(selectedGameweek + 1)}
                >
                  Next
                </button>
              </ul>
            </section>
            <main className="">
              <FixtureList groupedFixtures={groupedFixtures} />
            </main>
          </div>
        </Layout>
      </CurrentGameweekContext.Provider>
    </UserContext.Provider>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const fixtures = await axios
    .get('https://fantasy.premierleague.com/api/fixtures/')
    .catch((error) => {
      console.log(error)
    })

  const teams = await prisma.team.findMany({
    orderBy: [{ order: 'asc' }],
  })

  if (fixtures?.data) {
    fixtures.data[0] = finished.data[0]
    fixtures.data[1] = active.data[1]
  }

  const enrichedFixtures = fixtures?.data.map((f: any, idx: number) => {
    return {
      ...f,
      teams: [
        {
          basic_id: f.team_h - 1,
          score: f.team_h_score,
          ...teams[f.team_h - 1],
          isHome: true,
        },
        {
          basic_id: f.team_a - 1,
          score: f.team_a_score,
          ...teams[f.team_a - 1],
          isHome: false,
        },
      ],
    }
  })

  return {
    props: { fixtures: enrichedFixtures },
    revalidate: 60 * 5,
  }
}

export default Home
