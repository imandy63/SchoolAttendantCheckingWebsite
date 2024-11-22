import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
  password_field?: boolean;
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
  password_field = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
          type={password_field && !showPassword ? "password" : type}
          rows={rows}
          multiline={multiline}
          autoFocus={autofocus}
          onChange={onChange}
          value={value}
          variant={variant}
          InputProps={
            password_field
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
        />
      )}
    />
  );
};

export default FormInputText;
