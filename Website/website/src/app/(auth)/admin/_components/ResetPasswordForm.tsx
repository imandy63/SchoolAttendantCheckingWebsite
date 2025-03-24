import React from "react";
import FormInputText from "@/components/TextField";
import { useToast } from "@/context/ToastContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "./Button";
import { useResetUnionWorkerPassword } from "@/query/useUnionWorker";

export const ResetUnionWorkerPasswordForm = ({
  id,
  closePopup,
}: {
  id: string;
  closePopup: () => void;
}) => {
  const { showToast } = useToast();

  const validationSchema = yup.object({
    password: yup
      .string()
      .required("Mật khẩu không được để trống")
      .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
  });

  const { mutate } = useResetUnionWorkerPassword();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitForm = ({ password }: { password: string }) => {
    mutate(
      { id, password },
      {
        onSuccess: () => {
          showToast("Reset mật khẩu thành công", "success");
          closePopup();
        },
        onError: () => {
          showToast("Reset mật khẩu thất bại", "error");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="p-4 bg-white rounded-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Reset mật khẩu
      </h2>

      <div className="space-y-4">
        <div>
          <FormInputText
            name="password"
            control={control}
            label="Mật khẩu mới"
            password_field={true}
            required
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button
          type="submit"
          label="Xác nhận"
          variant="primary"
          className="w-full py-2 mt-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        />
      </div>
    </form>
  );
};
