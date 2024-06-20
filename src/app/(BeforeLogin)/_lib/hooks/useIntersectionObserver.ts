import { useState, useEffect, useRef } from "react";

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

const useIntersectionObserver: ({
  root,
  rootMargin,
  threshold,
}: IntersectionObserverOptions) => [React.RefObject<HTMLElement>, boolean] = ({
  root,
  rootMargin,
  threshold,
}) => {
  const [inView, setInView] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementRef, root, rootMargin, threshold]);

  return [elementRef, inView];
};

export default useIntersectionObserver;
