import customFetcher from "@/lib/utils/customFetcher";

export default async function getBoards({
  queryKey,
  sortType,
  page,
  accessToken,
  keyword,
}: {
  queryKey: [_1: string, _2: string, _3: string, _4: string];
  sortType: string;
  page: number;
  accessToken: string;
  keyword: string;
}) {
  const [_1, category] = queryKey;
  try {
    const { response, data } = await customFetcher(
      `/board/list?page=${page}&sortType=${sortType}&category=${category}&keyword=${keyword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response?.ok) {
      throw new Error("Failed to fetch data");
    }

    return await data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}
