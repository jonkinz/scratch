import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { ratelimit } from '../../../utils/rateLimit';

export const topicRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const topics = await ctx.prisma.topic.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: [{ createdAt: 'desc' }],
    });
    return topics;
  }),

  getTopicById: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.topic.findUnique({
        where: {
          id: input.topicId,
        },
      });
    }),
  // topicById: protectedProcedure.query(async (opts) => {
  //   return ctx.prisma.topic.findUnique({
  //     where: {
  //       id: input.topicId,
  //     },
  //   });
  // }),
  //
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const authorId = ctx.session.user.id;
      // const { success } = await ratelimit.limit(authorId);
      // if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
      return ctx.prisma.topic.delete({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    // A topic name should be a string of at least one character, but no more than 100 chars.
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session.user.id;
      const { success } = await ratelimit.limit(authorId);
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

      const topic = await ctx.prisma.topic.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
      return topic;
    }),
});
