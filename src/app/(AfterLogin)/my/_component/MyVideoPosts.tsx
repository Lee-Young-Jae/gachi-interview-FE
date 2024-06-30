import { useQuery } from "@tanstack/react-query";
import getMyVideos from "../_lib/getMyVideos";
import VideoCard from "../../videos/_component/VideoCard";
import { Video } from "@/model/Video";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
import NoData from "../../_component/NoData";
import Loading from "../../_component/Loading";

export default function MyVideoPosts() {
  const userId = useRecoilValue(userIdState);

  const { data, error, isLoading } = useQuery<Video[], Object, Video[], [string, string]>({
    queryKey: ["my", "videos"],
    queryFn: () => getMyVideos({ userId }),
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading videos</div>;

  const videos = Array.isArray(data) ? data : [];

  if (videos.length === 0) {
    return <NoData message="내가 등록한 인터뷰 영상이 없네요...🥲" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.videoId} video={video} />
      ))}
    </div>
  );
}
