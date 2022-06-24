import React, { useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import { randomUUID } from 'crypto'

export const getStaticProps: GetStaticProps = async () => {
  const leaderboard = [
    {
      id: randomUUID(),
      name: 'Cameron',
      score: 1,
    },
    {
      id: randomUUID(),
      name: 'Amber',
      score: 3,
    },
    {
      id: randomUUID(),
      name: 'Zelda',
      score: 2,
    },
    {
      id: randomUUID(),
      name: 'Buster',
      score: 0,
    },
  ]
  // const fixtures = await fetch(
  //   'https://fantasy.premierleague.com/api/fixtures/'
  // ).then((res) => res.json())
  return { props: { leaderboard }, revalidate: 1800 }
}

type Props = {
  leaderboard: any
}

const Leaderboard: React.FC<Props> = (props) => {
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

  console.log(props.leaderboard)

  return (
    <Layout>
      <div className="flex flex-col place-content-center">
        <main className="sm:px-36">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1"
          >
            {props.leaderboard
              .sort((a: any, b: any) => a.score <= b.score)
              .map((player: any) => (
                <div
                  key={player.id}
                  className="flex place-content-between border-b-2 text-xl"
                >
                  <h2 className="">{player.name}</h2>
                  <span>{player.score}</span>
                </div>
              ))}
          </motion.div>
        </main>
      </div>
    </Layout>
  )
}

export default Leaderboard
