import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
  key?: string;
};

type FormMultiSelectProps = {
  control: Control<any>;
  name: string;
  options: Option[];
  label: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: (string | number)[];
  add_value?: boolean; // New prop to allow adding custom values
};

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  control,
  name,
  options: initialOptions,
  label,
  disabled = false,
  required = false,
  defaultValue = [],
  add_value = false,
}) => {
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    setOptions(initialOptions);
  }, []);

  const handleAddValue = () => {
    if (
      newValue.trim() !== "" &&
      !options.find((opt) => opt.value === newValue)
    ) {
      const newOption = { label: newValue, value: newValue };
      setOptions((prev) => [...prev, newOption]);
      setNewValue("");
    }
  };

  return (
    <FormControl fullWidth sx={{ my: 1 }}>
      <InputLabel id={`input-label-${name}`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
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
                console.log(selected);
                const displayedValues = selectedArray.slice(0, 2);
                const overflowCount =
                  selectedArray.length - displayedValues.length;

                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {displayedValues.map((val) => (
                      <Chip
                        key={val}
                        label={
                          add_value
                            ? options.find((opt) => opt.value === val)?.label
                            : initialOptions.find((opt) => opt.value === val)
                                ?.label
                        }
                      />
                    ))}
                    {overflowCount > 0 && <Chip label={`+${overflowCount}`} />}
                  </Box>
                );
              }}
            >
              {add_value
                ? options.map((option) => {
                    return (
                      <MenuItem
                        value={option.value}
                        key={`menu-item-${name}-${option.key || option.value}`}
                      >
                        <Checkbox
                          checked={value && value.indexOf(option.value) > -1}
                        />
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    );
                  })
                : initialOptions.map((option) => {
                    return (
                      <MenuItem
                        value={option.value}
                        key={`menu-item-${name}-${option.key || option.value}`}
                      >
                        <Checkbox
                          checked={value && value.indexOf(option.value) > -1}
                        />
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    );
                  })}
            </Select>

            {add_value && (
              <Box mt={2} display="flex" gap={1}>
                <TextField
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  label="Thêm danh mục"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <button
                  type="button"
                  onClick={handleAddValue}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Thêm
                </button>
              </Box>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </>
        )}
      />
    </FormControl>
  );
};

export default FormMultiSelect;
