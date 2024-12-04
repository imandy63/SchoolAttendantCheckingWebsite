"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { useRouter, useParams } from "next/navigation";
import { useGetTracking, useUpdateTracking } from "@/query/useTracking";
import { useToast } from "@/context/ToastContext";

const AttendancePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const itemsPerPage = 10;
  const router = useRouter();
  const { data, isLoading, error } = useGetTracking(id as string);
  const { mutate } = useUpdateTracking(id as string);
  const { showToast } = useToast();
  const [students, setStudents] = useState<string[]>([]);

  const paginatedData = data
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  useEffect(() => {
    if (error || !id) {
      showToast("Không tìm thấy dữ liệu", "error");
      router.back();
    }
  }, [error]);

  const headers = ["Mã sinh viên", "Họ Tên", "Lớp", "Điểm danh"];
  const dataFieldsName = [
    "student_id",
    "student_name",
    "student_class.class_name",
  ];

  const handleSearch = () => {
    console.log("Searching for students...");
  };

  const handleSubmit = () => {
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
    <div className="p-8 bg-gray-100 min-h-screen">
      <button
        onClick={() => router.push("/union-worker/dashboard")}
        className="flex items-center text-blue-600 hover:text-blue-800"
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
        Quay lại
      </button>

      <div className="flex space-x-8">
        {/* Activity Information Section */}
        <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 relative">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Hoạt động: Tên Hoạt Động (Param)
          </h2>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Số lượng sinh viên:</strong> {data ? data.length : 0}
          </p>
          <p className="text-sm text-gray-700 mb-4">
            <strong>Người chủ trì:</strong> Nguyễn Thị Định
          </p>
          <Image
            src="/default-activity-image.png"
            alt="Activity"
            className="rounded-lg shadow-md w-full h-auto"
            width={500}
            height={300}
          />
          <div className="absolute top-4 right-4 flex items-center">
            <span className="h-3 w-3 bg-green-500 rounded-full shadow-md"></span>
          </div>
        </div>

        {/* Search, Table, and Pagination Section */}
        <div className="w-2/3 bg-white rounded-lg shadow-lg p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên..."
                className="w-64 p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSearch}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 3a7 7 0 104.908 12.32l4.387 4.387a1 1 0 001.415-1.415l-4.387-4.387A7 7 0 009 3zM5 9a4 4 0 118 0 4 4 0 01-8 0z" />
                </svg>
                Tìm kiếm
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
            >
              Xác nhận
            </button>
          </div>

          {/* Student Table */}
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

          {/* Pagination */}
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
