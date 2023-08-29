import { z } from 'zod';
import * as Constants from '~/constants';

export const NoteValidateSchema = z.object({
  title: z
    .string()
    .min(Constants.NOTE_TITLE_LENGTH_MIN, {
      message: Constants.ERROR_MESSAGE_MIN,
    })
    .max(Constants.NOTE_TITLE_LENGTH_MAX, {
      message: Constants.ERROR_MESSAGE_MAX,
    }),
  note: z.string(),
  topic: z.string(),
});
