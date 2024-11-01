import React from "react";

type TableProps = {
  headers: string[];
  data: any[];
  dataFieldsName?: string[];
  dateFields?: string[];
  actions?: (item: any) => JSX.Element;
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export const Table = ({
  headers,
  data,
  dataFieldsName,
  dateFields,
  actions,
}: TableProps) => {
  const rowsToRender = [...data];
  while (rowsToRender.length < 10) {
    rowsToRender.push(null);
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
                    {dateFields?.includes(field) && getNestedValue(row, field)
                      ? new Date(
                          getNestedValue(row, field)
                        ).toLocaleDateString() +
                        " " +
                        new Date(getNestedValue(row, field)).toLocaleTimeString(
                          undefined,
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : Array.isArray(getNestedValue(row, field))
                      ? getNestedValue(row, field).join(", ")
                      : getNestedValue(row, field)}
                  </td>
                ))}
                {actions && <td className="p-2 border-b">{actions(row)}</td>}
              </>
            ) : (
              <td
                colSpan={headers.length + (actions ? 1 : 0)}
                className="p-2 border-b"
              ></td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
