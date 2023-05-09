import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { ratelimit } from "../../../utils/rateLimit";

export const topicRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.topic.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
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
      return ctx.prisma.topic.delete({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session.user.id;
      const { success } = await ratelimit.limit(authorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      return ctx.prisma.topic.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),
});
