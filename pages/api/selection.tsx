import { NextApiRequest, NextApiResponse } from 'next/types'
import { teams } from '../../data/teams'

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const { id } = _req.body
  res.status(200).json(teams[id])
}

export default handler
