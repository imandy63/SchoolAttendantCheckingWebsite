"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";
import { useRouter } from "next/navigation";

const postData = [
  {
    _id: "1",
    post_title: "Thông báo học bổng",
    post_author: "Admin",
    post_contents: ["Nội dung 1", "Nội dung 2"],
    post_date: "2024-10-25",
  },
  {
    _id: "2",
    post_title: "Sự kiện cuối tuần",
    post_author: "Ban tổ chức",
    post_contents: ["Chi tiết 1", "Chi tiết 2"],
    post_date: "2024-10-26",
  }
];

export default function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const headers = [
    "ID",
    "Tiêu đề",
    "Tác giả",
    "Nội dung",
    "Ngày đăng",
  ];

  const dataFieldsName = [
    "_id",
    "post_title",
    "post_author",
    "post_contents",
    "post_date",
  ];

  const handleAddPost = () => {
    router.push("/admin/posts/add");
  };

  const handleEdit = (postId: string) => {
    router.push(`/admin/posts/edit?pageId=${postId}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={() => {}} />
          <Button label="Thêm bài viết" onClick={handleAddPost} variant="primary" />
        </div>
        <Table 
          headers={headers} 
          data={postData} 
          dataFieldsName={dataFieldsName} 
          actions={(item) => (
            <Button label="Sửa" onClick={() => handleEdit(item._id)} variant="secondary" />
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
