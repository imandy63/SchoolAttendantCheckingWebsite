// src/app/admin/students/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";
import { getAllStudentsAPI } from "@/api/api.student";

const studentData = [
  {
    mssv: "2001215836",
    ho_va_ten: "Kong Hoa Hung",
    ngay_sinh: "06/03/2003",
    lop: "12DHTH01",
    khoa: "12",
    diem_ren_luyen: "100",
    tong_so_hoat_dong: "8",
  },
  {
    mssv: "2001215836",
    ho_va_ten: "Kong Hoa Hung",
    ngay_sinh: "06/03/2003",
    lop: "12DHTH01",
    khoa: "12",
    diem_ren_luyen: "100",
    tong_so_hoat_dong: "8",
  },
  {
    mssv: "2001215836",
    ho_va_ten: "Kong Hoa Hung",
    ngay_sinh: "06/03/2003",
    lop: "12DHTH01",
    khoa: "12",
    diem_ren_luyen: "100",
    tong_so_hoat_dong: "8",
  },
  {
    mssv: "2001215836",
    ho_va_ten: "Kong Hoa Hung",
    ngay_sinh: "06/03/2003",
    lop: "12DHTH01",
    khoa: "12",
    diem_ren_luyen: "100",
    tong_so_hoat_dong: "8",
  },
  {
    mssv: "2001215836",
    ho_va_ten: "Kong Hoa Hung",
    ngay_sinh: "06/03/2003",
    lop: "12DHTH01",
    khoa: "12",
    diem_ren_luyen: "100",
    tong_so_hoat_dong: "8",
  },
];

export default function Students() {
  const [currentPage, setCurrentPage] = useState(1);
  const { page, search, sort } = useSearchParams();
  const [students, setStudents] = useState([]);

  const getAllStudents = async (page: number, search = "", sort = "") => {
    const data = await getAllStudentsAPI(page, search, sort).data;
    setStudents(data);
  };

  const headers = [
    "MSSV",
    "Họ và tên",
    "Ngày sinh",
    "Lớp",
    "Khóa",
    "Điểm rèn luyện",
    "Tổng số hoạt động",
  ];

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={handleSearch} />
          <Button label="Thêm sinh viên" onClick={() => {}} variant="primary" />
        </div>
        <Table
          headers={headers}
          data={studentData}
          actions={() => (
            <Button label="Sửa" onClick={() => {}} variant="secondary" />
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
