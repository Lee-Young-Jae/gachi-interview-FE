import customFetcher from "@/lib/utils/customFetcher";

export default async function postBoard({
  title,
  content,
  tags,
  category,
  userId,
}: {
  title: string;
  content: string;
  tags: string[];
  category: string;
  userId: number;
}) {
  try {
    const { response, data } = await customFetcher(`/board/write`, {
      method: "POST",
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
