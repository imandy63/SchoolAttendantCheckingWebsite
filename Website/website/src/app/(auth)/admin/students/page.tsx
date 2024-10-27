// src/app/admin/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";
import { getAllStudentsAPI } from "@/api/api.student";
import { Student } from "@/interfaces/student.interface";
import { Popup, StudentActivities } from "../components/Popup";

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
  "student_participated_activities.length",
];

export default function Students() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search");
  const [currentPage, setCurrentPage] = useState(page);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState(search);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const getAllStudents = async (page: number, search = "") => {
    const data = await getAllStudentsAPI(page, search);
    console.log(search);
    setStudents(data.data);
    setTotalPages(Math.ceil(data.total / 10));
  };

  useEffect(() => {
    getAllStudents(currentPage, searchQuery || "");
  }, [currentPage, searchQuery]);

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

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
        <Table
          headers={headers}
          dataFieldsName={dataFields}
          data={students}
          actions={(student) => (
            <>
              <Button
                label="Xem"
                onClick={() => {
                  console.log(student);
                  openPopup(student.student_id);
                }}
                variant="secondary"
              />
            </>
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
          title="Student Participated Activities"
          onClose={closePopup}
        >
          <StudentActivities studentId={selectedStudentId} />
        </Popup>
      )}
    </div>
  );
}
