"use client";

import { AddActivityForm } from "../../_components/AddActivityForm";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useCreateActivity } from "@/query/useActivity";
import { useUploadImage } from "@/query/useUpload";
import {
  CreateAndEditActivityPagePayload,
  CreateActivityPayload,
} from "@/interfaces/activity.interface";

export default function AddActivityPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const { mutate: createActivity } = useCreateActivity();
  const { mutate: uploadImage } = useUploadImage();

  const handleCreateActivity = (data: CreateActivityPayload) => {
    console.log(data);
    createActivity(data, {
      onSuccess: () => {
        showToast("Activity created successfully!", "success");
        router.push("/admin/activities");
      },
      onError: (error) => {
        console.error(error);
        showToast("Failed to create activity", "error");
      },
    });
  };

  const handleSubmit = (formData: CreateAndEditActivityPagePayload) => {
    if (formData.activity_file) {
      uploadImage(formData.activity_file, {
        onSuccess(data) {
          data.activity_thumb_url = data.image_url;
          handleCreateActivity({
            activity_thumb_url: data.image_url,
            activity_start_date: formData.activity_start_datetime,
            activity_categories: formData.activity_categories,
            activity_duration: formData.activity_duration,
            activity_host: formData.activity_host,
            activity_max_participants: formData.activity_max_participants,
            activity_name: formData.activity_name,
            activity_point: formData.activity_point,
            activity_location: formData.activity_location,
          });
        },
        onError(error) {
          console.error(error);
          showToast("Failed to upload image", "error");
        },
      });
    } else {
      handleCreateActivity({
        activity_thumb_url: "",
        activity_start_date: formData.activity_start_datetime,
        activity_categories: formData.activity_categories,
        activity_duration: formData.activity_duration,
        activity_host: formData.activity_host,
        activity_max_participants: formData.activity_max_participants,
        activity_name: formData.activity_name,
        activity_point: formData.activity_point,
        activity_location: formData.activity_location,
      });
    }
  };

  return (
    <main className="flex-1 p-8 w-full h-[100vh] overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-4">Thêm Hoạt Động Mới</h1>
      <AddActivityForm onSubmit={handleSubmit} />
    </main>
  );
}
