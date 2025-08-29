import { Box, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { grey } from '@mui/material/colors';

interface FullWidthTextArea {
  value?: any;
  labelName: string;
  required?: string;
  disabled?: boolean;
  onchange?: (value: any) => void;
  bgcolorTextField?: boolean;
  readonly?: boolean;
  textAlignTextField?: 'left' | 'right' | 'center';
  endAdornment?: boolean;
  Validate?: boolean;
  validateTextLable?: string
}

export default function FullWidthTextArea(props: FullWidthTextArea) {
  const hedelonChange = (e: React.ChangeEvent<HTMLInputElement>) => { props.onchange && props.onchange(e.target.value) }
  return (
    <>
      <Box>
        <label htmlFor="" className={`${props.required} fs-5 py-2 sarabun-regular`}>
          {props.labelName}
        </label>
        <TextField
          fullWidth
          multiline
          rows={4}
          sx={{
            bgcolor: props.bgcolorTextField ? grey[200] : null,
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
            readOnly: props.readonly,
            endAdornment: props.endAdornment ? <InputAdornment position="end">%</InputAdornment> : null,
            inputProps: {
              style: { textAlign: props.textAlignTextField },
            },
          }}
          autoComplete="off"
          // id="fullWidth"
          // size="small"
          disabled={props.disabled}
          onChange={hedelonChange}
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