import { NextApiRequest, NextApiResponse } from 'next/types'
import { getSession } from 'next-auth/react'
import axios from 'axios'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fixtures = await axios.get(
    'https://fantasy.premierleague.com/api/fixtures/')
  .then(response => console.log(response.data)).catch((error) => {
    console.log(error)
  })

  res.json(fixtures)

  console.log(fixtures)

  
}
