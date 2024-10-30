import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getQuestions from "../api/getQuestions";
import postQuestion from "../api/postQuestion";
import deleteQuestion, { DeleteQuestionRequest } from "../api/deleteQuestion";

// TODO: 타입 디렉토리로 분리

export type ResponseQuestions = {
  questionId: number;
  questionContent: string;
  answerContent: string;
  answerId: number;
}[];

export const useGetQuestionsQuery = ({ workbookId }: { workbookId: number }) => {
  const queryClient = useQueryClient();
  return useQuery<ResponseQuestions, Error>({
    queryKey: ["questions", workbookId],
    queryFn: () => getQuestions({ workbookId }),
    initialData: () => {
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
