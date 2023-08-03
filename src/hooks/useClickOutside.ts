import { useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
// import type { MouseEventHandler } from 'react';

interface callback {
  // sum: (a: number, b: number) => number;
  // logMessage: (message: string) => void;
  // 👇️ turn off type checking
  // doSomething: (params: any) => any;
  onSave: (note: { title: string; content: string }) => void;
}
// callback needs a type, so I've defined the simplest possible function
export const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // const handleClick = (event: MouseEvent<HTMLElement>) => {
    // const handleClick = (e: any) => {
    //   if (ref.current && !ref.current.contains(event.target)) {
    //     callback();
    //   }
    // };
    if (!ref.current) throw Error('divRef is not assigned');
    const handleClick: Event = (event): void => {
      // Your code
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref]);

  return ref;
};
