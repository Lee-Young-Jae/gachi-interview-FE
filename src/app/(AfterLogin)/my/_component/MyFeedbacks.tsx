import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
import getMyFeedbacks from "../_lib/getMyFeedbacks";
import FeedbackCard from "./FeedbackCard";
import NoData from "../../_component/NoData";

export interface MyFeedback {
  commentId: number;
  userId: number;
  content: string;
  videoId: string;
}

export default function MyFeedbacks() {
  const userId = useRecoilValue(userIdState);

  const { data } = useQuery<MyFeedback[]>({
    queryKey: ["my", "feedbacks"],
    queryFn: () => getMyFeedbacks({ userId }),
  });

  const comments = Array.isArray(data) ? data : [];

  if (comments.length === 0) {
    return <NoData message="내가 등록한 영상 피드백이 없네요...🥲" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {comments.map((comment) => (
        <FeedbackCard key={comment.commentId} comment={comment} />
      ))}
    </div>
  );
}
