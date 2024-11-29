import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";

export const getAllUnionWorkersAPI = async (page: number, search = "") => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/union-worker?page=${page}&search=${search}`
  );
  return response.data.metadata;
};

export const enableUnionWorkerAPI = async (id: string) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/union-worker/${id}/enable`
  );

  return response.data.metadata;
};

export const disableUnionWorkerAPI = async (id: string) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/union-worker/${id}/disable`
  );

  return response.data.metadata;
};
