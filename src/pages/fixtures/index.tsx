import React, { useState, useEffect, createContext } from 'react'
import { GetStaticPropsContext } from 'next'
import { createSSGHelpers } from '@trpc/react/ssg'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth/core/types'
import Head from 'next/head'
import superjson from 'superjson'
import { appRouter } from '@/backend/router'
import { trpc } from '@/utils/trpc'
import { formatDistance, parseJSON } from 'date-fns'
import { GameweekNavigation } from '@/components/GameweekNavigation/GameweekNavigation'
import Link from 'next/link'
import { Status } from '@/account/types'
import FixtureList from '@/components/FixtureList'
import Layout from '@/components/Layout/Layout'
import { getActiveGameweekFromFixtures } from '@/utils/fixtures'

type User = {
  session: Session | null
  status: string
}

export const UserContext = createContext<User>({
  session: null,
  status: Status.Unauthenticated,
})

export const ActiveGameweekContext = createContext<Number>(1)

const Fixtures = () => {
  const fixturesData = trpc.useQuery(['getFixtures'])
  const { data: session, status } = useSession()
  const userInfo = trpc.useQuery([
    'getUser',
    {
      email: session?.user?.email ?? '',
    },
  ])
  const [leagueBanner, setLeagueBanner] = useState(false)
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
        (f) => f.event === activeGameweek + 1
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
    if (fixturesData.isSuccess) {
      const activeGameeweek = getActiveGameweekFromFixtures(fixturesData?.data)
      console.log(activeGameeweek)
      setActiveGameweek(activeGameeweek)
    }
  }, [fixturesData])

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
              Fixtures
            </h1>
          </header>
          <div className="sm:w-xl flex w-full flex-col place-content-center">
            <GameweekNavigation
              activeGameweek={activeGameweek}
              selectedGameweek={selectedGameweek}
              setSelectedGameweek={setSelectedGameweek}
            />
            {daysUntilDeadline !== '' &&
            activeGameweek === selectedGameweek - 1 ? (
              <span className="text-red-600 bg-red-100/50 rounded-md p-2 w-max m-auto">
                Deadline in {daysUntilDeadline}
              </span>
            ) : null}
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
          <Link href="/rules">
            <span className="h-full my-5 p-3 cursor-pointer bg-orange-100 text-amber-900 hover:bg-orange-200 rounded-md">
              How to play
            </span>
          </Link>
          {status === 'authenticated' &&
            leagueBanner &&
            !userInfo?.data?.user?.league && (
              <div className="absolute bottom-0 w-full bg-white p-5 flex flex-row justify-between items-center">
                <p className="text-lg">
                  Compete against friends and family in your own private league!
                </p>
                <div className="flex flex-row gap-2">
                  <Link href="/league">
                    <a>
                      <h3 className="p-3 text-lg font-semibold rounded-md bg-green-200 w-max">
                        Join a league now!
                      </h3>
                    </a>
                  </Link>
                  <button
                    className="p-3 rounded-md bg-red-200 w-max"
                    onClick={() => setLeagueBanner(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
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

export default Fixtures
