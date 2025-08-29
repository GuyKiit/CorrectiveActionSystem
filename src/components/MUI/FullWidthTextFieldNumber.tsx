import { TextField } from "@mui/material";
import { ChangeEvent, forwardRef, useState } from "react";
import { NumericFormat } from "react-number-format";

interface CustomProps {
  inputRef: (instance: HTMLInputElement | null) => void;
  onChange: (event: { target: { value: string } }) => void;
}
const NumberFormatCustom = forwardRef(function NumberFormatCustom(
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
        console.log(values);
       
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
    />
  );
});
 
export default function FullWidthTextFieldNumber() {
  const [value, setValue] = useState<string>("0.00");
 
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };
 
  return (
    <TextField
      // label="Formatted Number"
      value={value}
      onChange={handleChange}
      InputProps={{
        inputComponent: NumberFormatCustom as any,
      }}
      size="small"
    />
  );
}