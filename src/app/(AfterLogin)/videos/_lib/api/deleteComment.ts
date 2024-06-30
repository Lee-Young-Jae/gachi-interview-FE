import customFetcher from "@/lib/utils/customFetcher";

export interface DeleteCommentProps {
  userId: number;
  commentId: number;
  videoId: string;
}

const deleteComment = async ({ userId, commentId, videoId }: DeleteCommentProps) => {
  const { data } = await customFetcher(`/video/${videoId}/comments/${commentId}`, {
    method: "DELETE",
    body: JSON.stringify({ userId, commentId }),
  });

  return data;
};

export default deleteComment;
