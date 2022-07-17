import * as trpc from "@trpc/server";
import prisma from "lib/prisma";
import { useQuery } from "react-query";
import { z } from "zod";

export type Player = z.infer<typeof PlayerSchema>;
const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string().nullable(),
  score: z.number(),
  selection: z.number().nullable(),
});

export const appRouter = trpc
  .router()
  .query("getUsers", {
    async resolve() {
      try {
        const users = await prisma.user.findMany({});
        return { success: true, users };
      } catch (e) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "BAD_REQUEST",
        });
      }
    },
  })
  .query("getUser", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      return { success: true, user };
    },
  })
  .mutation("makeSelection", {
    input: z.object({
      selection: z.number(),
      email: z.string(),
    }),
    async resolve({ input }) {
      const selectionSaved = await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          selection: input.selection,
        },
      });

      return { success: true, user: selectionSaved };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
