// src/app/admin/activities/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";
import { Activity } from "@/interfaces/activity.interface";
import { getAllActivitiesAPI } from "@/api/api.activity";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ActivityParticipants, Popup } from "../components/Popup";

const headers = [
  "Tên hoạt động",
  "Ngày",
  "Thời gian (phút)",
  "Điểm rèn luyện",
  "Số lượng",
  "Đã tham gia",
];

const dataFields = [
  "activity_name",
  "activity_start_date",
  "activity_duration",
  "activity_point",
  "activity_max_participants",
  "activity_participants.length",
];

export default function Activities() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search");
  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState(search);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [selectedActivityName, setSelectedActivityName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  const openPopup = async (activityId: string, activityName: string) => {
    setSelectedActivityName(activityName);
    setSelectedActivityId(activityId);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const getAllActivities = async (page: number, search = "") => {
    const data = await getAllActivitiesAPI(page, search);
    console.log(data);
    setTotalPages(Math.ceil(data.total / 10));
    setActivities(data.data);
  };

  useEffect(() => {
    getAllActivities(currentPage, searchQuery || "");
  }, [currentPage, searchQuery]);

  const handleSearch = (searchQuery: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("search", searchQuery);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);

    setSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);

    setCurrentPage(newPage);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={handleSearch} />
          <Button
            label="Thêm hoạt động"
            onClick={() => {
              router.push("/admin/acitvities/add");
            }}
            variant="primary"
          />
        </div>
        <Table
          headers={headers}
          data={activities}
          dataFieldsName={dataFields}
          dateFields={["activity_start_date"]}
          actions={(activity) => (
            <>
              <Button label="Sửa" onClick={() => {}} variant="secondary" />
              <Button
                label="Sửa"
                onClick={() => {
                  console.log(activity);
                  openPopup(activity._id, activity.activity_name);
                }}
                variant="secondary"
              />
            </>
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
      {isPopupOpen && (
        <Popup
          isOpen={isPopupOpen}
          title={selectedActivityName}
          onClose={closePopup}
        >
          <ActivityParticipants activityId={selectedActivityId} />
        </Popup>
      )}
    </div>
  );
}
