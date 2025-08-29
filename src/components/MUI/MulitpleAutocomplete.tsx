import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';


interface MulitpleAutocomplete {
  value?: any[];
  labelName: string;
  required?: string;
  disabled?: boolean;
  bgcolorTextField?: boolean;
  readonly?: boolean;
  onchange?: (value: string) => void;
  column?: string;
  ColumnConcat?: string;
  options?: any[];
  setvalue?: (value: any) => void;
  Validate?: boolean
}

export default function MulitpleAutocomplete(props: MulitpleAutocomplete) {
  const { value, labelName, required, setvalue, options = [], column, ColumnConcat, disabled, bgcolorTextField, readonly } = props;
  const handleOnchange = (e: any, value: any) => {
    setvalue && setvalue(value)
  };
  return (
    <>
      <Box>
        <label htmlFor="" className={`${required} fs-5 py-2 sarabun-regular`}>
          {labelName}
        </label>
        <Autocomplete
          sx={{
            bgcolor: bgcolorTextField ? grey[200] : null,
            width: "100%"
          }}
          multiple
          id="tags-outlined"
          value={value ? value : []}
          options={options ? options : []}
          getOptionLabel={(option) => {
            const col_column = column ? option[column] : '';
            const col2_ColumnConcat = ColumnConcat && option[ColumnConcat]
              ? `[${option[ColumnConcat]}]`
              : '';
            return `${col_column} ${col2_ColumnConcat}`;
          }}
          //defaultValue={[top100Films[13]]}
          onChange={handleOnchange}
          disabled={disabled}
          readOnly={readonly}
          filterSelectedOptions
          size="small"
          renderInput={(params) => <TextField {...params} placeholder="" size="small"
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
          />}
        />

      </Box>
    </>
  )
}