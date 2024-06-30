import customFetcher from "@/lib/utils/customFetcher";

export default async function getComments({
  queryKey,
}: {
  queryKey: [_1: string, _2: string, _3: string];
}) {
  const [_1, postId, _3] = queryKey;
  try {
    const { response, data } = await customFetcher(`/board/${postId}/comments`);

    if (!response?.ok) {
      throw new Error("Failed to fetch data");
    }
    return await data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}
