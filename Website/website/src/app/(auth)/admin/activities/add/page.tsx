"use client";

import { Sidebar } from "../../_components/Sidebar";
import { AddActivityForm } from "../../_components/AddActivityForm";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useCreateActivity } from "@/query/useActivity";

export default function AddActivityPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const { mutate: createActivity } = useCreateActivity();

  const handleSubmit = (data: any) => {
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

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Thêm Hoạt Động Mới</h1>
        <AddActivityForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
