import { Control, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";

type FormInputDateProps = {
  name: string;
  control: Control<any>;
  label: string;
  required?: boolean;
  defaultValue?: any;
};

const FormInputDate: React.FC<FormInputDateProps> = ({
  name,
  control,
  label,
  required = false,
  defaultValue,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field: { onChange, value } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            label={label}
            value={value || null}
            onChange={onChange}
            fullWidth
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default FormInputDate;
