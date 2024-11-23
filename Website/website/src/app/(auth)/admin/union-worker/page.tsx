"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table } from "../../../../components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import { Button } from "../_components/Button";
import { Popup, StudentActivities } from "../_components/Popup";
import { Menu } from "@headlessui/react";


const headers = ["MSSV", "Họ tên","Tình trạng"];

const dataFields = ["student_id", "student_name", "status"];

const mockUnionWorkers = [
  { student_id: "2001215836", student_name: "Kong Hoa Hung", status: "Enable" },
  { student_id: "2001215837", student_name: "Nguyễn Văn A", status: "Disable" },
  { student_id: "2001215838", student_name: "Trần Thị B", status: "Enable" },
];

export default function UnionWorkerPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search") || "";
  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState(search);
  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [workerStatus, setWorkerStatus] = useState(
    mockUnionWorkers.reduce((acc, worker) => {
      acc[worker.student_id] = worker.status;
      return acc;
    }, {} as { [key: string]: string })
  );

  const handleSearch = (searchQuery: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("search", searchQuery);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
    setSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const openPopup = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedStudentId(null);
  };

  const toggleStatus = (studentId: string) => {
    setWorkerStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: prevStatus[studentId] === "Enable" ? "Disable" : "Enable",
    }));
    console.log(`Status toggled for ${studentId}`);
  };

  const unionWorkers = mockUnionWorkers;
  const totalPages = 1;

  return (
    <main className="flex-1 p-8">
      <div className="flex justify-between items-center mb-4">
        <SearchBar onSearch={handleSearch} />
        <Button label="Thêm công tác viên" variant="primary" onClick={() => console.log("Add Union Worker")} />
      </div>

      {/* Cập nhật bảng với căn giữa tiêu đề và canh trái dữ liệu */}
      <Table
        headers={headers}
        dataFieldsName={dataFields}
        data={unionWorkers}
        loading="skeleton"
        isLoading={false}
        actions={(worker) => (
          <div className="flex justify-center items-center space-x-2">
            {/* Nút trạng thái */}
            <Button
              label={workerStatus[worker.student_id]}
              variant={workerStatus[worker.student_id] === "Enable" ? "primary" : "secondary"}
              onClick={() => toggleStatus(worker.student_id)}
              className="w-20"
            />

            {/* Dropdown tác vụ */}
            <Menu as="div" className="relative inline-block text-center">
              <Menu.Button className="px-2 py-1 ml-2 bg-gray-200 rounded text-sm">
                Tác vụ
              </Menu.Button>
              <Menu.Items className="absolute mt-2 w-24 bg-white border rounded-md shadow-lg z-10">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => openPopup(worker.student_id)}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } w-full px-4 py-2 text-left text-sm`}
                    >
                      Xem
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => console.log(`Thêm cho ${worker.student_id}`)}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } w-full px-4 py-2 text-left text-sm`}
                    >
                      Thêm
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => console.log(`Sửa cho ${worker.student_id}`)}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } w-full px-4 py-2 text-left text-sm`}
                    >
                      Sửa
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => console.log(`Xóa cho ${worker.student_id}`)}
                      className={`${
                        active ? "bg-gray-100 text-red-500" : "text-red-500"
                      } w-full px-4 py-2 text-left text-sm`}
                    >
                      Xóa
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set("page", page.toString());
          router.push(`?${newParams.toString()}`);
        }}
      />

      {selectedStudentId && (
        <Popup
          isOpen={isPopupOpen}
          title={`Chi tiết hoạt động của công tác viên mã: ${selectedStudentId}`}
          onClose={closePopup}
        >
          <StudentActivities studentId={selectedStudentId} />
        </Popup>
      )}
    </main>
  );
}
