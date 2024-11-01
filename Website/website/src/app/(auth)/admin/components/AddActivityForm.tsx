import React from "react";
import { Button } from "./Button";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreateActivityPayload } from "@/interfaces/activity.interface";
import FormInputText from "@/components/TextField";
import FormInputDate from "@/components/DateField";
import FormSelect from "@/components/SelectField";

type AddActivityFormProps = {
  onSubmit: (activityData: CreateActivityPayload) => void;
};

const validationSchema = yup.object({
  activity_name: yup.string().required("Tên hoạt động là bắt buộc"),
  activity_start_date: yup.date().required("Ngày bắt đầu là bắt buộc"),
  activity_start_time: yup.string().required("Giờ bắt đầu là bắt buộc"),
  activity_max_participants: yup
    .number()
    .required("Số lượng tối đa là bắt buộc")
    .positive("Số lượng tối đa phải là số dương")
    .integer("Số lượng tối đa phải là số nguyên"),
  activity_point: yup
    .number()
    .required("Điểm là bắt buộc")
    .min(0, "Điểm phải từ 0 trở lên"),
  activity_duration: yup
    .number()
    .required("Thời gian hoạt động là bắt buộc")
    .positive("Thời gian hoạt động phải là số dương"),
  activity_host: yup.string().required("Người tổ chức là bắt buộc"),
  activity_categories: yup.string().required("Danh mục là bắt buộc"),
});

export const AddActivityForm: React.FC<AddActivityFormProps> = ({
  onSubmit,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateActivityPayload & { activity_start_time: string }>({
    resolver: yupResolver(validationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log(file);
    }
  };

  const onSubmitForm: SubmitHandler<CreateActivityPayload> = (data) => {
    const date = new Date(data.activity_start_date).toISOString().split("T")[0];

    const startDateTime = `${date}T${data.activity_start_time}:00`;

    const formData = {
      ...data,
      activity_start_date: startDateTime,
    };

    console.log(formData);

    onSubmit(formData);
  };

  return (
    <form
      className="bg-white p-4 rounded-lg shadow w-full max-w-full space-y-2"
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <h2 className="text-lg font-semibold mb-3">Thêm Hoạt Động</h2>

      <div className="grid grid-cols-2 gap-2">
        <FormInputText
          name="activity_name"
          control={control}
          label="Tên hoạt động"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInputDate
          name="activity_start_date"
          control={control}
          label="Ngày bắt đầu"
          required
        />
        <FormInputText
          name="activity_start_time"
          control={control}
          label="Giờ bắt đầu"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInputText
          name="activity_max_participants"
          control={control}
          label="Số lượng tối đa"
          type="number"
          required
        />

        <FormInputText
          name="activity_point"
          control={control}
          label="Điểm"
          type="number"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInputText
          name="activity_duration"
          control={control}
          label="Thời gian (phút)"
          type="number"
          required
        />

        <FormSelect
          name="activity_categories"
          control={control}
          label="Danh mục"
          required
          options={[
            { value: "Hội thảo", label: "Hội thảo" },
            { value: "Việc làm", label: "Việc làm" },
            { value: "Lễ hội", label: "Lễ hội" },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInputText
          name="activity_host"
          control={control}
          label="Người tổ chức"
          required
        />

        <div>
          <label className="block text-gray-700 text-sm">
            Tải lên hình ảnh
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-1 w-full rounded border-gray-300 text-sm"
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit(onSubmitForm)}
        type="submit"
        label="Thêm hoạt động"
        variant="primary"
        className="w-full py-2 mt-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      />
    </form>
  );
};
