import customFetcher from "@/utils/customFetcher";

export interface DeleteQuestionRequest {
  workbookId: number;
  questionId: number;
  userId: number;
}

const deleteQuestion = async ({ workbookId, questionId, userId }: DeleteQuestionRequest) => {
  const { response, data } = await customFetcher(`/workbook/${workbookId}/question/${questionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  return data;
};

export default deleteQuestion;