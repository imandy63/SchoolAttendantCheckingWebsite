import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";

export const getUpcomingAssignedActivities = async () => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/checking/available-checking`
  );
  return response.data.metadata;
};

export const getPastAssignedActivities = async () => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/checking/past-checking`
  );
  return response.data.metadata;
};
