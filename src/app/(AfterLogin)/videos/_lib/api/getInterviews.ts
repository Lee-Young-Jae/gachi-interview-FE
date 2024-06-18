import customFetcher from "@/lib/utils/customFetcher";

export interface getInterviewsProps {
  sortType: "new" | "like";
  page: number;
  keyword: string;
}
const getInterviews = async ({ sortType, page, keyword }: getInterviewsProps) => {
  try {
    const { data } = await customFetcher(
      `/video/list?page=${page}&sortType=${sortType}&keyword=${keyword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default getInterviews;
