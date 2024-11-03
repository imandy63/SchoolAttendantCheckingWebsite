"use client";

import { Sidebar } from "../../_components/Sidebar";
import { EditActivityForm } from "../../_components/EditActivityForm";
import { updateActivityAPI } from "@/api/api.activity"; // Assuming an API update function
import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditActivityPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("pageId");

  const handleSave = async (updatedActivity: any) => {
    try {
      await updateActivityAPI({
        id: updatedActivity.activity_id,
        ...updatedActivity,
      });
      showToast("Cập nhật thành công", "success");
      router.push("/admin/activities");
    } catch (error) {
      console.error(error);
      showToast("Cập nhật thất bại", "error");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa Hoạt Động</h1>
        <EditActivityForm onSubmit={handleSave} />
      </main>
    </div>
  );
}
