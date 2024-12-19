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

export const getActivityForStudent = async (activityId: string) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/student/${activityId}`
  );
  return response.data.metadata;
};

export const getTimeRange = async () => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/time-range`
  );
  return response.data.metadata;
};

export const getStatistics = async (month: number, year: number) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/statistic?month=${month}&year=${year}`
  );
  return response.data.metadata;
};

export const getYearStatistics = async (year: number) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/year-statistic?year=${year}`
  );
  return response.data.metadata;
};

export const getUpcomingActivitiesGroupByDateAPI = async (
  page = 1,
  search = ""
) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/upcoming?page=${page}&search=${search}`
  );
  return response.data.metadata;
};

export const getActivitiesByDateAPI = async (date?: string) => {
  if (!date) {
    return null;
  }
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/student?date=${date}`
  );
  return response.data.metadata;
};

export const getActivityCategoriesAPI = async () => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/category`
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
  activity_location,
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
    activity_location,
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

export const removeActivityAPI = async (id: string) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/activity/remove/${id}`
  );
  return response.data.metadata;
};

export const participateActivityAPI = async (activityId: string) => {
  const response = await axiosInstance.post(
    `${urlConfig.CORE}/api/activity/participate/${activityId}`
  );
  return response.data.metadata;
};

export const leaveActivityAPI = async (activityId: string) => {
  const response = await axiosInstance.post(
    `${urlConfig.CORE}/api/activity/leave/${activityId}`
  );
  return response.data.metadata;
};

export const getAssignableActivitiesAPI = async (id: string) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/assignable?id=${id}`
  );
  return response.data.metadata;
};

export const assignCheckingAPI = async ({
  activity_id,
  student_id,
}: {
  activity_id: string;
  student_id: string;
}) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/activity/assign/${activity_id}`,
    {
      student_id,
    }
  );
  return response.data.metadata;
};

export const getAssignedActivitiesByWorkerAPI = async (id: string) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/activity/assigned?id=${id}`
  );
  return response.data.metadata;
};

export const removeCheckingAssignmentAPI = async ({
  activity_id,
  student_id,
}: {
  activity_id: string;
  student_id: string;
}) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/activity/remove-assignment/${activity_id}`,
    {
      student_id,
    }
  );
  return response.data.metadata;
};

export const exportExcelAPI = async ({
  year,
  month,
}: {
  year: number;
  month?: number;
}) => {
  const queryParams = new URLSearchParams({ year: String(year) });
  if (month) queryParams.append("month", String(month));

  const response = await fetch(
    `${urlConfig.CORE}/api/activity/excel?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
  }

  return await response.blob();
};
