import { MenuItem, Select, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';


interface BrowseFileUpload {
  file?: any;
  // Pass selected files back with selected attachment type and optional other text
  setFile: (files: File[], attachmentType?: string, otherText?: string) => void;
  labelname?: string;
  fileName?: string;
  setFileName: (val: string | undefined) => void;
  required?: string
  validate?: boolean
  // LOV options for document types (attach_type)
  options?: Array<{ id: string; lov1: string }>;
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
  validate,
  options = []
}: BrowseFileUpload) {
  const inputFile = React.useRef<HTMLInputElement>(null);
  const [attachmentType, setAttachmentType] = React.useState<string>("");
  const [otherText, setOtherText] = React.useState<string>("");

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

      setFile(
        [...files],
        attachmentType, 
        attachmentType === "TRR_AT_4" ? otherText : undefined);

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
  <label className={`${required} text-xl text-gray-800 mb-2`}>
    {labelname}
  </label>

  {/* Select + โปรดระบุ บรรทัดเดียวกัน */}
  <div className="flex items-center gap-2 mb-2">
    <Select
      size="small"
      value={attachmentType}
      displayEmpty
      onChange={(e) => setAttachmentType(e.target.value as string)}
      sx={{ flex: 1, backgroundColor: "#fff" }}
    >
      <MenuItem value="">
        <em>เลือกรูปแบบเอกสาร</em>
      </MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt.id} value={opt.id}>
          {opt.lov1}
        </MenuItem>
      ))}
    </Select>

    {attachmentType === "TRR_AT_4" && (
      <TextField
        size="small"
        placeholder="โปรดระบุ...กดเด"
        value={otherText}
        onChange={(e) => setOtherText(e.target.value)}
        sx={{ flex: 1 }}
      />
    )}
  </div>

  {/* ปุ่ม Upload */}
  <div className="flex items-center">
    <a
      className="bg-green-300 py-1 px-2 rounded-sm cursor-pointer flex items-center gap-1"
      onClick={startUploadFile}
    >
      <DriveFolderUploadIcon />
      <span>อัปโหลดไฟล์</span>
    </a>
  </div>

  <input
    type="file"
    onChange={handleFileChange}
    ref={inputFile}
    style={{ display: "none" }}
    accept="application/pdf, image/jpg, image/jpeg, image/png"
  />

  {validate && (
    <label className="text-[9px] text-red-600">
      {`*** กรุณาอัปโหลดไฟล์ ${labelname} ***`}
    </label>
  )}
</div>

  );
}