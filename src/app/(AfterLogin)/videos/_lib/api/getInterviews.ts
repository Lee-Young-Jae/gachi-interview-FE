import customFetcher from "@/lib/utils/customFetcher";
import { Video } from "@/model/Video";

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ResponseGetInterviews {
  content: Video[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export interface getInterviewsProps {
  sortType: "new" | "like";
  pageParam: number;
  keyword: string;
}
const getInterviews = async ({
  sortType,
  pageParam = 1,
  keyword,
}: getInterviewsProps): Promise<ResponseGetInterviews> => {
  try {
    const { data } = await customFetcher(
      `/video/list?page=${pageParam}&sortType=${sortType}&keyword=${keyword}`,
    );

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default getInterviews;
