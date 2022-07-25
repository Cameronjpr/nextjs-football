import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import classNames from 'classnames'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'
import Heading from '@/components/Heading/Heading'
import Button from '@/components/Button/Button'

const League = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [leagueCode, setLeagueCode] = useState('')
  const [joinedLeague, setJoinedLeague] = useState('')
  const [leagueRes, setLeagueRes] = useState('')
  const [textCopied, setTextCopied] = useState(false)
  const [error, setError] = useState('')

  console.log(router.query)

  const userInfo = trpc.useQuery([
    'getUser',
    {
      email: session?.user?.email ?? '',
    },
  ])

  const joinLeague = trpc.useMutation(['joinLeague'], {
    onSuccess: (res) => {
      setLeagueRes(res?.league ? 'joined' : 'left')
      setJoinedLeague(res?.league ?? '')
      console.log('successfully joined league ', res?.league)
    },
    onError: (data) => {
      setError(data.message)
    },
  })

  useEffect(() => {
    if (
      router?.query?.code &&
      userInfo?.data?.user?.email &&
      userInfo?.data?.user?.league !== router?.query?.code &&
      !joinLeague.isLoading &&
      !joinLeague.isSuccess
    ) {
      console.log('joining league')
      joinLeague.mutate({
        email: userInfo?.data?.user?.email ?? '',
        code: router.query?.code as string,
      })
    }
  }, [router, userInfo, joinLeague])

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

    if (!code) return

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
        <Heading level="1">Leagues</Heading>
        <div className="w-80">
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
        </div>
        {userInfo.isSuccess && !userInfo?.data?.user?.league ? (
          <form className="flex flex-col w-80">
            <label className="mb-2">Enter league code</label>
            <input
              className="border p-2 my-2 rounded-md font-rubik text-lg text-orange-900"
              type="text"
              minLength={5}
              maxLength={10}
              value={leagueCode}
              onChange={(e) => setLeagueCode(e.target.value)}
            />
            <Button
              onClick={(e: any) => handleJoinSubmit(e, leagueCode)}
              isLoading={joinLeague.isLoading}
            >
              Join
            </Button>
          </form>
        ) : null}

        {leagueRes === 'joined' && (
          <span>
            Successfully joined <strong>{joinedLeague}</strong> 🎉
          </span>
        )}
        {status === 'authenticated' &&
          userInfo?.data?.user?.league &&
          leagueRes !== 'left' && (
            <>
              <form
                className="flex flex-col w-80"
                onSubmit={(e) => {
                  e.preventDefault()
                  const inviteLink = `https://soccer-survivor.vercel.app/league?code=${userInfo?.data?.user?.league}`
                  navigator.clipboard.writeText(inviteLink)
                  setTextCopied(true)
                }}
              >
                <span className="text-center font-semibolds p-2">
                  You’re a member of ”{userInfo?.data?.user?.league}”
                </span>
                <button className="p-2 bg-green-200 text-green-800 rounded-md">
                  Copy league invite link
                </button>
                {textCopied ? (
                  <span className="p-1 text-center text-green-900">
                    League invite link copied to clipboard 🎉
                  </span>
                ) : null}
              </form>
              <form
                className="flex flex-col w-80"
                onSubmit={(e) => handleLeaveSubmit(e)}
              >
                <button className="p-2 bg-red-200 text-orange-800 rounded-md">
                  Leave league ”{userInfo?.data?.user?.league}”
                </button>
              </form>
            </>
          )}
        {leagueRes === 'left' && <span>Successfully left league.</span>}
      </main>
    </Layout>
  )
}

export default League
