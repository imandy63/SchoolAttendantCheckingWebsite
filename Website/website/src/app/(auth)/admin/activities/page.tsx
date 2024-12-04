"use client";
import { useState } from "react";
import { Table } from "../../../../components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import { Button } from "../_components/Button";
import { useGetAllActivities } from "@/query/useActivity";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ActivityAttendance,
  ActivityParticipants,
  Popup,
} from "../_components/Popup";
import ActionButton from "../_components/ActionButton";

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
  "activity_participants_total",
];

export default function Activities() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState(search);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [selectedActivityName, setSelectedActivityName] = useState("");
  const [isAttendancePopupOpen, setIsAttendancePopupOpen] = useState(false);

  const { data, isLoading } = useGetAllActivities(currentPage, searchQuery);

  const handleSearch = (query: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("search", query);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
    setCurrentPage(newPage);
  };

  const openAttendancePopup = (activityId: string, activityName: string) => {
    setSelectedActivityName(activityName);
    setSelectedActivityId(activityId);
    setIsAttendancePopupOpen(true);
  };

  const closeAttendancePopup = () => {
    setIsAttendancePopupOpen(false);
  };

  const openPopup = (activityId: string, activityName: string) => {
    setSelectedActivityName(activityName);
    setSelectedActivityId(activityId);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={handleSearch} />
          <Button
            label="Thêm hoạt động"
            onClick={() => router.push("/admin/activities/add")}
            variant="primary"
          />
        </div>
        <Table
          headers={headers}
          data={data?.data || []}
          dataFieldsName={dataFields}
          dateFields={["activity_start_date"]}
          isLoading={isLoading}
          loading={"skeleton"}
          actions={(activity) => (
            <ActionButton
              buttonLabel="Tác vụ"
              actions={[
                {
                  label: "Sửa",
                  onClick: () =>
                    router.push(`/admin/activities/${activity._id}`),
                },
                {
                  label: "Xem sinh viên",
                  onClick: () =>
                    openPopup(activity._id, activity.activity_name),
                },
                {
                  label: "Xem điểm danh",
                  onClick: () => {
                    openAttendancePopup(activity._id, activity.activity_name);
                  },
                },
              ]}
            />
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(data?.total / 10 || 1)}
          onPageChange={handlePageChange}
        />
      </main>
      {isAttendancePopupOpen && (
        <Popup
          isOpen={isAttendancePopupOpen}
          title={selectedActivityName}
          onClose={closeAttendancePopup}
        >
          <ActivityAttendance activityId={selectedActivityId} />
        </Popup>
      )}
      {isPopupOpen && (
        <Popup
          isOpen={isPopupOpen}
          title={selectedActivityName}
          onClose={closePopup}
        >
          <ActivityParticipants activityId={selectedActivityId} />
        </Popup>
      )}
    </>
  );
}
