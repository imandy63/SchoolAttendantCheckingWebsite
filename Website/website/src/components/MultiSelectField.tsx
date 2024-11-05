import React from "react";
import { Control, Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  Chip,
  Box,
} from "@mui/material";

type Option = {
  value: string | number;
  label: string;
  key?: string;
};

type FormMultiSelectProps = {
  control: Control<any>;
  disabled?: boolean;
  required?: boolean;
  name: string;
  defaultValue?: (string | number)[];
  options: Option[];
  label: string;
};

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  control,
  disabled = false,
  required = false,
  name,
  defaultValue = [],
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
            labelId={`input-label-${name}`}
            multiple
            value={value || []}
            onChange={(event) => {
              const {
                target: { value },
              } = event;
              onChange(value);
            }}
            label={label}
            disabled={disabled}
            error={!!error}
            renderValue={(selected) => {
              const selectedArray = selected as (string | number)[];
              const displayedValues = selectedArray.slice(0, 2); // Show up to two selected values
              const overflowCount =
                selectedArray.length - displayedValues.length;

              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {displayedValues.map((value) => (
                    <Chip
                      key={value}
                      label={
                        options.find((option) => option.value === value)?.label
                      }
                    />
                  ))}
                  {overflowCount > 0 && <Chip label={`+${overflowCount}`} />}
                </Box>
              );
            }}
          >
            {options.map((option) => (
              <MenuItem
                value={option.value}
                key={`menu-item-${name}-${option.key || option.value}`}
              >
                <Checkbox checked={value && value.indexOf(option.value) > -1} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default FormMultiSelect;
