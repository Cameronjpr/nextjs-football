import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { signOut, useSession } from 'next-auth/react'
import { Status } from '../../account/types'
import { useRouter } from 'next/router'
import { User } from '@prisma/client'
import { richTeams } from '../../data/teams'
import Head from 'next/head'
import { trpc } from '@/utils/trpc'
import Heading from '@/components/Heading/Heading'
import Button from '@/components/Button/Button'
import Link from '@/components/Link/Link'

const Profile = ({ user }: { user: User }) => {
  const { data: session, status } = useSession()
  const [showRealDeleteButton, setShowRealDeleteButton] = useState(false)
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const router = useRouter()

  const userInfo = trpc.useQuery([
    'getUser',
    { email: session?.user?.email ?? '' },
  ])

  useEffect(() => {
    console.log(userInfo?.data)
  }, [userInfo])

  const deleteUser = trpc.useMutation(['deleteUser'], {
    onSuccess: (res) => {
      signOut()
    },
    onError: (data) => {
      setError(data.message)
    },
  })

  const updateUsername = trpc.useMutation(['updateUsername'], {
    onSuccess: (res) => {
      if (res?.user?.username) {
        setUsername(res.user.username)
        router.reload()
      }
    },
    onError: (data) => {
      setUsernameError(data.message)
    },
  })

  useEffect(() => {
    if (status === Status.Unauthenticated) {
      router.push(encodeURI('/auth/signin'))
    }
  }, [router, status])

  const handleDeleteAccount = () => {
    deleteUser.mutate({ email: session?.user?.email ?? '' })
  }

  const handleShowDeleteButton = () => {
    setShowRealDeleteButton(true)
  }

  const handleUpdateUsername = (e: any) => {
    setUsernameError('')
    if (!session?.user?.email) return

    e.preventDefault()
    updateUsername.mutate({
      email: session?.user?.email,
      username: username,
    })
  }

  return (
    <Layout>
      <Head>
        <title>Profile - Soccer Predictor</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <div className="flex w-full flex-col place-content-center">
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
          <div className="my-8 flex w-full flex-col gap-1">
            <section className="text-xl">
              {userInfo?.data?.user?.selections?.length ? (
                <Heading level="2">
                  Your selection:{' '}
                  <strong className="font-semibold">
                    {richTeams[userInfo?.data?.user?.selections[0]]?.shortName}
                  </strong>
                  .
                </Heading>
              ) : (
                <div className="flex flex-col items-center">
                  <Heading level="2">You haven’t made any selections.</Heading>
                  <Link href="/fixtures">Go to fixtures</Link>
                </div>
              )}
            </section>
            <form className="self-center flex flex-col w-64">
              <fieldset className="flex flex-col">
                <label className="font-semibold" htmlFor="username">
                  Username
                </label>
                {usernameError ? (
                  <span
                    aria-live="polite"
                    className="block text-red-700 w-full"
                  >
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
                  value={username}
                />
                <Button
                  isLoading={updateUsername.isLoading}
                  onClick={(e: any) => handleUpdateUsername(e)}
                >
                  Update
                </Button>
              </fieldset>
            </form>
          </div>
          <div className="flex flex-col justify-center gap-4 mt-20">
            <h2 className="text-center font-semibold text-red-800">
              🚨 Danger Zone 🚨
            </h2>
            {showRealDeleteButton ? (
              <div className="flex flex-col gap-4">
                <p className="text-center">
                  Are you sure you want to delete your account?{' '}
                  <strong className="text-red-700">
                    This is IRREVERSIBLE.
                  </strong>
                </p>
                <div className="self-center flex flex-row gap-4">
                  <Button onClick={() => setShowRealDeleteButton(false)}>
                    No, keep my account
                  </Button>
                  <Button
                    isLoading={deleteUser.isLoading}
                    type="warning"
                    onClick={handleDeleteAccount}
                  >
                    Yes, delete my account
                  </Button>
                </div>
              </div>
            ) : (
              <div className="self-center w-36">
                <Button onClick={handleShowDeleteButton}>Delete account</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Profile
