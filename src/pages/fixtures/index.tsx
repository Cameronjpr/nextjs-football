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
import Link from '@/components/Link/Link'
import { Status } from '@/account/types'
import FixtureList from '@/components/FixtureList'
import Layout from '@/components/Layout/Layout'
import { getActiveGameweekFromFixtures } from '@/utils/fixtures'
import Heading from '@/components/Heading/Heading'
import { getMostPopularPickForGameweek } from '@/utils/selections'
import { richTeams } from '@/data/teams'

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
  const users = trpc.useQuery(['getUsers'])
  const { data: session, status } = useSession()
  const userInfo = trpc.useQuery([
    'getUser',
    {
      email: session?.user?.email ?? '',
    },
  ])
  const [user, setUser] = useState<User>({
    session,
    status,
  })
  const [selectedGameweek, setSelectedGameweek] = useState(1)
  const [activeGameweek, setActiveGameweek] = useState(1)
  const [mostPopularSelection, setMostPopularSelection] = useState<
    number | undefined
  >(undefined)
  const [daysUntilDeadline, setDaysUntilDeadline] = useState('')

  useEffect(() => {
    if (!users.isLoading && users?.data?.users.length) {
      const selectionsForGameweek = users.data.users.map(
        (u) => u.selections[activeGameweek]
      )
      setMostPopularSelection(
        getMostPopularPickForGameweek(selectionsForGameweek)
      )
    }
  }, [users, activeGameweek])

  console.log(richTeams[mostPopularSelection ?? 0].name)
  useEffect(() => {
    const daysUntilDeadline = (activeGameweek: number) => {
      const now = new Date()
      const fixtures = fixturesData?.data
      // ALERT: What about the last gameweek of the season!!!! Don't want to get the 39th week
      const firstGameOfNextGameweek = fixtures?.find(
        (f) => f.event === activeGameweek
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
            <Heading level="1">Fixtures</Heading>
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
                  mostPopularSelection={mostPopularSelection}
                />
              )}
            </main>
          </div>
          <Link href="/rules">How to play</Link>
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
