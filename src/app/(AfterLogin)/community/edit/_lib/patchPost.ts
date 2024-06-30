import customFetcher from "@/lib/utils/customFetcher";

export default async function patchPost({
  title,
  content,
  tags,
  category,
  userId,
  postId,
}: {
  title: string;
  content: string;
  tags: string[];
  category: string;
  userId: number;
  postId?: string;
}) {
  try {
    const { response, data } = await customFetcher(`/board/${postId}/edit`, {
      method: "PATCH",
      body: JSON.stringify({
        userId,
        postTitle: title,
        content,
        tag: tags,
        category,
      }),
    });

    if (!response?.ok) {
      throw new Error("Failed to fetch data");
    }

    return data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}
