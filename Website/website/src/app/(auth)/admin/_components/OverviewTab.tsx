"use client";

import React, { useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import {
  AiOutlineUser,
  AiOutlinePieChart,
  AiOutlineTeam,
  AiOutlineFieldTime,
} from "react-icons/ai";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

// Mock data
const dashboardData = [
  {
    id: "D001",
    hoat_dong: "Hoạt động thể thao",
    tong_so_thanh_vien: 100,
    tham_gia: 80,
  },
  {
    id: "D002",
    hoat_dong: "Hoạt động văn nghệ",
    tong_so_thanh_vien: 80,
    tham_gia: 60,
  },
  {
    id: "D003",
    hoat_dong: "Hoạt động học thuật",
    tong_so_thanh_vien: 50,
    tham_gia: 45,
  },
];

const monthlyData = {
  labels: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  datasets: [
    {
      label: "Số lượng tham gia",
      data: [50, 60, 75, 80, 90, 100, 110, 120, 130, 140, 150, 160],
      borderColor: "#4caf50",
      backgroundColor: "rgba(76, 175, 80, 0.2)",
      fill: true,
    },
    {
      label: "Tổng số thành viên",
      data: [80, 90, 100, 120, 130, 140, 150, 160, 170, 180, 190, 200],
      borderColor: "#2196f3",
      backgroundColor: "rgba(33, 150, 243, 0.2)",
      fill: true,
    },
  ],
};

const pieData = {
  labels: ["Tham gia", "Chưa tham gia"],
  datasets: [
    {
      data: [185, 45],
      backgroundColor: ["#2196f3", "#f44336"],
    },
  ],
};

const barData = {
  labels: dashboardData.map((item) => item.hoat_dong),
  datasets: [
    {
      label: "Tổng số thành viên",
      data: dashboardData.map((item) => item.tong_so_thanh_vien),
      backgroundColor: "#4caf50",
    },
    {
      label: "Tham gia",
      data: dashboardData.map((item) => item.tham_gia),
      backgroundColor: "#2196f3",
    },
  ],
};

export const OverviewTab = () => {
  const [selectedMonth, setSelectedMonth] = useState("Tháng 10");
  const [selectedYear, setSelectedYear] = useState("2024");

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-700">Tổng quan hoạt động</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
        >
          {["Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="flex items-center bg-white rounded-lg shadow-md p-4">
          <AiOutlinePieChart className="text-blue-500 text-4xl mr-4" />
          <div>
            <p className="text-gray-600">Tổng số hoạt động</p>
            <h3 className="text-2xl font-bold text-blue-600">
              {dashboardData.length}
            </h3>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-md p-4">
          <AiOutlineTeam className="text-green-500 text-4xl mr-4" />
          <div>
            <p className="text-gray-600">Số lượng tham gia</p>
            <h3 className="text-2xl font-bold text-green-600">185</h3>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-md p-4">
          <AiOutlineUser className="text-orange-500 text-4xl mr-4" />
          <div>
            <p className="text-gray-600">Tổng số thành viên</p>
            <h3 className="text-2xl font-bold text-orange-600">230</h3>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-md p-4">
          <AiOutlineFieldTime className="text-red-500 text-4xl mr-4" />
          <div>
            <p className="text-gray-600">Tỉ lệ tham gia</p>
            <h3 className="text-2xl font-bold text-red-600">80.43%</h3>
          </div>
        </div>
      </div>

      {/* Biểu đồ Pie và Bar */}
      <div className="flex space-x-8 mb-6">
        <div
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ width: "40%", height: "300px" }}
        >
          <Pie data={pieData} />
        </div>

        <div
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ width: "60%", height: "300px" }}
        >
          <Bar data={barData} />
        </div>
      </div>

      {/* Dropdown chọn năm */}
      <div className="flex justify-end mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>

      {/* Biểu đồ Line */}
      <div
        className="bg-white rounded-lg shadow-lg p-6"
        style={{ height: "400px" }}
      >
        <Line data={monthlyData} />
      </div>
    </>
  );
};
