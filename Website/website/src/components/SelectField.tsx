import React from "react";
import { Control, Controller } from "react-hook-form";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type Option = {
  value: string | number;
  label: string;
  key?: string;
};

type FormSelectProps = {
  control: Control<any>;
  disabled?: boolean;
  required?: boolean;
  name: string;
  defaultValue?: string | number;
  options: Option[];
  label: string;
};

const FormSelect: React.FC<FormSelectProps> = ({
  control,
  disabled = false,
  required = false,
  name,
  defaultValue = "",
  options,
  label,
}) => {
  return (
    <FormControl fullWidth sx={{ my: 1 }}>
      <InputLabel id={`input-label-${name}`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            fullWidth
            onChange={onChange}
            value={value}
            label={label}
            disabled={disabled}
            error={!!error}
          >
            {options.map((option, index) => (
              <MenuItem
                value={option.value}
                key={`menu-item-${name}-${option.key || index}`}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default FormSelect;
