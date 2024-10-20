import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";

export const getAllStudentsAPI = async (
  page: number,
  search = "",
  sort = "",
  limit: number = 10
) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/student?page=${page}&limit=${limit}?search=${search}&sort=${sort}`
  );
  return response.data.metadata;
};
