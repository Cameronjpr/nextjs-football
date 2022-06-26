import React, { useContext, useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import { randomUUID } from 'crypto'
import prisma from '../../lib/prisma'
import classNames from 'classnames'
import { getSession, useSession } from 'next-auth/react'
import { Status } from '../../domains/account/types'
import { useRouter } from 'next/router'
import axios from 'axios'
import { UserContext } from '..'
import { User } from '@prisma/client'
import { teams } from '../../data/teams'
import Image from 'next/image'

export const getServerSideProps: GetStaticProps = async (context) => {
  const session = await getSession(context)
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || '',
    },
    select: {
      name: true,
      username: true,
      score: true,
      selection: true,
    },
  })

  return { props: { user } }
}

const Profile = ({ user }: { user: User }) => {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user.username ?? 'You')
  const [tempUsername, setTempUsername] = useState(username)

  const router = useRouter()

  const userData = useContext(UserContext)

  console.log(session)

  if (status === Status.Unauthenticated) {
    router.push(
      encodeURI('/login?message=You must be signed in to view this page.')
    )
  }
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
      },
    },
  }

  const updateProfile = async () => {
    const res = await axios
      .post('/api/profile/update', {
        username: tempUsername,
      })
      .then((response) => {
        // setUsername(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Layout>
      <div className="flex flex-col place-content-center">
        <main className="">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1"
          >
            <div className="w-full p-5 rounded-full bg-slate-100 flex place-content-between">
              {isEditing ? (
                <>
                  {/* Refactor these two sections, they're almost identical */}
                  <div className="flex flex-row gap-5 items-center">
                    {session?.user?.image && (
                      <Image
                        src={session?.user?.image || ''}
                        alt={`The player ${session?.user?.name}`}
                        width="80"
                        height="80"
                        className="w-10 h-10 sm:w-20 sm:h-20 p-2 sm:p-3 rounded-full"
                      />
                    )}

                    <input
                      type="text"
                      className="p-2 rounded-md text-xl sm:text-3xl w-auto"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex flex-row place-content-end">
                    <button
                      className="sm:p-3 w-10 h-10 sm:w-20 sm:h-20 rounded-full sm:text-md bg-green-400 text-slate-700"
                      onClick={() => {
                        setUsername(tempUsername)
                        setIsEditing(false)
                        updateProfile()
                      }}
                    >
                      Done
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-row gap-5 items-center">
                    {session?.user?.image && (
                      <Image
                        src={session?.user?.image || ''}
                        alt={`The player ${session?.user?.name}`}
                        width="80"
                        height="80"
                        className="w-10 h-10 sm:w-20 sm:h-20 p-2 sm:p-3 rounded-full"
                      />
                    )}
                    <h1 className="p-2 text-xl sm:text-3xl">{username}</h1>
                  </div>
                  <div className="flex flex-row place-content-end">
                    <button
                      className="sm:p-3 w-10 h-10 sm:w-20 sm:h-20 rounded-full sm:text-md bg-slate-300 text-slate-700"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
            <section className="p-5">
              <h2 className="text-xl">Your selection</h2>
              {user?.selection && (
                <p>
                  This week, you have selected{' '}
                  <strong className="font-semibold">
                    {teams[Number(user?.selection)]}
                  </strong>
                  .
                </p>
              )}
            </section>
          </motion.div>
        </main>
      </div>
    </Layout>
  )
}

export default Profile
