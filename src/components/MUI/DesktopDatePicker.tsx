
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/en";
import LocalizedFormat from "dayjs/plugin/buddhistEra";
import OverwriteAdapterDayjs from "../dataAdapter";
import { grey } from "@mui/material/colors";
import React from "react";

dayjs.locale("en");
dayjs.extend(LocalizedFormat);

interface DesktopDatePickers {
  labelName: string;
  required?: string;
  bgcolorTextField?: boolean;
  readonly?: boolean;
  value?: dayjs.Dayjs | undefined | null
  handleChange?: (val: dayjs.Dayjs | undefined | null) => void;
  Validate?: boolean
  validateTextLable?: string
  shouldFocusError?: boolean;
  submitCount?: number;
}

export default function DesktopDatePickers({
  labelName,
  required,
  readonly,
  bgcolorTextField,
  value,
  Validate,
  validateTextLable,
  handleChange,
  shouldFocusError,
  submitCount,
}: DesktopDatePickers) {
  const dateFormat = "DD/MM/YYYY";
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (shouldFocusError && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocusError, submitCount]);

  const handleChangeDate = (val: any) => {
    handleChange && handleChange(val);
  };

  return (
    <div style={{ width: "100%" }}>
      <label htmlFor="" className={`${required} fs-5 py-2 sarabun-regular`}>
        {labelName} {required && <span style={{ color: 'red' }}> *</span>}
      </label>
      <LocalizationProvider
        dateAdapter={OverwriteAdapterDayjs}
      //adapterLocale="en"
      //dateFormats={{ monthAndYear: "MMMM BBBB" }}
      >
        <DesktopDatePicker
          sx={{
            width: "100%", size: "small", bgcolor: readonly ? grey[200] : grey[50],
            "& .MuiOutlinedInput-root": {
              fontFamily: "Sarabun",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: Validate || errorMessage ? "#d50000" : "",
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: Validate || errorMessage ? "#d50000" : "info.main",
                },
              },
            },
          }}
          readOnly={readonly}
          format={dateFormat}
          value={value ? value : null}
          onChange={(newValue) => handleChangeDate(newValue)}
          onError={(newError) => {
            if (newError) {
              setErrorMessage("กรุณากรอกวันที่ให้ถูกต้อง");
            } else {
              setErrorMessage(null);
            }
          }}
          slotProps={{
            textField: {
              size: "small",
              error: Validate || !!errorMessage,
              // helperText: errorMessage,
              inputRef: inputRef,
              // inputProps: { readOnly: true },
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                 // Allow navigation keys, backspace, delete, tab
                 if (
                  [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                    "Home",
                    "End",
                  ].includes(e.key)
                ) {
                  return;
                }

                // Allow numbers and slash
                if (/^[0-9/]$/.test(e.key)) {
                  return;
                }

                // Block everything else
                e.preventDefault();
              },
            },
          }}
        />
      </LocalizationProvider>
      {(errorMessage || validateTextLable) && (
        <label className="fs-7 py-1 sarabun-regular-lable-validate" style={{ color: "red" }}>
          {errorMessage || validateTextLable}
        </label>
      )}
      
    </div>
  );
}
