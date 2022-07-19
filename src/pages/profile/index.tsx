import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useSession } from 'next-auth/react'
import { Status } from '../../account/types'
import { useRouter } from 'next/router'
import { User } from '@prisma/client'
import { richTeams } from '../../data/teams'
import Head from 'next/head'
import { trpc } from '@/utils/trpc'

const Profile = ({ user }: { user: User }) => {
  const { data: session, status } = useSession()

  const router = useRouter()

  const userInfo = trpc.useQuery([
    'getUser',
    { email: session?.user?.email ?? '' },
  ])

  useEffect(() => {
    if (status === Status.Unauthenticated) {
      router.push(
        encodeURI('/login?message=You must be signed in to view this page.')
      )
    }
  }, [router, status])

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
        <main className="my-10">
          {userInfo?.data?.user?.name && (
            <h1 className="w-full rounded-md p-2 font-rubik text-3xl italic text-orange-600 sm:text-5xl">
              Hi, {userInfo?.data?.user?.name}!
            </h1>
          )}
          <div className="my-8 flex w-full flex-col gap-1">
            <section className="text-xl">
              {userInfo?.data?.user?.selections?.length && (
                <p>
                  This week, you have selected{' '}
                  <strong className="font-semibold">
                    {richTeams[userInfo?.data?.user?.selections[1]]?.shortName}
                  </strong>
                  .
                </p>
              )}
            </section>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Profile
