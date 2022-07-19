import React, { useState, useEffect, createContext } from 'react'
import { GetStaticPropsContext } from 'next'
import { createSSGHelpers } from '@trpc/react/ssg'
import Layout from '../components/Layout/Layout'
import { useSession } from 'next-auth/react'
import { Status } from '../account/types'
import FixtureList from '../components/FixtureList'
import { Session } from 'next-auth/core/types'
import Head from 'next/head'
import superjson from 'superjson'
import { appRouter } from '@/backend/router'
import { trpc } from '@/utils/trpc'
import { formatDistance, parseJSON } from 'date-fns'
import { GameweekNavigation } from '@/components/GameweekNavigation/GameweekNavigation'
import Link from 'next/link'

type User = {
  session: Session | null
  status: string
}

export const UserContext = createContext<User>({
  session: null,
  status: Status.Unauthenticated,
})

export const ActiveGameweekContext = createContext<Number>(1)

const Home = () => {
  const fixturesData = trpc.useQuery(['getFixtures'])

  const { data: session, status } = useSession()
  const [user, setUser] = useState<User>({
    session,
    status,
  })
  const [selectedGameweek, setSelectedGameweek] = useState(1)
  const [activeGameweek, setActiveGameweek] = useState(1)
  const [daysUntilDeadline, setDaysUntilDeadline] = useState('')

  useEffect(() => {
    const daysUntilDeadline = (activeGameweek: number) => {
      const now = new Date()
      const fixtures = fixturesData?.data
      // ALERT: What about the last gameweek of the season!!!! Don't want to get the 39th week
      const firstGameOfNextGameweek = fixtures?.find(
        (f) => f.event === selectedGameweek + 1
      )
      if (now === undefined || firstGameOfNextGameweek === undefined) return ''
      return formatDistance(
        now,
        parseJSON(firstGameOfNextGameweek?.kickoff_time ?? '')
      )
    }
    setDaysUntilDeadline(daysUntilDeadline(selectedGameweek))
  }, [selectedGameweek, fixturesData])

  useEffect(() => {
    setUser({
      session,
      status,
    })
  }, [session, status])

  return (
    <UserContext.Provider value={user}>
      <ActiveGameweekContext.Provider value={activeGameweek}>
        <Head>
          <title>Fixtures - Soccer Survivor</title>
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon-16x16.png"
          />
        </Head>
        <Layout>
          <header className="flex flex-row justify-between items-center">
            <h1 className="w-full rounded-md p-2 text-center font-rubik text-3xl italic text-orange-600 sm:text-5xl">
              Soccer Survivor
            </h1>
            <Link href="/help">
              <span className="w-12 h-10 p-2 text-center text-lg font-bold rounded-full cursor-pointer bg-orange-100 text-amber-900 hover:bg-orange-200">
                ?
              </span>
            </Link>
          </header>
          <div className="sm:w-xl flex w-full flex-col place-content-center">
            <GameweekNavigation
              activeGameweek={activeGameweek}
              selectedGameweek={selectedGameweek}
              daysUntilDeadline={daysUntilDeadline}
              setSelectedGameweek={setSelectedGameweek}
            />
            <main className="">
              {fixturesData?.isSuccess && (
                <FixtureList
                  fixtures={fixturesData?.data}
                  activeGameeweek={activeGameweek}
                  selectedGameweek={selectedGameweek}
                />
              )}
            </main>
          </div>
          <Link href="/help">
            <span className="h-full my-5 p-3 cursor-pointer bg-orange-100 text-amber-900 hover:bg-orange-200 rounded-md">
              How to play
            </span>
          </Link>
        </Layout>
      </ActiveGameweekContext.Provider>
    </UserContext.Provider>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  })

  await ssg.fetchQuery('getFixtures')

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 60,
  }
}

export default Home
