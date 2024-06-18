"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VideoCard from "./_component/VideoCard";
import { useGetInterviews } from "./_lib/queries/useInterviewQuery";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import NoData from "../_component/NoData";
import Loading from "../_component/Loading";
import { CiSearch } from "react-icons/ci";
import debounce from "../_lib/debounce";

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
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative flex items-center w-full">
      <CiSearch className="absolute left-3 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        placeholder="검색어를 입력하세요"
        className="h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
});

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`p-2 mx-1 border rounded ${i === currentPage ? "bg-gray-200" : ""}`}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="p-2 mx-2 border rounded disabled:opacity-50"
      >
        이전
      </button>
      {renderPageNumbers()}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 mx-2 border rounded disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
};
const Videos = () => {
  const [sortType, setSortType] = useState<"new" | "like">("new");
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const {
    data: videoList,
    isLoading,
    refetch,
  } = useGetInterviews({
    sortType,
    page,
    keyword,
  });

  const handleSortType = (value: string) => {
    setSortType(value as "new" | "like");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    refetch();
  }, [sortType, keyword, page]);

  if (isLoading || !videoList) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex justify-between items-center w-full mb-2 gap-4">
        <Search setKeyword={setKeyword} keyword={keyword} />
        <div className="flex-grow w-32">
          <Select onValueChange={handleSortType}>
            <SelectTrigger>
              <SelectValue placeholder="최신순" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">최신순</SelectItem>
              <SelectItem value="like">인기순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {videoList.content.length === 0 && <NoData />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {videoList.content.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={videoList.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Videos;
