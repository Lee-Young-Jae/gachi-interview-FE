import { InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// 랜딩 페이지에서 사용하는 훅과 비슷하게 구현했지만 다른점은 이건 요소가 뷰포트에 들어왔을 때 등록한 함수를 실행하도록 하는 훅
// 랜딩 페이지꺼는 뷰포트안에 들어오면 Boolean값을 반환하는 훅
interface useIntersectionObserverProps {
  threshold?: number;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => Promise<InfiniteQueryObserverResult>;
}

const useIntersectionObserver = ({
  hasNextPage,
  fetchNextPage,
  threshold,
}: useIntersectionObserverProps) => {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!target) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage) {
          await fetchNextPage();
        }
      },
      { threshold: threshold || 0.5 },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [target, hasNextPage, fetchNextPage, threshold]);

  return { setTarget };
};

export default useIntersectionObserver;
