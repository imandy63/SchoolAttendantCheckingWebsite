// src/admin/components/Table.tsx
type TableProps = {
  headers: string[];
  data: any[];
  actions?: (row: any) => JSX.Element;
};

export const Table = ({ headers, data, actions }: TableProps) => {
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
        {data.map((row, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            {Object.values(row).map((value, idx) => (
              <td key={idx} className="py-2 px-4 text-gray-800">
                {value}
              </td>
            ))}
            {actions && <td>{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
