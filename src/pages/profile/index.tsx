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
      router.push(encodeURI('/auth/signin'))
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
              ) : (
                <div className="flex flex-col items-center">
                  <Heading level="2">You haven’t made any selections.</Heading>
                  <Link href="/fixtures">Go to fixtures</Link>
                </div>
              )}
            </section>
          </div>
          <div className="flex flex-col justify-center gap-4">
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
                  <Button type="warning" onClick={handleDeleteAccount}>
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
