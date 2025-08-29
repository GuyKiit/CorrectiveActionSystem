import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface SliderSizes {
  value?: any;
  onChange?: (value: any) => void;
  defaultValue? : number;
  step? : any;
  min? : any;
  max? : any;
  //handleonClick: () => void;
  // variant_text: "text" | "contained" | "outlined";
  // iconAdd?: boolean;
  // iconPrint?: boolean;
  // iconUpload?: boolean;
  // iconDownload?: boolean;

}

export default function SliderSizes({defaultValue, step, min, max, value, onChange }: SliderSizes) {
  const handleOnChange = (event: Event, newValue: number | number[]) => {
    if (onChange && typeof newValue === 'number') {
      onChange(newValue);
    }
  };  //console.log(iconAdd);

  return (
    <div>
      <Box sx={{ width: 300 }}>
        <Slider
          value={value}
          onChange={handleOnChange}
          aria-label="Temperature"
          defaultValue={defaultValue}
          valueLabelDisplay="auto"
          step={step}
          min={min}
          max={max}
        />
      </Box>
    </div>

  );
}