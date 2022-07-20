import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import classNames from 'classnames'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'

const League = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [leagueCode, setLeagueCode] = useState('')
  const [leagueRes, setLeagueRes] = useState('')
  const [error, setError] = useState('')

  const userInfo = trpc.useQuery([
    'getUser',
    {
      email: session?.user?.email ?? '',
    },
  ])

  const joinLeague = trpc.useMutation(['joinLeague'], {
    onSuccess: (res) => {
      setLeagueRes(res?.league ? 'joined' : 'left')
      setLeagueCode(res?.league ?? '')
    },
    onError: (data) => {
      setError(data.message)
    },
  })

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated') {
    router.push('/fixtures')
  }

  const handleJoinSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    code: string
  ) => {
    e.preventDefault()

    setLeagueRes('')

    joinLeague.mutate({
      email: session?.user?.email ?? '',
      code,
    })
  }

  const handleLeaveSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLeagueRes('')

    joinLeague.mutate({
      email: session?.user?.email ?? '',
      code: '',
    })
  }

  return (
    <Layout>
      <Head>
        <title>League</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <main className="flex flex-col m-auto p-2 items-center gap-10">
        <h1 className="w-full rounded-md p-2 text-center font-rubik text-3xl italic text-orange-600 sm:text-5xl">
          Leagues
        </h1>
        <form
          className="flex flex-col w-80"
          onSubmit={(e) => handleJoinSubmit(e, leagueCode)}
        >
          <h2 className="text-xl mb-2 font-semibold">
            Create or join a league
          </h2>
          <p className="my-4 text-slate-700">
            You can join a league to play with family and friends, whilst still
            competing against players from around the world.
          </p>
          <p className="my-4 text-slate-700">
            If the league doesn’t yet exist, we’ll create it for you and make
            you its first member!
          </p>
          <label className="mb-2">Enter league code</label>
          <input
            className="border p-2 rounded-md font-rubik text-lg text-orange-900"
            type="text"
            minLength={5}
            maxLength={10}
            value={leagueCode}
            onChange={(e) => setLeagueCode(e.target.value)}
          />
          <button className="mt-2 p-2 bg-orange-200 text-orange-800 rounded-md">
            Join
          </button>
        </form>

        {leagueRes === 'joined' && (
          <span>
            Successfully joined <strong>{leagueCode}</strong> 🎉
          </span>
        )}
        {status === 'authenticated' &&
          userInfo?.data?.user?.league &&
          leagueRes !== 'left' && (
            <form
              className="flex flex-col w-80"
              onSubmit={(e) => handleLeaveSubmit(e)}
            >
              <button className="p-2 bg-red-200 text-orange-800 rounded-md">
                Leave current league
              </button>
            </form>
          )}
        {leagueRes === 'left' && <span>Successfully left league.</span>}
        {/* <form
          className="flex flex-col w-80"
          onSubmit={(e) => handleJoinSubmit(e, leagueCode)}
        >
          <h2 className="text-lg mb-2">Create a new league</h2>
          <label className="mb-2">League name</label>
          <input
            className="border p-2 rounded-md font-rubik text-lg text-orange-900"
            type="text"
            minLength={5}
            maxLength={10}
            value={leagueCode}
            onChange={(e) => setLeagueCode(e.target.value)}
          />
          <button className="mt-2 p-2 bg-orange-200 text-orange-800 rounded-md">
            Create
          </button>
        </form>
        {createRes === 'success' && (
          <span>
            Successfully joined <strong>{leagueCode}</strong> 🎉
          </span>
        )} */}
      </main>
    </Layout>
  )
}

export default League
