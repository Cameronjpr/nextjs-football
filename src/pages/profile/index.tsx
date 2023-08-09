import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { signOut, useSession } from 'next-auth/react'
import { Status } from '../../account/types'
import { useRouter } from 'next/router'
import { User } from '@prisma/client'
import { richTeams, teams } from '../../data/teams'
import Head from 'next/head'
import { trpc } from '@/utils/trpc'
import Heading from '@/components/Heading/Heading'
import { Button } from '@/components/ui/button'
import Link from '@/components/Link/Link'
import { Session } from 'next-auth'
import {
  getFixtureFromSelectionAndGameweek,
  getPointsFromFixtureAndSelection,
} from '@/utils/scores'

const Profile = () => {
  const { data: session, status } = useSession()

  const [username, setUsername] = useState('')

  const router = useRouter()

  const userInfo = trpc.useQuery([
    'getUser',
    { email: session?.user?.email ?? '' },
  ])

  useEffect(() => {
    if (status === Status.Unauthenticated) {
      router.push(encodeURI('/auth/signin'))
    }
  }, [router, status])

  return (
    <Layout>
      <Head>
        <title>Profile</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <div className="flex w-full sm:max-w-xs flex-col place-content-center">
        <main className="my-4">
          {userInfo?.data?.user?.name ? (
            <Heading level="1">
              Hi,{' '}
              {userInfo?.data?.user?.username ??
                userInfo?.data?.user?.name ??
                'there'}
              !
            </Heading>
          ) : null}

          <UsernameField
            username={userInfo?.data?.user?.username}
            setUsername={setUsername}
            session={session}
          />

          <section className="flex w-full place-content-center">
            <Button onClick={() => signOut()}>Sign out</Button>
          </section>

          <SelectionHistory selections={userInfo?.data?.user?.selections} />

          <DangerZone session={session} />
        </main>
      </div>
    </Layout>
  )
}

type UsernameFieldProps = {
  username: string | null | undefined
  session: Session | null
  setUsername: (username: string) => void
}

const UsernameField = (props: UsernameFieldProps) => {
  const { username, session, setUsername } = props
  const [usernameError, setUsernameError] = useState('')
  const utils = trpc.useContext()

  const handleUpdateUsername = (e: any) => {
    setUsernameError('')
    if (!session?.user?.email) return

    e.preventDefault()
    updateUsername.mutate({
      email: session?.user?.email,
      username: username ?? '',
    })
  }

  const updateUsername = trpc.useMutation(['updateUsername'], {
    onSuccess: (res) => {
      console.log(res)
      if (res?.user?.username) {
        utils.refetchQueries(['getUser'])
      }
    },
    onError: (data) => {
      setUsernameError(data.message)
    },
  })

  return (
    <div className="my-8 flex w-full flex-col gap-1">
      <form className="self-center flex flex-col w-64">
        <fieldset className="flex flex-col">
          <label className="font-semibold" htmlFor="username">
            Username
          </label>
          {usernameError ? (
            <span aria-live="polite" className="block text-red-700 w-full">
              {usernameError}
            </span>
          ) : null}
          <input
            name="username"
            className="border border-emerald-900 self-center w-full rounded-md my-2"
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={16}
            type="text"
            value={username ?? ''}
          />

          <Button
            loading={updateUsername.isLoading}
            onClick={(e: any) => handleUpdateUsername(e)}
          >
            Update
          </Button>
        </fieldset>
      </form>
    </div>
  )
}

type DangerZoneProps = {
  session: Session | null
}

const DangerZone = (props: DangerZoneProps) => {
  const { session } = props
  const [showRealDeleteButton, setShowRealDeleteButton] = useState(false)
  const [error, setError] = useState('')

  const deleteUser = trpc.useMutation(['deleteUser'], {
    onSuccess: (res) => {
      signOut()
    },
    onError: (data) => {
      setError(data.message)
    },
  })

  const handleDeleteAccount = () => {
    deleteUser.mutate({ email: session?.user?.email ?? '' })
  }

  const handleShowDeleteButton = () => {
    setShowRealDeleteButton(true)
  }

  return (
    <div className="flex flex-col justify-center gap-4 mt-20 bg-red-100 p-5 rounded-lg">
      <h2 className="text-center font-semibold text-red-800">
        🚨 Danger Zone 🚨
      </h2>
      {showRealDeleteButton ? (
        <div className="flex flex-col gap-4">
          <p className="text-center">
            Are you sure you want to delete your account?{' '}
            <strong className="text-red-700">This is IRREVERSIBLE.</strong>
          </p>
          <div className="self-center flex flex-row gap-4">
            <Button onClick={() => setShowRealDeleteButton(false)}>
              No, keep my account
            </Button>
            <Button
              loading={deleteUser.isLoading}
              variant="destructive"
              onClick={handleDeleteAccount}
            >
              Yes, delete my account
            </Button>
          </div>
        </div>
      ) : (
        <div className="self-center w-36">
          <Button variant="destructive" onClick={handleShowDeleteButton}>
            Delete account
          </Button>
        </div>
      )}
    </div>
  )
}

type SelectionHistoryProps = {
  selections: Array<number> | undefined
}

const SelectionHistory = (props: SelectionHistoryProps) => {
  const { selections } = props

  if (!selections) {
    return null
  }

  return (
    <section className="w-full sm:xs p-3 pt-10">
      <Heading level="body">Selection History</Heading>
      {selections.map((selection, index) => {
        return (
          <div
            key={selection}
            className="flex w-full justify-between border-b-2 border-orange-200 p-1"
          >
            <span className="text-orange-900">Week {index + 1}</span>
            <span>{richTeams[selection]?.name ?? ''}</span>
          </div>
        )
      })}
    </section>
  )
}

export default Profile
