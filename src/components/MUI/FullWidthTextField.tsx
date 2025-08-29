import { Box, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { grey } from '@mui/material/colors';

interface FullWidthTextField {
  value?: any;
  labelName: string;
  required?: string;
  disabled?: boolean;
  onchange?: (value: any) => void;
  onblur?: (value: any) => void;
  bgcolorTextField?: boolean;
  readonly?: boolean;
  textAlignTextField?: 'left' | 'right' | 'center';
  endAdornment?: boolean;
  Validate?: boolean;
  validateTextLable?: string
}

export default function FullWidthTextField(props: FullWidthTextField) {
  const hedelonChange = (e: React.ChangeEvent<HTMLInputElement>) => { props.onchange && props.onchange(e.target.value) }
  const hedelonBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    props.onblur && props.onblur(e.target.value)
  }
  return (
    <>
      <Box>
        <label htmlFor="" className={` fs-5 py-2 sarabun-regular`}>
          {props.labelName} {props.required && <span style={{ color: 'red' }}> *</span>}
        </label>
        <TextField
          fullWidth
          multiline
          sx={{
            bgcolor: props.readonly ? grey[300] : props.bgcolorTextField ? grey[100] : "",
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
            endAdornment: props.endAdornment ? (
              <InputAdornment position="end">%</InputAdornment>
            ) : null,
            inputProps: {
              style: { textAlign: props.textAlignTextField },
            },
          }}
          autoComplete="off"
          id="fullWidth"
          size="small"
          disabled={props.disabled}
          onChange={hedelonChange}
          onBlur={hedelonBlur}
          value={props.value !== undefined && props.value !== null ? props.value : ""}
        />
        {props.validateTextLable ? (
          <label htmlFor="" className={`fs-7 py-1 sarabun-regular-lable-validate`}>
            {props.validateTextLable}
          </label>
        ) : null}
      </Box>
    </>
  );
}