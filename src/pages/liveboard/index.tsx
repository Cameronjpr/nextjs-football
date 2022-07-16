import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import classNames from 'classnames'
import { trpc } from '@/utils/trpc'
import { teams } from '../../data/teams'
import { Player } from '@/backend/router'
import { User } from '@prisma/client'

const Leaderboard = () => {
  const [gameweek, setGameweek] = useState(1)

  const { isLoading, data } = trpc.useQuery(['getUsers'])

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
            {!isLoading &&
              data?.success &&
              data.users
                .sort((a: User, b: User) => (b.score ?? 0) - (a.score ?? 0))
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
