"use client";

import React, { useState, useEffect } from "react";
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
import {
  useGetStatistics,
  useGetTimeRange,
  useGetYearStatistics,
} from "@/query/useActivity";

// Register Chart.js components
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

export const OverviewTab = () => {
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [availableMonths, setAvailableMonths] = useState<number[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Fetch data using react-query
  const { data: yearStatistics } = useGetYearStatistics({ year: selectedYear });
  const { data: timeRange } = useGetTimeRange();
  const { data: statistics } = useGetStatistics({
    year: selectedYear,
    month: selectedMonth,
  });

  console.log(yearStatistics);

  useEffect(() => {
    if (timeRange) {
      const minDate = new Date(timeRange.min);
      const maxDate = new Date(timeRange.max);

      // Generate available years between minDate and maxDate
      const yearRange = [];
      for (
        let year = minDate.getFullYear();
        year <= maxDate.getFullYear();
        year++
      ) {
        yearRange.push(year);
      }
      setAvailableYears(yearRange);

      // Generate month range for dropdown
      if (minDate.getFullYear() === maxDate.getFullYear()) {
        setAvailableMonths(
          Array.from(
            { length: maxDate.getMonth() - minDate.getMonth() + 1 },
            (_, i) => minDate.getMonth() + i + 1
          )
        );
      } else if (selectedYear === minDate.getFullYear()) {
        setAvailableMonths(
          Array.from(
            { length: 12 - minDate.getMonth() },
            (_, i) => minDate.getMonth() + i + 1
          )
        );
      } else if (selectedYear === maxDate.getFullYear()) {
        setAvailableMonths(
          Array.from({ length: maxDate.getMonth() + 1 }, (_, i) => i + 1)
        );
      } else {
        setAvailableMonths(Array.from({ length: 12 }, (_, i) => i + 1));
      }
    }
  }, [timeRange, selectedYear]);

  // Prepare chart data
  const pieData = {
    labels: ["Tham gia", "Vắng"],
    datasets: [
      {
        data: statistics
          ? [
              statistics.total_participated_students,
              statistics.total_students_by_activities -
                statistics.total_participated_students,
            ]
          : [0, 0],
        backgroundColor: ["#2196f3", "#f44336"],
      },
    ],
  };

  const barData = {
    labels: statistics
      ? statistics.activities.map((activity) => activity.activity_name)
      : [],
    datasets: [
      {
        label: "Tổng sinh viên",
        data: statistics
          ? statistics.activities?.map(
              (activity) => activity.number_of_students
            )
          : [],
        backgroundColor: "#4caf50",
      },
      {
        label: "Tổng tham gia",
        data: statistics
          ? statistics.activities?.map(
              (activity) => activity.number_of_participated_students
            )
          : [],
        backgroundColor: "#2196f3",
      },
    ],
  };

  const monthlyData = {
    labels: yearStatistics ? yearStatistics.map((item) => item.month) : [],
    datasets: yearStatistics
      ? [
          {
            label: "Tổng tham gia",
            data: yearStatistics.map((item) => item.total_participants),
            borderColor: "#4caf50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            fill: true,
          },
          {
            label: "Tổng sinh viên",
            data: yearStatistics.map((item) => item.total_students),
            borderColor: "#2196f3",
            backgroundColor: "rgba(33, 150, 243, 0.2)",
            fill: true,
          },
        ]
      : [],
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-700">Activity Overview</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
        >
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              Tháng {month}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="flex items-center bg-white rounded-lg shadow-md p-4">
          <AiOutlinePieChart className="text-blue-500 text-4xl mr-4" />
          <div>
            <p className="text-gray-600">Tổng số hoạt động</p>
            <h3 className="text-2xl font-bold text-blue-600">
              {statistics?.number_of_activities || 0}
            </h3>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-md p-4">
          <AiOutlineTeam className="text-green-500 text-4xl mr-4" />
          <div>
            <p className="text-gray-600">Tổng số tham gia</p>
            <h3 className="text-2xl font-bold text-green-600">
              {statistics?.total_participated_students || 0}
            </h3>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-md p-4">
          <AiOutlineUser className="text-orange-500 text-4xl mr-4" />
          <div>
            <p className="text-gray-600">Tổng số sinh viên</p>
            <h3 className="text-2xl font-bold text-orange-600">
              {statistics?.total_students_by_activities || 0}
            </h3>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-md p-4">
          <AiOutlineFieldTime className="text-red-500 text-4xl mr-4" />
          <div>
            <p className="text-gray-600">Tỉ lệ tham gia</p>
            <h3 className="text-2xl font-bold text-red-600">
              {statistics &&
              statistics.total_participated_students &&
              statistics.total_students_by_activities
                ? `${(
                    (statistics.total_participated_students /
                      statistics.total_students_by_activities) *
                    100
                  ).toFixed(2)}%`
                : "0%"}
            </h3>
          </div>
        </div>
      </div>

      {/* Pie and Bar Charts */}
      <div className="flex space-x-8 mb-6">
        <div
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ width: "40%", height: "300px" }}
        >
          <Pie data={pieData} />
        </div>
        <div
          className="bg-white rounded-lg shadow-lg p-6 overflow-auto"
          style={{ width: "60%", height: "300px" }}
        >
          <Bar
            data={barData} // Keep original data as it is
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    title: function (tooltipItems) {
                      // Display the full activity name in the tooltip title
                      const index = tooltipItems[0].dataIndex;
                      return barData.labels[index];
                    },
                    label: function (context) {
                      // Display dataset label and value
                      const datasetLabel = context.dataset.label || "";
                      const value = context.raw;
                      return `${datasetLabel}: ${value}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    callback: function (value, index) {
                      // Shorten x-axis labels but ensure full names are shown in tooltip
                      const label = barData.labels[index];
                      return label.length > 15
                        ? `${label.slice(0, 15)}...`
                        : label;
                    },
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Dropdown for Year */}
      <div className="flex justify-end mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Line Chart */}
      <div
        className="bg-white rounded-lg shadow-lg p-6"
        style={{ height: "400px" }}
      >
        <Line data={monthlyData} />
      </div>
    </>
  );
};
