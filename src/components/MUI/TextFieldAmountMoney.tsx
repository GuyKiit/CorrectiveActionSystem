import * as React from "react";
import TextField from "@mui/material/TextField";
import { NumericFormat } from "react-number-format";
import { grey } from "@mui/material/colors";

interface TextFieldAmountMoney {
  value?: string;
  labelname?: string;
  idName?: string;
  required?: string;
  typeneme?: string;
  onchange?: (value: any) => void;
  maxLength?: number;
  disabled?: boolean;
  Validate?: boolean;
  craditLimit?: boolean;
  readonly?: boolean;
  bgcolorTextField?: boolean;
  validateTextLable?: string
}

interface CustomProps {
  inputRef: (instance: HTMLInputElement | null) => void;
  onChange: (event: { target: { value: string } }) => void;
}

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  { inputRef, onChange, ...other }: CustomProps,
  ref
) {
  // const  NumberFormatCustom = forwardRef(function NumberFormatCustom( {}: CustomProps) {
  // const { inputRef, onChange, ...other } = props;
  // console.log(props);

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: `${values.value}`,
          },
        });
      }}
      fixedDecimalScale
      decimalScale={2}
      thousandSeparator={true}
      prefix=""
      allowNegative={false}
    />
  );
});

export default function TextFieldAmountMoney({
  value,
  labelname,
  required,
  typeneme = "text",
  onchange,
  maxLength,
  disabled,
  Validate,
  idName,
  readonly,
  validateTextLable,
  bgcolorTextField,
  craditLimit
}: TextFieldAmountMoney) {
  const [validateLabelCitizenId, setValidateLabelCitizenId] = React.useState("");
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('handleOnChange', e.target.value);
    onchange && onchange(e.target.value);
  };

  // React.useEffect(() => {
  //   if (craditLimit) {
  //     setValidateLabelCitizenId("*** ไม่สามารถขอเกินวงเงินได้ ***")
  //   } else {
  //     setValidateLabelCitizenId("")
  //   }
  //   if (validate) {
  //     setValidateLabelCitizenId(`*** กรุณากรอก${labelname} ***`)
  //   }
  // }, [craditLimit, validate])
  return (
    <div>
      <label className={`${required} fs-5 py-2 sarabun-regular`}>{labelname}</label>
      <TextField
        value={value}
        id={idName}
        name={labelname}
        //placeholder={""}
        autoComplete="off"
        type={`${typeneme}`}
        inputProps={{ maxLength, style: { textAlign: "right"}}}
        disabled={disabled}
        fullWidth
        sx={{
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
        size="small"
        onChange={handleOnChange}
        InputProps={{
          readOnly: readonly,
          inputComponent: NumberFormatCustom as any,
          style: craditLimit ? { color: "red" } : {}
        }}
      />
      {validateTextLable ? (
        <label htmlFor="" className={`fs-7 py-1 sarabun-regular-lable-validate`}>
          {validateTextLable}
        </label>
      ) : null}
    </div>
  );
}