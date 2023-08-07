import { useRef, useEffect } from 'react';

export const useOutsideClick = (callback: (e: Event) => void) => {
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // if (!ref.current) throw Error('divRef is not assigned');
    const handleClick = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [callback]);

  return ref;
};
