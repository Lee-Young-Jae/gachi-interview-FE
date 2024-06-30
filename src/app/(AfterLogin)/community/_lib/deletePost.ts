import customFetcher from "@/lib/utils/customFetcher";

export default async function deletePost({ userId, postId }: { userId: number; postId: string }) {
  const { response, data } = await customFetcher(`/board/${postId}/delete`, {
    method: "DELETE",
    body: JSON.stringify({ userId, postId }),
  });

  if (!response?.ok) {
    throw new Error("Failed to delete comment");
  }
  return await data;
}
