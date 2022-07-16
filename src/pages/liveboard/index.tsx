import React, { useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../../components/Layout/Layout'
import { motion } from 'framer-motion'
import { randomUUID } from 'crypto'
import prisma from '../../../lib/prisma'
import classNames from 'classnames'
import axios from 'axios'
import { parse, isBefore } from 'date-fns'
import { finished } from '../../data/__mocks/gameweekfixtures'
import { trpc } from '@/utils/trpc'
import superjson from 'superjson'

import { createSSGHelpers } from '@trpc/react/ssg'

import {
  getResultFromFixture,
  getSelectionFixtureInGameweek,
} from '../../utils/fixtures'
import { teams } from '../../data/teams'
import { appRouter } from '@/backend/router'

export const getStaticProps: GetStaticProps = async () => {
  const general = await axios
    .get('https://fantasy.premierleague.com/api/bootstrap-static/')
    .catch((error) => {
      console.log(error)
    })

  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson, // optional - adds superjson serialization
  })

  await ssg.fetchQuery('getUsers')

  const activeGameweek = general?.data?.events?.filter(
    (e: any) => e.is_current || e.is_next
  )[0].id

  const activeGameweekFixtures = finished?.data.filter(
    (f: any) => f.event === activeGameweek
  )

  console.log(ssg.dehydrate())

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 60,
  }
}

type User = {
  id: string
  username?: string
  name: string
  score: number
  selection: string
  calculated: boolean
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
      <main className="flex flex-col w-full sm:max-w-3xl p-5 mx-4 bg-teal-800/5 place-content-start rounded-lg drop-shadow-md">
        <table>
          <caption className="mb-4 text-xl font-semibold p-2 drop-shadow-sm bg-teal-800/10 rounded-lg text-teal-900">
            Current leaderboard
          </caption>
          <thead>
            <tr className="border-b-2 text-left underline italic text-slate-600 h-10">
              <th className="font-normal pl-2" colSpan={1}>
                #
              </th>
              <th className="font-normal" colSpan={1}>
                Player
              </th>
              <th className="font-normal" colSpan={1}>
                Selection
              </th>
              <th className="font-normal" colSpan={1}>
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {users
              .sort((a: User, b: User) => b.score - a.score)
              .map(({ name, username, selection, score }: User, idx) => (
                <tr
                  key={idx}
                  className={classNames(
                    idx ? 'bg-white' : 'bg-yellow-300',
                    'border-b-4 border-teal-800/5 h-12 rounded-sm'
                  )}
                >
                  <td className="pl-3 w-10">{idx + 1}</td>
                  <td className="font-semibold">{username ?? name}</td>
                  <td>{teams[Number(selection) - 1] ?? ''}</td>
                  <td>{score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
    </Layout>
  )
}

export default Leaderboard
