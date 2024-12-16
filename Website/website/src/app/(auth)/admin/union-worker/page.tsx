"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table } from "../../../../components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import { Assignment, Popup } from "../_components/Popup";
import ActionButton from "../_components/ActionButton";
import { useGetUnionWorkers } from "@/query/useUnionWorker";
import { useToast } from "@/context/ToastContext";
import { useToStudent } from "@/query/useStudent";

const headers = ["MSSV", "Họ tên"];

const dataFields = ["student_id", "student_name"];

export default function UnionWorkerPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search") || "";
  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState(search);
  const router = useRouter();
  const { showToast } = useToast();

  const { data, isLoading, error } = useGetUnionWorkers(
    currentPage,
    searchQuery
  );

  const [assignment, setAssignment] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { mutate: toStudent } = useToStudent(currentPage, searchQuery);

  useEffect(() => {
    console.log(error);
  }, [error]);

  if (error) {
    showToast(error.message, "error");
  }

  const handleSearch = (searchQuery: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("search", searchQuery);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
    setSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const openAssignment = (id: string) => {
    setAssignment(true);
    setSelectedId(id);
  };

  const closeAssignment = () => {
    setAssignment(false);
    setSelectedId(null);
  };

  const totalPages = 1;

  return (
    <main className="flex-1 p-8">
      <div className="flex justify-between items-center mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <Table
        headers={headers}
        dataFieldsName={dataFields}
        data={data?.data || []}
        loading="skeleton"
        isLoading={isLoading}
        specialFields={[
          {
            name: "is_active",
            conditions: [
              {
                value: true,
                fontColor: "GREEN",
              },
              {
                value: false,
                fontColor: "RED",
              },
            ],
          },
        ]}
        actions={(worker) => (
          <ActionButton
            buttonLabel="Tác vụ"
            actions={[
              {
                label: "Bỏ quyền",
                onClick: () =>
                  toStudent(worker._id, {
                    onSuccess: () => {
                      showToast("Khóa thành công", "success");
                    },
                    onError: () => {
                      showToast("Lỗi khi cập nhật", "error");
                    },
                  }),
              },
              {
                label: "Phân công",
                onClick: () => {
                  openAssignment(worker._id);
                },
              },
            ]}
          />
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set("page", page.toString());
          router.push(`?${newParams.toString()}`);
        }}
      />

      {selectedId && assignment && (
        <Popup
          className={"w-4/5 h-4/5"}
          isOpen={assignment}
          title={`Phân công`}
          onClose={closeAssignment}
        >
          <Assignment id={selectedId as string} />
        </Popup>
      )}
    </main>
  );
}
