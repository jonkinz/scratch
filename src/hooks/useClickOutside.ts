import type { RefObject } from 'react';
import { useEffect } from 'react';

type Event = MouseEvent | TouchEvent;

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  isVisible = true,
  ref: RefObject<T>,
  callback: (event: Event) => void
) => {
  useEffect(() => {
    if (!isVisible) {
      return; // If your html  element is not visible, don't do anthing.
    }
    const listener = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };
    document.addEventListener('click', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('click', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [isVisible, ref, callback]); // Reload only if ref or handler changes
};

export default useOnClickOutside;
