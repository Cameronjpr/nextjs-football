import React, { useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import { randomUUID } from 'crypto'
import prisma from '../../lib/prisma'
import classNames from 'classnames'

export const getStaticProps: GetStaticProps = async () => {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      username: true,
      score: true,
      selection: true,
    },
  })
  return { props: { users }, revalidate: 300 }
}

type User = {
  id: string
  username?: string
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
              .sort((a: User, b: User) => b.score - a.score)
              .map((player: User, idx) => (
                <div
                  key={player.id}
                  className={classNames(
                    'px-2 flex flex-row place-content-between border-b-2 text-xl',
                    idx ? 'bg-white' : 'bg-yellow-300'
                  )}
                >
                  <div>
                    <span>{idx === 0 ? '👑' : idx + 1}</span>
                    <h2 className={`${idx ? 'pl-5' : 'pl-3'} inline`}>
                      {player?.username || player.name}
                    </h2>
                  </div>
                  <span>{player.score ?? 0}</span>
                </div>
              ))}
          </motion.div>
        </main>
      </div>
    </Layout>
  )
}

export default Leaderboard
