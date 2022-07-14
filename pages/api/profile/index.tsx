import { NextApiRequest, NextApiResponse } from 'next/types'
import { getSession } from 'next-auth/react'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session?.user?.email) return

  const result = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
    select: {
      name: true,
      username: true,
      score: true,
      selection: true,
    },
  })
  res.json(result)
}
