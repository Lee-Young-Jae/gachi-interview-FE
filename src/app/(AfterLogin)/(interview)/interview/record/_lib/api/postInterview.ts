import customFetcher from "@/lib/utils/customFetcher";

export interface postInterviewProps {
  userId: number;
  exposure: boolean;
  videoLink: string;
  thumbnailLink: string;
  videoTitle: string;
  questions: number[];
  tags: string[];
}
const postInterview = async ({
  userId,
  exposure,
  videoLink,
  thumbnailLink,
  videoTitle,
  questions,
  tags,
}: postInterviewProps) => {
  try {
    const { response, data } = await customFetcher(`/interview/complete`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        exposure,
        videoLink,
        thumbnailLink,
        videoTitle,
        questions,
        tags,
      }),
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default postInterview;
