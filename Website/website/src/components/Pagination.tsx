// src/admin/components/Pagination.tsx
import React, { useState } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const [inputPage, setInputPage] = useState<string>("");

  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage > totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const handleGoToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = Number(inputPage);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        setInputPage(""); // Clear input after navigating
      }
    }
  };

  const handleButtonClick = () => {
    const page = Number(inputPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setInputPage(""); // Clear input after navigating
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border rounded hover:bg-gray-200"
        >
          <span className="text-gray-600">←</span>
        </button>
        {getPages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`p-2 border rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border rounded hover:bg-gray-200"
        >
          <span className="text-gray-600">→</span>
        </button>
      </div>
      <div className="mt-2 flex items-center space-x-2">
        <span>Đi đến trang</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          className="border rounded p-1 w-16 text-center"
          onKeyDown={handleGoToPage}
        />
        <button
          className="text-blue-500 underline hover:text-blue-700"
          onClick={handleButtonClick}
        >
          Nhấn để di chuyển
        </button>
      </div>
    </div>
  );
};
