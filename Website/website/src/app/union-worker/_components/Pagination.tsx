import React from 'react';

const Pagination = ({ currentPage, onPageChange }: { currentPage: number; onPageChange: (page: number) => void }) => {
  const totalPages = 125;

  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          &lt;
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2 p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
