
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/en";
import LocalizedFormat from "dayjs/plugin/buddhistEra";
import OverwriteAdapterDayjs from "../dataAdapter";
import { grey } from "@mui/material/colors";

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
}: DesktopDatePickers) {
  const dateFormat = "DD/MM/YYYY";

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
                borderColor: Validate ? "#d50000" : "",
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: Validate ? "#d50000" : "info.main",
                },
              },
            },
          }}
          readOnly={readonly}
          format={dateFormat}
          value={value ? value : null}
          onChange={(newValue) => handleChangeDate(newValue)}
          slotProps={{ 
            textField: { 
              size: "small" ,
              error: Validate,
              
            } 
            }}
        />
      </LocalizationProvider>
      {validateTextLable && (
        <label className="fs-7 py-1 sarabun-regular-lable-validate" style={{ color: "red" }}>
          {validateTextLable}
        </label>
      )}
    </div>
  );
}
