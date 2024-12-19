"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { useRouter, useParams } from "next/navigation";
import {
  useGetTracking,
  useImageProcessing,
  useUpdateTracking,
} from "@/query/useTracking";
import { useToast } from "@/context/ToastContext";
import { useGetActivity } from "@/query/useActivity";
import { Popup } from "@/app/(auth)/admin/_components/Popup";

const AttendancePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const itemsPerPage = 10;
  const router = useRouter();
  const { data: activity, isLoading: isLoadingActivity } = useGetActivity(
    id as string
  );
  const { data, isLoading, error } = useGetTracking(id as string);
  const { mutate } = useUpdateTracking(id as string);
  const { showToast } = useToast();
  const [students, setStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data || []);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupItem, setPopupItem] = useState<string[] | null>(null);
  const { mutate: imageProcess } = useImageProcessing();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imageProcess(file, {
        onSuccess: (returnData) => {
          const firstArr = valueInTwoArrays(
            returnData.data,
            data.map((student) => student.student_id)
          );
          const secondArr = valueNotInSecondArrays(firstArr, students);

          if (secondArr.length !== 0) {
            setPopupItem(secondArr);
            setIsPopupOpen(true);
          }

          setStudents((prev) => [...prev, ...secondArr]);

          showToast("Xử lý thành công", "success");
        },
        onError: () => {
          showToast("Xử lý thất bại", "error");
        },
      });
    }
  };

  const valueInTwoArrays = (returnData: string[], data: string[]) => {
    const commonValues = returnData.filter((value) => data.includes(value));
    return commonValues;
  };

  const valueNotInSecondArrays = (returnData: string[], data: string[]) => {
    const commonValues = returnData.filter((value) => !data.includes(value));
    return commonValues;
  };

  // Filter data based on search term
  useEffect(() => {
    if (data) {
      const filtered = data.filter(
        (student) =>
          student.student_id.includes(searchTerm) ||
          student.student_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.student_class.class_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  // Handle error and redirection if necessary
  useEffect(() => {
    if (error || !id) {
      showToast("Không tìm thấy dữ liệu", "error");
      router.back();
    }
  }, [error]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const headers = ["Mã sinh viên", "Họ Tên", "Lớp", "Điểm danh"];
  const dataFieldsName = [
    "student_id",
    "student_name",
    "student_class.class_name",
  ];

  const handleSubmit = () => {
    mutate(
      {
        student_ids: students,
      },
      {
        onSuccess: () => {
          showToast("Điểm danh thành công!", "success");
          router.push("/union-worker");
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
        onClick={() => router.push("/union-worker")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 "
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
          {!isLoadingActivity && activity ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">
                Hoạt động: {activity.activity_name}
              </h2>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Số lượng sinh viên:</strong> {data ? data.length : 0}
              </p>
              <p className="text-sm text-gray-700 mb-4">
                <strong>Người chủ trì:</strong> {activity.activity_host}
              </p>
              <Image
                src={
                  activity.activity_thumb_url || "/default-activity-image.png"
                }
                alt="Activity"
                className="rounded-lg shadow-md w-full h-auto"
                width={500}
                height={300}
              />
            </>
          ) : (
            <></>
          )}
        </div>

        {/* Search, Table, and Pagination Section */}
        <div className="w-2/3 bg-white rounded-lg shadow-lg p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="fileInput"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md cursor-pointer"
              >
                Xử lý điểm danh ảnh
              </label>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
              >
                Xác nhận
              </button>
            </div>
          </div>

          {/* Student Table */}
          <Table
            headers={headers}
            data={paginatedData}
            dataFieldsName={dataFieldsName}
            loading="skeleton"
            isLoading={isLoading}
            showCheckbox={true}
            checkboxRules={[
              {
                column: "student_id",
                data: students,
              },
            ]}
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
            totalPages={Math.ceil(filteredData.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {isPopupOpen && (
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          title="Mã số các sinh viên được thêm"
        >
          {popupItem?.map((item, index) => (
            <div key={index} className="mb-4">
              <p>{item}</p>
            </div>
          ))}
        </Popup>
      )}
    </div>
  );
};

export default AttendancePage;
