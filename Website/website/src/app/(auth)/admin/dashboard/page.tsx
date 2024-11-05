"use client";

import { useState } from "react";
import { Sidebar } from "../_components/Sidebar";
import { Table } from "../_components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../_components/Pagination";
import { Button } from "../_components/Button";

const dashboardData = [
  {
    id: "D001",
    hoat_dong: "Hoạt động thể thao",
    tong_so_thanh_vien: 100,
    ngay: "06/03/2023",
  },
  {
    id: "D002",
    hoat_dong: "Hoạt động văn nghệ",
    tong_so_thanh_vien: 80,
    ngay: "07/03/2023",
  },
];

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);

  const headers = ["ID", "Hoạt động", "Tổng số thành viên", "Ngày"];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={() => {}} />
          <Button label="Thêm hoạt động" onClick={() => {}} variant="primary" />
        </div>
        <Table
          headers={headers}
          data={dashboardData}
          actions={(row) => (
            <Button
              label="Xem chi tiết"
              onClick={() => {}}
              variant="secondary"
            />
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
