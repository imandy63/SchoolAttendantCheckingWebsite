"use client";

import { Sidebar } from "../../_components/Sidebar";
import { EditActivityForm } from "../../_components/EditActivityForm";
import { updateActivityAPI } from "@/api/api.activity"; // Assuming an API update function
import { useToast } from "@/context/ToastContext";
import { useRouter, useParams } from "next/navigation";
import {
  CreateActivityPayload,
  CreateAndEditActivityPagePayload,
  CreateAndEditActivitySchema,
} from "@/interfaces/activity.interface";
import { useUploadImage } from "@/query/useUpload";
import { useUpdateActivity } from "@/query/useActivity";

export default function EditActivityPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const { mutate: uploadImageAPI } = useUploadImage();
  const { mutate: updateActivity } = useUpdateActivity();

  const handleUpdateActivity = (
    data: CreateActivityPayload & { id: string }
  ) => {
    updateActivity(data, {
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
      uploadImageAPI(formData.activity_file, {
        onSuccess(data) {
          data.activity_thumb_url = data.image_url;
          handleUpdateActivity({
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
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa Hoạt Động</h1>
        <EditActivityForm activityId={id as string} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
