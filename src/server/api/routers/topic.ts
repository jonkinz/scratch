import { z } from 'zod';
import type { PrismaClient } from '@prisma/client';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { rateLimiter } from './helpers';

export const createTopicInputSchema = z.object({
  topicName: z.string(),
});

export async function createTopic({
  prisma,
  topicName,
  userId,
}: {
  prisma: PrismaClient;
  topicName: string;
  userId: string;
}) {
  const topic = await prisma.topic.create({
    data: {
      name: topicName,
      userId: userId,
    },
  });
  return topic;
}

export const topicRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // await rateLimiter(ctx.session.user.id);
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      // await rateLimiter(ctx.session.user.id);
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
      // const authorId = ctx.session.user.id;
      // const { success } = await ratelimit.limit(authorId);
      // if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
      // await rateLimmiter(ctx.session.user.id);

      // const topic = await ctx.prisma.topic.create({
      //   data: {
      //     name: input.name,
      //     userId: ctx.session.user.id,
      //   },
      // });

      // await rateLimiter(ctx.session.user.id);
      const topic = await createTopic({
        prisma: ctx.prisma,
        userId: ctx.session.user.id,
        topicName: input.name,
      });
      return topic;
    }),
});
