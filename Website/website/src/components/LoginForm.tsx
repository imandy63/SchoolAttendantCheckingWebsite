"use client";

import { isAdmin, loginUser } from "@/api/api.auth";
import React from "react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();

  const [studentId, setStudentId] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await loginUser({
        studentId: studentId,
        password: password,
      });

      if (res) {
        const admin = (await isAdmin()).status;
        if (admin) {
          router.push("/admin/students");
        } else {
          router.push("/student/main");
        }
      }
    } catch (error: any) {
      console.log(error);
      setError("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."); // More detailed error message
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg w-80">
      <h2 className="text-lg font-semibold text-blue-800 mb-4 text-center">
        CỔNG THÔNG TIN SINH VIÊN
      </h2>
      <h3 className="text-md font-semibold text-blue-800 mb-6 text-center">
        ĐĂNG NHẬP HỆ THỐNG
      </h3>
      <form>
        <div className="mb-4">
          <input
            type="text"
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập mã sinh viên"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          ĐĂNG NHẬP
        </button>
        {error && ( // Conditionally render error message
          <div className="mt-4 text-red-500 text-center">{error}</div>
        )}
      </form>
    </div>
  );
};
