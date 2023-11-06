// Truncate strings with an ellipsis when the length exceeds some limit.
export function truncate(string: string, limit: number) {
  if (string.length <= limit) {
    return string;
  }
  return string.slice(0, limit) + '...';
}
