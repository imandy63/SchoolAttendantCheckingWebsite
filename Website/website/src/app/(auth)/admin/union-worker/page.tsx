"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table } from "../../../../components/Table";
import { SearchBar } from "../_components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import { Button } from "../_components/Button";
import {
  Assignment,
  CreateUnionWorker,
  Popup,
  ResetUnionWorkerPassword,
} from "../_components/Popup";
import {
  useDisableUnionWorker,
  useEnableUnionWorker,
  useGetUnionWorkers,
} from "@/query/useUnionWorker";
import { useToast } from "@/context/ToastContext";
import ActionButton from "../_components/ActionButton";
import { set } from "date-fns";

const headers = ["MSSV", "Họ tên", "Đang kích hoạt"];

const dataFields = ["student_id", "student_name", "is_active"];

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
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState(false);

  const { mutate: enableWorker } = useEnableUnionWorker();
  const { mutate: disableWorker } = useDisableUnionWorker();

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

  const openPopup = (id: string) => {
    setSelectedId(id);
    setResetPassword(true);
  };

  const closePopup = () => {
    setResetPassword(false);
    setSelectedId(null);
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
        <Button
          label="Thêm công tác viên"
          variant="primary"
          onClick={() => setShowCreatePopup(true)}
        />
      </div>

      {/* Cập nhật bảng với căn giữa tiêu đề và canh trái dữ liệu */}
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
              worker.is_active
                ? {
                    label: "Khóa hoạt động",
                    onClick: () =>
                      disableWorker(worker._id, {
                        onSuccess: () => {
                          showToast("Khóa thành công", "success");
                        },
                        onError: () => {
                          showToast("Lỗi khi cập nhật", "error");
                        },
                      }),
                  }
                : {
                    label: "Mở hoạt động",
                    onClick: () =>
                      enableWorker(worker._id, {
                        onSuccess: () => {
                          showToast("Mở thành công", "success");
                        },
                        onError: () => {
                          showToast("Lỗi khi cập nhật", "error");
                        },
                      }),
                  },

              {
                label: "Reset mật khẩu",
                onClick: () => {
                  openPopup(worker._id);
                },
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

      {selectedId && resetPassword && (
        <Popup
          isOpen={resetPassword}
          title={`Reset mât khẩu`}
          onClose={closePopup}
        >
          <ResetUnionWorkerPassword
            id={selectedId as string}
            closePopup={closePopup}
          />
        </Popup>
      )}

      {showCreatePopup && (
        <Popup
          isOpen={showCreatePopup}
          title="Tạo công tác viên"
          onClose={() => setShowCreatePopup(false)}
        >
          <CreateUnionWorker closePopup={() => setShowCreatePopup(false)} />
        </Popup>
      )}

      {selectedId && assignment && (
        <Popup
          className={"w-4/5 h-4/5"}
          isOpen={assignment}
          title={`Phân công`}
          onClose={closePopup}
        >
          <Assignment id={selectedId as string} />
        </Popup>
      )}
    </main>
  );
}
