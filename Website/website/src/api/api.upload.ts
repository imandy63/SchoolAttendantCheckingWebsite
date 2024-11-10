import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";

export const uploadImageAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(
    `${urlConfig.UPLOAD}/api/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.metadata;
};
