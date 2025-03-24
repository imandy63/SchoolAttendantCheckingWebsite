"use client";
import { act, useState } from "react";
import { Table } from "../../../../components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import { Button } from "../_components/Button";
import { useGetAllActivities, useGetTotalActivity } from "@/query/useActivity";
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
  "Người điểm danh",
  "Trạng thái",
  "Số lượng",
  "Đã tham gia",
];

const dataFields = [
  "activity_name",
  "activity_start_date",
  "activity_duration",
  "activity_point",
  "assigned_to",
  "activity_status",
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
  const { data: count, isLoading: totalLoading } =
    useGetTotalActivity(searchQuery);

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

  const statusHandler = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Mở";
      case "CLOSED":
        return "Đóng";
      case "REMOVED":
        return "Đã bỏ";
      case "FULL":
        return "Đầy";
      default:
        return "Mở";
    }
  };

  const restructuredData = (data: any) => {
    return data?.map(
      (act: {
        activity_name: string;
        activity_start_date: string;
        activity_duration: string;
        activity_point: string;
        assigned_to: string;
        activity_status: string;
        activity_max_participants: string;
        activity_participants_total: string;
      }) => {
        return {
          ...act,
          activity_status: statusHandler(act.activity_status),
        };
      }
    );
  };

  return (
    <>
      <main className="flex-1 p-8 h-screen overflow-y-auto">
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
          data={data ? restructuredData(data?.data) : []}
          dataFieldsName={dataFields}
          dateFields={["activity_start_date"]}
          isLoading={isLoading}
          loading={"skeleton"}
          actions={(activity) => (
            <ActionButton
              buttonLabel="Tác vụ"
              actions={
                activity.activity_status !== "CLOSED"
                  ? [
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
                          openAttendancePopup(
                            activity._id,
                            activity.activity_name
                          );
                        },
                      },
                    ]
                  : [
                      {
                        label: "Xem sinh viên",
                        onClick: () =>
                          openPopup(activity._id, activity.activity_name),
                      },
                      {
                        label: "Xem điểm danh",
                        onClick: () => {
                          openAttendancePopup(
                            activity._id,
                            activity.activity_name
                          );
                        },
                      },
                    ]
              }
            />
          )}
        />
        <div className="py-4 font-bold">
          Tổng số lượng hoạt động: {data?.total ?? 0}
        </div>
        {!totalLoading && count.length > 0 && (
          <>
            <div className="py-4 font-bold">
              Tổng hoạt động đã điểm danh:{" "}
              {count.length > 0 && count[0]?.closedCount.length > 0
                ? count[0]?.closedCount[0].count
                : 0}
            </div>
            <div className="py-4 font-bold">
              Tổng hoạt động sắp tới:{" "}
              {count.length > 0 && count[0]?.upcomingCount.length > 0
                ? count[0]?.upcomingCount[0].count
                : 0}
            </div>
            <div className="py-4 font-bold">
              Tổng hoạt động chưa điểm danh:{" "}
              {count.length > 0 && count[0]?.notSubmittedCount.length > 0
                ? count[0]?.notSubmittedCount[0].count
                : 0}
            </div>
          </>
        )}
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
