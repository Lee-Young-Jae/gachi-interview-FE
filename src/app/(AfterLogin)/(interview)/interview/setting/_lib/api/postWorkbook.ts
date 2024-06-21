import customFetcher from "@/lib/utils/customFetcher";

interface postWorkbookProps {
  userId: number;
  title: string;
  job: string;
}

const postWorkbook = async ({ userId, title, job }: postWorkbookProps) => {
  try {
    const { data } = await customFetcher(`/workbook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title,
        job,
      }),
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default postWorkbook;
