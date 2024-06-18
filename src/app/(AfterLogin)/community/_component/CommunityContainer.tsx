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
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PostContent } from "@/model/Post";
import getBoards from "../_lib/getBoards";
import { useRecoilValue } from "recoil";
import { accessTokenState } from "@/store/auth";
import Loading from "../../_component/Loading";
import Search from "../../_component/Search";

export default function CommunityContainer({ category }: { category: string }) {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const page = 1;
  const [sortType, setSortType] = useState<"new" | "like">("new");
  const [keyword, setKeyword] = useState<string>("");

  const {
    data: boardList,
    error,
    isLoading,
  } = useQuery<PostContent, Object, PostContent, [_1: string, _2: string, _3: string, _4: string]>({
    queryKey: ["community", category, sortType, keyword],
    queryFn: ({ queryKey }) => getBoards({ queryKey, sortType, page, accessToken, keyword }),
  });

  const handleTabClick = (value: string) => {
    router.replace(`/community?tab=${value}`);
  };

  const handleSortType = (value: string) => {
    setSortType(value as "new" | "like");
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;

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
        <div>
          <InterviewReview tabParams={category} boardList={boardList} />
        </div>
      </TabsContent>
      <TabsContent value="studies">
        <div>
          <GetStudy tabParams={category} boardList={boardList} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
