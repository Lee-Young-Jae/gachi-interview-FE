import customFetcher from "@/lib/utils/customFetcher";

interface getQuestionsProps {
  workbookId: number;
}

const getQuestions = async ({ workbookId }: getQuestionsProps) => {
  try {
    const { response, data } = await customFetcher(`/workbook/${workbookId}/question/list`, {
      method: "GET",
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default getQuestions;
