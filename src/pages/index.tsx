import React, { useState, useEffect, createContext } from 'react'
import Layout from '../components/Layout/Layout'
import { useSession } from 'next-auth/react'
import { Status } from '../account/types'
import { Session } from 'next-auth/core/types'
import Head from 'next/head'
import Link from '@/components/Link/Link'
import Heading from '@/components/Heading/Heading'
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
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User>({
    session,
    status,
  })

  useEffect(() => {
    setUser({
      session,
      status,
    })
  }, [session, status])

  return (
    <UserContext.Provider value={user}>
      <Head>
        <title>Soccer Survivor</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <Layout>
        <main className="flex flex-col p-2">
          <header className="flex flex-row justify-between items-center">
            <Heading level="1">Soccer Survivor</Heading>
          </header>
          <span className="text-center text-slate-600">
            A real-world, real-time football guessing game.
          </span>
          <section className="my-8 sm:my-16 text-center">
            <Heading level="2">Start playing in 3 simple steps</Heading>
            <div className="flex flex-col justify-between gap-10 sm:gap-16 items-center">
              <article className="bg-white drop-shadow-lg p-4 rounded-lg w-full sm:w-2/3 flex flex-col justify-between">
                <span className="self-center mb-4 sm:mb-0 sm:fixed -top-5 left-3  bg-emerald-600 text-white font-bold font-rubik rounded-full w-10 h-10 flex place-content-center items-center drop-shadow">
                  1
                </span>
                <h3 className="text-lg mb-2 text-emerald-700 font-semibold">
                  Pick your team 🤔
                </h3>
                <p className="p-3">
                  Choose a Premier League team you think will win this week.
                </p>
              </article>
              <article className="bg-white drop-shadow-lg p-4 rounded-lg w-full sm:w-2/3 flex flex-col justify-between">
                <span className="self-center mb-4 sm:mb-0 sm:fixed -top-5 left-3  bg-emerald-600 text-white font-bold font-rubik rounded-full w-10 h-10 flex place-content-center items-center drop-shadow">
                  2
                </span>
                <h3 className="text-lg mb-2 text-emerald-700 font-semibold">
                  See if they win 👀
                </h3>
                <p className="p-3">Get points if your team won!</p>
              </article>
              <article className="bg-white drop-shadow-lg p-4 rounded-lg w-full sm:w-2/3 flex flex-col justify-between">
                <span className="self-center mb-4 sm:mb-0 sm:fixed -top-5 left-3  bg-emerald-600 text-white font-bold font-rubik rounded-full w-10 h-10 flex place-content-center items-center drop-shadow">
                  3
                </span>
                <h3 className="text-lg mb-2 text-emerald-700 font-semibold">
                  Climb the leaderboard🏆
                </h3>
                <p className="p-3">
                  Keep guessing correctly and you'll soon be on top!
                </p>
              </article>
            </div>
          </section>
          <Link
            href={status === 'authenticated' ? '/fixtures' : '/auth/signin'}
          >
            Get started
          </Link>
        </main>
      </Layout>
    </UserContext.Provider>
  )
}

export default Home
