import * as trpc from '@trpc/server';
import prisma from 'lib/prisma';
import { useQuery } from 'react-query';
import { z } from 'zod';

export const appRouter = trpc
  .router()
  .query('getUsers', {
    async resolve() {
      const users = prisma.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          score: true,
          selection: true,
        },
      })

      return { success: true, users }
    }
  })
  .query('getUser', {
    input: z.object({
      email: z.string()
    }),
    async resolve({input}) {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email
        }
      })

      return { success: true, user }
    }
  })
  .mutation('makeSelection', {
    input: z.object({
      selection: z.number(),
      email: z.string()
    }),
    async resolve({input}) {
      const selectionSaved = await prisma.user.update({
        where: {
          email: input.email
        },
        data: {
          selection: input.selection.toString()
        }
      })

      return { success: true, user: selectionSaved }
    }
  })

// export type definition of API
export type AppRouter = typeof appRouter;
