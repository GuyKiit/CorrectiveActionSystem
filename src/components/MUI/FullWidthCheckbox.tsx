// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Typography
// } from "@mui/material";
// import { grey } from "@mui/material/colors";

// interface FullWidthCheckboxProps {
//   labelName: string;
//   labelParent?: string;
//   labelChild1?: string;
//   labelChild2?: string;
//   value?: boolean[];
//   onchange?: (value: boolean[]) => void;
//   required?: string;
//   disabled?: boolean;
//   readonly?: boolean;
//   bgcolorTextField?: boolean;
//   Validate?: boolean;
//   validateTextLable?: string;
// }

// export default function FullWidthCheckbox(props: FullWidthCheckboxProps) {
//   const [checked, setChecked] = useState<boolean[]>([false, false]);

//   // อัปเดตเมื่อ prop.value เปลี่ยน (เช่นจาก form control)
//   useEffect(() => {
//     if (props.value) {
//       setChecked(props.value);
//     }
//   }, [props.value]);

//   const handleParentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = [event.target.checked, event.target.checked];
//     setChecked(newValue);
//     props.onchange?.(newValue);
//   };

//   const handleChildChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newChecked = [...checked];
//     newChecked[index] = event.target.checked;
//     setChecked(newChecked);
//     props.onchange?.(newChecked);
//   };

//   const parentChecked = checked[0] && checked[1];
//   const isIndeterminate = checked[0] !== checked[1];

//   return (
//     <Box sx={{
//       bgcolor: props.bgcolorTextField ? grey[100] : "", 
//       borderRadius: 1,
//       p: 2,
//       mb: 2,
//       border: '0px solid #d9d9d9',
//     }}>
//       <label className={`${props.required} fs-5 py-2 sarabun-regular`}>
//         {props.labelName}
//       </label>

//       <FormControlLabel
//         control={
//           <Checkbox
//             checked={parentChecked}
//             indeterminate={isIndeterminate}
//             onChange={handleParentChange}
//             disabled={props.disabled || props.readonly}
//           />
//         }
//         label={props.labelParent ?? "ทั้งหมด"}
//       />

//       <FormGroup sx={{ pl: 4 }}>
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={checked[0]}
//               onChange={handleChildChange(0)}
//               disabled={props.disabled || props.readonly}
//             />
//           }
//           label={props.labelChild1 ?? ""}
//         />
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={checked[1]}
//               onChange={handleChildChange(1)}
//               disabled={props.disabled || props.readonly}
//             />
//           }
//           label={props.labelChild2 ?? ""}
//         />
//       </FormGroup>

//       {props.Validate && props.validateTextLable && (
//         <Typography color="error" variant="body2" sx={{ mt: 1 }}>
//           {props.validateTextLable}
//         </Typography>
//       )}
//     </Box>
//   );
// }


// FullWidthCheckbox.tsx
import React from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

interface FullWidthCheckboxProps {
  labelName: string;
  value?: boolean;
  hidden?: boolean;
  onchange?: (value: boolean) => void;
  disabled?: boolean;
  readonly?: boolean;
  bgcolorTextField?: boolean;
  Validate?: boolean;
  validateTextLable?: string;
}



export default function FullWidthCheckbox(props: FullWidthCheckboxProps) {
  if (props.hidden) return null;
  return (
    <Box
      sx={{
        bgcolor: props.bgcolorTextField ? grey[100] : "",
        borderRadius: 1,
        p: 1,
        mb: 1,
        border: "0px solid #d9d9d9",
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={props.value}
            onChange={(e) => props.onchange?.(e.target.checked)}
            disabled={props.disabled || props.readonly}
          />
        }
        label={props.labelName}
      />
      
      {props.Validate && props.validateTextLable && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {props.validateTextLable}
        </Typography>
      )}
    </Box>
  );
}