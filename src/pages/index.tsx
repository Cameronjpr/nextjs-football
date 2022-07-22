import React, { useState, useEffect, createContext } from 'react'
import Layout from '../components/Layout/Layout'
import { useSession } from 'next-auth/react'
import { Status } from '../account/types'
import { Session } from 'next-auth/core/types'
import Head from 'next/head'
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
            <h1 className="w-full rounded-md p-2 text-center font-rubik text-3xl italic text-orange-600 sm:text-5xl">
              Soccer Survivor
            </h1>
          </header>
          <span className="text-center text-slate-600">
            A real-world, real-time football guessing game.
          </span>
          <section className="my-8 sm:my-16 text-center">
            <h2 className="text-xl sm:text-3xl font-rubik mb-8 sm:mb-16 text-emerald-800 px-20">
              Start playing in 3 simple steps
            </h2>
            <div className="flex flex-col justify-between gap-10 sm:gap-16">
              <article className="bg-white drop-shadow-lg p-4 rounded-lg w-full sm:ml-20 sm:w-1/2 flex flex-col justify-between">
                <span className="self-center mb-4 sm:mb-0 sm:fixed  -top-5 left-3 sm:-left-5 bg-emerald-600 text-white font-bold font-rubik rounded-full w-10 h-10 flex place-content-center items-center drop-shadow">
                  1
                </span>
                <h3 className="text-lg mb-2 text-emerald-700 font-semibold">
                  Make an account 👋
                </h3>
                <p>
                  <Link href="/auth/signin">Sign in with Google</Link> to get
                  started.
                </p>
              </article>
              <article className="bg-white drop-shadow-lg p-4 rounded-lg w-full self-end sm:mr-20 sm:w-1/2 flex flex-col justify-between">
                <span className="self-center mb-4 sm:mb-0 sm:fixed -top-5 left-3 sm:-left-5 bg-emerald-600 text-white font-bold font-rubik rounded-full w-10 h-10 flex place-content-center items-center drop-shadow">
                  2
                </span>
                <h3 className="text-lg mb-2 text-emerald-700 font-semibold">
                  Choose your team 🤔
                </h3>
                <p>Pick a team you think will win this week</p>
              </article>
              <article className="bg-white drop-shadow-lg p-4 rounded-lg w-full sm:ml-20 sm:w-1/2 flex flex-col justify-between">
                <span className="self-center mb-4 sm:mb-0 sm:fixed -top-5 left-3 sm:-left-5 bg-emerald-600 text-white font-bold font-rubik rounded-full w-10 h-10 flex place-content-center items-center drop-shadow">
                  3
                </span>
                <h3 className="text-lg mb-2 text-emerald-700 font-semibold">
                  Climb the leaderboard 🏆
                </h3>
                <p>Get points if your team won!</p>
              </article>
            </div>
          </section>
          <Link
            href={status === 'authenticated' ? '/fixtures' : '/auth/signin'}
          >
            <span className="w-max self-center mb-10 p-5 text-lg cursor-pointer bg-orange-200 text-amber-900 hover:bg-orange-300 rounded-xl drop-shadow-md">
              Get started
            </span>
          </Link>
        </main>
      </Layout>
    </UserContext.Provider>
  )
}

export default Home
