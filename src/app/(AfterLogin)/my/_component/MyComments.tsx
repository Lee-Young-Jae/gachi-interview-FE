import { useQuery } from "@tanstack/react-query";
import getMyComments from "../_lib/getMyComments";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
import CommentCard from "./CommentCard";
import NoData from "../../_component/NoData";

export interface MyComment {
  commentId: number;
  userId: number;
  username: string;
  content: string;
  category: string;
  postId: string;
}

export default function MyComments() {
  const userId = useRecoilValue(userIdState);

  const { data } = useQuery<MyComment[]>({
    queryKey: ["my", "comments"],
    queryFn: () => getMyComments({ userId }),
  });

  const comments = Array.isArray(data) ? data : [];

  if (comments.length === 0) {
    return <NoData message="내가 등록한 댓글이 없네요...🥲" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {comments.map((comment) => (
        <CommentCard key={comment.commentId} comment={comment} />
      ))}
    </div>
  );
}
