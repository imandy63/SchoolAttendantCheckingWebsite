import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";

export const getTrackingAPI = async (id: string) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/tracking/${id}`
  );
  return response.data.metadata;
};

export const getActivityTrackingDetailAPI = async (id: string) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/tracking/detail/${id}`
  );
  return response.data.metadata;
};

export const updateTrackingAPI = async ({
  activity_id,
  student_ids,
}: {
  activity_id: string;
  student_ids: string[];
}) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/tracking/${activity_id}`,
    {
      student_ids,
    }
  );
  return response.data.metadata;
};
