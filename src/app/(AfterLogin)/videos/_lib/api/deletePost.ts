import customFetcher from "@/lib/utils/customFetcher";

export interface DeletePostProps {
  userId: number;
  videoId: number;
}

const deletePost = async ({ userId, videoId }: DeletePostProps) => {
  const { data } = await customFetcher(`/video/${videoId}`, {
    method: "DELETE",
    body: JSON.stringify({ userId, videoId }),
  });

  return data;
};

export default deletePost;
