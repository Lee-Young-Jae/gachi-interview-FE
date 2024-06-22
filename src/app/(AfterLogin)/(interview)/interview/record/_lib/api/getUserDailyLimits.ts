import customFetcher from "@/lib/utils/customFetcher";

export type ResponseUserDailyLimits = {
  maxCount: number;
  currentCount: number;
};

export const getUserDailyLimits = async () => {
  const { data } = await customFetcher(`/feedback/limits`, {
    method: "GET",
  });

  return data;
};
