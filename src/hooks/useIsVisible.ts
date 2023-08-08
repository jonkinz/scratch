import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export function useIsVisible(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        return setIntersecting(entry.isIntersecting);
      }
    });

    // observer.observe(ref.current as Element);
    if (ref.current instanceof Element) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
