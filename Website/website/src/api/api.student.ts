import axiosInstance from ".";

export const getAllStudents = async (page: number, limit: number = 10) => {
  const response = await axiosInstance.get(
    `/api/student?page=${page}&limit=${limit}`
  );
  return response.data.metadata;
};
