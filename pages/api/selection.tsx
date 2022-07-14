import { NextApiRequest, NextApiResponse } from 'next/types'
import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body
  const session = await getSession({ req })

  console.log(id)

  if (!session?.user?.email) return

  const result = await prisma.user.update({
    where: {
      email: session?.user?.email,
    },
    data: {
      selection: String(id),
      calculated: false,
    },
  })
  res.json(result)
}
