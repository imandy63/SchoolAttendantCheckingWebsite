// src/app/admin/reports/page.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";

const reportsData = [
  {
    id: "R001",
    bao_cao: "Báo cáo tổng kết tháng 3",
    so_trang: 20,
    ngay_xuat: "31/03/2023",
  },
  {
    id: "R002",
    bao_cao: "Báo cáo hoạt động tuần",
    so_trang: 10,
    ngay_xuat: "07/03/2023",
  },
];

export default function Reports() {
  const [currentPage, setCurrentPage] = useState(1);

  const headers = ["ID", "Báo cáo", "Số trang", "Ngày xuất"];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={() => {}} />
          <Button label="Xuất báo cáo" onClick={() => {}} variant="primary" />
        </div>
        <Table headers={headers} data={reportsData} actions={(row) => (
          <Button label="Xem báo cáo" onClick={() => {}} variant="secondary" />
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
