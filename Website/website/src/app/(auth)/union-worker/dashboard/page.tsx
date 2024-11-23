"use client";

import { useState, useEffect } from "react";
import { Activity } from "@/interfaces/activity.interface";
import { categorizeActivities } from "@/utils/activity-utils";
import { ActivityEnum } from "@/enums/activity.enum";
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
import { FaRunning, FaClock, FaCheckCircle } from "react-icons/fa";

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const mockActivities: Activity[] = [
  // Mock data as provided
  {
    _id: "1",
    activity_name: "Hội thao sinh viên",
    activity_start_date: new Date("2024-11-15T08:00:00"),
    activity_participants: [{ student_id: "2001215836", student_name: "Kong Hoa Hung" }],
    activity_max_participants: 50,
    activity_point: 10,
    activity_thumb_url: "/images/sample1.jpg",
    activity_duration: 120,
    activity_categories: ["Thể thao"],
    activity_status: ActivityEnum.ONGOING,
    activity_host: "Đoàn trường",
    activity_location: "Sân vận động",
  },
  // More data as needed
];

export default function DashboardPage() {
  const [categorizedActivities, setCategorizedActivities] = useState({
    past: [] as Activity[],
    ongoing: [] as Activity[],
    upcoming: [] as Activity[],
  });
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  useEffect(() => {
    const categorized = categorizeActivities(mockActivities);
    setCategorizedActivities(categorized);
  }, []);

  const chartData = {
    labels: ["Đã kết thúc", "Đang diễn ra", "Sắp diễn ra"],
    datasets: [
      {
        label: "Số lượng hoạt động",
        data: [
          categorizedActivities.past.length,
          categorizedActivities.ongoing.length,
          categorizedActivities.upcoming.length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
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
    <div className="flex flex-col p-8" style={{ backgroundColor: "#F2F3F7" }}>
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8">
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

      {/* Tab Content */}
      {activeTab === "overview" && (
        <>
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-[#0066B3]">Dashboard Công Tác Viên</h1>
            <p className="text-gray-600">
              Thống kê hoạt động được phân công cho công tác viên
            </p>
          </header>

          {/* Thống kê */}
          <section className="mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div
                className="shadow rounded p-4 flex items-center space-x-4"
                style={{ backgroundColor: "#FAFAFA" }}
              >
                <FaRunning className="text-green-500 text-4xl" />
                <div>
                  <h3 className="text-lg font-semibold text-[#0066B3] mb-1">
                    Hoạt động đang diễn ra
                  </h3>
                  <p className="text-3xl font-bold text-green-500">
                    +{categorizedActivities.ongoing.length}
                  </p>
                </div>
              </div>
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
                    +{categorizedActivities.upcoming.length}
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
                    +{categorizedActivities.past.length}
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
                {mockActivities.map((activity) => (
                  <li
                    key={activity._id}
                    className="p-2 bg-white rounded shadow hover:bg-gray-50"
                  >
                    <p className="font-semibold text-[#0066B3]">{activity.activity_name}</p>
                    <p className="text-sm text-gray-600">
                      {activity.activity_location} -{" "}
                      {activity.activity_start_date.toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {activeTab === "history" && (
        <div>
          <h2 className="text-xl font-bold text-[#0066B3]">Lịch sử hoạt động</h2>
          <p>Hiển thị danh sách lịch sử hoạt động.</p>
        </div>
      )}
    </div>
  );
}
