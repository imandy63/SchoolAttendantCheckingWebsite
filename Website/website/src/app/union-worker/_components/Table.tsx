import React from 'react';

const Table = ({ currentPage }: { currentPage: number }) => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">STT</th>
          <th className="p-2 border">MSSV</th>
          <th className="p-2 border">Họ và tên</th>
          <th className="p-2 border">Điểm Danh</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }, (_, i) => (
          <tr key={i} className="text-center">
            <td className="p-2 border">{(currentPage - 1) * 10 + i + 1}</td>
            <td className="p-2 border">2001215836</td>
            <td className="p-2 border">Kong Hoa Hung</td>
            <td className="p-2 border">
              <input type="checkbox" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
