import customFetcher from "@/lib/utils/customFetcher";

export interface postCommentProps {
  userId: number;
  videoId: string;
  content: string;
}

const postComment = async ({ userId, videoId, content }: postCommentProps) => {
  try {
    console.log("userId: ", userId, content, videoId);
    const { data } = await customFetcher(`/video/${videoId}/submit`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        content,
      }),
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default postComment;
