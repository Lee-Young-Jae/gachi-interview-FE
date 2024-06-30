import customFetcher from "@/lib/utils/customFetcher";

export default async function getPostDetail({ queryKey }: { queryKey: [_1: string, _2: string] }) {
  const [_1, postId] = queryKey;

  try {
    const { response, data } = await customFetcher(`/board/${postId}`);

    if (!response?.ok) {
      throw new Error("Failed to fetch data");
    }

    return await data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}
