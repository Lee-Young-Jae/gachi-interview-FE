import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils/days";
import { Video } from "@/model/Video";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";

const VideoCard = ({ video }: { video: Video }) => {
  const router = useRouter();
  const [showAllTags, setShowAllTags] = useState(false);
  const MAX_TAGS_TO_SHOW = 3;

  const handleCardClick = () => {
    router.push(`/videos/${video.videoId}`);
  };

  const toggleShowAllTags = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowAllTags(!showAllTags);
  };

  return (
    <Card
      onClick={handleCardClick}
      key={video.videoId}
      className="flex flex-col h-full cursor-pointer"
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 truncate">
          {video.videoTitle}
        </CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <div className="flex justify-center rounded-lg overflow-hidden">
          <img src={video.thumbnailLink} alt="thumbnail" className="w-full h-40 object-cover" />
        </div>
        <div className="mt-4">
          {(showAllTags ? video.tags : video.tags.slice(0, MAX_TAGS_TO_SHOW)).map((tag, index) => (
            <Badge key={index} className="px-3 py-1 text-sm mt-2 mx-1" variant="secondary">
              #{tag}
            </Badge>
          ))}
          {video.tags.length > MAX_TAGS_TO_SHOW && (
            <button onClick={toggleShowAllTags} className="text-blue-500 text-sm ml-2 mt-2">
              {showAllTags ? "접기" : `+${video.tags.length - MAX_TAGS_TO_SHOW} 더보기`}
            </button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between mt-auto flex-wrap">
        <div className="flex items-center gap-1">
          <img
            src={video.image}
            alt="프로필이미지"
            className="rounded-full"
            width={20}
            height={20}
          />
          <div className="text-sm font-semibold">{video.userName}</div>
          <span> • </span>
          <div className="text-sm text-muted-foreground">{formatRelativeTime(video.time)}</div>
        </div>

        <div className="flex items-center">
          {video.liked ? (
            <AiFillLike className="text-blue-500 mr-1" />
          ) : (
            <AiOutlineLike className="text-muted-foreground mr-1" />
          )}
          <span className="text-muted-foreground text-xs">{video.numOfLike}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
