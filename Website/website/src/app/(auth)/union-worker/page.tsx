"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import {
  useGetPastAssignedActivities,
  useGetUpcomingAssignedActivities,
} from "@/query/useChecking";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { ActivityAttendance, Popup } from "../admin/_components/Popup";
import { logoutUser } from "@/api/api.auth";
import Link from "next/link";
import { exportPDFAPI } from "@/api/api.tracking";

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "history">(
    "overview"
  );

  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [selectedActivityName, setSelectedActivityName] = useState("");
  const [isAttendancePopupOpen, setIsAttendancePopupOpen] = useState(false);

  const openAttendancePopup = (activityId: string, activityName: string) => {
    setSelectedActivityName(activityName);
    setSelectedActivityId(activityId);
    setIsAttendancePopupOpen(true);
  };

  const closeAttendancePopup = () => {
    setIsAttendancePopupOpen(false);
  };

  const handleExportPDF = async (activityId: string) => {
    try {
      // Fetch the file as a Blob
      const blob = await exportPDFAPI({
        activity_id: activityId,
      });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Set the downloaded file name
      const fileName = `activities_${activityId}.pdf`;
      a.download = fileName;

      // Trigger the download
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export Excel:", error);
    }
  };

  const { data: upcoming, isLoading: upcomingLoading } =
    useGetUpcomingAssignedActivities();
  const { data: past, isLoading: pastLoading } = useGetPastAssignedActivities();

  const router = useRouter();

  const chartData = {
    labels: ["Đã kết thúc", "Sắp diễn ra"],
    datasets: [
      {
        label: "Số lượng hoạt động",
        data: [past?.length || 0, upcoming?.length || 0],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Thống kê hoạt động",
      },
    },
  };

  return (
    <div className="flex flex-col p-8 bg-[#F2F3F7]">
      {/* Tab Navigation */}
      <div className="flex justify-between space-x-4 mb-8">
        <div className="space-x-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded ${
              activeTab === "overview"
                ? "bg-[#0066B3] text-white font-semibold"
                : "bg-[#FAFAFA] text-[#0066B3] hover:bg-[#A0D0EC]"
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded ${
              activeTab === "history"
                ? "bg-[#0066B3] text-white font-semibold"
                : "bg-[#FAFAFA] text-[#0066B3] hover:bg-[#A0D0EC]"
            }`}
          >
            Lịch sử
          </button>
        </div>
        <div className="flex items-center justify-between">
          <Link
            href="/student/main"
            className="text-blue-600 px-4 py-2 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium transition-colors duration-200"
          >
            Về trang sinh viên
          </Link>
          <button
            onClick={async () => {
              await logoutUser();
              router.push("/login");
            }}
            className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <>
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-[#0066B3]">
              Dashboard Công Tác Viên
            </h1>
            <p className="text-gray-600">
              Thống kê hoạt động được phân công cho công tác viên
            </p>
          </header>

          {/* Thống kê */}
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="shadow rounded p-4 flex items-center space-x-4"
                style={{ backgroundColor: "#FAFAFA" }}
              >
                <FaClock className="text-blue-500 text-4xl" />
                <div>
                  <h3 className="text-lg font-semibold text-[#0066B3] mb-1">
                    Hoạt động sắp diễn ra
                  </h3>
                  <p className="text-3xl font-bold text-blue-500">
                    +{upcoming?.length || 0}
                  </p>
                </div>
              </div>
              <div
                className="shadow rounded p-4 flex items-center space-x-4"
                style={{ backgroundColor: "#FAFAFA" }}
              >
                <FaCheckCircle className="text-red-500 text-4xl" />
                <div>
                  <h3 className="text-lg font-semibold text-[#0066B3] mb-1">
                    Hoạt động đã kết thúc
                  </h3>
                  <p className="text-3xl font-bold text-red-500">
                    +{past?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Chart and Activities Section */}
          <section className="grid grid-cols-2 gap-4">
            <div
              className="shadow rounded p-4"
              style={{ backgroundColor: "#FAFAFA" }}
            >
              <h2 className="text-lg font-bold text-[#0066B3] mb-4">
                Biểu đồ hoạt động
              </h2>
              <div style={{ height: "300px", width: "100%" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            <div
              className="shadow rounded p-4"
              style={{ backgroundColor: "#FAFAFA" }}
            >
              <h2 className="text-lg font-bold text-[#0066B3] mb-4">
                Danh sách hoạt động
              </h2>
              <ul className="space-y-2">
                {upcoming &&
                  upcoming.map((activity) => {
                    const activityDate = new Date(activity.activity_start_date);
                    const now = new Date();
                    const oneHourLater = new Date(
                      activityDate.getTime() + 60 * 60 * 1000
                    );

                    const isButtonEnabled =
                      now >= activityDate &&
                      now <= oneHourLater &&
                      activity.activity_status !== "CLOSED";
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
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 text-white bg-[#f5672e] rounded hover:bg-[#cc7439]"
                            onClick={() => handleExportPDF(activity._id)}
                          >
                            PDF
                          </button>
                          {isButtonEnabled && (
                            <button
                              className="px-4 py-2 text-white bg-[#0066B3] rounded hover:bg-[#005699]"
                              onClick={() => {
                                router.push(
                                  `/union-worker/attendance-check/${activity._id}`
                                );
                              }}
                            >
                              Tiến hành điểm danh
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </section>
        </>
      )}

      {activeTab === "history" && (
        <div>
          <h2 className="text-xl font-bold text-[#0066B3]">
            Lịch sử hoạt động
          </h2>
          <p>Hiển thị danh sách lịch sử hoạt động.</p>
          <div>
            <ul className="py-4 space-y-2">
              {past &&
                past
                  .filter((a) => {
                    console.log(a);
                    return a.activity_status === "CLOSED";
                  })
                  .map((activity) => {
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
                        <button
                          className="px-4 py-2 text-white bg-[#0066B3] rounded hover:bg-[#005699]"
                          onClick={() => {
                            openAttendancePopup(
                              activity._id,
                              activity.activity_name
                            );
                          }}
                        >
                          Xem điểm danh
                        </button>
                      </li>
                    );
                  })}
            </ul>
          </div>
        </div>
      )}

      {isAttendancePopupOpen && (
        <Popup
          isOpen={isAttendancePopupOpen}
          title={selectedActivityName}
          onClose={closeAttendancePopup}
        >
          <ActivityAttendance activityId={selectedActivityId} />
        </Popup>
      )}
    </div>
  );
}
