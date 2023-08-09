import type { RefObject } from 'react';
import { useEffect, useState, useRef } from 'react';

export default function useOnScreen(ref: RefObject<HTMLElement>) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => {
      {
        if (entry) {
          setIsOnScreen(entry.isIntersecting);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (observerRef.current && ref.current instanceof Element) {
      observerRef.current.observe(ref.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref]);

  return isOnScreen;
}
