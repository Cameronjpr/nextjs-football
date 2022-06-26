import React, { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../components/Layout'
import { Fixture, Gameweek, Matchday } from '../components/Fixture.types'
import prisma from '../lib/prisma'
import { useSession } from 'next-auth/react'
import { tallyUserSelections } from '../util/index'
import { groupFixturesByDate } from '../util/fixtures'
import { Status } from '../domains/account/types'
import FixtureList from '../components/FixtureList'
import { Session } from 'next-auth/core/types'

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

const Home = ({ fixtures, users }: HomeProps) => {
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

  useEffect(() => {}, [fixtures])

  const gameweeks = Array.from({ length: 38 }, (v, k) => k + 1)
  const groupedFixtures: Matchday[] = groupFixturesByDate(
    fixtures.filter((f: Fixture) => f.event === selectedGameweek)
  )

  return (
    <UserContext.Provider value={user}>
      <CurrentGameweekContext.Provider value={currentGameweek}>
        <Layout>
          <div className="flex flex-col place-content-center">
            <section className="pb-5 w-full flex place-content-between">
              <section className="flex flex-row place-content-between w-full text-xl font-bold">
                <button
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
                    <option key={gw} value={gw}>
                      Gameweek {gw}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setSelectedGameweek(selectedGameweek + 1)}
                >
                  Next
                </button>
              </section>
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

  const teams = await prisma.team.findMany()
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      score: true,
      selection: true,
    },
  })

  const talliedSelections = tallyUserSelections(users)

  const enrichedFixtures = fixtures?.data.map((f: any, idx: number) => {
    return {
      ...f,
      teams: [
        {
          basic_id: f.team_h - 1,
          score: f.team_h_score,
          ...teams[f.team_h - 1],
          isHome: true,
          selectedBy: talliedSelections[f.team_h - 1],
        },
        {
          basic_id: f.team_a - 1,
          score: f.team_a_score,
          ...teams[f.team_a - 1],
          isHome: false,
          selectedBy: talliedSelections[f.team_a - 1],
        },
      ],
    }
  })

  console.log('fixture')
  console.log(fixtures?.data[0])

  return {
    props: { fixtures: enrichedFixtures, users },
    revalidate: 1800,
  }
}

export default Home
