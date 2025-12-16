import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import { MenuItem, Select, TextField } from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import Swal from "sweetalert2";
import FullSweetalert from "../../../components/MUI/Sweetalert";

export interface ComplaintFile {
  file: File;
  attachmentType: string;
  otherText?: string;
  original_file_name?: string;
  img_url?: string;
  full_path?: string;
  id?: string;
}

interface BrowseFileUploadProps {
  file?: ComplaintFile[];
  setFile: (files: ComplaintFile[]) => void;
  labelname?: string;
  fileName?: string;
  setFileName: (val: string | undefined) => void;
  required?: string;
  validate?: boolean;
  options?: Array<{ id: string; lov1: string; lov_code: string; lov2: string; isOther?: string }>;
  action?: string;
  isViewMode?: boolean;
  grouped?: { [key: string]: any[] };
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
  action,
  isViewMode,
  grouped,
}: BrowseFileUploadProps) {

  const isActionAdd = action === "Add";
  const isActionEdit = action === "Edit";
  const Read = action === "Read";
  const isActionExplainAdd = action === "ExplainAdd";
  const isActionExplain = action === "Explain";
  const inputFile = useRef<HTMLInputElement>(null);
  const [attachmentType, setAttachmentType] = useState<string>("");
  const [otherText, setOtherText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Debug logging
  // console.log("BrowseFileUpload options:", options);
  // console.log("BrowseFileUpload attachmentType:", attachmentType);
  // console.log("Selected option:", options?.find((opt) => opt.id === attachmentType));

  // เมื่อผู้ใช้เลือกไฟล์
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const fileObj = event.target.files[0];
    const sizeInMB = fileObj.size / (1024 * 1024);
    if (sizeInMB > 5) {
    FullSweetalert({
      icon: "error",
      title: "ไฟล์มีขนาดใหญ่เกินไป!",
      text: `ไฟล์ ${fileObj.name} มีขนาด ${sizeInMB.toFixed(2)} MB (จำกัดไม่เกิน 5 MB)`,
      confirmButtonColor: "#d33",
      confirmButtonText: "ตกลง",
    }).then(() => {
      setAttachmentType("");
      setOtherText("");
    });
    
    event.target.value = ""; // ล้างค่า input เพื่อให้เลือกไฟล์ใหม่ได้
    return;
  }

    const fileConfig = grouped?.["config_file"]?.find(
    (c: any) => c.lov_code === "CheckTypeFileImage"
  );
    const isValidateEnabled = fileConfig?.lov2 === "Y";
    const allowedExt = fileConfig?.lov1
    ?.split(",")
    .map((x:any) => x.trim().toLowerCase()) || [];

    if (isValidateEnabled) {
    const fileExt = (fileObj.name.split(".").pop() || "").toLowerCase();


    if (!allowedExt.includes(fileExt)) {
      FullSweetalert({
        icon: "error",
        title: "ประเภทไฟล์ไม่ถูกต้อง!",
        text: `รองรับเฉพาะไฟล์: ${allowedExt.join(", ")}`,
        confirmButtonText: "ตกลง",
      });
      event.target.value = "";
      return;
    }
  }

    setSelectedFile(fileObj);
    setFileName(fileObj.name);
    event.target.value = "";
  };

  // เมื่อเลือกประเภทไฟล์หรือกรอก otherText ให้สร้าง object แล้วส่งกลับ parent
  useEffect(() => {
    if (!selectedFile || !attachmentType) return;
    const selectedOption = options.find((opt) => opt.id === attachmentType);
    const isOther = selectedOption?.isOther === 'Y';
    
    if (isOther && !otherText.trim()) return; // ต้องกรอก otherText

    const newFile: ComplaintFile = {
      file: selectedFile,
      original_file_name: selectedFile.name,
      attachmentType,
      otherText: (() => {
        const selectedOption = options.find((opt) => opt.id === attachmentType);
        return selectedOption?.isOther === "Y" ? otherText : undefined;
      })(),
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

      {/*select ประเภทไฟล์ และ ปุ่มอัปโหลด */}
      {(isActionAdd || isActionEdit  || isActionExplainAdd ) && !isViewMode && (
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
                const selectedOption = options.find((opt) => opt.id === value);
                if (selectedOption?.isOther !== "Y") {
                  setOtherText("");
                }
              }}
              sx={{ flex: 1, backgroundColor: "#fff" }}
            >
              <MenuItem value="" sx={{ display: "none" }}>
                <em>-- เลือกรูปแบบเอกสาร --</em>
              </MenuItem>
              {options.map((opt) => (
                <MenuItem key={opt.id} value={opt.id}>
                  {opt.lov1}
                </MenuItem>
              ))}
            </Select>

            {options.find((opt) => opt.id === attachmentType)?.isOther === "Y" && (
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
                (options.find((opt) => opt.id === attachmentType)?.isOther !== "Y" || otherText.trim())
                  ? "bg-green-300 cursor-pointer"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
              onClick={() => {
                const isOther = options.find((opt) => opt.id === attachmentType)?.isOther === "Y";
                if (
                  !attachmentType ||
                  (isOther && !otherText.trim())
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
