// src/app/admin/help/page.tsx
"use client";

import { useState } from "react";
import { Table } from "../../../../components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import { Button } from "../_components/Button";

const helpData = [
  {
    id: "H001",
    tieu_de: "Cách thêm sinh viên mới",
    mo_ta: "Hướng dẫn chi tiết về cách thêm sinh viên mới vào hệ thống.",
    ngay_cap_nhat: "01/03/2023",
  },
  {
    id: "H002",
    tieu_de: "Cách tạo báo cáo",
    mo_ta: "Cách xuất báo cáo chi tiết hàng tuần và hàng tháng.",
    ngay_cap_nhat: "05/03/2023",
  },
];

export default function Help() {
  const [currentPage, setCurrentPage] = useState(1);

  const headers = ["ID", "Tiêu đề", "Mô tả", "Ngày cập nhật"];

  return (
    <main className="flex-1 p-8">
      <div className="flex justify-between items-center mb-4">
        <SearchBar onSearch={() => {}} />
        <Button label="Thêm hướng dẫn" onClick={() => {}} variant="primary" />
      </div>
      <Table
        headers={headers}
        data={helpData}
        actions={(row) => (
          <Button label="Xem chi tiết" onClick={() => {}} variant="secondary" />
        )}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
