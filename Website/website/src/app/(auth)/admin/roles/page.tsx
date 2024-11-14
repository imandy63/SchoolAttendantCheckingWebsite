"use client";

import React, { useState } from "react";

interface Role {
  name: string;
  permissions: { [key: string]: boolean };
}

const initialRoles: Role[] = [
  { name: "Admin", permissions: { create: true, read: true, update: true, delete: true } },
  { name: "Editor", permissions: { create: true, read: true, update: true, delete: false } },
  { name: "Viewer", permissions: { create: false, read: true, update: false, delete: false } },
];

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  const togglePermission = (roleIndex: number, permission: string) => {
    setRoles((prevRoles) =>
      prevRoles.map((role, index) =>
        index === roleIndex
          ? { ...role, permissions: { ...role.permissions, [permission]: !role.permissions[permission] } }
          : role
      )
    );
  };

  const handleSave = () => {
    // Implement logic to save roles to the backend
    console.log("Roles saved:", roles);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Phân quyền chức năng</h1>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b text-left">Vai trò</th>
            <th className="py-3 px-4 border-b text-center">Tạo</th>
            <th className="py-3 px-4 border-b text-center">Xem</th>
            <th className="py-3 px-4 border-b text-center">Cập nhật</th>
            <th className="py-3 px-4 border-b text-center">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, roleIndex) => (
            <tr key={role.name} className="border-t">
              <td className="py-3 px-4 border-b text-gray-800 font-medium">{role.name}</td>
              {Object.keys(role.permissions).map((permission) => (
                <td key={permission} className="py-3 px-4 border-b text-center">
                  <input
                    type="checkbox"
                    checked={role.permissions[permission]}
                    onChange={() => togglePermission(roleIndex, permission)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default RolesPage;
