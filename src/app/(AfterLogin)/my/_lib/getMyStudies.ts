import customFetcher from "@/lib/utils/customFetcher";

export default async function getMyStudies({
  queryKey,
  userId,
}: {
  queryKey: [_1: string, _2: string, _3: string];
  userId: number;
}) {
  const [_1, category] = queryKey;
  try {
    const { response, data } = await customFetcher(`/user/${userId}/boards/${category}`);

    if (!response?.ok) {
      throw new Error("Failed to fetch data");
    }

    return data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}
