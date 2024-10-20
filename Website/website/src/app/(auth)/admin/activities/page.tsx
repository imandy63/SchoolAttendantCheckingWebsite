// src/app/admin/activities/page.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";

const activityData = [
  {
    id: "2001215836",
    ten_hoat_dong: "Hoạt động thể thao",
    ngay: "06/03/2023",
    thoi_gian: "9:00 - 11:00",
    khoa: "12",
    diem_ren_luyen: "100",
    so_luong: "300",
  },
  {
    id: "2001215837",
    ten_hoat_dong: "Hoạt động văn nghệ",
    ngay: "07/03/2023",
    thoi_gian: "13:00 - 15:00",
    khoa: "12",
    diem_ren_luyen: "90",
    so_luong: "250",
  },
];

export default function Activities() {
  const [currentPage, setCurrentPage] = useState(1);

  const headers = [
    "ID",
    "Tên hoạt động",
    "Ngày",
    "Thời gian",
    "Khóa",
    "Điểm rèn luyện",
    "Số lượng",
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
          <Button label="Thêm hoạt động" onClick={() => {}} variant="primary" />
        </div>
        <Table headers={headers} data={activityData} actions={(row) => (
          <Button label="Sửa" onClick={() => {}} variant="secondary" />
        )} />
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
