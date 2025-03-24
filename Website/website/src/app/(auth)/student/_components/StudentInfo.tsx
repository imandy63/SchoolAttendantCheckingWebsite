"use client";
import { useStudentInfoContext } from "@/context/StudentAuthContext";
import Image from "next/image";
import React from "react";
import ChangeSubscribedCategoriesForm from "./ChangeSubscribedCategoriesForsm";
import { useChangeSubscribedCategories } from "@/query/useStudent";
import { useToast } from "@/context/ToastContext";

const StudentInfo: React.FC = () => {
  const { data, isLoading } = useStudentInfoContext();

  const { mutate } = useChangeSubscribedCategories();
  const { showToast } = useToast();

  if (isLoading)
    return (
      <div className="flex items-start ml-10 p-6 bg-gray-100 rounded-lg shadow-lg animate-pulse">
        <div className="flex-shrink-0 mr-10">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        </div>

        <div className="flex-grow ml-10">
          <div className="w-40 h-6 bg-gray-300 rounded mb-4"></div>

          <div className="w-full h-1 bg-gray-200 rounded mb-4"></div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            <div className="w-48 h-4 bg-gray-300 rounded"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full">
      <div className="w-full flex items-start p-6 bg-white rounded-lg shadow-lg">
        <div className="flex-shrink-0 mr-10">
          <Image
            alt="student image"
            width={96}
            height={96}
            src={
              data.student_avatar_url
                ? data.student_avatar_url
                : "/default-avatar.jpg"
            }
            className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center"
          />
        </div>
        <div className="flex-grow ml-10">
          <h2 className="text-xl font-bold mb-4">Thông tin học vấn</h2>
          <hr className="border-t border-gray-300 mb-4" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <p>
              <strong>MSSV:</strong> {data.student_id}
            </p>
            <p>
              <strong>Lớp học:</strong> {data.student_class.class_name}
            </p>
            <p>
              <strong>Họ tên:</strong> {data.student_name}
            </p>
            <p>
              <strong>Khoa:</strong> {data.student_class.faculty}
            </p>
            <p>
              <strong>Điem rèn luyện:</strong> {data.student_activity_point}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {data.student_address}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full p-6 mt-6 bg-white rounded-lg shadow-lg">
        <ChangeSubscribedCategoriesForm
          initialCategories={data.subscribed_categories}
          onSubmit={(categories) => {
            mutate(categories, {
              onSuccess: () => {
                showToast(
                  "Đăng ký danh mục nhận thông báo thành công",
                  "success"
                );
              },
              onError: () => {
                showToast("Đăng ký danh mục nhận thông báo thất bại", "error");
              },
            });
          }}
        />
      </div>
    </div>
  );
};

export default StudentInfo;
