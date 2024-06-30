import customFetcher from "@/lib/utils/customFetcher";

export interface PatchInterviewProps {
  userId: number;
  videoId: string;
  exposure: boolean;
  videoTitle: string;
  tags: string[];
}

const patchInterview = async ({
  userId,
  videoId,
  exposure,
  tags,
  videoTitle,
}: PatchInterviewProps) => {
  const { data } = await customFetcher(`/video/${videoId}`, {
    method: "PATCH",
    body: JSON.stringify({ userId, exposure, tags, videoTitle }),
  });
  return data;
};

export default patchInterview;
