import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";

export const getAllStudentsAPI = async (page: number, search = "") => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/student?page=${page}&search=${search}`
  );
  return response.data.metadata;
};

export const getStudentActivitiesAPI = async (studentId: string) => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/student/activity/${studentId}`
  );

  return response.data.metadata;
};

export const changeSubscribeCategoriesAPI = async ({
  categories,
}: {
  categories: string[];
}) =>
  axiosInstance.put(`${urlConfig.CORE}/api/student/categories`, {
    categories,
  });

export const getPastActivities = async () => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/student/past`
  );
  return response.data.metadata;
};
