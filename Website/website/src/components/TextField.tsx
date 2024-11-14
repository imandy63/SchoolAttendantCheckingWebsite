import React from "react";
import { Control, Controller } from "react-hook-form";
import { TextField } from "@mui/material";

type FormInputTextProps = {
  disabled?: boolean;
  name: string;
  variant?: "outlined" | "filled" | "standard";
  control: Control<any>;
  defaultValue?: string;
  label: string;
  type?: string;
  required?: boolean;
  rows?: number;
  multiline?: boolean;
  autofocus?: boolean;
  errorMessage?: string;
};

const FormInputText: React.FC<FormInputTextProps> = ({
  disabled = false,
  name,
  variant = "outlined",
  control,
  defaultValue = "",
  label,
  type = "text",
  required = false,
  rows = 1,
  multiline = false,
  autofocus = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: required,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          helperText={error ? error.message : null}
          sx={{ my: 1 }}
          margin="dense"
          error={!!error}
          fullWidth
          label={label}
          disabled={disabled}
          type={type}
          rows={rows}
          multiline={multiline}
          autoFocus={autofocus}
          onChange={onChange}
          value={value}
          variant={variant}
        />
      )}
    />
  );
};

export default FormInputText;
