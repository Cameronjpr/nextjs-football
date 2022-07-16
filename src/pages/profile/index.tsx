import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Status } from '../../account/types'
import { useRouter } from 'next/router'
import axios from 'axios'
import { User } from '@prisma/client'
import { teams } from '../../data/teams'
import Image from 'next/image'

const Profile = ({ user }: { user: User }) => {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user?.username ?? 'You')
  const [tempUsername, setTempUsername] = useState(username)
  const [userInfo, setUserInfo] = useState<any>(undefined)

  const router = useRouter()

  useEffect(() => {
    const getUserInfo = async () => {
      if (session?.user?.email === null) return
      const userInfo = await axios.get('/api/profile')

      setUserInfo(userInfo?.data)
      setTempUsername(userInfo?.data?.username)
    }

    getUserInfo()
  }, [session])

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
      .catch((error) => {
        console.log(error)
      })
  }

  const EditButton = () => {
    return isEditing ? (
      <button
        className="sm:p-3 w-16 sm:w-20 sm:h-20 rounded-md sm:text-md text-slate-700"
        onClick={() => {
          setUsername(tempUsername)
          setIsEditing(false)
          updateProfile()
        }}
      >
        Done
      </button>
    ) : (
      <button
        className="sm:p-3 w-16 sm:w-20 sm:h-20 rounded-md sm:text-md text-slate-700"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
    )
  }

  const UsernameField = () => {
    return isEditing ? (
      <input
        type="text"
        className="w-full ml-5 p-2 rounded-md text-xl sm:text-2xl"
        value={tempUsername}
        onChange={(e) => setTempUsername(e.target.value)}
      ></input>
    ) : (
      <h1 className="w-full ml-5 p-2 text-xl sm:text-2xl">
        {userInfo?.username}
      </h1>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col place-content-center w-full">
        <main className="">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1 w-full"
          >
            <div className="w-full p-5 bg-slate-100 rounded-md flex place-content-between">
              <>
                {/* Refactor these two sections, they're almost identical */}
                <div className="w-full flex flex-row gap-5 place-content-between">
                  <div className="w-full flex flex-row items-center">
                    {session?.user?.image && (
                      <Image
                        src={session?.user?.image || ''}
                        alt={`The player ${session?.user?.name}`}
                        quality={80}
                        width="80"
                        height="80"
                        className="w-16 h-16 sm:w-20 sm:h-20 p-2 sm:p-3 rounded-md"
                      />
                    )}
                    {<UsernameField />}
                  </div>
                  <div className="flex flex-row place-content-end">
                    {<EditButton />}
                  </div>
                </div>
              </>
            </div>
            <section className="p-5">
              <h2 className="text-xl mb-2">Your selection</h2>
              {userInfo?.selection && (
                <p>
                  You have selected{' '}
                  <strong className="font-semibold">
                    {teams[Number(userInfo?.selection)]}
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
