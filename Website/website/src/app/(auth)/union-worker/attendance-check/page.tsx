"use client";
import React, { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { useRouter } from "next/navigation";
import { useGetTracking, useUpdateTracking } from "@/query/useTracking";
import { useToast } from "@/context/ToastContext";

const AttendancePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const { data, isLoading, isError } = useGetTracking(
    "672b14a7dea77ab9208611c8"
  );
  const {
    mutate,
    isSuccess,
    isError: updateError,
  } = useUpdateTracking("672b14a7dea77ab9208611c8");
  const { showToast } = useToast();
  const [students, setStudents] = useState<string[]>([]);

  const paginatedData = data
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  // 3 fields + checkbox field
  const headers = ["Mã sinh viên", "Họ Tên", "Lớp", "Điểm danh"];
  const dataFieldsName = [
    "student_id",
    "student_name",
    "student_class.class_name",
  ];

  const handleSearch = () => {
    console.log("Searching for students...");
  };

  const handleSubmit = async () => {
    mutate(
      {
        student_ids: students,
      },
      {
        onSuccess: () => {
          showToast("Điểm danh thành công!", "success");
        },
        onError: () => {
          showToast("Lỗi khi điểm danh. Vui lòng thử lại sau", "error");
        },
      }
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8 bg-white">
      {/* Back Button */}
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
        {/* Activity Information Section */}
        <div className="w-1/3">
          <h2 className="text-2xl font-bold mb-4 text-black">
            Hoạt động: Tên Hoạt Động (Param)
          </h2>
          <div className="mb-4 text-lg font-medium text-black">
            <p>Số lượng sinh viên: {data ? data.length : 0}</p>
            <p>Người chủ trì: Nguyễn Thị Định</p>
          </div>
          <div className="mb-4">
            <img
              src="/path-to-your-image.jpg"
              alt="Activity Image"
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
        </div>

        {/* Search, Table, and Pagination Section */}
        <div className="w-2/3">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              className="w-64 p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-500"
            />
            <button
              onClick={handleSearch}
              className="ml-2 p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
            >
              Tìm kiếm
            </button>
            <button
              onClick={handleSubmit}
              className="ml-2 p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
            >
              Xác nhận
            </button>
          </div>

          <Table
            headers={headers}
            data={paginatedData}
            dataFieldsName={dataFieldsName}
            loading="skeleton"
            isLoading={isLoading}
            showCheckbox={true}
            onCheckboxChange={(checked, rowData) => {
              setStudents((prevStudents) => {
                if (checked) {
                  return [...prevStudents, rowData.student_id];
                } else {
                  return prevStudents.filter(
                    (student) => student !== rowData.student_id
                  );
                }
              });
            }}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((data?.length || 0) / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
