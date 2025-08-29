import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { grey } from '@mui/material/colors';
import dayjs from 'dayjs';

interface TimePickerTextFieldProps {
  labelName: string;
  required?: string;
  bgcolorTextField?: boolean;
  readonly?: boolean;
  value?: dayjs.Dayjs | null;
  handleChange?: (val: dayjs.Dayjs | null) => void;
  Validate?: boolean;
  validateTextLable?: string;
}

export default function TimePickerTextField({
  labelName,
  required,
  readonly,
  bgcolorTextField,
  value,
  Validate,
  validateTextLable,
  handleChange, // << ต้องใส่กลับเข้ามา
}: TimePickerTextFieldProps) {

  const handleChangeTime = (val: dayjs.Dayjs | null) => {
    if (handleChange) handleChange(val);
  };

  return (
    <div style={{ width: "100%" }}>
      <label className={`${required} fs-2 py-2 sarabun-regular`}>
        {labelName}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimeField
          size='small'
          sx={{
            width: "100%",
            bgcolor: bgcolorTextField ? grey[200] : null,
            "& .MuiOutlinedInput-root": {
              fontFamily: "Sarabun",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: Validate ? "#d50000" : "",
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "info.main",
                },
              },
            },
          }}
          value={value ?? null}
          onChange={(newValue) => handleChangeTime(newValue)}
          format="HH:mm"
        />
      </LocalizationProvider>
    </div>
  );
}
