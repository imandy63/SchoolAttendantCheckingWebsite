"use client";

import { loginUser } from "@/api/api.auth";
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
        router.push("/admin/students");
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
        <div className="mb-4 flex items-center">
          <input type="checkbox" id="graduate" className="mr-2" />
          <label htmlFor="graduate" className="text-sm">
            Đã tốt nghiệp
          </label>
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Nhập mã"
            className="flex-1 p-2 border rounded"
          />
          <button className="p-2 border rounded bg-gray-200">🔄</button>
          <img
            src="/path/to/captcha-image.png"
            alt="captcha"
            className="w-20 h-10"
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
        <div className="text-center mt-4">
          <a href="#" className="text-blue-500 underline hover:text-blue-700">
            Dành cho phụ huynh
          </a>
        </div>
      </form>
    </div>
  );
};
