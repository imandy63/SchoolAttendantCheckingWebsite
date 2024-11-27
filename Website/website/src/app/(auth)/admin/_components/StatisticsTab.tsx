"use client";

import React from "react";
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

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock data
const dashboardData = [
  { id: "D001", hoat_dong: "Hoạt động thể thao", tham_gia: 80 },
  { id: "D002", hoat_dong: "Hoạt động văn nghệ", tham_gia: 60 },
  { id: "D003", hoat_dong: "Hoạt động học thuật", tham_gia: 45 },
];

const barData = {
  labels: dashboardData.map((item) => item.hoat_dong),
  datasets: [
    {
      label: "Số lượng tham gia",
      data: dashboardData.map((item) => item.tham_gia),
      backgroundColor: "#2196f3",
    },
  ],
};

export default function StatisticsTab() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6" style={{ height: "400px" }}>
      <h2 className="text-lg font-bold text-blue-600 mb-4">
        Thống kê số lượng sinh viên tham gia
      </h2>
      <Bar data={barData} />
    </div>
  );
}
