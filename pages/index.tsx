import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../components/Layout'
import FixtureCard from '../components/Fixture'
import { Fixture } from '../components/Fixture.types'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import prisma from '../lib/prisma'
import { useSession } from 'next-auth/react'
import router from 'next/router'

export const getStaticProps: GetStaticProps = async () => {
  // const feed = await prisma.fixture.findMany()
  const fixtures = await fetch(
    'https://fantasy.premierleague.com/api/fixtures/'
  ).then((res) => res.json())

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      score: true,
      selection: true,
    },
  })

  return { props: { fixtures, users }, revalidate: 1800 }
}

type Gameweek = {
  date: string
  fixtures: Fixture[]
}

type HomeProps = {
  fixtures: Fixture[]
  users: any
}

enum Status {
  Unauthenticated = 'unauthenticated',
  Authenticated = 'authenticated',
}

const Home = ({ fixtures, users }: HomeProps) => {
  const { data: session, status } = useSession()
  console.log(status)
  const [gameweek, setGameweek] = useState(1)
  const [selectedTeam, setSelectedTeam] = useState<undefined | string>(
    undefined
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
      },
    },
  }

  console.log(fixtures[0])
  console.log(users)

  const gameweeks = Array.from({ length: 38 }, (v, k) => k + 1)
  const groupedFixtures: Gameweek[] = groupFixturesByDate(
    fixtures.filter((f: Fixture) => f.event === gameweek)
  )

  const handleTeamSelect = async (id: string) => {
    if (status === Status.Unauthenticated) {
      router.push(
        encodeURI('/login?message=Please sign in to make a selection.')
      )
      return
    }
    const res = await axios
      .post('/api/selection', {
        id: id,
      })
      .then((response) => {
        setSelectedTeam(id)
        console.log(response, selectedTeam)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    console.log(selectedTeam)
  }, [selectedTeam])

  return (
    <Layout>
      <div className="flex flex-col place-content-center">
        <section className="pb-5 sm:px-36 flex place-content-between">
          <section className="text-xl font-bold">
            <label className="hidden" htmlFor="gameweek-select">
              Select a gameweek
            </label>
            <select
              name="gameweek"
              id="gameweek-select"
              onChange={(event) => {
                console.log(event.target.value)
                setGameweek(parseInt(event.target.value))
              }}
            >
              {gameweeks.map((gw, idx) => (
                <option key={gw} value={gw}>
                  Gameweek {gw}
                </option>
              ))}
            </select>
          </section>
        </section>
        <main className="sm:px-36">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1"
          >
            {groupedFixtures.map((date, idx) => (
              <section key={idx}>
                <h2 className="my-2">{format(new Date(date.date), 'PPPP')}</h2>
                {date.fixtures.map((f: Fixture) => (
                  <div key={f.id} className="">
                    <FixtureCard
                      fixture={f}
                      selectedTeam={selectedTeam}
                      handleSelection={handleTeamSelect}
                    />
                  </div>
                ))}
              </section>
            ))}
          </motion.div>
        </main>
      </div>
    </Layout>
  )
}

// { date: d, fixtures: [] }
const groupFixturesByDate = (fixtures: Fixture[]): Gameweek[] => {
  const dates: Gameweek[] = []

  fixtures.forEach((f) => {
    const date = format(new Date(f.kickoff_time), 'P')
    const idx = dates.findIndex((d) => d.date === date)
    if (idx >= 0) {
      dates[idx].fixtures.push(f)
    } else {
      dates.push({
        date: date,
        fixtures: [f],
      })
    }
  })

  return dates
}

export default Home
