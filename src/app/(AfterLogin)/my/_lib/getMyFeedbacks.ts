import customFetcher from "@/lib/utils/customFetcher";

export default async function getMyFeedbacks({ userId }: { userId: number }) {
  try {
    const { response, data } = await customFetcher(`/user/${userId}/feedbacks`);

    if (!response?.ok) {
      throw new Error("Failed to fetch data");
    }

    return data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}
