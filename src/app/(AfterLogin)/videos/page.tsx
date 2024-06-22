"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VideoCard from "./_component/VideoCard";
import { useGetInfinityInterviews } from "./_lib/queries/useInterviewQuery";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import NoData from "../_component/NoData";
import Loading from "../_component/Loading";
import { CiSearch } from "react-icons/ci";
import debounce from "../_lib/debounce";
import useIntersectionObserver from "./_lib/hooks/useInterSection";

interface SearchProps {
  setKeyword: (keyword: string) => void;
  keyword: string;
}

const Search = memo(({ setKeyword, keyword }: SearchProps) => {
  const [inputValue, setInputValue] = useState<string>(keyword);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSetKeyword = useCallback(
    debounce((value: string) => {
      setKeyword(value);
    }, 500),
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetKeyword(value);
  };

  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  return (
    <div className="relative flex items-center w-48">
      <CiSearch className="absolute text-muted-foreground left-2" />
      <input
        ref={inputRef}
        type="text"
        placeholder="무엇을 찾고 계신가요?"
        className="w-full pl-8 pr-2 py-1 rounded-md bg-background border-none border-input text-basic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
});

Search.displayName = "SearchComponent";

const Videos = () => {
  const [sortType, setSortType] = useState<"new" | "like">("new");
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, refetch, fetchNextPage } = useGetInfinityInterviews({
    pageParam: page,
    sortType,
    keyword,
  });

  const { setTarget } = useIntersectionObserver({
    hasNextPage: true,
    fetchNextPage,
  });

  const handleSortType = (value: string) => {
    setSortType(value as "new" | "like");
  };

  useEffect(() => {
    refetch();
  }, [sortType, keyword, page]);

  // 정렬이 바뀌거나 검색어가 바뀌면 첫 페이지로 이동
  useEffect(() => {
    setPage(1);
  }, [sortType, keyword]);

  const videoList = data?.pages.map((page) => page.content).flat();
  const totalElement = data?.pages[0].totalElements;

  if (isLoading || !videoList) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex justify-end items-center w-full mb-2 gap-2">
        <Search setKeyword={setKeyword} keyword={keyword} />
        <div className="w-20">
          <Select onValueChange={handleSortType}>
            <SelectTrigger className="border-none pr-0">
              <SelectValue placeholder="최신순" className="border-none">
                최신순
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">최신순</SelectItem>
              <SelectItem value="like">인기순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <span className="text-sm">전체 {totalElement}</span>

      {videoList.length === 0 && <NoData />}
      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"> */}
      <div className="grid grid-cols-2 gap-4 lg:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 pt-4">
        {videoList.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
      <div className="h-5 flex justify-center items-center" ref={(ref) => setTarget(ref)} />
    </div>
  );
};

export default Videos;
