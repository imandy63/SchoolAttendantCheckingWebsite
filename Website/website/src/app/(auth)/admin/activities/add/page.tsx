"use client";

import { Sidebar } from "../../components/Sidebar";
import { AddActivityForm } from "../../components/AddActivityForm";
import { createActivityAPI } from "@/api/api.activity";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function AddActivityPage() {
  const { showToast } = useToast();
  const router = useRouter();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Thêm Hoạt Động Mới</h1>
        <AddActivityForm
          onSubmit={(data) => {
            try {
              createActivityAPI(data);
              showToast("Activity created successfully!", "success");
              router.push("/admin/activities");
            } catch (err) {
              console.log(err);
              showToast("Failed to create activity", "error");
            }
          }}
        />
      </main>
    </div>
  );
}
