import customFetcher from "@/lib/utils/customFetcher";

export default async function deleteComment({
  userId,
  commentId,
  postId,
}: {
  userId: number;
  commentId: number;
  postId: string;
}) {
  const { response, data } = await customFetcher(`/board/${postId}/comments/${commentId}`, {
    method: "DELETE",
    body: JSON.stringify({ userId, commentId }),
  });

  if (!response?.ok) {
    throw new Error("Failed to delete comment");
  }
  return await data;
}
