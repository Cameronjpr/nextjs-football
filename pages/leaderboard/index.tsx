import React, { useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import { randomUUID } from 'crypto'
import prisma from '../../lib/prisma'

export const getStaticProps: GetStaticProps = async () => {
  const fixtures = await fetch(
    'https://fantasy.premierleague.com/api/fixtures/'
  ).then((res) => res.json())

  const users = await prisma.user.findMany({
    select: {
      name: true,
      score: true,
      selection: true,
    },
  })
  return { props: { users }, revalidate: 1800 }
}

type User = {
  id: string
  name: string
  score: number
  selection: string
}

type LeaderboardProps = {
  users: User[]
}

const Leaderboard = ({ users }: LeaderboardProps) => {
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
            {users
              .sort((a: User, b: User) => a.score - b.score)
              .map((player: User) => (
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
