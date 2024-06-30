"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaPen } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InterviewReview from "./InterviewReview";
import GetStudy from "./GetStudy";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PostContent } from "@/model/Post";
import getBoards from "../_lib/getBoards";
import Loading from "../../_component/Loading";
import Search from "../../_component/Search";

export default function CommunityContainer({ category }: { category: string }) {
  const router = useRouter();
  const [sortType, setSortType] = useState<"new" | "like">("new");
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>("");

  const {
    data: boardList,
    error,
    isLoading,
    refetch,
  } = useQuery<PostContent, Object, PostContent, [_1: string, _2: string, _3: string, _4: string]>({
    queryKey: ["community", category, sortType, keyword],
    queryFn: ({ queryKey }) => getBoards({ queryKey, sortType, page, keyword }),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  const handleTabClick = (value: string) => {
    router.replace(`/community?tab=${value}`);
  };

  const handleSortType = (value: string) => {
    setSortType(value as "new" | "like");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    refetch();
  }, [sortType, keyword, page]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;

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

  return (
    <Tabs defaultValue={category}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col md:flex-row w-full">
          <div>
            <TabsList className="mr-4">
              <TabsTrigger value="reviews" onClick={() => handleTabClick("reviews")}>
                면접 후기
              </TabsTrigger>
              <TabsTrigger value="studies" onClick={() => handleTabClick("studies")}>
                스터디 모집
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-grow mt-2 md:mt-0">
            <div className="flex-grow">
              <Search keyword={keyword} setKeyword={setKeyword} />
            </div>
            <div className="w-32 mr-0 ml-2 md:mr-4 md:ml-4">
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
        </div>
        <Link href={`/community/create?tab=${category}`}>
          <Button className="fixed bottom-24 right-4 z-50 rounded-3xl md:hidden">
            <FaPen className="mr-2" />
            글쓰기
          </Button>
        </Link>
        <Link href={`/community/create?tab=${category}`}>
          <Button className="rounded-3xl hidden md:flex items-center">
            <FaPen className="mr-2" />
            글쓰기
          </Button>
        </Link>
      </div>
      <TabsContent value="reviews">
        <InterviewReview tabParams={category} boardList={boardList} />
      </TabsContent>
      <TabsContent value="studies">
        <GetStudy tabParams={category} boardList={boardList} />
      </TabsContent>
      {boardList?.totalPages ? (
        <Pagination
          currentPage={page}
          totalPages={boardList.totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}
    </Tabs>
  );
}
