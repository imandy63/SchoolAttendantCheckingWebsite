import { Button } from "./Button";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreateActivityPayload } from "@/interfaces/activity.interface";

type AddActivityFormProps = {
  onSubmit: (activityData: any) => void;
};

const validationSchema = yup.object({
  activity_name: yup.string().required("Tên hoạt động là bắt buộc"),
  activity_start_date: yup.date().required("Ngày bắt đầu là bắt buộc"),
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

export const AddActivityForm = ({ onSubmit }: AddActivityFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log(file);
    }
  };

  const onSubmitForm = (data: any) => {
    console.log(data);
    onSubmit(data);
  };

  return (
    <form
      className="bg-white p-4 rounded-lg shadow w-full max-w-full space-y-2"
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <h2 className="text-lg font-semibold mb-3">Thêm Hoạt Động</h2>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-gray-700 text-sm">Tên hoạt động</label>
          <input
            type="text"
            {...register("activity_name")}
            className="border p-1 w-full rounded border-gray-300 text-sm"
          />
          {errors.activity_name && (
            <p className="text-red-500 text-xs">
              {errors.activity_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm">Ngày bắt đầu</label>
          <input
            type="date"
            {...register("activity_start_date")}
            className="border p-1 w-full rounded border-gray-300 text-sm"
          />
          {errors.activity_start_date && (
            <p className="text-red-500 text-xs">
              {errors.activity_start_date.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-gray-700 text-sm">Số lượng tối đa</label>
          <input
            type="number"
            {...register("activity_max_participants")}
            className="border p-1 w-full rounded border-gray-300 text-sm"
          />
          {errors.activity_max_participants && (
            <p className="text-red-500 text-xs">
              {errors.activity_max_participants.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm">Điểm</label>
          <input
            type="number"
            {...register("activity_point")}
            className="border p-1 w-full rounded border-gray-300 text-sm"
          />
          {errors.activity_point && (
            <p className="text-red-500 text-xs">
              {errors.activity_point.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-gray-700 text-sm">Thời gian (giờ)</label>
          <input
            type="number"
            {...register("activity_duration")}
            className="border p-1 w-full rounded border-gray-300 text-sm"
          />
          {errors.activity_duration && (
            <p className="text-red-500 text-xs">
              {errors.activity_duration.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm">Danh mục</label>
          <select
            {...register("activity_categories")}
            className="border p-1 w-full rounded border-gray-300 text-sm"
          >
            <option value="Hội thảo">Hội thảo</option>
            <option value="Việc làm">Việc làm</option>
            <option value="Lễ hội">Lễ hội</option>
          </select>
          {errors.activity_categories && (
            <p className="text-red-500 text-xs">
              {errors.activity_categories.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-gray-700 text-sm">Người tổ chức</label>
          <input
            type="text"
            {...register("activity_host")}
            className="border p-1 w-full rounded border-gray-300 text-sm"
          />
          {errors.activity_host && (
            <p className="text-red-500 text-xs">
              {errors.activity_host.message}
            </p>
          )}
        </div>

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
        onClick={() => handleSubmit(onSubmit)}
        type="submit"
        label="Thêm hoạt động"
        variant="primary"
        className="w-full py-2 mt-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      />
    </form>
  );
};
