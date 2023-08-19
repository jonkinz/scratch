import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
// import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
// import { Redis } from "@upstash/redis";
import type { Note } from '@prisma/client';
// import * as Constants from "../../../constants"
// import * as Constants from '~/constants';
import { NoteSchema } from '~/constants/NoteSchema';

// Create a new ratelimiter, that allows 10 requests per 10 seconds
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(3, "1 m"),
//   analytics: true,
//   /**
//    * Optional prefix for the keys used in redis. This is useful if you want to share a redis
//    * instance with other applications and want to avoid key collisions. The default prefix is
//    * "@upstash/ratelimit"
//    */
//   prefix: "@upstash/ratelimit",
// });

// const NOTE_TITLE_LENGTH_MIN = 1;
// const NOTE_TITLE_LENGTH_MAX = 3;
// const ERROR_MESSAGE_MIN = `Note title should be at least ${NOTE_TITLE_LENGTH_MIN} character`;
// const ERROR_MESSAGE_MAX = `Note title should be at least ${NOTE_TITLE_LENGTH_MAX} characters`;

export const noteRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      // z.object({ title: z.string().min(1).max(2), content: z.string(), topicId: z.string() })
      NoteSchema
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.create({
        data: {
          title: input.title,
          topicId: input.topicId,
          content: input.content,
        },
      });
    }),

  getAll: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findMany({
        where: {
          topicId: input.topicId,
        },
        take: 100,
        orderBy: {
          createdAt: 'desc',
        },
      });
    }),

  // get a note by its id
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.note.findFirst({
      where: {
        id: input,
      },
    });
  }),
});
