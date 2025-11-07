import { Box, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { grey } from '@mui/material/colors';

interface FullWidthTextField {
  value?: any;
  labelName: string;
  placeholderlabel?: string;
  required?: string;
  disabled?: boolean;
  hidden?: boolean;
  onchange?: (value: any) => void;
  onblur?: (value: any) => void;
  bgcolorTextField?: boolean;
  readonly?: boolean;
  textAlignTextField?: 'left' | 'right' | 'center';
  endAdornment?: boolean;
  Validate?: boolean;
  validateTextLable?: string
  readOnly?: boolean;
}

export default function FullWidthTextField(props: FullWidthTextField) {
  const hedelonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onchange && props.onchange(e.target.value);
  };
  const hedelonBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    props.onblur && props.onblur(e.target.value);
  };

  ////////////////////////////
  // ถ้า hidden = true จะไม่ render ทั้ง Box และ TextField
  if (props.hidden) return null;

  return (
    <Box>
      <label className="fs-5 py-2 sarabun-regular">
        {props.labelName} {props.required && <span style={{ color: 'red' }}> *</span>}
      </label>
      <TextField
        fullWidth
        multiline    
        sx={{
          bgcolor: props.readonly ? grey[200] : grey[50],
          "& .MuiOutlinedInput-root": {
            fontFamily: "Sarabun",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: props.Validate ? "#d50000" : "",
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "info.main",
              },
            },
          },
        }}
        InputProps={{
          readOnly: props.readonly ?? false,
          endAdornment: props.endAdornment ? <InputAdornment position="end">%</InputAdornment> : null,
          inputProps: { style: { textAlign: props.textAlignTextField } },
        }}
        autoComplete="off"
        size="small"
        disabled={props.disabled}
        onChange={hedelonChange}
        onBlur={hedelonBlur}
        value={props.value ?? ""}
        placeholder={props.placeholderlabel}
      />
      {props.validateTextLable && (
        <label className="fs-7 py-1 sarabun-regular-lable-validate">
          {props.validateTextLable}
        </label>
      )}
    </Box>
  );
}
//  