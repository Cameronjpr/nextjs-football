import React, { useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../components/Layout'
import Fixture, { FixtureProps } from '../components/Fixture'
import { motion } from 'framer-motion'

export const getStaticProps: GetStaticProps = async () => {
  // const feed = await prisma.fixture.findMany()
  const fixtures = await fetch(
    'https://fantasy.premierleague.com/api/fixtures/'
  ).then((res) => res.json())
  return { props: { fixtures }, revalidate: 1800 }
}

type Props = {
  // feed: FixtureProps[]
  fixtures: any
}

type Fixture = {
  id: string
  event: number
  team_h: number
  team_a: number
  team_h_score: number
  team_a_score: number
  started: boolean
}

const Blog: React.FC<Props> = (props) => {
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

  return (
    <Layout>
      <div className="flex flex-col place-content-center">
        <section className="pb-5 sm:px-36 flex place-content-between">
          <button
            onClick={() => setGameweek(gameweek - 1)}
            disabled={gameweek === 1}
          >
            Previous
          </button>
          <h1 className="text-3xl font-bold">Gameweek {gameweek}</h1>
          <button
            onClick={() => setGameweek(gameweek + 1)}
            disabled={gameweek === 38}
          >
            Next
          </button>
        </section>
        <main className="sm:px-36">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1"
          >
            {props.fixtures
              .filter((f: Fixture) => f.event === gameweek)
              .map((f: Fixture) => (
                <div key={f.id} className="">
                  <Fixture fixture={f} />
                </div>
              ))}
          </motion.div>
        </main>
      </div>
    </Layout>
  )
}

export default Blog
