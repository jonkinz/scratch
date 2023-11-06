import { z } from 'zod';
import * as Constants from '~/constants';

export const NoteSchema = z.object({
  title: z
    .string()
    .min(Constants.NOTE_TITLE_LENGTH_MIN, {
      message: Constants.ERROR_MESSAGE_MIN,
    })
    .max(Constants.NOTE_TITLE_LENGTH_MAX, {
      message: Constants.ERROR_MESSAGE_MAX,
    }),
  content: z.string(),
  topicId: z.string(),
});
