import { useMutation } from "@tanstack/react-query";
import { uploadImageAPI } from "@/api/api.upload";

// Custom hook for uploading images
export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadImageAPI(file),
    onSuccess: (data) => {
      console.log("Image uploaded successfully:", data);
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
    },
  });
};
