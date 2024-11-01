import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreateActivityPayload } from "@/interfaces/activity.interface";
import FormInputText from "@/components/TextField";
import FormInputDate from "@/components/DateField";
import FormSelect from "@/components/SelectField";
import { useRouter, useParams } from "next/navigation";
import { getActivityAPI } from "@/api/api.activity";
import dayjs from "dayjs";
import { format } from "date-fns";

type EditActivityFormProps = {
  onSubmit: ({
    activity_id,
    ...activityData
  }: CreateActivityPayload & { activity_id: string }) => void;
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

export const EditActivityForm: React.FC<EditActivityFormProps> = ({
  onSubmit,
}) => {
  const { id: activityId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateActivityPayload & { activity_start_time: string }>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        const activity = await getActivityAPI(activityId as string);
        console.log(activity);
        const [date, time] = activity.activity_start_date.split("T");
        const parsedDate = dayjs(date);
        setValue("activity_start_date", parsedDate);
        setValue("activity_start_time", time.slice(0, 5));
        setValue("activity_name", activity.activity_name);
        setValue(
          "activity_max_participants",
          activity.activity_max_participants
        );
        setValue("activity_point", activity.activity_point);
        setValue("activity_duration", activity.activity_duration);
        setValue("activity_host", activity.activity_host);
        setValue("activity_categories", activity.activity_categories);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load activity details", error);
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [activityId, setValue]);

  const onSubmitForm: SubmitHandler<CreateActivityPayload> = async (data) => {
    const date = new Date(data.activity_start_date).toISOString().split("T")[0];

    const startDateTime = `${date}T${data.activity_start_time}:00`;
    const formData = {
      activity_id: activityId as string,
      ...data,
      activity_start_date: startDateTime,
    };

    try {
      onSubmit(formData);
    } catch (error) {
      console.error("Failed to update activity", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form
      className="bg-white p-4 rounded-lg shadow w-full max-w-full space-y-2"
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <h2 className="text-lg font-semibold mb-3">Chỉnh Sửa Hoạt Động</h2>

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
            onChange={(e) => console.log(e.target.files)}
            className="border p-1 w-full rounded border-gray-300 text-sm"
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit(onSubmitForm)}
        label="Cập nhật hoạt động"
        variant="primary"
        className="w-full py-2 mt-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      />
    </form>
  );
};
