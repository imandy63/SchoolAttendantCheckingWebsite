import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";
import { CreateUnionWorkerPayload } from "@/interfaces/unionWorker.interface";

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

export const resetUnionWorkerPasswordAPI = async (
  id: string,
  newPassword: string
) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/union-worker/${id}/reset-password`,
    { password: newPassword }
  );

  return response.data.metadata;
};

export const createUnionWorkerAPI = async ({
  student_id,
  password,
  student_name,
}: CreateUnionWorkerPayload) => {
  const response = await axiosInstance.post(
    `${urlConfig.CORE}/api/union-worker`,
    {
      student_id,
      password,
      student_name,
    }
  );

  return response.data.metadata;
};
