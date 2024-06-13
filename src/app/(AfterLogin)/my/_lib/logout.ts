import customFetcher from "@/lib/utils/customFetcher";

export default async function logout({ accessToken }: { accessToken: string }) {
  try {
    const { response, data } = await customFetcher(`/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response?.ok) {
      throw new Error("Failed to fetch data");
    }

    return await data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}
