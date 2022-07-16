import { NextApiRequest, NextApiResponse } from 'next/types'
import { getSession } from 'next-auth/react'
import axios from 'axios'
import { groupFixturesByDate } from '../../../util/fixtures'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fixtures = await axios.get(
    'https://fantasy.premierleague.com/api/fixtures/')
  .catch((error) => {
    console.log(error)
  })

  if (!fixtures?.data?.length) res.json({})
  
  const groupedFixtures = groupFixturesByDate(fixtures?.data?.length)

  res.json(groupedFixtures)
  
}
