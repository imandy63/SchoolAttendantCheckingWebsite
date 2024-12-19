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

export const exportPDFAPI = async ({
  activity_id,
}: {
  activity_id: string;
}) => {
  const response = await fetch(
    `${urlConfig.CORE}/api/tracking/pdf/${activity_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch PDF file: ${response.statusText}`);
  }

  return await response.blob();
};

export const imageProcessAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(
    `${urlConfig.OCR}/api/ocr`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
