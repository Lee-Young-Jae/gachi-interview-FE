import customFetcher from "@/lib/utils/customFetcher";

const getWorkbookList = async () => {
  try {
    const { response, data } = await customFetcher(`/workbook/list`);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default getWorkbookList;
