type TableProps = {
  headers: string[];
  data: any[];
  dataFieldsName: string[];
  dateFields?: string[];
  actions?: (row: any) => JSX.Element;
};

export const Table = ({
  headers,
  data,
  dataFieldsName,
  dateFields,
  actions,
}: TableProps) => {
  const totalRows = 10;

  const emptyRows = totalRows - data.length > 0 ? totalRows - data.length : 0;
  const paddedData = [...data, ...Array(emptyRows).fill(null)];

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
          {actions && (
            <th className="py-2 px-4 border-b bg-gray-200 text-gray-700">
              Tác vụ
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {paddedData.map((row, index) => (
          <tr
            key={row ? row._id : `empty-row-${index}`}
            className="border-b hover:bg-gray-50"
          >
            {dataFieldsName.map((field, idx) => {
              let value;
              if (row) {
                value = field
                  .split(".")
                  .reduce((o, i) => (o ? o[i] : undefined), row);

                if (
                  dateFields &&
                  dateFields.includes(field) &&
                  value instanceof Date
                ) {
                  value = value.toLocaleDateString("vi-VN");
                }
              }

              return (
                <td key={idx} className="py-2 px-4 text-gray-800">
                  {value !== null && value !== undefined ? (
                    value
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </td>
              );
            })}
            {actions && (
              <td className="py-2 px-4">
                {row ? (
                  <div className="flex space-x-2">{actions(row)}</div>
                ) : null}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
