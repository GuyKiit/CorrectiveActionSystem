import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import { MenuItem, Select, TextField } from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

export interface ComplaintFile {
  file: File;
  attachmentType: string;
  otherText?: string;
  original_file_name?: string;
  img_url?: string;
}

interface BrowseFileUploadProps {
  file?: ComplaintFile[];
  setFile: (files: ComplaintFile[]) => void;
  labelname?: string;
  fileName?: string;
  setFileName: (val: string | undefined) => void;
  required?: string;
  validate?: boolean;
  options?: Array<{ id: string; lov1: string }>;
  action?: "Add" | "Edit" | "Read";
}

const allowedTypes = [
  "application/pdf",
  "image/jpg",
  "image/jpeg",
  "image/png",
];

export default function BrowseFileUpload({
  file,
  setFile,
  labelname,
  fileName,
  setFileName,
  required,
  validate,
  options = [],
  action = "Add",
}: BrowseFileUploadProps) {

  const Read = action === "Read";
  const inputFile = useRef<HTMLInputElement>(null);
  const [attachmentType, setAttachmentType] = useState<string>("");
  const [otherText, setOtherText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  // เมื่อผู้ใช้เลือกไฟล์
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const fileObj = event.target.files[0];
    setSelectedFile(fileObj);
    setFileName(fileObj.name);
    event.target.value = "";
  };

  // เมื่อเลือกประเภทไฟล์หรือกรอก otherText ให้สร้าง object แล้วส่งกลับ parent
  useEffect(() => {
    if (!selectedFile || !attachmentType) return;
    if (attachmentType === "TRR_AT_4" && !otherText.trim()) return; // ต้องกรอก otherText

    const newFile: ComplaintFile = {
      file: selectedFile,
      original_file_name: selectedFile.name,
      attachmentType,
      otherText: attachmentType === "TRR_AT_4" ? otherText : undefined,
    };
    setFile([...(file ?? []), newFile]);
    setSelectedFile(null);
    setAttachmentType("");
    setOtherText("");
    // eslint-disable-next-line
  }, [selectedFile, attachmentType, otherText]);

  // กดปุ่มอัปโหลด -> เปิด file dialog
  const startUploadFile = () => inputFile.current?.click();

  return (
    <div className="my-3 mx-3 w-96">
      {/* Label */}
      <label className={`${required} text-xl text-gray-800 mb-2`}>
        {labelname}
      </label>

      {/* Select + OtherText + Upload Button แสดงเฉพาะถ้าไม่ใช่ Read */}
      {action !== "Read" && (
        <>
          {/* Select + OtherText */}
          <div className="flex items-center gap-2 mb-2 w-full">
            <Select
              size="small"
              value={attachmentType}
              displayEmpty
              onChange={(e) => {
                const value = e.target.value as string;
                setAttachmentType(value);
                if (value !== "TRR_AT_4") {
                  setOtherText("");
                }
              }}
              sx={{ flex: 1, backgroundColor: "#fff" }}
            >
              <MenuItem value="">
                <em>-- เลือกรูปแบบเอกสาร --</em>
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
                placeholder="โปรดระบุ..."
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                sx={{ width: 1 }}
              />
            )}
          </div>

          {/* Upload Button */}
          <div className="flex items-center">
            <a
              className={`py-1 px-2 rounded-sm flex items-center gap-1 ${
                attachmentType &&
                (attachmentType !== "TRR_AT_4" || otherText.trim())
                  ? "bg-green-300 cursor-pointer"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
              onClick={() => {
                if (
                  !attachmentType ||
                  (attachmentType === "TRR_AT_4" && !otherText.trim())
                )
                  return;
                startUploadFile();
              }}
            >
              <DriveFolderUploadIcon />
              <span>อัปโหลดไฟล์</span>
            </a>
          </div>
        </>
      )}

      {/* Hidden input */}
      <input
        type="file"
        onChange={handleFileChange}
        ref={inputFile}
        style={{ display: "none" }}
        accept={allowedTypes.join(",")}
      />

      {/* Validation */}
      {validate && (
        <label className="text-[9px] text-red-600">
          {`*** กรุณาอัปโหลดไฟล์ ${labelname} ***`}
        </label>
      )}
    </div>
  );
}
