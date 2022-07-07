import { NextApiRequest, NextApiResponse } from 'next/types'
import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'
import axios from 'axios'
import { groupFixturesByDate } from '../../util/fixtures'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body
  const session = await getSession({ req })

  if (!session?.user?.email) return

  const fixtures = await axios
    .get('https://fantasy.premierleague.com/api/fixtures/')
    .catch((error) => {
      console.log(error)
    })

  if (!fixtures?.data?.length) res.json({})

  const groupedFixtures = groupFixturesByDate(fixtures?.data?.length)

  const selections = await prisma.user.findMany({})

  // const selections = await prisma.user.update({
  //   where: {
  //     email: session?.user?.email,
  //   },
  //   data: {
  //     selection: id,
  //   },
  // })
  res.json(result)
}
