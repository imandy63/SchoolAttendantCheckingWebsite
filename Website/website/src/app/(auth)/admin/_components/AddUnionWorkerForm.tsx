import React from "react";
import FormInputText from "@/components/TextField";
import { useToast } from "@/context/ToastContext";
import { CreateUnionWorkerPayload } from "@/interfaces/unionWorker.interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "./Button";
import { useCreateUnionWorker } from "@/query/useUnionWorker";

export const AddUnionWorkerForm = ({
  closePopup,
}: {
  closePopup: () => void;
}) => {
  const { showToast } = useToast();

  const validationSchema = yup.object({
    student_id: yup
      .string()
      .required("MSSV không được để trống")
      .matches(/^[0-9]+$/, "MSSV chỉ được chứa số"),
    password: yup
      .string()
      .required("Mật khẩu không được để trống")
      .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    student_name: yup.string().required("Họ tên không được để trống"),
  });

  const { mutate } = useCreateUnionWorker();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUnionWorkerPayload>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitForm = (data: CreateUnionWorkerPayload) => {
    mutate(data, {
      onSuccess: () => {
        showToast("Tạo công tác viên thành cong", "success");
        closePopup();
      },
      onError: () => {
        showToast("Tạo công tác viên thất bại", "error");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="p-4 bg-white rounded-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Thêm công tác viên
      </h2>

      <div className="space-y-4">
        {/* Student ID Field */}
        <div>
          <FormInputText
            name="student_id"
            control={control}
            label="Mã đăng nhập"
            required
          />
        </div>

        {/* Student Name Field */}
        <div>
          <FormInputText
            name="student_name"
            control={control}
            label="Họ tên"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <FormInputText
            name="password"
            control={control}
            label="Mật khẩu"
            password_field={true}
            required
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button
          type="submit"
          label="Thêm"
          variant="primary"
          className="w-full py-2 mt-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        />
      </div>
    </form>
  );
};
