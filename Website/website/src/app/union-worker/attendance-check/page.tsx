"use client";
import React, { useState } from "react";
import Pagination from "../_components/Pagination";
import Table from "../_components/Table";
import { useRouter } from "next/navigation";

const AttendancePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleSearch = () => {
    console.log("Tìm kiếm sinh viên...");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8 bg-white">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-black flex items-center hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 111.414 1.414L4.414 10l6.293 6.293A1 1 0 0110 18z"
              clipRule="evenodd"
            />
          </svg>
          Điểm Danh
        </button>
      </div>

      <div className="flex space-x-8">
        {/* Phần bên trái với thông tin hoạt động */}
        <div className="w-1/3">
          <h2 className="text-2xl font-bold mb-4 text-black">
            Hoạt động: Tên Hoạt Động (Param)
          </h2>
          <div className="mb-4">
            <p className="text-lg font-medium text-black">
              Số lượng sinh viên: 300
            </p>
            <p className="text-lg font-medium text-black">
              Người chủ trì: Nguyễn Thị Định
            </p>
          </div>
          <div className="mb-4">
            <img
              src="/path-to-your-image.jpg"
              alt="Activity Image"
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
        </div>

        {/* Phần bên phải với table và pagination */}
        <div className="w-2/3">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              className="w-64 p-2 border border-gray-300 rounded-lg text-black"
              onChange={() => handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="ml-2 p-2 bg-gray-200 text-black hover:bg-gray-300 rounded-lg"
            >
              Tìm kiếm
            </button>
          </div>

          <Table currentPage={currentPage} />

          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
