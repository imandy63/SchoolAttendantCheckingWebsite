// src/app/admin/components/InputField.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

type InputFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
};

export const InputField: React.FC<InputFieldProps> = ({ name, label, placeholder, type = "text" }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
        {label}
      </label>
      <input
        id={name}
        {...register(name)}
        placeholder={placeholder}
        type={type}
        className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{(errors[name]?.message as string) || "Invalid value"}</p>
      )}
    </div>
  );
};
