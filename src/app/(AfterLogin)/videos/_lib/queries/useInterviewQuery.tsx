import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import getInterviews, {
  getInterviewsProps as RequestGetInterviews,
  ResponseGetInterviews,
  getInterviewsProps,
} from "../api/getInterviews";
import getInterview, { getInterviewProps as RequestGetInterview } from "../api/getInterview";
import patchInterview, { PatchInterviewProps } from "../api/patchInterview";
import postLike, { postLikeProps } from "../api/postLike";
import deletePost, { DeletePostProps } from "../api/deletePost";

export const useGetInterviews = ({ sortType, pageParam, keyword }: RequestGetInterviews) => {
  return useQuery<
    ResponseGetInterviews,
    Error,
    ResponseGetInterviews,
    [string, string, number, string]
  >({
    queryKey: ["interviews", sortType, pageParam, keyword],
    queryFn: () => getInterviews({ sortType, pageParam, keyword }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData, // 이전 데이터 유지
  });
};

export const useGetInfinityInterviews = ({ sortType, keyword }: getInterviewsProps) => {
  return useInfiniteQuery({
    queryKey: ["interviews", sortType, keyword],
    queryFn: ({ pageParam }) => getInterviews({ sortType, pageParam, keyword }),
    getNextPageParam: (lastPage: ResponseGetInterviews) => {
      return lastPage.last ? undefined : lastPage.number + 2;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
};

type ResponseGetInterview = {
  userId: number;
  userName: string;
  videoId: number;
  videoLink: string;
  videoTitle: string;
  time: string;
  updateTime: string | null;
  numOfLike: number;
  tags: string[];
  exposure: boolean;
  liked: boolean;
  image: string;
  thumbnailLink: string;
};

export const useGetInterview = (videoId: RequestGetInterview) => {
  return useQuery<ResponseGetInterview, Error, ResponseGetInterview, [string, string]>({
    queryKey: ["interview", videoId],
    queryFn: () => getInterview(videoId),
  });
};

type ResponsePostLike = {
  numOfLike: number;
  liked: boolean;
};

export const usePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponsePostLike, Error, postLikeProps>({
    mutationFn: (data) => postLike(data),
    onSuccess: async (data, variables) => {
      const videoId = variables.id;
      const currentData = queryClient.getQueryData<ResponseGetInterview>([
        "interview",
        videoId.toString(),
      ]);
      queryClient.setQueryData<ResponseGetInterview>(["interview", videoId.toString()], {
        ...currentData!,
        numOfLike: data.numOfLike,
        liked: data.liked,
      });
    },
  });
};

export const usePatchInterview = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, PatchInterviewProps>({
    mutationFn: (data) => patchInterview(data),
    onSuccess: async (data, variables) => {
      const videoId = variables.videoId;
      const currentData = queryClient.getQueryData<ResponseGetInterview>([
        "interview",
        videoId.toString(),
      ]);
      queryClient.setQueryData<ResponseGetInterview>(["interview", videoId.toString()], {
        ...currentData!,
        ...variables,
        videoId: parseInt(videoId),
      });
    },
  });
};

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, DeletePostProps>({
    mutationFn: (data) => deletePost(data),
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["interview", variables.videoId.toString()],
      });
    },
  });
};
