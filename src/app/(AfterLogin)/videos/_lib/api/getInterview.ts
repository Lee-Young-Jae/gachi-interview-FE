import customFetcher from "@/lib/utils/customFetcher";

export type getInterviewProps = string;
const getInterview = async (videoId: getInterviewProps) => {
  try {
    const { data } = await customFetcher(`/video/${videoId}`);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default getInterview;
