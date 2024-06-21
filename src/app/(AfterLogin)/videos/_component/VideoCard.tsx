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
    // <Card
    //   onClick={handleCardClick}
    //   key={video.videoId}
    //   className="flex flex-col h-full cursor-pointer"
    // >
    //   <CardHeader>
    //     <CardTitle className="text-xl font-semibold text-gray-800 truncate">
    //       {video.videoTitle}
    //     </CardTitle>
    //     <hr />
    //   </CardHeader>
    //   <CardContent>
    //     <div className="flex justify-center rounded-lg overflow-hidden">
    //       <img src={video.thumbnailLink} alt="thumbnail" className="w-full h-40 object-cover" />
    //     </div>
    //     <div className="mt-4 flex-wrap flex">
    //       {(showAllTags ? video.tags : video.tags.slice(0, MAX_TAGS_TO_SHOW)).map((tag, index) => (
    //         <Badge
    //           key={index}
    //           className="px-3 py-1 text-sm mt-2 mx-1 max-w-[190px] truncate tracking-tight"
    //           variant="secondary"
    //         >
    //           #{tag}
    //         </Badge>
    //       ))}
    //       {video.tags.length > MAX_TAGS_TO_SHOW && (
    //         <button onClick={toggleShowAllTags} className="text-blue-500 text-sm ml-2 mt-2">
    //           {showAllTags ? "접기" : `+${video.tags.length - MAX_TAGS_TO_SHOW} 더보기`}
    //         </button>
    //       )}
    //     </div>
    //   </CardContent>
    //   <CardFooter className="flex flex-row items-center justify-between mt-auto flex-wrap">
    //     <div className="flex items-center gap-1">
    //       <img
    //         src={video.image}
    //         alt="프로필이미지"
    //         className="rounded-full"
    //         width={20}
    //         height={20}
    //       />
    //       <div className="text-sm font-semibold">{video.userName}</div>
    //       <span> • </span>
    //       <div className="text-sm text-muted-foreground">{formatRelativeTime(video.time)}</div>
    //     </div>

    //     <div className="flex items-center">
    //       {video.liked ? (
    //         <AiFillLike className="text-blue-500 mr-1" />
    //       ) : (
    //         <AiOutlineLike className="text-muted-foreground mr-1" />
    //       )}
    //       <span className="text-muted-foreground text-xs">{video.numOfLike}</span>
    //     </div>
    //   </CardFooter>
    // </Card>
    <article
      className="flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
      key={video.videoId}
    >
      <div className="relative flex justify-center rounded-md overflow-hidden text-white">
        <div className="flex items-center gap-1 absolute top-2 left-2 text-sm bg-black bg-opacity-10 px-1 py-0.5 rounded-full flex-wrap">
          <img
            src={video.image}
            alt="프로필이미지"
            onError={(e) => {
              e.currentTarget.src =
                "https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fbde7a0f1-b659-4891-8b8a-1bc69cf523b7%2Fb080e8c6-4c88-466f-af9c-22c87d5babbf%2FUntitled.png?table=block&id=da12736f-b123-465e-aa98-4694c25e0533&spaceId=bde7a0f1-b659-4891-8b8a-1bc69cf523b7&width=1600&userId=f2df590b-e1ce-4346-a37d-0e7b25babdda&cache=v2";
            }}
            className="rounded-full"
            width={20}
            height={20}
          />
          <span>{video.userName}</span>
        </div>
        <img
          src={video.thumbnailLink}
          onError={(e) => {
            console.log(e);
            e.currentTarget.src =
              "https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fbde7a0f1-b659-4891-8b8a-1bc69cf523b7%2Fb080e8c6-4c88-466f-af9c-22c87d5babbf%2FUntitled.png?table=block&id=da12736f-b123-465e-aa98-4694c25e0533&spaceId=bde7a0f1-b659-4891-8b8a-1bc69cf523b7&width=1600&userId=f2df590b-e1ce-4346-a37d-0e7b25babdda&cache=v2";
          }}
          alt="thumbnail"
          className="w-full h-40 object-cover"
        />
        <div className="flex items-center absolute bottom-2 right-2 text-sm bg-black bg-opacity-10 px-1 py-0.5 rounded-full">
          {video.liked ? <AiFillLike className="mr-1" /> : <AiOutlineLike className="mr-1" />}
          <span className="text-xs">{video.numOfLike}</span>
        </div>
      </div>
      <h2 className="text-base font-semibold text-gray-800 truncate">{video.videoTitle}</h2>
      <div className="flex-wrap flex">
        {(showAllTags ? video.tags : video.tags.slice(0, MAX_TAGS_TO_SHOW)).map(
          (tag, index) =>
            tag && (
              <span
                key={index}
                className="py-1 text-sm mt-1 mr-2 max-w-[190px] truncate tracking-tight"
              >
                #{tag}
              </span>
            ),
        )}
        {video.tags.length > MAX_TAGS_TO_SHOW && (
          <button onClick={toggleShowAllTags} className="text-blue-500 text-sm ml-2 mt-1">
            {showAllTags ? "접기" : `+${video.tags.length - MAX_TAGS_TO_SHOW} 더보기`}
          </button>
        )}
      </div>
      <span className="text-sm text-muted-foreground">{formatRelativeTime(video.time)}</span>
    </article>
  );
};

export default VideoCard;
