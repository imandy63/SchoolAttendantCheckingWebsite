"use client";
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "../../_components/InputField";
import { Button } from "../../_components/Button";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import { updatePostAPI, getPostDetailsAPI } from "@/api/api.post";
import { PostCreate } from "@/interfaces/post.interface";
import { useToast } from "@/context/ToastContext";
import { Popup } from "../../_components/Popup";
import { formatDate } from "@/utils/formatDate";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const schema = yup.object().shape({
  post_title: yup.string().required("Tiêu đề bài viết là bắt buộc"),
  post_author: yup.string().required("Tác giả là bắt buộc"),
  post_contents: yup.string().required("Nội dung bài viết là bắt buộc"),
});

const UpdatePostPage = () => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      post_title: "",
      post_author: "",
      post_contents: "",
    },
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>({});
  const [date, setDate] = useState(new Date());
  const { id: postId } = useParams();
  const router = useRouter();

  const { showToast } = useToast();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await getPostDetailsAPI(postId as string);
        setDate(postData.post_date);
        methods.reset({
          post_title: postData?.post_title || "",
          post_author: postData?.post_author || "",
          post_contents: postData?.post_contents || "",
        });
      } catch (err) {
        console.log(err);
        showToast("Failed to load post data", "error");
      }
    };

    fetchPostData();
  }, [postId]);

  const onSubmit = async (data: PostCreate) => {
    try {
      await updatePostAPI({ post_id: postId as string, ...data });
      showToast("Post updated successfully!", "success");
      router.push("/admin/posts");
    } catch (err) {
      console.log(err);
      showToast("Failed to update post", "error");
    }
  };

  const handlePreview = () => {
    const data = methods.getValues();
    setPreviewData(data);
    setShowPreview(true);
  };

  const closeModal = () => setShowPreview(false);

  return (
    <FormProvider {...methods}>
      <div className="flex w-full bg-gray-100 p-8">
        <div className="w-3/4 p-6 bg-white rounded shadow-md mr-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
            >
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
            />
            <div>
              <label
                htmlFor="post_contents"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nội dung bài viết
              </label>
              <div className="border border-gray-300 h-[500px] pb-11 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={methods.watch("post_contents")}
                  onChange={(content) => {
                    methods.setValue("post_contents", content);
                  }}
                  className="w-full border-none h-full"
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

        {/* Right side of the form */}
        <div className="w-1/4 bg-blue-100 p-6 rounded shadow-md">
          <InputField
            name="post_author"
            label="Tác Giả"
            placeholder="Nhập tên tác giả"
          />
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={handlePreview}
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg"
              label="Xem trước bài viết"
              disabled={
                !methods.formState.isValid || methods.formState.isSubmitting
              }
            />
            <Button
              label="Cập nhật bài viết"
              type="submit"
              disabled={
                !methods.formState.isValid || methods.formState.isSubmitting
              }
              onClick={methods.handleSubmit(onSubmit)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            />
          </div>
        </div>
      </div>

      <Popup
        isOpen={showPreview}
        className="w-4/5 h-4/5"
        title="Xem trước bài viết"
        onClose={closeModal}
      >
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {previewData.post_title}
          </h2>
          <div className="text-sm text-gray-500 mb-6">
            <p>
              <span className="font-medium text-gray-600">Tác giả:</span>{" "}
              {previewData.post_author}
            </p>
            <p>
              <span className="font-medium text-gray-600">Ngày:</span>{" "}
              {formatDate(date)}
            </p>
          </div>
          <div className="prose max-w-none prose-blue">
            <strong className="block text-gray-700 mb-2">Nội dung:</strong>
            <div
              dangerouslySetInnerHTML={{ __html: previewData.post_contents }}
            />
          </div>
        </div>
      </Popup>
    </FormProvider>
  );
};

export default UpdatePostPage;
