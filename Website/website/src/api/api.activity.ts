import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";
import {
  Activity,
  CreateActivityPayload,
} from "@/interfaces/activity.interface";

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

export const getActivityAPI = async (activityId: string) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/${activityId}`
  );
  return response.data.metadata;
};

export const createActivityAPI = async ({
  activity_name,
  activity_start_date,
  activity_max_participants,
  activity_point,
  activity_thumb_url,
  activity_duration,
  activity_categories,
  activity_host,
}: CreateActivityPayload) => {
  const response = await axiosInstance.post(`${urlConfig.CORE}/api/activity`, {
    activity_name,
    activity_start_date,
    activity_max_participants,
    activity_point,
    activity_thumb_url,
    activity_duration,
    activity_categories,
    activity_host,
  });
  return response.data.metadata;
};

export const updateActivityAPI = async ({
  id,
  activity_name,
  activity_start_date,
  activity_max_participants,
  activity_point,
  activity_thumb_url,
  activity_duration,
  activity_categories,
  activity_host,
}: Activity & { id: string }) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/activity/${id}`,
    {
      activity_name,
      activity_start_date,
      activity_max_participants,
      activity_point,
      activity_thumb_url,
      activity_duration,
      activity_categories,
      activity_host,
    }
  );
  return response.data.metadata;
};
