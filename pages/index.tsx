import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../components/Layout'
import FixtureCard from '../components/Fixture'
import { Fixture } from '../components/Fixture.types'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

export const getStaticProps: GetStaticProps = async () => {
  // const feed = await prisma.fixture.findMany()
  const fixtures = await fetch(
    'https://fantasy.premierleague.com/api/fixtures/'
  ).then((res) => res.json())
  return { props: { fixtures }, revalidate: 1800 }
}

type Props = {
  fixtures: any
}

type Gameweek = {
  date: string
  fixtures: Fixture[]
}

const Home: React.FC<Props> = (props) => {
  const [gameweek, setGameweek] = useState(1)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
      },
    },
  }

  console.log(props.fixtures[0])

  const gameweeks = Array.from({ length: 38 }, (v, k) => k + 1)
  console.log(gameweek)
  const groupedFixtures: Gameweek[] = groupFixturesByDate(
    props.fixtures.filter((f: Fixture) => f.event === gameweek)
  )

  const handleTeamSelect = async (id: string) => {
    const res = await axios
      .post('/api/selection', {
        id: id,
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Layout>
      <div className="flex flex-col place-content-center">
        <section className="pb-5 sm:px-36 flex place-content-between">
          {/* <button
            onClick={() => setGameweek(gameweek - 1)}
            disabled={gameweek === 1}
            className="text-xl"
          >
            Previous
          </button> */}
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
          {/* <button
            onClick={() => setGameweek(gameweek + 1)}
            disabled={gameweek === 38}
            className="text-xl"
          >
            Next
          </button> */}
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
