import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/model/Post";
import { formatRelativeTime } from "@/lib/utils/days";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostCard({
  post,
  tabParams,
}: {
  post: Post;
  tabParams: string | undefined;
}) {
  const router = useRouter();
  const [showAllTags, setShowAllTags] = useState(false);
  const MAX_TAGS_TO_SHOW = 3;

  const toggleShowAllTags = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowAllTags(!showAllTags);
  };

  const handleCardClick = () => {
    router.push(`/community/${tabParams}/${post.postId}`);
  };

  return (
    <Card onClick={handleCardClick} className="cursor-pointer">
      <CardHeader>
        <CardTitle className="truncate overflow-hidden">{post.postTitle}</CardTitle>
        <hr />
        <CardDescription className="h-24 whitespace-pre truncate overflow-hidden">
          {post.content}
        </CardDescription>
      </CardHeader>
      <div className="pl-4">
        {(showAllTags ? post.tag : post.tag?.slice(0, MAX_TAGS_TO_SHOW))?.map((tag, index) => (
          <Badge key={index} className="px-3 py-1 text-sm mx-1 mt-2" variant="secondary">
            #{tag}
          </Badge>
        ))}
        {post.tag?.length > MAX_TAGS_TO_SHOW && (
          <button onClick={toggleShowAllTags} className="text-blue-500 text-sm ml-2 mt-2">
            {showAllTags ? "접기" : `+${post.tag.length - MAX_TAGS_TO_SHOW} 더보기`}
          </button>
        )}
      </div>
      <div className="px-6 py-4">
        <div className="flex">
          <div className="flex items-center flex-1">
            {post.image ? (
              <img
                src={post.image}
                alt="프로필이미지"
                className="rounded-full"
                width={20}
                height={20}
              />
            ) : null}
            <p className="text-gray-600 text-sm">
              {post.userName ? (
                <span className="font-semibold ml-2">{post.userName} • </span>
              ) : null}
              {formatRelativeTime(post.time.toLocaleString())}
            </p>
          </div>
          <div className="flex items-center">
            <AiOutlineLike className="text-gray-500 mr-1" />
            <span className="text-gray-700 text-sm">{post.numOfLike}</span>
          </div>
          <div className="flex items-center ml-3">
            <FaRegComment className="text-gray-500 mr-1" />
            <span className="text-gray-700 text-sm">{post.numOfComment}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
