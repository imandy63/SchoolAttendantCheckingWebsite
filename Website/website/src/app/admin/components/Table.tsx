// src/admin/components/Table.tsx
type TableProps = {
  headers: string[];
  data: any[];
  actions?: (row: any) => JSX.Element;
};

export const Table = ({ headers, data, actions }: TableProps) => {
  const totalRows = 10; // Số hàng mặc định hiển thị trên mỗi trang

  // Tạo dữ liệu cho các hàng trống
  const emptyRows = totalRows - data.length > 0 ? totalRows - data.length : 0;
  const paddedData = [...data, ...Array(emptyRows).fill(null)]; // Sử dụng null cho hàng trống

  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="py-2 px-4 border-b bg-gray-200 text-left text-sm font-semibold text-gray-700"
            >
              {header}
            </th>
          ))}
          {actions && <th className="py-2 px-4 border-b bg-gray-200 text-gray-700">Tác vụ</th>}
        </tr>
      </thead>
      <tbody>
        {paddedData.map((row, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            {headers.map((header, idx) => {
              const key = header.toLowerCase().replace(/\s/g, "_"); // Định dạng để khớp tên khóa
              return (
                <td key={idx} className="py-2 px-4 text-gray-800">
                  {row ? row[key] || <span className="text-gray-400">--</span> : <span className="text-gray-400">--</span>}
                </td>
              );
            })}
            {actions && (
              <td>
                {row ? actions(row) : null}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
