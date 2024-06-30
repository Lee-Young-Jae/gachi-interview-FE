import customFetcher from "@/lib/utils/customFetcher";

export interface PatchCommentProps {
  userId: number;
  commentId: number;
  content: string;
  videoId: string;
}

const patchComment = async ({ userId, commentId, content, videoId }: PatchCommentProps) => {
  const { data } = await customFetcher(`/video/${videoId}/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ userId, content, commentId }),
  });

  return data;
};

export default patchComment;
