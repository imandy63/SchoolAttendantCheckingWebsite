import React, { useEffect, useState } from "react";

type CheckboxRule = {
  column: string;
  data: (string | number | boolean)[];
};

type TableProps = {
  headers: string[];
  data: any[];
  dataFieldsName?: string[];
  dateFields?: string[];
  actions?: (item: any) => JSX.Element;
  loading?: "default" | "skeleton";
  isLoading?: boolean;
  specialFields?: {
    name: string;
    conditions: {
      value: string | number | boolean;
      fontColor: "RED" | "GREEN" | "NONE";
    }[];
  }[];
  showCheckbox?: boolean;
  onCheckboxChange?: (
    isChecked: boolean,
    rowData: any,
    rowIndex: number
  ) => void;
  checkboxRules?: CheckboxRule[];
};

enum FontColorEnum {
  RED = "text-red-500",
  GREEN = "text-green-500",
  NONE = "",
}

const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const SkeletonRow = ({ colSpan }: { colSpan: number }) => (
  <tr className="animate-pulse">
    <td colSpan={colSpan} className="p-4 border-b text-center">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
    </td>
  </tr>
);

export const Table = ({
  headers,
  data,
  dataFieldsName,
  dateFields,
  actions,
  loading = "skeleton",
  isLoading,
  specialFields,
  showCheckbox = false,
  onCheckboxChange,
  checkboxRules = [],
}: TableProps) => {
  const [checkedRows, setCheckedRows] = useState<Record<number, boolean>>({});

  console.log(data);

  useEffect(() => {
    console.log("?", checkboxRules);
    const initialCheckedRows: Record<number, boolean> = {};
    data.forEach((row, index) => {
      checkboxRules.forEach(({ column, data: ruleData }) => {
        const value = getNestedValue(row, column);
        if (ruleData.includes(value)) {
          initialCheckedRows[index] = true;
        }
      });
    });
    setCheckedRows(initialCheckedRows);
  }, [data, checkboxRules.length]);

  const handleCheckboxChange = (
    isChecked: boolean,
    rowData: any,
    rowIndex: number
  ) => {
    setCheckedRows((prevState) => ({
      ...prevState,
      [rowIndex]: isChecked,
    }));
    if (onCheckboxChange) {
      onCheckboxChange(isChecked, rowData, rowIndex);
    }
  };

  const rowsToRender = [...data];

  while (rowsToRender.length < 10) {
    rowsToRender.push(null);
  }

  return (
    <table className="w-full border-collapse bg-white text-black">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="border-b p-4 text-center bg-gray-200">
              {header}
            </th>
          ))}
          {actions && (
            <th className="border-b p-4 bg-gray-200 text-center">Tác vụ</th>
          )}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          loading === "skeleton" ? (
            Array.from({ length: 10 }).map((_, idx) => (
              <SkeletonRow
                key={idx}
                colSpan={
                  headers.length + (actions ? 1 : 0) + (showCheckbox ? 1 : 0)
                }
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  headers.length + (actions ? 1 : 0) + (showCheckbox ? 1 : 0)
                }
                className="p-4 text-center"
              >
                Loading...
              </td>
            </tr>
          )
        ) : (
          rowsToRender.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 transition-colors duration-200"
            >
              {row ? (
                <>
                  {dataFieldsName?.map((field, idx) => {
                    const specialField = specialFields?.find(
                      (sf) => sf.name === field
                    );
                    const value = getNestedValue(row, field);

                    let className = "";
                    if (specialField) {
                      specialField.conditions.forEach((condition) => {
                        if (value === condition.value) {
                          className = FontColorEnum[condition.fontColor];
                        }
                      });
                    }

                    return (
                      <td
                        key={idx}
                        className={`p-4 border-b text-left ${className}`}
                      >
                        {dateFields?.includes(field) && value
                          ? formatDate(value)
                          : Array.isArray(value)
                          ? value.join(", ")
                          : value.toString()}
                      </td>
                    );
                  })}
                  {actions && (
                    <td className="p-4 border-b text-center">{actions(row)}</td>
                  )}
                  {showCheckbox && (
                    <td className="p-4 border-b text-center">
                      <input
                        type="checkbox"
                        checked={!!checkedRows[index]}
                        onChange={(e) =>
                          handleCheckboxChange(e.target.checked, row, index)
                        }
                      />
                    </td>
                  )}
                </>
              ) : (
                <td
                  colSpan={
                    headers.length + (actions ? 1 : 0) + (showCheckbox ? 1 : 0)
                  }
                  className="p-4 border-b text-center py-5"
                ></td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
