import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getQuestions from "../api/getQuestions";
import postQuestion from "../api/postQuestion";
import deleteQuestion, { DeleteQuestionRequest } from "../api/deleteQuestion";

// TODO: 타입 디렉토리로 분리

export type Question = {
  questionId: number;
  questionContent: string;
  answerContent: string;
  answerId: number;
};

export type ResponseQuestions = Question[];

export const useGetQuestionsQuery = ({ workbookId }: { workbookId: number | null }) => {
  const queryClient = useQueryClient();
  return useQuery<ResponseQuestions, Error>({
    queryKey: ["questions", workbookId],
    queryFn: () => {
      if (workbookId == null) {
        return Promise.reject(new Error("Invalid workbookId"));
      }
      return getQuestions({ workbookId });
    },
    enabled: workbookId != null,
    initialData: () => {
      if (workbookId == null) return [];
      const cache = queryClient.getQueryData<ResponseQuestions>(["questions", workbookId]);
      return cache;
    },
    placeholderData: [],
    gcTime: Infinity,
    staleTime: Infinity,
  });
};

type RequestPostQuestions = {
  userId: number;
  questionContent: string;
  answerContent: string;
  workbookId: number;
};

export const usePostQuestionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Response, Error, RequestPostQuestions>({
    mutationKey: ["questions"],
    mutationFn: (data) => postQuestion(data),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Response, Error, DeleteQuestionRequest>({
    mutationKey: ["questions"],
    mutationFn: (data) => deleteQuestion(data),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
  });
};
