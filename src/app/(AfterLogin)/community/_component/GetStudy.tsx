import PostCard from "./PostCard";
import { Post, PostContent } from "@/model/Post";
import NoData from "../../_component/NoData";

export default function GetStudy({
  tabParams,
  boardList,
}: {
  tabParams: string | undefined;
  boardList: PostContent | undefined;
}) {
  if (boardList?.content?.length === 0) {
    return <NoData message="게시글이 아직 등록되지 않았네요...😰" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boardList?.content.map((post) => (
        <PostCard key={post.postId} post={post} tabParams={tabParams} />
      ))}
    </div>
  );
}
