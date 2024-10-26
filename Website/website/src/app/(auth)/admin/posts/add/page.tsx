'use client'
import React from 'react';
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const schema = yup.object().shape({
  post_title: yup.string().required("Tiêu đề bài viết là bắt buộc"),
  post_author: yup.string().required("Tác giả là bắt buộc"),
  post_contents: yup.string().required("Nội dung bài viết là bắt buộc"),
  post_date: yup.date().required("Ngày đăng là bắt buộc"),
});

const AddPostPage = () => {
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handlePreview = () => {
    console.log("Xem trước bài viết");
  };

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-screen bg-gray-100 p-8">
        {/* Form bên trái */}
        <div className="w-3/4 p-6 bg-white rounded shadow-md mr-6">
          <div className="flex items-center mb-4">
            <button onClick={() => router.back()} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 111.414 1.414L4.414 10l6.293 6.293A1 1 0 0110 18z"
                  clipRule="evenodd"
                />
              </svg>
              Bài viết
            </button>
          </div>

          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <InputField 
              name="post_title" 
              label="Tiêu đề" 
              placeholder="Nhập tiêu đề bài viết" 
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <div>
              <label htmlFor="post_contents" className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung bài viết
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={methods.watch("post_contents")}
                  onChange={(content) => methods.setValue("post_contents", content)}
                  className="w-full h-[500px] border-none" // Đặt chiều cao của khung Quill
                />
              </div>
              {methods.formState.errors.post_contents && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.post_contents.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Phần phải của form */}
        <div className="w-1/4 bg-blue-100 p-6 rounded shadow-md">
          <InputField 
            name="post_author" 
            label="Tác Giả" 
            placeholder="Nhập tên tác giả" 
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <InputField 
            name="post_date" 
            label="Ngày Đăng" 
            placeholder="Nhập ngày đăng" 
            type="date" 
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={handlePreview} 
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 106.32 3.907l4.387-.002-1.948 1.948a1 1 0 01-1.414 0l-3.727-3.727a1 1 0 010-1.414l1.949-1.949L14.53 4.68A8 8 0 0010 2z"/>
                <path fillRule="evenodd" d="M10 6a4 4 0 100 8 4 4 0 000-8zM6 10a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd"/>
              </svg>
              Xem trước
            </button>
            <Button 
              label="Thêm bài viết" 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default AddPostPage;
