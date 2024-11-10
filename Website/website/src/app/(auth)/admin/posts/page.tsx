"use client";

import { useState } from "react";
import { Sidebar } from "../_components/Sidebar";
import { Table } from "../../../../components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import { Button } from "../_components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeletePost, useGetAllPosts, useRestorePost } from "@/query/usePost";
import ActionButton from "../_components/ActionButton";
import { useToast } from "@/context/ToastContext";

export default function Posts() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState(search);

  const { data, isLoading } = useGetAllPosts(currentPage, searchQuery);
  const totalPages = data ? Math.ceil(data.total / 10) : 0;

  const deleteMutation = useDeletePost();
  const restoreMutation = useRestorePost();
  const { showToast } = useToast();

  const headers = [
    "Tiêu đề",
    "Tác giả",
    "Ngày đăng",
    "Chỉnh sửa cuối",
    "Đã xóa",
  ];
  const dataFieldsName = [
    "post_title",
    "post_author",
    "post_date",
    "modified_at",
    "post_deleted",
  ];

  const handleAddPost = () => {
    router.push("/admin/posts/add");
  };

  const handleEdit = (postId: string, isDeleted: boolean) => {
    if (isDeleted) {
      showToast(
        "Bài viết đã xóa. Vui lòng khôi phục trước khi sửa.",
        "warning"
      );
    } else {
      router.push(`/admin/posts/${postId}`);
    }
  };

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

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(postId, {
      onSuccess: () => {
        showToast("Bài viết đã được xóa thành công!", "success");
      },
      onError: () => {
        showToast("Lỗi khi xóa bài viết. Vui lòng thử lại.", "error");
      },
    });
  };

  const handleRestore = (postId: string) => {
    restoreMutation.mutate(postId, {
      onSuccess: () => {
        showToast("Bài viết đã được khôi phục thành công!", "success");
      },
      onError: () => {
        showToast("Lỗi khi khôi phục bài viết. Vui lòng thử lại.", "error");
      },
    });
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
          loading="skeleton"
          isLoading={isLoading}
          headers={headers}
          data={data?.data || []}
          dataFieldsName={dataFieldsName}
          dateFields={["post_date", "modified_at"]}
          specialFields={[
            {
              name: "post_deleted",
              conditions: [
                {
                  value: true,
                  fontColor: "RED",
                },
                {
                  value: false,
                  fontColor: "GREEN",
                },
              ],
            },
          ]}
          actions={(item) => {
            return (
              <ActionButton
                buttonLabel="Action"
                actions={[
                  {
                    label: "Sửa",
                    onClick: () => {
                      handleEdit(item._id, item.post_deleted);
                    },
                  },
                  item.post_deleted
                    ? {
                        label: "Khôi phục",
                        onClick: () => {
                          handleRestore(item._id);
                        },
                      }
                    : {
                        label: "Xóa",
                        onClick: () => {
                          handleDelete(item._id);
                        },
                      },
                ]}
              />
            );
          }}
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
