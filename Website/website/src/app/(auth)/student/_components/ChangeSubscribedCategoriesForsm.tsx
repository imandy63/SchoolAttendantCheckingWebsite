import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormMultiSelect from "@/components/MultiSelectField";
import { useGetActivityCategories } from "@/query/useActivity";
import { Button } from "@/components/Button";

type ChangeSubscribedCategoriesFormProps = {
  initialCategories: string[];
  onSubmit: (categories: string[]) => void;
};

type FormValues = {
  subscribed_categories: string[];
};

const validationSchema = yup.object({
  subscribed_categories: yup.array().of(yup.string()).default([]),
});

const ChangeSubscribedCategoriesForm: React.FC<
  ChangeSubscribedCategoriesFormProps
> = ({ initialCategories, onSubmit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: { subscribed_categories: initialCategories },
  });

  const { data: categories, isLoading } = useGetActivityCategories();

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data.subscribed_categories);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 bg-white"
    >
      <h2 className="text-lg font-semibold">
        Đăng ký danh mục để nhận thông báo
      </h2>

      <FormMultiSelect
        name="subscribed_categories"
        control={control}
        label="Danh mục"
        options={
          isLoading
            ? []
            : categories.map((category: string) => ({
                value: category,
                label: category,
              }))
        }
        required
      />
      {errors.subscribed_categories && (
        <p className="text-red-500 text-sm">
          {errors.subscribed_categories.message}
        </p>
      )}
      <div className="flex justify-end w-full">
        <Button
          type="submit"
          label="Cập nhật"
          variant="primary"
          className="bg-blue-400 hover:bg-blue-600 duration-300"
        />
      </div>
    </form>
  );
};

export default ChangeSubscribedCategoriesForm;
