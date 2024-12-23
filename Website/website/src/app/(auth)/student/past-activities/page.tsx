"use client";
import { useToast } from "@/context/ToastContext";
import { useLeaveActivity } from "@/query/useActivity";
import { useGetPastActivities } from "@/query/useStudent";
import { formatDate } from "@/utils/formatDate";
import { useState } from "react";

const PastActivityPage = () => {
  const { data, isLoading } = useGetPastActivities();
  const { showToast } = useToast();
  const { mutate } = useLeaveActivity();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filteredData =
    data &&
    data.filter((activity) => {
      const matchesStatus =
        statusFilter === "all" ||
        activity.participating_status === statusFilter;
      const matchesSearch = activity.activity_name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });

  return (
    <>
      <div className="flex flex-col p-8 bg-[#F2F3F7]">
        <div className="px-4">
          <h2 className="text-xl font-bold text-[#0066B3]">
            Lịch sử hoạt động
          </h2>
          <p>Hiển thị danh sách lịch sử hoạt động.</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          {/* Select Box for Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Tất cả</option>
            <option value="participated">Đã tham gia</option>
            <option value="rejected">Vắng</option>
            <option value="registered">Đã đăng ký</option>
          </select>
          {/* Search Box */}
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoạt động..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
        </div>
        <ul className="space-y-2">
          {!isLoading &&
            filteredData &&
            filteredData.map((activity) => {
              return (
                <li
                  key={activity._id}
                  className="flex items-center justify-between p-2 bg-white rounded shadow hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-[#0066B3]">
                      {activity.activity_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.activity_location} -{" "}
                      {formatDate(activity.activity_start_date)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {activity.participating_status === "participated" && (
                      <span className="text-green-500 text-sm">
                        Đã tham gia
                      </span>
                    )}
                    {activity.participating_status === "rejected" && (
                      <span className="text-red-500 text-sm">Vắng</span>
                    )}
                    {activity.participating_status === "registered" &&
                      activity.leavable && (
                        <button
                          className="px-4 py-2 text-white bg-[#0066B3] rounded hover:bg-[#005699]"
                          onClick={() => {
                            mutate(activity._id, {
                              onSuccess: () => {
                                showToast(
                                  "Rời hoạt động thành công",
                                  "success"
                                );
                              },
                              onError: () => {
                                showToast("Rời hoạt động thất bại", "error");
                              },
                            });
                          }}
                        >
                          Rời hoạt động
                        </button>
                      )}
                  </div>
                </li>
              );
            })}
          {!isLoading && filteredData?.length === 0 && (
            <p className="text-center text-gray-500">
              Không có hoạt động phù hợp
            </p>
          )}
        </ul>
      </div>
    </>
  );
};

export default PastActivityPage;
