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
import { useEffect, useState } from "react";
import NoData from "../_component/NoData";
import Loading from "../_component/Loading";
import FilterTag from "../_component/FilterTag";
import { Video } from "@/model/Video";
import { Post } from "@/model/Post";

const Videos = () => {
  const page = 1;
  const [sortType, setSortType] = useState<"new" | "like">("new");
  const { data: videoList, isLoading } = useGetInterviews({ sortType: sortType, page });
  const [filteredVideoList, setFilteredVideoList] = useState<Video[]>(videoList?.content || []);

  useEffect(() => {
    if (videoList?.content) {
      setFilteredVideoList(videoList.content);
    }
  }, [videoList]);

  const handleSortType = (value: string) => {
    setSortType(value as "new" | "like");
  };

  const handleFilterChange = (filteredList: (Video | Post)[]) => {
    setFilteredVideoList(filteredList as Video[]);
  };

  if (isLoading || !videoList) {
    return <Loading />;
  }

  if (videoList.content?.length === 0) {
    return <NoData />;
  }

  return (
    <div>
      <div className="flex justify-between items-center w-full mb-2 gap-4">
        <FilterTag originalList={videoList.content} onFilterChange={handleFilterChange} />
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

      {filteredVideoList.length === 0 && <NoData />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideoList.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Videos;
