import { ratelimit } from './rateLimit';
import { TRPCError } from '@trpc/server';
// Truncate strings with an ellipsis when the length exceeds some limit.
export function truncate(string: string, limit: number) {
  if (string.length <= limit) {
    return string;
  }
  return string.slice(0, limit) + '...';
}

// export const rateLimiter = async (userId: string) => {
//   //Your code here
//   const authorId = userId;
//   const { success } = await ratelimit.limit(authorId);
//   if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
// };
//
