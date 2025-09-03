import { TextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';


interface BrowseFileUpload {
  file?: any;
  setFile: (arg: any) => void;
  labelname?: string;
  fileName?: string;
  setFileName: (val: string | undefined) => void;
  required?: string
  validate?: boolean
}

const allowedTypes = [
  "application/pdf",
  "image/jpg",
  "image/jpeg",
  "image/png"
];

export default function BrowseFileUpload({
  file,
  setFile,
  labelname,
  fileName,
  setFileName,
  required,
  validate
}: BrowseFileUpload) {
  const inputFile = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const fileName_: string | undefined = event.target.files?.[0]?.name;
      setFileName(fileName_);
      if (!event.target.files) return;
      const firstFile  = event.target.files[0];
      if (!allowedTypes.includes(firstFile.type)) {
        // SnackbarSet("อนุญาตเฉพาะไฟล์ PDF, JPG, JPEG, PNG เท่านั้น", "error", 4000);!!!
        event.target.value = ""; // reset input
        return;
      }
      const files: File[] = [];

      for (const file of event.target.files) {
        files.push(file);
      }

      setFile([...files]);

      event.target.value = "";
    } catch (e) {
      console.log(e);
    }
  };

  const startUploadFile = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };
  return (
    <div className="my-3 mx-3 w-96">
      <label className={`${required} text-xl text-gray-800 mb-2`}>{labelname}</label>
      <div className="flex items-center">
        <TextField
          value={fileName}
          size="small"
          placeholder="กรุณาเลือกไฟล์"
          disabled
          error={validate}
          sx={{
            width: "100%",
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "black", // For text color in WebKit browsers
            },
            "& .MuiInputBase-root": {
              backgroundColor: "white", // Background color for the default input
            },
            "& .MuiInputBase-root.Mui-disabled": {
              backgroundColor: "rgb(241,241,244)", // Background color for the disabled input
            },
            "& .MuiOutlinedInput-root": {
              fontFamily: "Sarabun",
              fontSize: 14,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: validate ? "#d50000" : "",
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "info.main",
                },
              },
            },
          }}
        />
        <a
          className="bg-green-300 py-1 px-1 rounded-sm"
          onClick={startUploadFile}
        >
          <DriveFolderUploadIcon />
        </a>
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        ref={inputFile}
        style={{ display: "none" }}
        accept="application/pdf, image/jpg, image/jpeg, image/png"
      />
      {validate &&
        <label htmlFor="" className="text-[9px] text-red-600">{`*** กรุณาอัปโหลดไฟล์ ${labelname} ***`}</label>
      }
    </div>
  );
}