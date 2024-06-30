import customFetcher from "@/lib/utils/customFetcher";

export type getCommentsProps = string;

const getComments = async (videoId: getCommentsProps) => {
  try {
    const { data } = await customFetcher(`/video/${videoId}/comments`);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default getComments;
