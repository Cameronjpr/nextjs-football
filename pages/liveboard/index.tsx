import React, { useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../../components/Layout/Layout'
import { motion } from 'framer-motion'
import { randomUUID } from 'crypto'
import prisma from '../../lib/prisma'
import classNames from 'classnames'
import axios from 'axios'
import { parse, isBefore } from 'date-fns'
import { finished } from '../../data/__mocks/gameweekfixtures'
import {
  getResultFromFixture,
  getSelectionFixtureInGameweek,
} from '../../util/fixtures'

export const getStaticProps: GetStaticProps = async () => {
  const general = await axios
    .get('https://fantasy.premierleague.com/api/bootstrap-static/')
    .catch((error) => {
      console.log(error)
    })

  const activeGameweek = general?.data?.events?.filter(
    (e: any) => e.is_current || e.is_next
  )[0].id

  // THESE ARE THE REAL FIXTURES
  // const fixtures = await axios
  //   .get('https://fantasy.premierleague.com/api/fixtures/')
  //   .catch((error) => {
  //     console.log(error)
  //   })

  const activeGameweekFixtures = finished?.data.filter(
    (f: any) => f.event === activeGameweek
  )

  /*
  
    HOW IT WORKS
    1. find the current gameweek
    2. get the games from the current gameweek
    3. get all the users and their selections
    4. for all the users whose selections have played, calculate the scoring, and set their calculated=true

  */

  // console.log(activeGameweekFixtures)
  // console.log(
  //   isBefore(
  //     new Date(fixtures?.data[0].kickoff_time),
  //     new Date('2022-08-11T19:00:00Z')
  //   )
  // )

  const initialUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      score: true,
      selection: true,
      calculated: true,
    },
  })

  let users

  initialUsers.forEach(async (u) => {
    console.log(u.selection, u.calculated)
    if (u?.calculated) return
    if (u.selection !== null) {
      const relevantFixture = getSelectionFixtureInGameweek(
        activeGameweekFixtures,
        Number(u?.selection) + 1
      )

      console.log(relevantFixture)
      if (relevantFixture.length === 0) return
      const result = getResultFromFixture(
        relevantFixture[0],
        Number(u?.selection) + 1
      )

      console.log(result)

      let points

      switch (result) {
        case 'win':
          points = 3
          break
        case 'draw':
          points = 1
          break
        default:
          points = 0
      }

      await prisma.user.update({
        where: {
          id: u?.id,
        },
        data: {
          score: u.score ? (u.score += points) : points,
          calculated: true,
        },
      })
    }
  })

  users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      score: true,
      selection: true,
    },
  })

  return { props: { users }, revalidate: 60 }
}

type User = {
  id: string
  username?: string
  name: string
  score: number
  selection: string
  calculated: boolean
}

type LeaderboardProps = {
  users: User[]
}

const Leaderboard = ({ users }: LeaderboardProps) => {
  const [gameweek, setGameweek] = useState(1)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
      },
    },
  }

  return (
    <Layout>
      <main className="flex flex-col place-content-center w-full sm:max-w-3xl">
        <div className="flex flex-col gap-1">
          {users
            .sort((a: User, b: User) => b.score - a.score)
            .map((player: User, idx) => (
              <div
                key={player.id}
                className={classNames(
                  'px-2 flex flex-row place-content-between border-b-2 border-dashed text-xl',
                  idx ? 'bg-white' : 'bg-yellow-300'
                )}
              >
                <div>
                  <span>{idx + 1}</span>
                  <h2 className="pl-3 inline">
                    {player?.username || player.name}
                  </h2>
                </div>
                <span>{player.score ?? 0}</span>
              </div>
            ))}
        </div>
      </main>
    </Layout>
  )
}

export default Leaderboard
