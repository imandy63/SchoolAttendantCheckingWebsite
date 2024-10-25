"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";
import { useRouter } from "next/navigation";

const activityData = [
  {
    id: "2001215836",
    name: "Hoạt động thể thao",
    date: "06/03/2023",
    time: "9:00 - 11:00",
    khóa: "12",
    điểm: 100,
    số_lượng: 300,
  },
  {
    id: "2001215837",
    name: "Hoạt động văn nghệ",
    date: "07/03/2023",
    time: "13:00 - 15:00",
    khóa: "12",
    điểm: 90,
    số_lượng: 250,
  }
];

export default function Activities() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleEdit = (activityId: string) => {
    router.push(`/admin/activities/edit?pageId=${activityId}`);
  };

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

  const handleAddActivity = () => {
    router.push("/admin/activities/add");
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={handleSearch} />
          <Button label="Thêm hoạt động" onClick={handleAddActivity} variant="primary" />
        </div>
        <Table 
          headers={headers} 
          data={activityData} 
          actions={(activity) => (
            <Button label="Sửa" onClick={() => handleEdit(activity.id)} variant="secondary" />
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
