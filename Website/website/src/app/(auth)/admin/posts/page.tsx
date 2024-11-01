"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { Post } from "@/interfaces/post.interface";
import { getAllPostsAPI } from "@/api/api.post";

export default function Posts() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search");
  const [currentPage, setCurrentPage] = useState(page ?? 1);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(search);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState<Post[]>([]);

  const headers = ["Tiêu đề", "Tác giả", "Ngày đăng", "Chỉnh sửa cuối"];

  const dataFieldsName = [
    "post_title",
    "post_author",
    "post_date",
    "updated_at",
  ];

  const handleAddPost = () => {
    router.push("/admin/posts/add");
  };

  const handleEdit = (postId: string) => {
    router.push(`/admin/posts/${postId}`);
  };

  const getAllActivities = async (page: number, search = "") => {
    const data = await getAllPostsAPI(page, search);
    console.log(data);
    setTotalPages(Math.ceil(data.total / 10));
    setData(data.data);
  };

  useEffect(() => {
    getAllActivities(currentPage, searchQuery || "");
  }, [currentPage, searchQuery]);

  const handleSearch = (searchQuery: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("search", searchQuery);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);

    setSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);

    setCurrentPage(newPage);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <SearchBar onSearch={handleSearch} />
          <Button
            label="Thêm bài viết"
            onClick={handleAddPost}
            variant="primary"
          />
        </div>
        <Table
          headers={headers}
          data={data}
          dataFieldsName={dataFieldsName}
          dateFields={["post_date"]}
          actions={(item) => (
            <>
              <Button
                label="Sửa"
                onClick={() => handleEdit(item._id)}
                variant="secondary"
              />
            </>
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}
