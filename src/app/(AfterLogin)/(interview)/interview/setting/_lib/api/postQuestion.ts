import customFetcher from "@/lib/utils/customFetcher";

interface postQuestionProps {
  userId: number;
  questionContent: string;
  answerContent: string;
  workbookId: number;
}

const postQuestion = async ({
  userId,
  questionContent,
  answerContent,
  workbookId,
}: postQuestionProps) => {
  try {
    const { data } = await customFetcher(`/workbook/${workbookId}/question`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        questionContent,
        answerContent,
      }),
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default postQuestion;
