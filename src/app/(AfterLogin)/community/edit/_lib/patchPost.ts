import customFetcher from "@/lib/utils/customFetcher";

export default async function patchPost({
  title,
  content,
  tags,
  category,
  accessToken,
  userId,
  postId,
}: {
  title: string;
  content: string;
  tags: string[];
  category: string;
  accessToken: string;
  userId: number;
  postId?: string;
}) {
  try {
    const { response, data } = await customFetcher(`/board/${postId}/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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

    return await data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}
