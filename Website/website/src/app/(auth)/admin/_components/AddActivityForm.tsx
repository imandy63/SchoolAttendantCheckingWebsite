import React, { useState } from "react";
import { Button } from "./Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CreateAndEditActivityPagePayload,
  CreateAndEditActivitySchema,
} from "@/interfaces/activity.interface";
import FormInputText from "@/components/TextField";
import FormInputDate from "@/components/DateField";
import FormMultiSelect from "@/components/MultiSelectField";
import dayjs from "dayjs";
import { useToast } from "@/context/ToastContext";
import ImageInput from "./ImageField";
import { useGetActivityCategories } from "@/query/useActivity";

type AddActivityFormProps = {
  onSubmit: (activityData: CreateAndEditActivityPagePayload) => void;
};

const validationSchema = yup.object({
  activity_name: yup.string().required("Tên hoạt động là bắt buộc"),
  activity_start_date: yup.string().required("Ngày bắt đầu là bắt buộc"),
  activity_start_time: yup.string().required("Giờ bắt đầu là bắt buộc"),
  activity_max_participants: yup
    .number()
    .required("Số lượng tối đa là bắt buộc")
    .positive("Số lượng tối đa phải là số dương")
    .integer("Số lượng tối đa phải là số nguyên"),
  activity_file: yup.string(),
  activity_point: yup
    .number()
    .required("Điểm là bắt buộc")
    .min(0, "Điểm phải từ 0 trở lên"),
  activity_location: yup.string().required("Địa điểm tổ chức là bắt buộc"),
  activity_duration: yup
    .number()
    .required("Thời gian hoạt động là bắt buộc")
    .positive("Thời gian hoạt động phải là số dương"),
  activity_host: yup.string().required("Người tổ chức là bắt buộc"),
  activity_categories: yup.array().required("Danh mục là bắt buộc"),
});

export const AddActivityForm: React.FC<AddActivityFormProps> = ({
  onSubmit,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateAndEditActivitySchema>({
    resolver: yupResolver(validationSchema),
  });

  const { showToast } = useToast();

  const { data: categories, isLoading } = useGetActivityCategories();

  const handleImageSelect = async (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const onSubmitForm: SubmitHandler<CreateAndEditActivitySchema> = (
    data: CreateAndEditActivitySchema
  ) => {
    const parsedDate = dayjs(data.activity_start_date, "DD/MM/YYYY");

    if (!parsedDate.isValid()) {
      showToast("Invalid date format", "error");
      return;
    }

    const startDateTime = `${parsedDate.format("YYYY-MM-DD")}T${
      data.activity_start_time
    }:00`;

    const formData: CreateAndEditActivityPagePayload = {
      activity_location: data.activity_location,
      activity_duration: data.activity_duration,
      activity_host: data.activity_host,
      activity_max_participants: data.activity_max_participants,
      activity_name: data.activity_name,
      activity_point: data.activity_point,
      activity_start_datetime: startDateTime,
      activity_categories: data.activity_categories || [],
      activity_file: file,
    };

    onSubmit(formData);
  };

  return (
    <form
      className="bg-white p-4 rounded-lg shadow w-full max-w-full space-y-2"
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <h2 className="text-lg font-semibold mb-3">Thêm Hoạt Động</h2>

      <div className="gap-2">
        <ImageInput onImageSelect={handleImageSelect} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInputText
          name="activity_name"
          control={control}
          label="Tên hoạt động"
          required
        />
        {errors.activity_name && (
          <p className="text-red-500 text-sm">{errors.activity_name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInputDate
          name="activity_start_date"
          control={control}
          label="Ngày bắt đầu"
          required
        />
        {errors.activity_start_date && (
          <p className="text-red-500 text-sm">
            {errors.activity_start_date.message}
          </p>
        )}
        <FormInputText
          name="activity_start_time"
          control={control}
          label="Giờ bắt đầu"
          required
        />
        {errors.activity_start_time && (
          <p className="text-red-500 text-sm">
            {errors.activity_start_time.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInputText
          name="activity_max_participants"
          control={control}
          label="Số lượng tối đa"
          type="number"
          required
        />
        {errors.activity_max_participants && (
          <p className="text-red-500 text-sm">
            {errors.activity_max_participants.message}
          </p>
        )}
        <FormInputText
          name="activity_point"
          control={control}
          label="Điểm"
          type="number"
          required
        />
        {errors.activity_point && (
          <p className="text-red-500 text-sm">
            {errors.activity_point.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInputText
          name="activity_duration"
          control={control}
          label="Thời gian (phút)"
          type="number"
          required
        />
        {errors.activity_duration && (
          <p className="text-red-500 text-sm">
            {errors.activity_duration.message}
          </p>
        )}
        <FormMultiSelect
          name="activity_categories"
          control={control}
          label="Danh mục"
          add_value={true}
          required
          options={
            isLoading
              ? []
              : categories.map((category: string) => {
                  console.log(category);
                  return {
                    value: category,
                    label: category,
                  };
                })
          }
        />
        {errors.activity_categories && (
          <p className="text-red-500 text-sm">
            {errors.activity_categories.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInputText
          name="activity_host"
          control={control}
          label="Người tổ chức"
          required
        />
        {errors.activity_host && (
          <p className="text-red-500 text-sm">{errors.activity_host.message}</p>
        )}
        <FormInputText
          name="activity_location"
          control={control}
          label="Địa điểm tổ chức"
          required
        />
        {errors.activity_location && (
          <p className="text-red-500 text-sm">
            {errors.activity_location.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        label="Thêm hoạt động"
        variant="primary"
        className="w-full py-2 mt-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      />
    </form>
  );
};
