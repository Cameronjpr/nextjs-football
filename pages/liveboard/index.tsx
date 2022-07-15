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
import { teams } from '../../data/teams'

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
      <main className="flex flex-col w-full sm:max-w-3xl p-5 mx-4 bg-teal-800/5 place-content-start rounded-lg drop-shadow-md">
        <table>
          <caption className="mb-4 text-xl font-semibold p-2 drop-shadow-sm bg-teal-800/10 rounded-lg text-teal-900">
            Current leaderboard
          </caption>
          <thead>
            <tr className="border-b-2 text-left underline italic text-slate-600">
              <th className="font-normal pl-2" colSpan={1}>
                #
              </th>
              <th className="font-normal" colSpan={1}>
                Player
              </th>
              <th className="font-normal" colSpan={1}>
                Selection
              </th>
              <th className="font-normal" colSpan={1}>
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {users
              .sort((a: User, b: User) => b.score - a.score)
              .map(({ name, username, selection, score }: User, idx) => (
                <tr
                  key={idx}
                  className={classNames(
                    idx ? 'bg-white' : 'bg-yellow-300',
                    'border-b-4 border-teal-800/5 h-12 rounded-sm'
                  )}
                >
                  <td className="pl-3 w-10">{idx + 1}</td>
                  <td className="font-semibold">{username ?? name}</td>
                  <td>{teams[Number(selection) - 1] ?? ''}</td>
                  <td>{score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
    </Layout>
  )
}

export default Leaderboard

// {
//   users
//     .sort((a: User, b: User) => b.score - a.score)
//     .map((player: User, idx) => (
//       <div
//         key={player.id}
//         className={classNames(
//           'px-2 flex flex-row place-content-between border-b-2 border-dashed text-lg',
//           idx ? 'bg-white' : 'bg-yellow-300'
//         )}
//       >
//         <div className="w-full flex flex-row gap-2">
//           <span>{idx + 1}</span>
//           <div className="w-full flex flex-row justify-between">
//             <h2 className="pl-3 inline">{player?.username || player.name}</h2>
//             <span className="text-slate-800 text-sm leading-7">
//               {teams[Number(player?.selection) - 1] ?? ''}
//             </span>
//           </div>
//           <span className="w-12 text-right">{player.score ?? 0}</span>
//         </div>
//       </div>
//     ))
// }
