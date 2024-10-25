import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";

export const getAllActivitiesAPI = async (page: number, search = "") => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity?page=${page}&search=${search}`
  );
  return response.data.metadata;
};

export const getActivityParticipantsAPI = async (activityId: string) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/participants/${activityId}`
  );
  return response.data.metadata;
};
