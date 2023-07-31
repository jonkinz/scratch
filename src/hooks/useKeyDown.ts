import { useEffect } from 'react';

export const useKeyDown = (callback: (a: string) => void, keys: [string]) => {
  const onKeyDown = (event: KeyboardEvent) => {
    console.log('foo');
    const wasAnyKeyPressed = keys.some((key: string) => event.key === key);
    if (wasAnyKeyPressed) {
      event.preventDefault();
      callback(event.key);
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
};

// Example usage:
// useKeyDown(() => {
//   someCallback();
// }, ['Escape']);
