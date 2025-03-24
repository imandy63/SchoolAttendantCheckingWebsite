"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table } from "../../../../components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import { Button } from "../_components/Button";
import { Popup, StudentActivities } from "../_components/Popup";
import { useStudents, useToStudent } from "@/query/useStudent";
import { useToUnionWorker } from "@/query/useUnionWorker";
import ActionButton from "../_components/ActionButton";
import { useToast } from "@/context/ToastContext";

const headers = [
  "MSSV",
  "Họ và tên",
  "Lớp",
  "Khoa",
  "Vai trò",
  "Điểm rèn luyện",
  "Tổng số hoạt động",
];

const dataFields = [
  "student_id",
  "student_name",
  "student_class.class_name",
  "student_class.faculty",
  "role",
  "student_activity_point",
  "activity_participants_total",
];

export default function Students() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const [totalStudents, setTotalStudents] = useState(0);
  const search = searchParams.get("search") || "";
  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState(search);
  const router = useRouter();

  const { data, isLoading, error } = useStudents(currentPage, searchQuery);

  const handleSearch = (searchQuery: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("search", searchQuery);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
    setSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const { showToast } = useToast();
  const { mutate: toWorker } = useToUnionWorker(currentPage, searchQuery);
  const { mutate: toStudent } = useToStudent(currentPage, searchQuery);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  const openPopup = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedStudentId(null);
  };

  if (isLoading) return <p>Loading students...</p>;
  if (error) return <p>Error loading students: {error.message}</p>;

  const students = data?.data || [];
  const totalPages = Math.ceil(data?.total / 10) || 1;

  return (
    <>
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
        <Table
          headers={headers}
          dataFieldsName={dataFields}
          data={students}
          loading={"skeleton"}
          isLoading={isLoading}
          actions={(student) => (
            <ActionButton
              buttonLabel="Tác vụ"
              actions={[
                student.role === "sinh viên"
                  ? {
                      label: "Trờ thành công tác viên",
                      onClick: () => {
                        toWorker(student._id, {
                          onSuccess: () => {
                            showToast("Thành công", "success");
                          },
                          onError: () => {
                            showToast("Lỗi", "error");
                          },
                        });
                      },
                    }
                  : {
                      label: "Tước công tác viên",
                      onClick: () => {
                        toStudent(student._id, {
                          onSuccess: () => {
                            showToast("Thành công", "success");
                          },
                          onError: () => {
                            showToast("Lỗi", "error");
                          },
                        });
                      },
                    },
                {
                  label: "Xem hoạt động đăng ký",
                  onClick: () => {
                    openPopup(student.student_id);
                  },
                },
              ]}
            />
          )}
        />
        <div className="py-4 font-bold">
          Tổng số lượng sinh viên: {data?.total ?? 0}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
      {selectedStudentId && (
        <Popup
          isOpen={isPopupOpen}
          title={`Chi tiết tham gia của sinh viên mã: ${selectedStudentId}`}
          onClose={closePopup}
        >
          <StudentActivities studentId={selectedStudentId} />
        </Popup>
      )}
    </>
  );
}
