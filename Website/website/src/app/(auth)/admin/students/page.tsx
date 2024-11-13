"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table } from "../../../../components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import { Button } from "../_components/Button";
import { Popup, StudentActivities } from "../_components/Popup";
import { useStudents } from "@/query/useStudent";

const headers = [
  "MSSV",
  "Họ và tên",
  "Lớp",
  "Khoa",
  "Điểm rèn luyện",
  "Tổng số hoạt động",
];

const dataFields = [
  "student_id",
  "student_name",
  "student_class.class_name",
  "student_class.faculty",
  "student_activity_point",
  "activity_participants_total",
];

export default function Students() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
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
      <main className="flex-1 p-8">
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
            <Button
              label="Xem"
              onClick={() => openPopup(student.student_id)}
              variant="secondary"
            />
          )}
        />
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
