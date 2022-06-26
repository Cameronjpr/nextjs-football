import React, { useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import { randomUUID } from 'crypto'
import prisma from '../../lib/prisma'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { Status } from '../../domains/account/types'
import { useRouter } from 'next/router'
import axios from 'axios'

export const getStaticProps: GetStaticProps = async () => {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      score: true,
      selection: true,
    },
  })
  return { props: { users }, revalidate: 1800 }
}

type User = {
  id: string
  name: string
  score: number
  selection: string
}

const Profile = () => {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(session?.user?.name || 'You')
  const [tempUsername, setTempUsername] = useState(username)
  const router = useRouter()

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
                    <span className="text-center text-2xl sm:text-5xl leading-[1.5rem] sm:leading-[3.5rem] w-10 h-10 sm:w-20 sm:h-20 p-2 sm:p-3 rounded-full bg-violet-300">
                      🍉
                    </span>
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
                    <span className="text-center text-2xl sm:text-5xl leading-[1.5rem] sm:leading-[3.5rem] w-10 h-10 sm:w-20 sm:h-20 p-2 sm:p-3 rounded-full bg-violet-300">
                      🍉
                    </span>
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
              <p>
                This week, you have selected{' '}
                <strong className="font-semibold">Arsenal</strong>.
              </p>
            </section>
          </motion.div>
        </main>
      </div>
    </Layout>
  )
}

export default Profile
