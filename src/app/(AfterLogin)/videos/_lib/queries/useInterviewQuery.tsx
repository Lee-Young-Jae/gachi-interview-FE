import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getInterviews, { getInterviewsProps as RequestGetInterviews } from "../api/getInterviews";
import getInterview, { getInterviewProps as RequestGetInterview } from "../api/getInterview";
import patchInterview, { PatchInterviewProps } from "../api/patchInterview";
import postLike, { postLikeProps } from "../api/postLike";
import deletePost, { DeletePostProps } from "../api/deletePost";
import { Video } from "@/model/Video";

type ResponseGetInterviews = {
  content: Video[];
};

export const useGetInterviews = ({ sortType, page }: RequestGetInterviews) => {
  return useQuery<ResponseGetInterviews, Error, ResponseGetInterviews, [string, string, number]>({
    queryKey: ["interviews", sortType, page],
    queryFn: () => getInterviews({ sortType, page }),
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
