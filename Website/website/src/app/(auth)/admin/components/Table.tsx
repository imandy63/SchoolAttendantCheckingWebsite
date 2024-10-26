type TableProps = {
  headers: string[];
  data: any[];
  dataFieldsName?: string[];
  actions?: (item: any) => JSX.Element;
};

export const Table = ({ headers, data, dataFieldsName, actions }: TableProps) => {
  const rowsToRender = [...data];
  while (rowsToRender.length < 10) {
    rowsToRender.push(null); // Thêm các dòng trống nếu ít hơn 10 dòng
  }

  return (
    <table className="w-full border-collapse bg-white text-black">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="border-b p-2 text-left bg-gray-200">
              {header}
            </th>
          ))}
          {actions && <th className="border-b p-2 bg-gray-200">Tác vụ</th>}
        </tr>
      </thead>
      <tbody>
        {rowsToRender.map((row, index) => (
          <tr
            key={index}
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            {row ? (
              <>
                {dataFieldsName?.map((field, idx) => (
                  <td key={idx} className="p-2 border-b">
                    {Array.isArray(row[field]) ? row[field].join(", ") : row[field]}
                  </td>
                ))}
                {actions && (
                  <td className="p-2 border-b">
                    {actions(row)}
                  </td>
                )}
              </>
            ) : (
              <td colSpan={headers.length + (actions ? 1 : 0)} className="p-2 border-b">
                {/* Dòng trống */}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
