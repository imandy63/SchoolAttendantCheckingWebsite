"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { EditActivityForm } from "../../components/EditActivityForm";

export default function EditActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("pageId");

  const [activity, setActivity] = useState({
    activity_name: "",
    activity_start_date: "",
    activity_max_participants: 0,
    activity_point: 0,
    activity_duration: 0,
    activity_thumb_url: "",
    activity_host: "",
    activity_categories: "",
    activity_status: "OPEN",
  });

  useEffect(() => {
    const fetchActivity = async () => {
      if (activityId) {
        const response = {
          activity_name: "Hoạt động thể thao",
          activity_start_date: "2023-03-06",
          activity_max_participants: 100,
          activity_point: 10,
          activity_duration: 2,
          activity_thumb_url: "https://example.com/thumb.jpg",
          activity_host: "Đơn vị thể thao",
          activity_categories: "Hội thảo",
          activity_status: "OPEN",
        };
        setActivity(response);
      }
    };

    fetchActivity();
  }, [activityId]);

  const handleSave = (updatedActivity: any) => {
    console.log("Cập nhật hoạt động: ", updatedActivity);
    router.push("/admin/activities"); // Quay lại trang chính
  };

  return <EditActivityForm initialData={activity} onSave={handleSave} />;
}
