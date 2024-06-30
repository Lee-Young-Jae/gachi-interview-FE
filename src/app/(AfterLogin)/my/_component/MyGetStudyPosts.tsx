import { Post } from "@/model/Post";
import { useQuery } from "@tanstack/react-query";
import getMyStudies from "../_lib/getMyStudies";
import PostCard from "../../community/_component/PostCard";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
import NoData from "../../_component/NoData";

export default function MyGetStudyPosts({ tabParams }: { tabParams: string | undefined }) {
  const userId = useRecoilValue(userIdState);

  const { data } = useQuery<Post[], Object, Post[], [_1: string, _2: string, _3: string]>({
    queryKey: ["community", "studies", "my"],
    queryFn: ({ queryKey }) => getMyStudies({ queryKey, userId }),
  });

  const posts = Array.isArray(data) ? data : [];

  if (posts.length === 0) {
    return <NoData message="내가 등록한 게시글이 없네요...🥲" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} tabParams={tabParams} />
      ))}
    </div>
  );
}
