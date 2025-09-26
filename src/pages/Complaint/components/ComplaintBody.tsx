//ทำobj เป็น array
import React, { useState, useRef, use, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { setValueMas } from "../../../../libs/setvaluecallback";
import DeleteIcon from "@mui/icons-material/Delete";
import { _POST } from "../../../service/mas";
import {
  _formatNumber,
  _formatNumberNotdecimal,
} from "../../../../libs/datacontrol";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TableContainer,
  styled,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  Stack, AccordionDetails, Accordion, AccordionSummary, Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
// import { Document, Page, pdfjs } from "react-pdf";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import DesktopDatePickers from "../../../components/MUI/DesktopDatePicker";
import FullWidthButton from "../../../components/MUI/FullWidthButton";
import FullWidthTextArea from "../../../components/MUI/FullWidthTextFieldArea";
import FullWidthCheckbox from "../../../components/MUI/FullWidthCheckbox";
import Grid from "@mui/material/Grid2";
import TimePickerTextField from "../../../components/MUI/TimePickerTextField";
import FullSweetalert from "../../../components/MUI/Sweetalert";
import { v4 as uuidv4 } from "uuid";
import { useData } from "../../../auth/core/DataContext";
import { useLayout } from "../../../layout/core/LayoutProvider";
import { Collapse } from "@mui/material";
import BrowseFileUpload from "./BrowseFileUpload";
import { log } from "node:console";
import { cleanAccessData } from "../../../service/initmain/initmain";
import { useListComplaint } from "../core/ListComplaintContext";
import { data } from "react-router-dom";
import { ComplaintFile } from "./BrowseFileUpload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Validate = {
  Product_Group: boolean;
  Report_Type: boolean;
  Respondent_Department: boolean;
  Date_of_Detection: boolean;
  Department_Area: boolean;
  Product_Name: boolean;
  Lot_No: boolean;
  Email: boolean;
  Complaint_Type: boolean;
  Other_Type: boolean;
  Complaint_Rs: boolean;
  Other_Rs: boolean;
  Clause_Rs: boolean;
  Detail: boolean;
  Priority: boolean;
};

type detail = {
  qty?: false;
};

type Block = {
  id: any;
  season: number;
  groupProduct: number;
  prod_id: any;
  customer: any;
  address: any;
  tms_Complaint_no: string;
  order_po: string;
  order_do: string;
  qty: any;
  pack_unit: any;
  total_weight_ton: any;
  note: any;
  isValid: boolean;
  validateMessage: string;
  req: any;
};

interface ComplaintBody {
  action: string;
  disableTextField?: boolean;
  readonlyTextField?: boolean;
  bgcolorTextField?: boolean;
  disableComBoBox?: boolean;
  dataelement?: any;
  validateText?: Validate;
  validateDetailText?: { [index: number]: detail };
  onBlocksChange?: (blocks: Block[]) => void;
  handleOpenAdd?: () => void;
  onReportTypeChange?: (val: any) => void;
  onDateOfDetectionChange?: (val: any) => void;
  onDepartmentAreaChange?: (val: any) => void;
  onProductNameChange?: (val: any) => void;
  onLotNoChange?: (val: any) => void;
  onEmailChange?: (val: any) => void;

  onComplaintTypeChange?: (val: any) => void;
  onOtherTypeChange?: (val: any) => void;

  onComplaintRsChange?: (val: any) => void;
  onOtherRsChange?: (val: any) => void;
  onClauseChange?: (val: any) => void;

  onDetailChange?: (val: any) => void;
  onPriorityChange?: (val: any) => void;
}

type LovType = {
  id: string;
  lov_id: string;
  lov_group: string;
  lov_type: string;
  lov_code: string;
  lov1: string;
  lov2: string;
  lov3: string;
  lov4: string;
  lov5: string;
  lov6: string;
};

type FileData = {
  file: File;
  attachmentType?: string;
  otherText?: string;
  original_file_name?: string;
  img_url?: string;
  full_path?: string;
  id?: string;
};

export default function ComplaintBody({
  action,
  readonlyTextField,
  bgcolorTextField,
  validateText,
  onBlocksChange,
  validateDetailText,
  handleOpenAdd,
  onReportTypeChange,
  onDateOfDetectionChange,
  onDepartmentAreaChange,
  onProductNameChange,
  onLotNoChange,
  onEmailChange,

  onComplaintTypeChange,
  onOtherTypeChange,

  onComplaintRsChange,
  onOtherRsChange,
  onClauseChange,


  onDetailChange,
  onPriorityChange,
}: ComplaintBody) {
  const isActionRead = action === "Read";
  const isActionAdd = action === "Add";
  const isActionEdit = action === "Edit";
  const isActionDelete = action === "Delete";
  const isActionExplain = action === "Explain";
  const isActionClose = action === "Close";


  const user = cleanAccessData("userSession");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // const handleConfirmDelete = () => {
  //   if (deleteIndex !== null) {
  //     handleRemoveFile(deleteIndex);
  //     setDeleteIndex(null);
  //   }
  //   setOpenConfirm(false);
  // };

  const {
    dataelement,
    Complaint_no,
    no,
    cas_number,
    doc_date,
    date_of_detection,
    request_name,
    request_company_id,
    request_domain_id,
    request_position,
    request_email,
    request_phone,
    request_date,
    respondent_company_id,
    // request_department_id,
    respondent_domain_id,
    respondent_department_id,
    respondent_email,
    respondent_other_name,
    respondent_other_email,
    product_name,
    detail,
    priority_level,
    respond_date_within,
    lot_no,
    user_file_name,
    other,
    compTypeOther,
    otherText,
    compRsOther,
    clauseOther,
    photoOther,
    phoTypeOther,
    acknowledge_flag,
    acknowledge_name,
    acknowledge_company_id,
    acknowledge_department_id,
    acknowledge_position,
    acknowledge_email,
    acknowledge_datetime,
    complaint_status_id,
    status_last_datetime,
    return_from_status_id,
    return_from_status_datetime,
    dc_name,
    dc_company_id,
    dc_department_id,
    dc_position,
    dc_email,
    record_status,
    create_by,
    create_datetime,
    update_by,
    update_datetime,
    ComplaintStatusID_Combobox,
    dataReportTypeValue,
    dataComplaintTypeValue_Combobox,
    dataComplaintType_Combobox,
    dataComplaintRsValue_Combobox,
    dataComplaintRs_Combobox,
    dataphotoValue_Combobox,
    dataphoto_Combobox,
    datapriority_Combobox,
    datapriorityValue_Combobox,

    // Dataset
    dataset_reporttype,
    dataset_company,
    dataset_department,
    dataset_domain,
    complaintFiles,

    setComplaint_no,
    setno,
    setcas_number,
    setdoc_date,
    setdate_of_detection,
    setrequest_name,
    setrequest_company_id,
    setrequest_domain_id,
    // setrequest_department_id,
    setrequest_position,
    setrequest_email,
    setrequest_phone,
    setuser_file_name,
    setrequest_date,
    setrespondent_company_id,
    setrespondent_domain_id,
    setrespondent_department_id,
    setrespondent_email,
    setrespondent_other_name,
    setrespondent_other_email,
    setproduct_name,
    setdetail,
    setcomplaint_type_other,
    setpriority_level,
    setrespond_date_within,
    setlot_no,
    setother,
    setcompTypeOther,
    setotherText,
    setcompRsOther,
    setclauseOther,
    setphotoOther,
    setphoTypeOther,

    setreference_standard_other,
    setacknowledge_flag,
    setacknowledge_name,
    setacknowledge_company_id,
    setacknowledge_department_id,
    setacknowledge_position,
    setacknowledge_email,
    setacknowledge_datetime,
    setcomplaint_status_id,
    setstatus_last_datetime,
    setreturn_from_status_id,
    setreturn_from_status_datetime,
    setdc_name,
    setdc_company_id,
    setdc_department_id,
    setdc_position,
    setdc_email,
    setrecord_status,
    setcreate_by,
    setcreate_datetime,
    setupdate_by,
    setupdate_datetime,
    setComplaintStatusID_Combobox,
    setdataReportTypeValue,
    setdataComplaintType_Combobox,
    setdataComplaintTypeValue_Combobox,
    setdataComplaintRs_Combobox,
    setdataComplaintRsValue_Combobox,
    setdataphoto_Combobox,
    setdataphotoValue_Combobox,
    setdatapriority_Combobox,
    setdatapriorityValue_Combobox,

    // Dataset
    setdataset_reporttype,
    setdataset_company,
    setdataset_department,
    setdataset_domain,
    setcomplaintFiles,
  } = useListComplaint();

  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const getPdfUrl = (file: File) => {
    if (file.type === "application/pdf") {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Utility Variables ======================================================
  const { Customer } = useData();
  const { setIsLoadingScreen } = useLayout();

  // Get Master Variables ======================================================
  const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>([]);
  const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
  const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
  const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);

  // Value Variables ======================================================
  const [dataComplaintType, setdataComplaintType] = useState<LovType[]>([]);
  const [dataComplaintRs, setdataComplaintRs] = useState<LovType[]>([]);
  const [dataphoto, setdataphoto] = useState<LovType[]>([]);
  const [datapriority, setdatapriority] = useState<LovType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileAttachmentTypes, setFileAttachmentTypes] = useState<{
    [fileIndex: number]: string;
  }>({});
  const [fileOtherTexts, setFileOtherTexts] = useState<{
    [fileIndex: number]: string;
  }>({});
  const [fileList, setFileList] = useState<FileData[]>([]);
  const [request_department_id, setrequest_department_id] = React.useState<{
    itasset_department_id: number;
    itasset_department_name: string;
  } | null>(null);

  // Hidden Variables ======================================================
  const [isFormHidden, setisFormHidden] = useState(true);

  const [isCasNumberHidden, setisCasNumberHidden] = useState(true);
  const [isFactoryHidden, setisFactoryHidden] = useState(true);
  const [isAreaOfDetectionHidden, setisAreaOfDetectionHidden] = useState(true);
  const [isProductHidden, setisProductHidden] = useState(true);
  const [isLotNoHidden, setisLotNoHidden] = useState(true);
  const [isAttachmentsHidden, setisAttachmentsHidden] = useState(true);
  const [isDocumentIssuanceHidden, setisDocumentIssuanceHidden] =
    useState(true);
  const [isDateOfDetection, setisDateOfDetection] = useState(true);
  const [isRequiredResponseDateHidden, setisRequiredResponseDateHidden] =
    useState(true);
  const [isCTHidden, setisCTHidden] = useState(true);
  const [isRSHidden, setIsRSHidden] = useState(true);
  const [isDetailHidden, setisDetailHidden] = useState(true);
  const [isPriority, setisPriority] = useState(true);
  const [isReportedByHidden, setisReportedByHidden] = useState(true);
  const [isPositionHidden, setisPositionHidden] = useState(true);
  const [isDepartmentHidden, setisDepartmentHidden] = useState(true);
  const [isEmailHidden, setisEmailHidden] = useState(true);
  const [isPhoneHidden, setisPhoneHidden] = useState(true);

  // สร้าง state สำหรับควบคุม Accordion
  const [isMinimizedefaultOpen, setisMinimizeDefaultOpen] = useState(true);
  const [isMinimizetypeOpen, setisMinimizeTypeOpen] = useState(true);
  const [isMinimizersOpen, setisMinimizeRsOpen] = useState(true);
  const [isMinimizedetailOpen, setisMinimizeDetailOpen] = useState(true);
  const [isMinimizepriorityOpen, setisMinimizePriorityOpen] = useState(true);
  const [isMinimizefileOpen, setisMinimizeFileOpen] = useState(true);
  const [isMinimizerespondOpen, setisMinimizeRespondOpen] = useState(true);
  const [isMinimizeexlistOpen, setisMinimizeExlistOpen] = useState(true);
  const [isMinimizecloseOpen, setisMinimizeCloseOpen] = useState(true);

  // Function Handlers (On Change Event) ======================================================
  const handleReportTypeChange = (val: LovType | null) => {
    console.log(val, "valvalvalvalvalvalvalvalvalvalvalvalvalvalvalval");

    if (
      val?.lov_code === "CAR" ||
      val?.lov_code === "OBS" ||
      val?.lov_code === "CPAR"
    ) {
      setIsRSHidden(true);
    } else {
      setIsRSHidden(false);
    }
    setdataReportTypeValue(val);
    console.log(dataReportTypeValue, "dataReportTypeValue");

    // Clear validation error when user selects a value
    if (onReportTypeChange) {
      onReportTypeChange(val);
    }

    setrespondent_domain_id(dataset_company[0]);
    setrespondent_company_id(dataset_company[0]);
    setcas_number("");

    setdate_of_detection(null);
    setrespondent_department_id(null);
    setproduct_name("");
    setlot_no("");
    setrespondent_email("");
    setdataComplaintTypeValue_Combobox(null);
    setdataComplaintType([]);
    setcompTypeOther("");
    setdataComplaintRsValue_Combobox(null);
    setdataComplaintRs([]);
    setcompRsOther("");
    setclauseOther("");
    setdetail("");
    setdatapriorityValue_Combobox(null);
    setdatapriority(null);
    setrespond_date_within(null);
    setdataphotoValue_Combobox(null);
    setdataphoto([]);
    setotherText("");
    setphoTypeOther("");

    setrequest_name("");
    setrequest_position("");
    setrequest_department_id(user);
    setrequest_email("");
    setrequest_phone("");
    setrequest_domain_id(dataset_company[0]);
    setrequest_company_id(dataset_company[0]);
    setFileList([]);
    setcomplaintFiles([]);
  };



  const handleCheckboxChangeCT = (item: LovType) => {
    console.log("💛💛item", item);

    setdataComplaintType((prev: LovType[] = []) => {
      let newData: LovType[];

      if (prev.some((c) => c.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter((c) => c.id !== item.id);

        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        if (item.lov2 === "Y") {
          setcompTypeOther("");
        }
      } else {
        // เพิ่ม object แบบเต็ม
        newData = [...prev, item];
      }

      // สร้าง array ลดรูป
      const reducedArray = newData.map((c) => ({
        complaint_type_id: c.id,
        label: c.lov1,
        isOther: c.lov2,
      }));

      // ดู log
      console.log("Reduced array:", reducedArray);

      // อัปเดตเข้า context
      setdataComplaintTypeValue_Combobox(reducedArray);
      console.log(newData, "newData");

      // Clear validation error when user selects/deselects complaint type
      if (onComplaintTypeChange) {
        onComplaintTypeChange(newData);
      }


      return newData;
    });
  };

  const handleCheckboxChangeRS = (item: LovType) => {
    setdataComplaintRs((prev: LovType[] = []) => {
      console.log("💚💚item", item);
      let newData: LovType[];

      if (prev.some((rs) => rs.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter((rs) => rs.id !== item.id);

        if (item.lov3 === "Other") {
          setcompRsOther("");
        }
        if (item.lov3 === "Clause") {
          setclauseOther("");
        }
      } else {
        // เพิ่ม object แบบเต็ม
        newData = [...prev, item];
      }

      // สร้าง array ลดรูปสำหรับ context
      const reducedArray = newData.map((rs) => ({
        complaint_type_id: rs.id,
        label: rs.lov1,
        isOther: rs.lov2,
        isClause: rs.lov3,
      }));
      // const reducedArray = newData.map(rs => ({ complaint_type_id: rs.id, lov1: rs.lov1 }));

      console.log("Reduced array:", reducedArray);

      setdataComplaintRsValue_Combobox(reducedArray);

      // Clear validation error when user selects/deselects complaint rs
      if (onComplaintRsChange) {
        onComplaintRsChange(newData);
      }




      return newData;
    });
  };
  const handleCheckboxChangePhotoType = (item: LovType) => {
    setdataphoto((prev: LovType[] = []) => {
      let newData: LovType[];

      if (prev.some((pho) => pho.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = [];

        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        if (item.id === "TRR_AT_4") {
          setphoTypeOther("");
        }
      } else {
        // เพิ่ม object แบบเต็ม
        newData = [item];
      }

      // สร้าง array ลดรูปสำหรับ context
      const reducedArray = newData.map((pho) => ({
        complaint_at_id: pho.id,
        label: pho.lov1,
      }));

      console.log("Reduced array:", reducedArray);

      setdataphotoValue_Combobox(reducedArray);

      return newData;
    });
  };
  const handleCheckboxChangePriority = (item: LovType) => {
    // setdatapriority((prev) => (prev?.id === item.id ? null : item));
    const newPriority = datapriority?.id === item.id ? null : item;
    setdatapriority(newPriority);

    // Set the priority value for the context
    setdatapriorityValue_Combobox(newPriority?.id || "");
    setpriority_level(newPriority?.id || "");

    // Clear validation error when user selects/deselects priority
    if (onPriorityChange) {
      onPriorityChange(newPriority);
    }

    console.log("🎯 Priority selected:", newPriority);
    console.log("🎯 Priority ID:", newPriority?.id);
  };

  // รับ ComplaintFile[] จาก BrowseFileUpload
  const handleFileChange = (fileArray: ComplaintFile[]) => {
    if (!fileArray || fileArray.length === 0) return;
    const updatedList = [...fileList, ...fileArray];
    console.log("ไฟล์ที่เพิ่ม:", updatedList);
    setFileList(updatedList);
    setcomplaintFiles(updatedList);
  };



  const handleFileAttachmentTypeChange = (index: number, type: string) => {
    const updated = [...fileList];
    updated[index] = {
      ...updated[index],
      attachmentType: type,
      otherText: type === "TRR_AT_4" ? updated[index].otherText : "",
    };
    setFileList(updated);
    setcomplaintFiles(updated);
  };

  const handleFileOtherTextChange = (index: number, text: string) => {
    const updated = [...fileList];
    updated[index] = { ...updated[index], otherText: text };
    setFileList(updated);
    setcomplaintFiles(updated);
    return updated;
  };

  // Functions (Initial, Calculation or ETC.) =================================================
  const resetForm = () => {
    setdataReportTypeValue("");
    setcas_number("");
    setproduct_name("");
    setlot_no("");
    setrequest_name("");
    setrequest_company_id(null);
    setrequest_domain_id("");
    setrequest_department_id(null);
    setrequest_position("");
    setrequest_email("");
    setrequest_phone("");
    setrespondent_company_id(null);
    setrespondent_domain_id("");
    setrespondent_department_id(null);
    setrespondent_email("");

    setdoc_date(dayjs(null));
    setrespond_date_within(dayjs(null));
    setdetail("");
    setcompTypeOther("");
    setotherText("");
    setcompRsOther("");
  };

  const priorityCalculateRespondDate = (
    daysToAdd: number,
    checked: boolean
  ) => {
    if (checked) {
      const newDate = dayjs().add(daysToAdd, "day"); // use dayjs instead of Date
      setrespond_date_within(newDate);
    } else {
      setrespond_date_within(null);
    }
  };

  const arraysAreEqual = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    return a.every(
      (item, index) => JSON.stringify(item) === JSON.stringify(b[index])
    );
  };

  const handleRemoveFile = async (index: number) => {
    const fileToRemove = fileList[index];

    // ถ้าเป็นไฟล์ที่มีอยู่แล้วในฐานข้อมูล (มี id)
    if (fileToRemove && fileToRemove.id) {
      try {
        // เรียกใช้ endpoint ลบไฟล์จากฐานข้อมูล
        const deletePayload = {
          id: fileToRemove.id,
          update_by: user[0]?.employee_username || ""
        };

        console.log("🗑️ Deleting file from database:", deletePayload);
        const response = await _POST(deletePayload, "/ComplaintFile/ComplaintFileEdit");
        console.log("🗑️ Delete response:", response);

        if (response && response.status === "success") {
          console.log("✅ File deleted from database successfully");
        } else {
          console.log("⚠️ Failed to delete file from database:", response);
        }
      } catch (error) {
        console.error("❌ Error deleting file from database:", error);
      }
    }

    // ลบไฟล์จาก UI
    setFileList((prev) => {
      const updatedList = prev.filter((_, i) => i !== index);
      // อัปเดต complaintFiles ใน context ด้วย
      setcomplaintFiles(updatedList);
      return updatedList;
    });
  };
  useEffect(() => {
    setcomplaintFiles(fileList); // sync
  }, [fileList]);

  // READ - Get Complaints
  const ComplaintFile_Get = async () => {
    // ตรวจสอบว่ามี dataelement?.id หรือไม่  ไม่error หากไม่มีไฟล์
    if (!dataelement?.id) {
      console.log("No complaint ID, skipping file fetch");
      setFileList([]);
      setcomplaintFiles([]);
      return;
    }

    setIsLoadingScreen(true);
    const dataset = {
      complaint_id: dataelement?.id,
      cf_type: "Complaint",
    };

    try {
      let response = await _POST(dataset, "/ComplaintFile/ComplaintFileGet");
      console.log(response, "response_Get");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        const responseData: any = [];

        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log(
            "################# FILE #######################:",
            response.data
          ); // เช็คว่ามีกี่แถวจริง ๆ

          const mappedFiles: ComplaintFile[] = response.data.map(
            (file: any) => ({
              file: {
                name: file.user_file_name || "unknown",
                size: Number(file.file_size) || 0,
                type: file.file_type || "",
              } as File,
              attachmentType: file.complaint_at_id,
              otherText: file.other,
              original_file_name: file.user_file_name,
              img_url: file.img_url,
              full_path: file.full_path,
              id: file.id, // เพิ่ม id สำหรับการลบไฟล์
            })
          );

          setFileList(mappedFiles);
          setcomplaintFiles(mappedFiles);
        } else {
          // ไม่มีไฟล์
          console.log("No files found");
          setFileList([]);
          setcomplaintFiles([]);
        }
      } else {
        // Response ไม่สำเร็จ
        console.log("Failed to get files:", response);
        setFileList([]);
        setcomplaintFiles([]);
      }
    } catch (e) {
      console.log("Error getting files:", e);
      setFileList([]);
      setcomplaintFiles([]);
    } finally {
      setIsLoadingScreen(false);
    }
  };

  React.useEffect(() => {
    const updateData = async () => {
      // ถ้าไม่มี anything ที่จำเป็นก็ยังไม่ return ทันที — เราต้องการให้ logic พยายามทำงานเมื่อข้อมูลพร้อม
      // 1) เตรียม newDataset จาก dataset_reporttype (ถ้ามี)
      let newDataset: LovType[] | undefined = Array.isArray(dataset_reporttype)
        ? dataset_reporttype
        : undefined;

      // ถ้ามี dataset_reporttype และ dataelement ให้เรียก setValueMas เพื่อ map ค่า (safe)
      if (Array.isArray(dataset_reporttype) && dataelement) {
        try {
          const mapped = await setValueMas(
            dataset_reporttype,
            dataelement.report_type,
            "id"
          );
          // mapped อาจเป็น undefined หรือ array — ให้ใช้ mapped ถ้ามีค่าที่แตกต่างจากเดิม
          if (mapped && Array.isArray(mapped)) {
            // ถ้า different -> update state
            if (JSON.stringify(mapped) !== JSON.stringify(dataset_reporttype)) {
              setdataset_reporttype(mapped);
            }
            newDataset = mapped;
          } else {
            // ถ้า mapped เป็น object เดียว ๆ (กรณีฟังก์ชันคืน object) — เราอยากให้ newDataset เป็น array
            if (mapped && !Array.isArray(mapped)) {
              newDataset = Array.isArray(dataset_reporttype)
                ? dataset_reporttype
                : [mapped];
            }
          }
        } catch (err) {
          console.error("setValueMas error:", err);
        }
      }

      // 2) ถ้า action === "Read" และมี dataelement.report_type ให้หา default จาก newDataset (ถ้ามี)
      if (
        (isActionRead || isActionEdit || isActionDelete) &&
        dataelement?.report_type &&
        Array.isArray(newDataset) &&
        newDataset.length > 0
      ) {
        const defaultVal = newDataset.find(
          (item: LovType) =>
            // บางที dataelement.report_type อาจเก็บ lov_code หรือ id ขึ้นกับ backend — เช็คทั้งสอง
            item.lov_code === dataelement.report_type ||
            item.id === dataelement.report_type
        );

        if (defaultVal) {
          // ป้องกัน set ซ้ำ
          if (
            !dataReportTypeValue ||
            dataReportTypeValue.id !== defaultVal.id
          ) {
            setdataReportTypeValue(defaultVal);
          }
        }
      }

      // 3) กรอง priority (จาก datapriority_Combobox)
      if (Array.isArray(datapriority_Combobox)) {
        const newFilteredPriority = datapriority_Combobox.filter(
          (item: LovType) => item.lov_type === "priority_level"
        );
        setFilteredpriority((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredPriority))
            return newFilteredPriority;
          return prev;
        });
      }

      // 4) ถ้ามี dataReportTypeValue (จาก state หรือ เพิ่ง set ข้างบน) ให้กรอง complaint/attach/reference
      const reportTypeToUse = dataReportTypeValue; // ใช้ state ปัจจุบัน (ซึ่งเราเพิ่งอาจจะ set)
      if (reportTypeToUse) {
        const val = reportTypeToUse;

        const newFilteredComplaintType = (
          dataComplaintType_Combobox || []
        ).filter(
          (item: LovType) =>
            item.lov_type === "complaint_type" && item.lov_code === val.id
        );
        setFilteredComplaintType((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredComplaintType))
            return newFilteredComplaintType;
          return prev;
        });

        const newFilteredPhoto = (dataphoto_Combobox || []).filter(
          (item: LovType) => item.lov_type === "attach_type"
        );
        setFilteredphoto((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredPhoto))
            return newFilteredPhoto;
          return prev;
        });

        if (val.lov_code === "NCR") {
          const newFilteredComplaintRs = (
            dataComplaintRs_Combobox || []
          ).filter(
            (item: LovType) =>
              item.lov_type === "reference_standard" && item.lov_code === val.id
          );
          setFilteredComplaintRs((prev: LovType[]) => {
            if (JSON.stringify(prev) !== JSON.stringify(newFilteredComplaintRs))
              return newFilteredComplaintRs;
            return prev;
          });
        } else {
          setFilteredComplaintRs([]);
        }
      } else {
        // ถ้ายังไม่มี reportType ก็ reset
        setFilteredComplaintType([]);
        setFilteredComplaintRs([]);
        setFilteredphoto([]);
        // หมายเหตุ: filteredpriority เรา update ข้างบนแล้ว
      }
    };

    updateData();
    // dependency: ให้ trigger เมื่อสิ่งที่สำคัญเปลี่ยนจริง ๆ (action, property ที่เปลี่ยน, dataset ที่ load)
  }, [
    action,
    dataelement?.report_type, // ใช้ property เพื่อให้ effect รันเมื่อ report_type เปลี่ยน
    dataset_reporttype,
    datapriority_Combobox,
    dataComplaintType_Combobox,
    dataComplaintRs_Combobox,
    dataphoto_Combobox,
    dataReportTypeValue, // เพราะเรใช้ state นี้ต่อใน effect (และต้องการให้ flow ใช้ค่าล่าสุด)
  ]);

  React.useEffect(() => {
    console.log(
      dataelement,
      "55555555555555555555555555555",
      filteredComplaintType
    );
    console.log(
      dataelement,
      "55555555555555555555555555555",
      datapriority_Combobox
    );
    console.log(
      dataelement?.priority_level,
      "55555555555555555555555555555",
      datapriority_Combobox
    );
    console.log("💥💥CasNumber:", dataelement?.cas_number);
    console.log("isRSHidden", isRSHidden);
    console.log("dataReportTypeValue", dataReportTypeValue);
    console.log("dataComplaintRs", dataComplaintRs);
    console.log("filteredComplaintRs", filteredComplaintRs);
    console.log("💚 raw complaintRs from element:", dataelement?.complaintRs);
    console.log("💚 dataComplaintRs_Combobox:", dataComplaintRs_Combobox);
    const rsData = setComplaintRs(dataelement?.complaintRs);
    console.log("💚 mapped rsData:", rsData);

    if (dataelement && action != "Add") {
      setrespondent_company_id(
        dataset_company.find(
          (el: any) =>
            el.itasset_company_id == String(dataelement.respondent_company_id)
        )
      );
      setcas_number(dataelement?.cas_number || "");
      setdoc_date(
        dataelement?.doc_date
          ? dayjs(dataelement.doc_date, "DD-MM-YYYY")
          : dayjs()
      );
      setdate_of_detection(dayjs(dataelement?.date_of_detection));
      setrespondent_department_id(
        dataset_department.find(
          (el: any) =>
            el.itasset_department_id ==
            String(dataelement.respondent_department_id)
        )
      );
      setproduct_name(
        dataelement?.product_name ? dataelement?.product_name : ""
      );
      setlot_no(dataelement?.lot_no ? dataelement?.lot_no : "");
      setrespondent_email(
        dataelement?.respondent_email ? dataelement?.respondent_email : ""
      );
      setdataComplaintType(setComplaintType(dataelement?.complaintType));
      setcompTypeOther(dataelement?.other ? dataelement?.other : "");
      setdataComplaintRs(setComplaintRs(dataelement?.complaintRs));
      setcompRsOther(dataelement?.other ? dataelement?.other : "");
      setclauseOther(dataelement?.clause ? dataelement?.clause : "");
      setdetail(dataelement?.detail ? dataelement?.detail : "");
      setpriority_level(setPriorityLevel(dataelement?.priority_level));
      setrespond_date_within(
        dataelement?.respond_date_within
          ? dayjs(dataelement.respond_date_within, "DD-MM-YYYY")
          : dayjs()
      );
      setrequest_name(
        dataelement?.request_name ? dataelement?.request_name : ""
      );
      setrequest_position(
        dataelement?.request_position ? dataelement?.request_position : ""
      );
      setrequest_department_id(
        dataelement?.request_department_id
          ? dataelement?.request_department_id
          : ""
      );
      setrequest_email(
        dataelement?.request_email ? dataelement?.request_email : ""
      );
      setrequest_phone(
        dataelement?.request_phone ? dataelement?.request_phone : ""
      );
      setrequest_company_id(
        dataset_company.find(
          (el: any) =>
            el.itasset_company_id == String(dataelement.request_company_id)
        )
      );

      // สมมติ LovType คือ { id: string; label: string }

      const ct = setComplaintType(dataelement?.complaintType);
      setdataComplaintType(ct);

      // ถ้ามี complaintType ที่เป็น Other ให้ดึงค่ามา
      const otherCT = ct.find((el: any) => el.lov2 === "Y");
      setcompTypeOther(otherCT?.other || "");

      const rs = setComplaintRs(dataelement?.complaintRs);
      setdataComplaintRs(rs);

      // // ⭐ กรองตาม report_type
      // const filteredRS = rsData.filter(el => el.report_type === dataelement.report_type);
      // setdataComplaintRs(filteredRS);

      // ⭐ ใช้ filteredRS หา Other/Clause ไม่ใช่ rsData
      const otherRS = rs.find((el: any) => el.lov3 === "Other");
      setcompRsOther(otherRS?.other || "");

      const clauseRS = rs.find((el: any) => el.lov3 === "Clause");
      setclauseOther(clauseRS?.clause || "");

      // หา LovType จาก datapriority_Combobox ตาม dataelement?.priority_level
      const selectedPriority =
        datapriority_Combobox.find(
          (item: any) => item.id === dataelement?.priority_level
        ) || null;

      setdatapriority(selectedPriority);
      setpriority_level(selectedPriority);
      if (dataelement?.report_type === "TRR_RT_NCR") {
        setIsRSHidden(false);
      } else {
        setIsRSHidden(true);
      }
    }
  }, [dataset_reporttype]);

  React.useEffect(() => {
    // เฉพาะตอน Read เท่านั้น
    if (action === "Read" || action === "Edit" || action === "Delete") {
      ComplaintFile_Get();
    }
  }, [action, dataelement]);

  const setComplaintType = (data: any) => {
    const newData: any[] = [];
    Array.isArray(data) &&
      data.forEach((el) => {
        const filter = dataComplaintType_Combobox.find(
          (item: any) => item.id === el.complaint_type_id
        );

        if (filter) {
          newData.push({
            ...filter,
            other: el.other || "", // ⭐ เก็บค่าข้อความ Other มาด้วย
          });
        }
      });
    return newData;
  };

  const setComplaintRs = (data: any) => {
    const newData: any[] = [];
    Array.isArray(data) &&
      data.forEach((el) => {
        const filter = dataComplaintRs_Combobox.find(
          (item: any) => item.id === el.complaint_type_id
        );

        if (filter) {
          newData.push({
            ...filter,
            other: el.other || "", // ⭐ เก็บค่าข้อความ Other มาด้วย
            clause: el.clause || "",
          });
        }
      });
    return newData;
  };
  const setPriorityLevel = (value: any) => {
    if (!value) return null;

    // หา object ที่ id ตรงกับค่าที่ DB ส่งมา
    const selected =
      datapriority_Combobox.find((item: any) => item.id === value) || null;

    console.log("🎯 Priority matched:", selected);
    return selected;
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: "2px solid #F29739",
        borderRadius: 2,
        backgroundColor: "#ffffff",
        // boxShadow: '0 0 10px 2px rgba(0, 98, 233, 0.5)',
        // transition: 'box-shadow 0.3s ease',
        // '&:hover': {
        //   boxShadow: '0 0 20px 4px rgba(0, 98, 233, 0.8)',
        // },
      }}
    >
      <div className="px-2 pt-2 pb-5">
        <label className="sarabun-regular-datatable">
          ประเภทข้อมูลแบบฟอร์ม
        </label>
      </div>
      <Divider sx={{ my: 0.1, borderColor: "#F29739" }} />
      <Grid container spacing={2} mt={2}>
        <Grid size={6}>
          <AutocompleteComboBox
            required="required"
            value={dataReportTypeValue}
            labelName={"ประเภทรายงาน (Report Type)"}
            options={dataset_reporttype} // <-- แก้ตรงนี้
            column="lov_code"
            setvalue={handleReportTypeChange}
            readonly={
              isActionRead
                ? true
                : isActionEdit
                  ? true
                  : isActionDelete
                    ? true
                    : readonlyTextField
            }
            bgcolorTextField={
              isActionRead
                ? true
                : isActionEdit
                  ? true
                  : isActionDelete
                    ? true
                    : bgcolorTextField
            }
            Validate={validateText?.Report_Type || false}
            validateTextLable={validateText?.Report_Type ? "กรุณาเลือกประเภทรายงาน (Report Type)" : ""}
          />
        </Grid>
      </Grid>

      {/* ====== Dynamic ฟอร์ม สำหรับเลือกประเภทเอกสาร ====== */}
      {isFormHidden && dataReportTypeValue && (
        <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
          <Accordion
            expanded={isMinimizedefaultOpen}
            onChange={() => setisMinimizeDefaultOpen(!isMinimizedefaultOpen)}
            sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="reference-standard-content"
              id="reference-standard-header"
            >
              <Typography
                className="sarabun-regular-datatable"
                sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
              >
                {dataReportTypeValue?.lov4}
                <span style={{ color: "red" }}> *</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2}>
                <Grid size={4} mt={2}>
                  <AutocompleteComboBox
                    value={respondent_company_id}
                    labelName={"โรงงาน (Factory)"}
                    options={dataset_company}
                    column="domain_name"
                    setvalue={(v) => setrespondent_company_id(v)}
                    bgcolorTextField={true}
                    readonly
                  />
                </Grid>
                <Grid size={4} mt={2}>
                  <FullWidthTextField
                    value={cas_number || "AUTO"}
                    labelName="CAS Number"
                    onchange={(e) => {
                      setcas_number(e);
                    }}
                    readonly
                  />
                </Grid>
                <Grid size={4} mt={2}>
                  <DesktopDatePickers
                    labelName={"วันที่ออกเอกสาร (Document Issuance Date)"}
                    value={doc_date}
                    handleChange={(val: dayjs.Dayjs | null | undefined) => {
                      if (val) setdoc_date(val); // ถ้า val เป็น null/undefined จะไม่เซ็ต
                    }}
                    bgcolorTextField={true}
                    readonly
                  />
                </Grid>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    mt: 3,
                    width: "100%",
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
                    border: "1px solid #ffcdd2",
                    boxShadow: "0 4px 12px rgba(244,67,54,0.1)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      pb: 2,
                      borderBottom: "2px solid #f44336",
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 24,
                        backgroundColor: "#f44336",
                        borderRadius: 1,
                        mr: 2,
                      }}
                    />
                    <label
                      className="sarabun-regular-datatable"
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#d32f2f",
                        margin: 0,
                      }}
                    >
                      แผนกผู้ถูกร้องเรียน (Respondent Department)
                    </label>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid size={4}>
                      <DesktopDatePickers
                        required="required"
                        labelName={"วันที่พบปัญหา (Date of Detection)"}
                        value={date_of_detection}
                        handleChange={(val) => {
                          setdate_of_detection(val ?? null);
                          if (onDateOfDetectionChange) {
                            onDateOfDetectionChange(val);
                          }
                        }}
                        bgcolorTextField={action === "Add" ? false : true}
                        readonly={isActionRead || isActionEdit || isActionDelete}
                        Validate={validateText?.Date_of_Detection || false}
                        validateTextLable={validateText?.Date_of_Detection ? "กรุณาเลือกวันที่พบปัญหา" : ""}
                      />
                    </Grid>
                    <Grid size={4}>
                      <AutocompleteComboBox
                        required="required"
                        value={respondent_department_id}
                        labelName={
                          "แผนกที่พบปัญหา (Department / Area of Detection)"
                        }
                        options={dataset_department}
                        column="department_name"
                        setvalue={(val) => {
                          console.log("Selected value:", val);
                          setrespondent_department_id(val);
                          if (onDepartmentAreaChange) {
                            onDepartmentAreaChange(val);
                          }
                        }}
                        bgcolorTextField={
                          action === "Add" ? false : isActionEdit ? false : true
                        }
                        readonly={isActionRead || isActionDelete}
                        Validate={validateText?.Department_Area || false}
                        validateTextLable={validateText?.Department_Area ? "กรุณาเลือกแผนกที่พบปัญหา" : ""}
                      />
                    </Grid>
                    <Grid size={4}>
                      <FullWidthTextField
                        required="required"
                        value={product_name}
                        labelName="ชื่อสินค้า (Product Name)"
                        onchange={(e) => {
                          setproduct_name(e);
                          if (onProductNameChange) {
                            onProductNameChange(e);
                          }
                        }}
                        readonly={isActionRead || isActionDelete}
                        Validate={validateText?.Product_Name || false}
                        validateTextLable={validateText?.Product_Name ? "กรุณากรอกชื่อสินค้า" : ""}
                      />
                    </Grid>
                    <Grid size={4}>
                      <FullWidthTextField
                        required="required"
                        value={lot_no}
                        labelName="Lot No./Bag No"
                        onchange={(e) => {
                          setlot_no(e);
                          if (onLotNoChange) {
                            onLotNoChange(e);
                          }
                        }}
                        readonly={isActionRead || isActionDelete}
                        Validate={validateText?.Lot_No || false}
                        validateTextLable={validateText?.Lot_No ? "กรุณากรอก Lot No./Bag No" : ""}
                      />
                    </Grid>
                    <Grid size={4}>
                      <FullWidthTextField
                        required="required"
                        value={respondent_email}
                        labelName="อีเมล (Email)"
                        onchange={(e) => {
                          setrespondent_email(e);
                          if (onEmailChange) {
                            onEmailChange(e);
                          }
                        }}
                        readonly={isActionRead || isActionDelete}
                        Validate={validateText?.Email || false}
                        validateTextLable={validateText?.Email ? "กรุณากรอกอีเมล" : ""}
                      />
                    </Grid>
                  </Grid>

                  {/* รายละเอียด Sub-section */}
                  <Box sx={{ mt: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        pb: 1,
                        borderBottom: "1px solid #ffcdd2",
                      }}
                    >
                      <Box
                        sx={{
                          width: 4,
                          height: 16,
                          backgroundColor: "#f44336",
                          borderRadius: 0.5,
                          mr: 1.5,
                        }}
                      />
                      <label
                        className="sarabun-regular-datatable"
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#d32f2f",
                          margin: 0,
                        }}
                      >
                        รายละเอียด
                      </label>
                    </Box>

                    <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                      {dataReportTypeValue && (
                        <Grid size={12} sx={{ display: "flex" }}>
                          <Accordion
                            expanded={isMinimizetypeOpen}
                            onChange={() => setisMinimizeTypeOpen(!isMinimizetypeOpen)}
                            sx={{ borderRadius: 2, backgroundColor: "#fafafa", border: validateText?.Complaint_Type ? "1px solid #f44336" : "1px solid #e0e0e0" }}>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="reference-standard-content"
                              id="reference-standard-header"
                            >
                              <Typography
                                className="sarabun-regular-datatable"
                                sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                              >
                                ประเภทข้อร้องเรียน (Type Of Complaint){" "}
                                <span style={{ color: "red" }}> *</span>
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>

                              <Divider sx={{ my: 0 }} />
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Grid container spacing={2}>
                                  {(filteredComplaintType || []).map(
                                    (item: LovType) => (
                                      <Grid size={3} key={item.id}>
                                        <FullWidthCheckbox
                                          labelName={item.lov1}
                                          value={dataComplaintType.some(
                                            (c) => c.id === item.id
                                          )}
                                          onchange={() =>
                                            handleCheckboxChangeCT(item)
                                          }
                                          readonly={isActionRead || isActionDelete}
                                        />
                                      </Grid>
                                    )
                                  )}
                                </Grid>
                                <Box sx={{ mt: "auto", pt: 2 }}>
                                  {dataComplaintType.some((c) => c.lov2 === "Y") && (
                                    <FullWidthTextArea
                                      value={compTypeOther}
                                      labelName="Other:"
                                      onchange={(e) => {
                                        setcompTypeOther(e);
                                        if (onOtherTypeChange) {
                                          onOtherTypeChange(e);
                                        }

                                      }}
                                      readonly={isActionRead || isActionDelete}
                                      Validate={validateText?.Other_Type || false}
                                      validateTextLable={validateText?.Other_Type ? "กรุณากรอกรายละเอียด" : ""}
                                    />
                                  )}
                                </Box>
                              </Box>
                              {validateText?.Complaint_Type && (
                                <label className="fs-7 py-1 sarabun-regular-lable-validate" style={{ color: "red" }}>
                                  กรุณาเลือกประเภทข้อร้องเรียน
                                </label>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      )}

                      {!isRSHidden && dataReportTypeValue && (
                        <Grid size={12} sx={{ display: "flex" }}>
                          <Accordion
                            expanded={isMinimizersOpen}
                            onChange={() => setisMinimizeRsOpen(!isMinimizersOpen)}
                            sx={{ borderRadius: 2, backgroundColor: "#fafafa", border: validateText?.Complaint_Rs ? "1px solid #f44336" : "1px solid #e0e0e0" }}>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="reference-standard-content"
                              id="reference-standard-header"
                            >
                              <Typography
                                className="sarabun-regular-datatable"
                                sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                              >
                                มาตรฐานอ้างอิง (Reference Standard) {" "}
                                <span style={{ color: "red" }}> *</span>
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Divider sx={{ my: 0 }} />
                              <Box
                                sx={{
                                  flexGrow: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Grid container spacing={2}>
                                  {filteredComplaintRs.map((item: LovType) => (
                                    <Grid size={3} key={item.id}>
                                      <FullWidthCheckbox
                                        labelName={item.lov1}
                                        value={dataComplaintRs.some(
                                          (rs) => rs.id === item.id
                                        )}
                                        onchange={() => handleCheckboxChangeRS(item)}
                                        readonly={isActionRead || isActionDelete}
                                      />
                                    </Grid>
                                  ))}
                                </Grid>
                                <Box sx={{ mt: "auto", pt: 2 }}>
                                  {dataComplaintRs.some(
                                    (rs) => rs.lov3 === "Clause"
                                  ) && (
                                      <FullWidthTextArea
                                        value={clauseOther}
                                        labelName="Clause:"
                                        onchange={(e) => {
                                          setclauseOther(e);
                                          if (onClauseChange) {
                                            onClauseChange(e);
                                          }
                                        }}
                                        readonly={isActionRead || isActionDelete}
                                        Validate={validateText?.Clause_Rs || false}
                                        validateTextLable={validateText?.Clause_Rs ? "กรุณากรอกรายละเอียด Clause" : ""}
                                      />
                                    )}
                                  {dataComplaintRs.some(
                                    (rs) => rs.lov3 === "Other"
                                  ) && (
                                      <FullWidthTextArea
                                        value={compRsOther}
                                        labelName="Other:"
                                        onchange={(e) => {
                                          setcompRsOther(e);
                                          if (onOtherRsChange) {
                                            onOtherRsChange(e);
                                          }
                                        }}
                                        readonly={isActionRead || isActionDelete}
                                        Validate={validateText?.Other_Rs || false}
                                        validateTextLable={validateText?.Other_Rs ? "กรุณากรอกรายละเอียด Other" : ""}
                                      />
                                    )}
                                </Box>
                              </Box>
                              {validateText?.Complaint_Rs && (
                                <label className="fs-7 py-1 sarabun-regular-lable-validate" style={{ color: "red" }}>
                                  กรุณาเลือกมาตรฐานอ้างอิง
                                </label>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      )}
                    </Grid>
                    {/* Priority Section */}

                    {dataReportTypeValue && (
                      <Box sx={{ mt: 3 }}>
                        <Accordion
                          expanded={isMinimizedetailOpen}
                          onChange={() => setisMinimizeDetailOpen(!isMinimizedetailOpen)}
                          sx={{ borderRadius: 2, backgroundColor: "#fafafa", border: validateText?.Detail ? "1px solid #f44336" : "1px solid #e0e0e0" }}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="reference-standard-content"
                            id="reference-standard-header"
                          >
                            <Typography
                              className="sarabun-regular-datatable"
                              sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                            >
                              รายละเอียด (Detail) {" "}
                              <span style={{ color: "red" }}> *</span>
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider sx={{ my: 1 }} />
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                justifyContent: "center",
                                alignItems: "flex-start",
                              }}
                            >
                              {/* Response Date Field - positioned after Emergency option */}
                              <Grid size={12}>
                                <FullWidthTextArea
                                  value={detail}
                                  labelName=""
                                  onchange={(e) => {
                                    setdetail(e);
                                    if (onDetailChange) {
                                      onDetailChange(e);
                                    }
                                  }}
                                  readonly={isActionRead || isActionDelete}
                                  Validate={validateText?.Detail || false}
                                  validateTextLable={validateText?.Detail ? "กรุณากรอกรายละเอียด (Detail)" : ""}
                                />
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    )}
                    {/* Priority Section */}
                    {dataReportTypeValue && (
                      <Box sx={{ mt: 3 }}>
                        <Accordion
                          expanded={isMinimizepriorityOpen}
                          onChange={() => setisMinimizePriorityOpen(!isMinimizepriorityOpen)}
                          sx={{ borderRadius: 2, backgroundColor: "#fafafa", border: validateText?.Priority ? "1px solid #f44336" : "1px solid #e0e0e0" }}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="reference-standard-content"
                            id="reference-standard-header"
                          >
                            <Typography
                              className="sarabun-regular-datatable"
                              sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                            >
                              ระดับความสำคัญ (Priority) {" "}
                              <span style={{ color: "red" }}> *</span>
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider sx={{ my: 1 }} />
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                justifyContent: "center",
                                alignItems: "flex-start",
                              }}
                            >
                              {(filteredpriority || [])
                                .sort((a, b) => {
                                  const order: { [key: string]: number } = {
                                    Normal: 1,
                                    Urgent: 2,
                                    Emergency: 3,
                                  };
                                  return (
                                    (order[a.lov_code] || 999) -
                                    (order[b.lov_code] || 999)
                                  );
                                })
                                .map((item: LovType) => (
                                  <Grid size={3} key={item.id}>
                                    <Box
                                      sx={{
                                        border: "2px solid #e0e0e0",
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: "center",
                                        backgroundColor:
                                          datapriority?.id === item.id
                                            ? "#fff3e0"
                                            : "#ffffff",
                                        borderColor:
                                          datapriority?.id === item.id
                                            ? "#ff9800"
                                            : "#e0e0e0",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                          borderColor: "#ff9800",
                                          backgroundColor: "#fff8f0",
                                        },
                                      }}
                                    >
                                      <FormControlLabel
                                        control={
                                          <Radio
                                            checked={datapriority?.id === item.id}
                                            onChange={(e) => {
                                              console.log("🎯 Priority radio clicked:", item);
                                              setdatapriority(item);
                                              setdatapriorityValue_Combobox(item.id);
                                              setpriority_level(item.id);
                                              const days = Number(item.lov3 ?? 0);
                                              priorityCalculateRespondDate(
                                                days,
                                                true
                                              );
                                              // Clear validation error when user selects priority
                                              if (onPriorityChange) {
                                                onPriorityChange(item);
                                              }
                                              console.log(
                                                "เลือก priority:",
                                                item.lov_code,
                                                "Days:",
                                                days
                                              );
                                              console.log(
                                                "เลือก datapriority?.id:",
                                                item.id
                                              );
                                              console.log(
                                                "datapriorityValue_Combobox set to:",
                                                item.id
                                              );
                                            }}
                                            disabled={
                                              isActionRead ||
                                              isActionEdit ||
                                              isActionDelete
                                            }
                                            sx={{ color: "#ff9800" }}
                                          />
                                        }
                                        label={
                                          <Box sx={{ textAlign: "center" }}>
                                            <Box
                                              sx={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color:
                                                  datapriority?.id === item.id
                                                    ? "#f57c00"
                                                    : "#666",
                                              }}
                                            >
                                              {item.lov1} ({item.lov_code})
                                            </Box>
                                            <Box
                                              sx={{
                                                fontSize: "12px",
                                                color:
                                                  datapriority?.id === item.id
                                                    ? "#f57c00"
                                                    : "#999",
                                                mt: 0.5,
                                              }}
                                            >
                                              (ภายใน {item.lov3} วัน)
                                            </Box>
                                          </Box>
                                        }
                                        sx={{
                                          width: "100%",
                                          m: 0,
                                          flexDirection: "column",
                                          alignItems: "center",
                                        }}
                                      />
                                    </Box>
                                  </Grid>
                                ))}

                              {/* Response Date Field - positioned after Emergency option */}
                              <Grid size={3}>
                                <Box
                                  sx={{
                                    border: "2px solid #e0e0e0",
                                    borderRadius: 2,
                                    p: 2,
                                    textAlign: "center",
                                    backgroundColor: "#ffffff",
                                    borderColor: "#e0e0e0",
                                    transition: "all 0.2s ease",
                                    minHeight: "100px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      mb: 3,
                                    }}
                                  >
                                    ตอบกลับภายในวันที่ (Response Date)
                                  </Box>
                                  <DesktopDatePickers
                                    labelName=""
                                    value={respond_date_within}
                                    handleChange={(val) =>
                                      setrespond_date_within(val ?? null)
                                    }
                                    bgcolorTextField={true}
                                    readonly
                                  />
                                </Box>
                              </Grid>
                            </Grid>
                            {validateText?.Priority && (
                              <label className="fs-7 py-1 sarabun-regular-lable-validate" style={{ color: "red" }}>
                                กรุณาเลือกระดับความสำคัญ (Priority)
                              </label>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    )}
                  </Box>
                </Paper>

                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    mt: 3,
                    width: "100%",
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
                  }}
                >
                  <Accordion
                    expanded={isMinimizefileOpen}
                    onChange={() => setisMinimizeFileOpen(!isMinimizefileOpen)}
                    sx={{
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
                      mt: 3,

                    }}
                  >
                    {/* 🔹 หัวข้อ */}
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "#616161" }} />}
                      aria-controls="dept-content"
                      id="dept-header"
                      sx={{ px: 2 }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            pb: 2,
                            borderBottom: "2px solid #616161", // ✅ เส้นเต็มเหมือนเดิม
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 24,
                              backgroundColor: "#616161",
                              borderRadius: 1,
                              mr: 2,
                            }}
                          />
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{ fontSize: 18, fontWeight: 600, color: "#616161" }}
                          >
                            แนบไฟล์ (Attachments)
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>

                      <Grid container spacing={2}>
                        {dataReportTypeValue && (
                          <Grid size={12}>
                            <BrowseFileUpload
                              setFile={handleFileChange}
                              setFileName={() => { }}
                              options={(filteredphoto || []).map((p: any) => ({
                                id: p.id,
                                lov1: p.lov1,
                              }))}
                              action={action}
                            />

                            {/* Grouped display by attachment type - Full width boxes stacked vertically */}
                            <Box sx={{ mt: 1 }}>
                              {(filteredphoto || []).map((photoType: any) => {
                                const items = fileList.filter(
                                  (f) => f.attachmentType === photoType.id
                                );
                                if (items.length === 0) return null;
                                return (
                                  <Paper
                                    key={photoType.id}
                                    elevation={1}
                                    sx={{ p: 2, borderRadius: 2, mb: 2, width: "100%" }}
                                  >
                                    <label
                                      className="sarabun-regular-datatable"
                                      style={{ fontWeight: 600, fontSize: "16px" }}
                                    >
                                      {photoType.lov1}
                                    </label>
                                    <Divider sx={{ my: 1 }} />
                                    {items.map((item, idx) => (
                                      <Box
                                        key={idx}
                                        sx={{
                                          p: 1.5,
                                          border: "1px solid #e0e0e0",
                                          borderRadius: 1,
                                          mb: 1,
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          gap: 2,
                                        }}
                                      >
                                        <Box>
                                          <div style={{ fontWeight: "bold" }}>
                                            {item.file.name}
                                          </div>
                                          <div
                                            style={{
                                              fontSize: "15px",
                                              color: "#484444ff",
                                            }}
                                          >
                                            {(item.file.size / (1024 * 1024)).toFixed(
                                              2
                                            )}{" "}
                                            MB
                                          </div>
                                          {photoType.id === "TRR_AT_4" && (
                                            <div
                                              style={{
                                                fontSize: "15px",
                                                color: "#484444ff",
                                                marginTop: "4px",
                                              }}
                                            >
                                              รายละเอียด: {item.otherText}
                                            </div>
                                          )}
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                          {/* //ปุ่มลบไฟล์ */}
                                          {(action == "Edit" || action == "Add") && (
                                            <IconButton
                                              color="error"
                                              onClick={() => {
                                                // หา index ที่ถูกต้องใน fileList
                                                const actualIndex = fileList.findIndex(f =>
                                                  f.file.name === item.file.name &&
                                                  f.attachmentType === item.attachmentType
                                                );
                                                console.log("🔍 Remove file debug:", {
                                                  itemName: item.file.name,
                                                  itemType: item.attachmentType,
                                                  actualIndex,
                                                  fileListLength: fileList.length
                                                });
                                                if (actualIndex !== -1) {
                                                  handleRemoveFile(actualIndex);
                                                }
                                              }}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          )}

                                          {/* //ปุ่มดูไฟล์ */}

                                          <IconButton
                                            color="primary"
                                            onClick={() => {
                                              console.log("full_path:", item.full_path);
                                              console.log("file type:", typeof item.file);
                                              console.log("file instanceof File:", item.file instanceof File);

                                              // ตรวจสอบว่าเป็นไฟล์ใหม่ (ไม่มี full_path) หรือไฟล์เก่า (มี full_path)
                                              if (item.full_path) {
                                                // ไฟล์เก่า - เปิดจาก NAS
                                                window.open(item.full_path, "_blank");
                                              } else if (item.file instanceof File) {
                                                // ไฟล์ใหม่ - เปิดจาก File object
                                                const fileUrl = URL.createObjectURL(item.file);
                                                window.open(fileUrl, "_blank");
                                                // Clean up URL after a delay to free memory
                                                setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
                                              } else {
                                                console.log("Cannot preview file - no full_path or File object");
                                              }
                                            }}
                                          >
                                            <VisibilityIcon />
                                          </IconButton>


                                          {/* //ปุ่มดาวน์โหลดไฟล์ */}
                                          {action === "Read" && (
                                            <IconButton
                                              color="primary"
                                              onClick={async () => {
                                                if (!item.full_path) return;

                                                try {
                                                  const response = await fetch(
                                                    item.full_path,
                                                    { method: "GET" }
                                                  );
                                                  const blob = await response.blob();
                                                  const url = URL.createObjectURL(blob);

                                                  const link =
                                                    document.createElement("a");
                                                  link.href = url;
                                                  link.setAttribute(
                                                    "download",
                                                    item.original_file_name ?? "file"
                                                  );
                                                  document.body.appendChild(link);
                                                  link.click();
                                                  document.body.removeChild(link);

                                                  URL.revokeObjectURL(url); // cleanup memory
                                                } catch (err) {
                                                  console.error(
                                                    "Download failed:",
                                                    err
                                                  );
                                                }
                                              }}
                                            >
                                              <DownloadIcon />
                                            </IconButton>
                                          )}
                                        </Box>
                                      </Box>
                                    ))}
                                  </Paper>
                                );
                              })}

                              {fileList.length === 0 && (
                                <Paper
                                  elevation={0}
                                  sx={{ p: 2, textAlign: "center", color: "#999" }}
                                >
                                  ยังไม่มีไฟล์ที่แนบ
                                </Paper>
                              )}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Paper>

                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    mt: 3,
                    width: "100%",
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
                  }}
                >
                  <Accordion
                    expanded={isMinimizerespondOpen}
                    onChange={() => setisMinimizeRespondOpen(!isMinimizerespondOpen)}
                    sx={{
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)",
                      border: "1px solid #bbdefb",
                      boxShadow: "0 4px 12px rgba(33,150,243,0.1)",
                      mt: 3,

                    }}
                  >
                    {/* 🔹 หัวข้อ */}
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "#1976d2" }} />}
                      aria-controls="dept-content"
                      id="dept-header"
                      sx={{ px: 2 }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            pb: 2,
                            borderBottom: "2px solid #2196f3", // ✅ เส้นเต็มเหมือนเดิม
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 24,
                              backgroundColor: "#2196f3",
                              borderRadius: 1,
                              mr: 2,
                            }}
                          />
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{ fontSize: 18, fontWeight: 600, color: "#1976d2" }}
                          >
                            แผนกผู้ทำการออกเอกสาร (Reporting Department)
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>

                      <Grid container spacing={3}>
                        <Grid size={4}>
                          <FullWidthTextField
                            value={
                              action === "Add"
                                ? user[0]?.employee_username || "-"
                                : dataelement?.request_name || "-"
                            }
                            labelName="ชื่อผู้ออกเอกสาร (Reported by)"
                            onchange={(e) => setrequest_name(e.target.value)}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            value={
                              action === "Add"
                                ? user[0]?.employee_position || "-"
                                : dataelement?.request_position || "-"
                            }
                            labelName="ตำแหน่ง (Position)"
                            onchange={(e) => setrequest_position(e.target.value)}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            value={
                              action === "Add"
                                ? user[0]?.itasset_department_name || "-"
                                : dataelement?.request_department_id || "-"
                            }
                            labelName="แผนก (Department)"
                            onchange={(e) => {
                              // ถึง readonly แต่เผื่ออนาคตจะเปิดให้แก้
                              setrequest_department_id(
                                action === "Add"
                                  ? user[0]?.itasset_department_id
                                  : dataelement?.request_department_id
                              );
                            }}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            value={
                              action === "Add"
                                ? user[0]?.employee_email || "-"
                                : dataelement?.request_email || "-"
                            }
                            labelName="ตำแหน่ง (Position)"
                            onchange={(e) => setrequest_email(e.target.value)}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            value={
                              action === "Add"
                                ? user[0]?.employee_tel || "-"
                                : dataelement?.request_phone || "-"
                            }
                            labelName="ตำแหน่ง (Position)"
                            onchange={(e) => setrequest_phone(e.target.value)}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <AutocompleteComboBox
                            value={request_company_id}
                            labelName={"โรงงาน (Factory)"}
                            options={dataset_company}
                            column="domain_name"
                            setvalue={(v) => setrequest_company_id(v)}
                            bgcolorTextField={true}
                            readonly
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              </Grid>
            </AccordionDetails>
          </Accordion>

        </Paper>
      )}
      {isActionExplain && isActionClose && isFormHidden && dataReportTypeValue && (
        <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
          <Paper elevation={3} sx={{
            p: 3,
            mt: 3,
            width: "100%",
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)',
            border: '1px solid #ffe0b2',
            boxShadow: '0 4px 12px rgba(255,152,0,0.1)'
          }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Accordion expanded={isMinimizeexlistOpen}
                  onChange={() => setisMinimizeExlistOpen(!isMinimizeexlistOpen)}
                  sx={{
                    width: '100%',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
                    border: '1px solid #ff9800',
                    boxShadow: '0 4px 12px rgba(255,152,0,0.15)',
                    mt: 3
                  }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="reporting-dept-content"
                    id="reporting-dept-header"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between", // ✅ ดันซ้าย-ขวา
                        width: "100%", // ✅ กินเต็ม
                      }}
                    >
                      {/* === ฝั่งซ้าย === */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 24,
                            backgroundColor: "#ff9800",
                            borderRadius: 1,
                            mr: 2,
                          }}
                        />
                        <Typography
                          className="sarabun-regular-datatable"
                          sx={{ fontSize: 18, fontWeight: 600, color: "#000000" }}
                        >
                          รายการคำชี้แจง (Explain List)
                        </Typography>
                      </Box>

                      {/* === ฝั่งขวา ปุ่ม Add === */}
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#2e7d32",
                          "&:hover": { backgroundColor: "#2e7d32" },
                          borderRadius: 2,
                          textTransform: "none",
                        }}
                        onClick={() => handleOpenAdd && handleOpenAdd()}
                      >
                        + เพิ่มคำชี้แจง
                      </Button>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Divider sx={{ my: 1, borderBottom: '2px solid #ff9800' }} />
                    <Grid container spacing={3}>


                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Paper>
        </Paper>

      )}

      {isActionClose && isFormHidden && dataReportTypeValue && (
        <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
          <Paper elevation={3} sx={{
            p: 3,
            mt: 3,
            width: "100%",
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(158,158,158,0.1)'
          }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Accordion expanded={isMinimizecloseOpen}
                  onChange={() => setisMinimizeCloseOpen(!isMinimizecloseOpen)}
                  sx={{
                    width: '100%',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
                    border: '1px solid #9e9e9e',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    mt: 3
                  }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="reporting-dept-content"
                    id="reporting-dept-header"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        width: 6,
                        height: 24,
                        backgroundColor: '#424242',
                        borderRadius: 1,
                        mr: 2
                      }} />
                      <Typography
                        className="sarabun-regular-datatable"
                        sx={{ fontSize: 18, fontWeight: 600, color: '#000000' }}
                      >
                        รายละเอียดการปิดรายการ (Close Detail)
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Divider sx={{ my: 1, borderBottom: '2px solid #424242' }} />
                    <Grid container spacing={3}>

                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Paper>
        </Paper>

      )}
    </Box>

  );
}
