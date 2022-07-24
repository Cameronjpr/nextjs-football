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

const Profile = ({ user }: { user: User }) => {
  const { data: session, status } = useSession()
  const [showRealDeleteButton, setShowRealDeleteButton] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const userInfo = trpc.useQuery([
    'getUser',
    { email: session?.user?.email ?? '' },
  ])

  const deleteUser = trpc.useMutation(['deleteUser'], {
    onSuccess: (res) => {
      signOut()
    },
    onError: (data) => {
      setError(data.message)
    },
  })

  useEffect(() => {
    if (status === Status.Unauthenticated) {
      router.push(
        encodeURI('/login?message=You must be signed in to view this page.')
      )
    }
  }, [router, status])

  const handleDeleteAccount = () => {
    deleteUser.mutate({ email: session?.user?.email ?? '' })
  }

  const handleShowDeleteButton = () => {
    setShowRealDeleteButton(true)
  }

  return (
    <Layout>
      <Head>
        <title>Profile - Soccer Survivor</title>
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
            <Heading level="1">Hi, {userInfo?.data?.user?.name}!</Heading>
          ) : null}
          <div className="my-8 flex w-full flex-col gap-1">
            <section className="text-xl">
              {userInfo?.data?.user?.selections?.length ? (
                <Heading level="2">
                  This week, you have selected{' '}
                  <strong className="font-semibold">
                    {richTeams[userInfo?.data?.user?.selections[1]]?.shortName}
                  </strong>
                  .
                </Heading>
              ) : null}
            </section>
          </div>
          <div className="flex flex-row justify-center">
            {showRealDeleteButton ? (
              <div className="flex flex-col gap-2">
                <span className="">
                  Are you sure you want to delete your account?{' '}
                  <strong className="text-red-700">
                    This is IRREVERSIBLE.
                  </strong>
                </span>
                <div className="self-center">
                  <Button type="warning" onClick={handleDeleteAccount}>
                    Yes, delete my account
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={handleShowDeleteButton}>Delete account</Button>
            )}
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Profile
