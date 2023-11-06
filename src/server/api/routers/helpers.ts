import { ratelimit } from '~/utils/rateLimit';
import { TRPCError } from '@trpc/server';
// Truncate strings with an ellipsis when the length exceeds some limit.
export function truncate(string: string, limit: number) {
  if (string.length <= limit) {
    return string;
  }
  return string.slice(0, limit) + '...';
}

export const rateLimiter = async (userId: string) => {
  //Your code here
  const authorId = userId;
  console.log(`user id is ${userId}`);
  const { success } = await ratelimit.limit(authorId);
  if (!success) {
    console.log('foo');
    throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
  }
  console.log('bar');
};
//
