import prisma from 'lib/prisma'
import { z } from 'zod'

import { active, finished } from '@/data/__mocks/gameweekfixtures'
import { richTeams } from '@/data/teams'
import * as trpc from '@trpc/server'

export type Player = z.infer<typeof PlayerSchema>
const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string().nullable(),
  score: z.number(),
  selection: z.number().nullable(),
  selections: z.array(z.number()),
})

export type Team = z.infer<typeof TeamSchema>
const TeamSchema = z.object({
  basic_id: z.number(),
  id: z.number(),
  isHome: z.boolean(),
  name: z.string(),
  order: z.number(),
  score: z.number(),
  primaryColor: z.string(),
  secondaryColor: z.string().nullable(),
  shortName: z.string(),
})

export type Fixtures = z.infer<typeof FixturesSchema>
export type Fixture = z.infer<typeof FixtureSchema>
const FixtureSchema = z.object({
  code: z.number(),
  event: z.number(),
  finished: z.boolean(),
  finished_provisional: z.boolean(),
  id: z.number(),
  kickoff_time: z.string(),
  pulse_id: z.number(),
  started: z.boolean(),
  stats: z.any(),
  team_a: z.number(),
  team_a_difficulty: z.number(),
  team_a_score: z.number().nullable(),
  team_h: z.number(),
  team_h_difficulty: z.number(),
  team_h_score: z.number().nullable(),
  teams: z.array(TeamSchema),
})
const FixturesSchema = z.array(FixtureSchema)

export const appRouter = trpc
  .router()
  .query('getFixtures', {
    async resolve() {
      const res = await fetch('https://fantasy.premierleague.com/api/fixtures/')
      const fixtures = (await res.json()) as Fixtures

      const formattedFixtures = fixtures.map((f: Fixture, idx: number) => {
        return {
          ...f,
          teams: [
            {
              basic_id: f.team_h - 1,
              score: f.team_h_score,
              ...richTeams[f.team_h - 1],
              isHome: true,
            },
            {
              basic_id: f.team_a - 1,
              score: f.team_a_score,
              ...richTeams[f.team_a - 1],
              isHome: false,
            },
          ],
        }
      })
      return formattedFixtures as Fixtures
    },
  })
  .query('getUsers', {
    async resolve() {
      try {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            selections: true,
            name: true,
            username: true,
            score: true,
            league: true,
          },
        })
        return { success: true, users }
      } catch (e) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'BAD_REQUEST',
        })
      }
    },
  })
  .query('getUser', {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })
      return { success: true, user }
    },
  })
  .mutation('updateUsername', {
    input: z.object({
      email: z.string(),
      username: z.string(),
    }),
    async resolve({ input }) {
      const isNameAlreadyTaken = await prisma.user.findFirst({
        where: {
          username: input.username,
        },
      })

      if (isNameAlreadyTaken !== null) {
        console.log(
          'username already taken!',
          input.username,
          isNameAlreadyTaken
        )
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'This username is already taken.',
        })
      }
      const user = await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          username: input.username,
        },
      })
      return { user }
    },
  })
  .mutation('deleteUser', {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input }) {
      const deleteUser = await prisma.user.delete({
        where: {
          email: input.email,
        },
      })
    },
  })
  .mutation('joinLeague', {
    input: z.object({
      email: z.string(),
      code: z.string(),
    }),
    async resolve({ input }) {
      const result = await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          league: input.code,
        },
      })

      return result
    },
  })
  .mutation('makeGameweekSpecificSelection', {
    input: z.object({
      selection: z.number(),
      gameweek: z.number(),
      selections: z.array(z.number()),
      email: z.string(),
    }),
    async resolve({ input }) {
      let newSelections: number[] = []

      for (let i = 0; i < 38; i++) {
        if (i + 1 === input.gameweek) {
          newSelections[i] = input.selection
        } else {
          newSelections[i] =
            input.selections[i] === -1 ? -1 : input.selections[i]
        }
      }

      const selectionSaved = await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          selections: {
            set: newSelections,
          },
        },
      })
      return selectionSaved
    },
  })

// export type definition of API
export type AppRouter = typeof appRouter
