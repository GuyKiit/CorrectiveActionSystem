import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { grey } from "@mui/material/colors";


interface AutocompleteComboBox {
  value?: string;
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
  Validate?: boolean;
  validateTextLable?: string;
  error?: boolean;
  id?: string;
}

export default function AutocompleteComboBox(props: AutocompleteComboBox) {
  const {
    value,
    labelName,
    required,
    setvalue,
    options = [],
    column,
    ColumnConcat,
    disabled,
    bgcolorTextField,
    readonly,
    validateTextLable,
  } = props;
  const handleOnchange = (e: any, value: any) => {
    setvalue && setvalue(value)
  };

  return (
    <>
      <label htmlFor="" className={`fs-5 py-2 sarabun-regular`}>
        {labelName} {props.required && <span style={{ color: 'red' }}> *</span>}
      </label>
      <Autocomplete
        sx={{
          bgcolor: bgcolorTextField ? grey[200] : null,
          width: "100%",
        }}
        disablePortal
        value={value ? value : null}
        id="combo-box-demo"
        options={options ?? []}
        getOptionLabel={(option) => {
          if (!option) return "";
          const label = column && option[column] ? option[column] : "";
          const extra = ColumnConcat && option[ColumnConcat]
            ? `${option[ColumnConcat]}`
            : "";
          return `${label}${extra}`;
        }}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        renderOption={(props, option, { index }) => (
          <li {...props} key={`${option.id ?? option[column ? column : ""]}-${index}`}>
            {column && option[column] ? option[column] : ""}
            {ColumnConcat && option[ColumnConcat] ? ` ${option[ColumnConcat]}` : ""}
          </li>
        )}
        onChange={handleOnchange}
        disabled={disabled}
        readOnly={readonly}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="กรุณาเลือก"
            size="small"
            sx={{
              bgcolor: props.bgcolorTextField ? grey[200] : "",
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
          />
        )}
      />
      {validateTextLable ? (
        <label
          htmlFor=""
          //font colo
          className={`fs-7 py-1 sarabun-regular-lable-validate`}
        >
          {validateTextLable}
        </label>
      ) : null}
    </>
  );
}
