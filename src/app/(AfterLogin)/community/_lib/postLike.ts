import customFetcher from "@/lib/utils/customFetcher";

export interface postLikeProps {
  userId: number;
  postId: string;
}

export default async function postLike({ userId, postId }: postLikeProps) {
  try {
    const { response, data } = await customFetcher(`/board/${postId}/like`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        postId,
      }),
    });

    if (!response?.ok) {
      throw new Error("Failed to fetch data");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}
