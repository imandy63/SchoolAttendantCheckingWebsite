// src/app/admin/posts/page.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";

const postsData = [
  {
    id: "P001",
    tieu_de: "Hoạt động thể thao mở rộng",
    ngay_dang: "01/03/2023",
    so_luong_binh_luan: 12,
  },
  {
    id: "P002",
    tieu_de: "Chương trình văn nghệ",
    ngay_dang: "05/03/2023",
    so_luong_binh_luan: 8,
  },
];

export default function Posts() {
  const [currentPage, setCurrentPage] = useState(1);

  const headers = ["ID", "Tiêu đề", "Ngày đăng", "Số lượng bình luận"];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={() => {}} />
          <Button label="Thêm bài viết" onClick={() => {}} variant="primary" />
        </div>
        <Table headers={headers} data={postsData} actions={(row) => (
          <Button label="Chỉnh sửa" onClick={() => {}} variant="secondary" />
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
