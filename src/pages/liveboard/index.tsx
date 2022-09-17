import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import classNames from 'classnames'
import { trpc } from '@/utils/trpc'
import { richTeams } from '../../data/teams'
import { User } from '@prisma/client'
import Head from 'next/head'
import superjson from 'superjson'
import { useSession } from 'next-auth/react'
import { getActiveGameweekFromFixtures } from '@/utils/fixtures'
import { appRouter, Player } from '@/backend/router'
import { createSSGHelpers } from '@trpc/react/ssg'
import Heading from '@/components/Heading/Heading'
import { getCurrentScores } from '@/utils/scores'

export async function getStaticProps() {
  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  })

  await ssg.fetchQuery('getUsers')
  await ssg.fetchQuery('getFixtures')
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 60,
  }
}

const Leaderboard = () => {
  const [gameweek, setGameweek] = useState(0)
  const { data: session, status } = useSession()
  const fixturesData = trpc.useQuery(['getFixtures'], {
    onSuccess(data) {
      const activeGameeweek = getActiveGameweekFromFixtures(data)

      setGameweek(activeGameeweek)
    },
  })
  const { isLoading, data } = trpc.useQuery(['getUsers'])
  const [usersWithScores, setUsersWithScores] = useState<Player[]>([])
  const userInfo = trpc.useQuery([
    'getUser',
    { email: session?.user?.email ?? '' },
  ])

  useEffect(() => {
    const start = performance.now()
    if (
      !isLoading &&
      data?.users?.length &&
      fixturesData?.data?.length &&
      !usersWithScores?.length
    ) {
      const scoredPlayers = getCurrentScores(data.users, fixturesData.data)
      setUsersWithScores(scoredPlayers)
      const duration = performance.now() - start
      console.log(duration)
    }
  }, [isLoading, data, fixturesData, usersWithScores?.length])

  return (
    <Layout>
      <Head>
        <title>Leaderboard</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <main className="flex w-full flex-col place-content-start rounded-lg sm:max-w-3xl">
        <Heading level="1">Current Leaderboard</Heading>
        {gameweek ? <h2 className="text-center">Gameweek {gameweek}</h2> : null}
        <table>
          <thead>
            <tr className="h-10 border-b-2 text-left italic text-orange-900">
              <th className="pl-2 font-normal" colSpan={1}>
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
              usersWithScores?.length &&
              usersWithScores
                .sort((a: Player, b: Player) => (b.score ?? 0) - (a.score ?? 0))
                .map(
                  ({ name, username, selections, score, id }: Player, idx) => (
                    <tr
                      key={idx}
                      className={classNames(
                        idx ? 'bg-white' : 'bg-yellow-300',
                        id === userInfo?.data?.user?.id
                          ? 'bg-blue-300 font-bold'
                          : '',
                        'h-12 rounded-sm border-b-4 border-teal-800/5'
                      )}
                    >
                      <td className="w-10 pl-3">{idx + 1}</td>
                      <td className="font-semibold">
                        {username ?? name?.split(' ')[0] ?? name}
                      </td>
                      <td>
                        {richTeams[Number(selections[gameweek - 1])]
                          ?.shortName ?? ''}
                      </td>
                      <td>{score}</td>
                    </tr>
                  )
                )}
          </tbody>
        </table>
      </main>
    </Layout>
  )
}

export default Leaderboard
