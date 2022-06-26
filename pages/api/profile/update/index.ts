import { NextApiRequest, NextApiResponse } from 'next/types'
import { getSession } from 'next-auth/react'
import prisma from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.body
  const session = await getSession({ req })

  if (!session?.user?.email || !username) return

  const result = await prisma.user.update({
    where: {
      email: session?.user?.email,
    },
    data: {
      username: username,
    },
  })
  res.json(result)
}
