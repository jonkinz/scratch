import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { NoteSchema } from '~/constants/NoteSchema';
import { UpdateNoteSchema } from '~/constants/UpdateNoteSchema';
import { createTopic } from './topic';
import { rateLimiter } from './helpers';

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
      // await rateLimiter(ctx.session.user.id);

      // if we are creating a new topic for our note, create it, and update the topic id on the input
      if (input.topicName) {
        const topic = await createTopic({
          prisma: ctx.prisma,
          userId: ctx.session.user.id,
          topicName: input.topicName,
        });
        input.topicId = topic.id;
      }
      return ctx.prisma.note.create({
        data: {
          title: input.title,
          topicId: input.topicId,
          content: input.content,
        },
      });
    }),

  update: protectedProcedure
    .input(UpdateNoteSchema)
    .mutation(async ({ ctx, input }) => {
      // Update one Note
      await rateLimiter(ctx.session.user.id);
      return ctx.prisma.note.update({
        where: {
          // ... provide filter here
          id: input.id,
        },
        data: {
          // ... provide data here
          title: input.title,
          topicId: input.topicId,
          content: input.content,
        },
      });
    }),

  getAll: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(({ ctx, input }) => {
      // await rateLimiter(ctx.session.user.id);
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

  getTopicById: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .query(async ({ ctx, input }) => {
      await rateLimiter(ctx.session.user.id);
      return ctx.prisma.note.findUnique({
        where: {
          id: input.noteId,
        },
      });
    }),
  // get a note by its id
  // getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
  //   return ctx.prisma.note.findFirst({
  //     where: {
  //       id: input,
  //     },
  //   });
  // }),
});
