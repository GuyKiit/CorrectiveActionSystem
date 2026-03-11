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
import Fade from '@mui/material/Fade';
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
  Stack,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
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
  Follow_up_Date: boolean;
  ObsAnaly: boolean;
  Tu: boolean;
  Tuother: boolean;
  Rc: boolean;
  Dd: boolean;
  Ddother: boolean;
  Ca: boolean;
  Pap: boolean;
  ScDetail: boolean;
  ScNote: boolean;
  QcDetail: boolean;
  QcNote: boolean;
  CloseDetail: boolean;
  CloseNote: boolean;
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

interface ExplaintBody {
  action: string;
  isItAdmin: boolean;
  disableTextField?: boolean;
  readonlyTextField?: boolean;
  bgcolorTextField?: boolean;
  disableComBoBox?: boolean;
  dataelement?: any;
  validateText?: Validate;
  validateDetailText?: { [index: number]: detail };
  onBlocksChange?: (blocks: Block[]) => void;
  handleOpenAdd?: () => void;
  handleOnclickExplainView?: (item: any) => void;
  handleOnclickExplainApproveSc?: (item: any) => void;
  onApproveChange?: (value: LovType | null) => void;

  onSCDetailChange?: (value: string) => void;
  onSCNoteChange?: (value: string) => void;
  onQCDetailChange?: (value: string) => void;
  onQCNoteChange?: (value: string) => void;
  onCloseDetailChange?: (value: string) => void;
  onCloseNoteChange?: (value: string) => void;

  onFollowUpDateChange?: (value: any) => void;
  onObsAnalyChange?: (value: string) => void;
  onToolUseChange?: (value: any) => void;
  onToolOtherChange?: (value: any) => void;
  onDdChange?: (value: any) => void;
  onDecisionOtherChange?: (value: any) => void;
  onRootCauseChange?: (value: string) => void;
  onCorrectiveActionChange?: (value: string) => void;
  onPreventiveActionPlanChange?: (value: string) => void;

  isViewMode?: boolean;
  currentExplainForApproval?: any;
  complaint_status_lable?: any;

  submitCount?: number;
  prevFiles?: ComplaintFile[];
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
  lov7: string;
};

type FileData = {
  file: File;
  attachmentType?: string;
  otherText?: string;
  original_file_name?: string;
  img_url?: string;
  full_path?: string;
};

export default function ExplaintBody({
  action,
  isItAdmin,
  validateText,
  currentExplainForApproval,
  isViewMode = false,
  prevFiles,
  //====================Validate==================================//
  onFollowUpDateChange,
  onObsAnalyChange,
  onToolUseChange,
  onToolOtherChange,
  onDdChange,
  onDecisionOtherChange,
  onRootCauseChange,
  onCorrectiveActionChange,
  onPreventiveActionPlanChange,
  onApproveChange,
  onSCDetailChange,
  onSCNoteChange,
  onQCDetailChange,
  onQCNoteChange,
  onCloseDetailChange,
  onCloseNoteChange,
  //====================Validate==================================//
  submitCount,
}: ExplaintBody) {
  // const isActionRead =
  //   action === "Read" || action === "ExplainRead" || isViewMode;
  const isActionRead = action === "Read" || isViewMode;
  const isActionAdd = action === "Add";
  const isActionEdit = action === "Edit";
  const isActionDelete = action === "Delete";
  // =====================================================
  const isActionExplain = action === "Explain";
  const isActionExplainAdd = action === "ExplainAdd";
  const isActionReadExplain = action === "ReadExplain";
  const isActionExplainRead = action === "ExplainRead";
  // =====================================================
  const isActionExplainApproveSc = action === "ApproveSC";
  const isActionExplainApproveScAdd = action === "ApproveSCAdd";
  const isActionExplainReadApproveSc = action === "ReadApproveSC";
  const isActionExplainApproveScRead = action === "ApproveScRead";
  // =====================================================
  const isActionExplainApproveQc = action === "ApproveQC";
  const isActionExplainApproveQcAdd = action === "ApproveQCAdd";
  const isActionExplainReadApproveQc = action === "ReadApproveQC";
  const isActionExplainApproveQcRead = action === "ApproveQcRead";
  // =====================================================
  const isActionClose = action === "Close";
  const isActionCloseAdd = action === "CloseAdd";
  const isActionReadClose = action === "ReadClose";
  const isActionCloseHistory = action === "CloseHistoryRead" || action === "CloseHistory";
  // =====================================================
  const user = cleanAccessData("userSession");
  //⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐//
  const {
    dataelement,
    dataReportTypeValue,
    dataphoto_Combobox,
    // Dataset
    dataset_reporttype,
    dataset_reporttype_inactive,
    dataset_company,
    dataset_department,
    ToolOther,
    DecisionOther,

    //Explaint
    explainList,
    approveList,
    dataTooluse,
    dataToolUse_Combobox,
    dataDecision,
    dataDecision_Combobox,
    dataSectionapp,
    dataQcapp,
    dataApprove_Combobox,
    observation_analysis,
    root_cause,
    corrective_action,
    preventive_action_plan,
    follow_up_date,
    responsible_name,
    responsible_company_id,
    responsible_department_id,
    responsible_position,
    responsible_email,
    responsible_date,
    close_name,
    close_company_id,
    close_department_id,
    close_position,
    close_email,
    close_date,
    close_detail,
    close_note,
    return_detail,
    followup_approve, //มันคือ Radio Close 
    approve_name,
    approve_company_id,
    approve_department_id,
    approve_position,
    approve_email,
    approve_date,
    approve_detail,
    approve_note,

    qcapprove_name,
    qcapprove_company_id,
    qcapprove_department_id,
    qcapprove_position,
    qcapprove_email,
    qcapprove_date,
    qcapprove_detail,
    qcapprove_note,
    dataset_configfile,
    explainFiles,
    closeFiles,

    
    setrespondent_company_id,
    setrespondent_department_id,
    setdataReportTypeValue,
    // Dataset
    setdataset_reporttype,
    setdataset_reporttype_inactive,
    setcomplaintFiles,
    //Explaint
    setApproveList,
    setdataToolUse,
    setdataToolUseValue,
    setToolOther,
    setdataDecision,
    setdataDecisionValue,
    setDecisionOther,
    setdataSectionapp,
    setdataQcapp,
    setobservation_analysis,
    setroot_cause,
    setcorrective_action,
    setpreventive_action_plan,
    setfollow_up_date,
    setresponsible_name,
    setresponsible_company_id,
    setresponsible_department_id,
    setresponsible_position,
    setresponsible_email,
    setresponsible_date,
    setclose_name,
    setclose_company_id,
    setclose_department_id,
    setclose_position,
    setclose_email,
    setclose_date,
    setclose_detail,
    setclose_note,
    setapprove_name,
    setapprove_company_id,
    setapprove_department_id,
    setapprove_position,
    setapprove_email,
    setapprove_date,
    setapprove_detail,
    setapprove_note,
    setqcapprove_name,
    setqcapprove_company_id,
    setqcapprove_department_id,
    setqcapprove_position,
    setqcapprove_email,
    setqcapprove_date,
    setqcapprove_detail,
    setqcapprove_note,
    setfollowup_approve, //มันคือ Radio Close 
    setexplainFiles,
    setcloseFiles,
  } = useListComplaint();
  //⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐//
  // Utility Variables ======================================================
  const { setIsLoadingScreen } = useLayout();

  // For On-Off Calling Function Log
  const [isCallFuncLogOn] = useState(true);
  // Get Master Variables ======================================================
  const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);
  const [filteredTooluse, setFilteredTooluse] = useState<LovType[]>([]);
  const [filteredDecision, setFilteredDecision] = useState<LovType[]>([]);
  const [filteredScApprove, setFilteredScApprove] = useState<LovType[]>([]);
  const [filteredQmrApprove, setFilteredQmrApprove] = useState<LovType[]>([]);
  const [filteredCloseApprove, setFilteredCloseApprove] = useState<LovType[]>([]);
  //======================= Value Variables =======================
  //======================= Hidden Variables ======================
  const [isFormHidden, setIsFormHidden] = useState(false);
  const [isDDHidden, setIsDDHidden] = useState(true);
  const [isTUHidden, setIsTUHidden] = useState(true);
  const [isCAHidden, setIsCAHidden] = useState(true);
  const [isPAPHidden, setIsPAPHidden] = useState(true);
  const [isOBSAHidden, setIsOBSAHidden] = useState(true);
  const [isROOTHidden, setIsROOTHidden] = useState(false);
  //==========================================================================
  //              สร้าง state สำหรับควบคุม Accordion
  //================================ ผู้ชี้แจง ===================================//
  const [isMinimizeexplainOpen, setisMinimizeExplainOpen] = useState(true);
  const [isMinimizetoolOpen, setisMinimizeToolOpen] = useState(true);
  const [isMinimizeobservOpen, setisMinimizeObservOpen] = useState(true);
  const [isMinimizeddOpen, setisMinimizeDdOpen] = useState(true);
  const [isMinimizerootOpen, setisMinimizeRootOpen] = useState(true);
  const [isMinimizecaOpen, setisMinimizeCaOpen] = useState(true);
  const [isMinimizepapOpen, setisMinimizePapOpen] = useState(true);
  const [isMinimizefileOpen, setisMinimizeFileOpen] = useState(true);
  //=================== หัวหน้าส่วนผู้อนุมัติ ===================//
  const [isMinimizesectionappOpen, setisMinimizeSectionappOpen] = useState(true);
  const [isMinimizesectionradioOpen, setisMinimizeSectionradioOpen] = useState(true);
  const [isMinimizedeappOpen, setisMinimizeDeappOpen] = useState(true);
  const [isMinimizeotappOpen, setisMinimizeOtappOpen] = useState(true);
  //=================== ผู้จัดการโรงงานผู้อนุมัติ ===================//
  const [isMinimizeqmrappOpen, setisMinimizeQmrappOpen] = useState(true);
  const [isMinimizeqmrradioOpen, setisMinimizeQmrradioOpen] = useState(true);
  const [isMinimizeqmrdetailOpen, setisMinimizeQmrdetailOpen] = useState(true);
  const [isMinimizeqmrnoteOpen, setisMinimizeQmrnoteOpen] = useState(true);
  //======================= ผู้ปิดรายการ ========================//
  const [isMinimizecloseOpen, setisMinimizeCloseOpen] = useState(true);
  const [isMinimizecloseradioOpen, setisMinimizeCloseradioOpen] = useState(true);
  const [isMinimizeclosedetailOpen, setisMinimizeClosedetailOpen] = useState(true);
  const [isMinimizeclosenoteOpen, setisMinimizeClosenoteOpen] = useState(true);
  const [isMinimizefilecloseOpen, setisMinimizeFilecloseOpen] = useState(true);
  //=================================================================================//

  //======================= Tempเก็บค่า ========================//
  const [TempDataSC, setTempDataSC] = useState(null);
  const [TempDataQMR, setTempDataQMR] = useState(null);
  const [TempDataReturnClose, setTempDataReturnClose] = useState(null);
  //=========================================================//

  const grouped = {config_file: dataset_configfile || [],};
  const TuRef = useRef<HTMLDivElement>(null);
  const DdRef = useRef<HTMLDivElement>(null);
  const [firstErrorField, setFirstErrorField] = useState<string | null>(null);
  const isApprovesc = dataSectionapp?.lov_code === "APPROVE";
  const showPlaceholderscdetail = isActionExplainApproveScAdd && !approve_detail;
  const showPlaceholderscnote = isActionExplainApproveScAdd && !approve_note;
  const isApproveqmr = dataQcapp?.lov_code === "APPROVE";
  const showPlaceholderqmrdetail = isActionExplainApproveQcAdd && !qcapprove_detail;
  const showPlaceholderqmrnote = isActionExplainApproveQcAdd && !qcapprove_note;
  const isApproveClose = followup_approve?.lov_code === "APPROVE";
  const showPlaceholderclosedetail = isActionCloseAdd && !close_detail;
  const showPlaceholderclosenote = isActionCloseAdd && !close_note;
  const isFollowUpDate = dataelement?.follow_up_date_condition === "1";
  //================================================================================//

  //=====================Validate================================//
  useEffect(() => {
    if (!validateText) return;

    // Define the order of fields from top to bottom based on Validate type
    const fieldOrder: (keyof Validate)[] = [
      "Follow_up_Date",
      "Tu",
      "Tuother",
      "Dd",
      "Ddother",
      "Rc",
      "ObsAnaly",
      "Ca",
      "Pap",
      "ScDetail",
      "ScNote",
      "QcDetail",
      "QcNote",
      "CloseDetail",
      "CloseNote",
    ];

    // Find the first field that has an error
    const firstError = fieldOrder.find((field) => validateText[field]);

    if (firstError) {
      setFirstErrorField(firstError);

      // Handle scrolling for Accordions
      if (firstError === "Tu" && TuRef.current) {
        TuRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstError === "Dd" && DdRef.current) {
        DdRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setFirstErrorField(null);
    }
  }, [submitCount]);
  //=====================Validate================================//

  //=====================ซ่อนกล่องต่างๆตามประเภทเอกสาร=========================//
  const setVisibilityByReportType = (reportTypeCode: string) => {

    setIsTUHidden(["OBS"].includes(reportTypeCode));

    setIsDDHidden(["OBS", "CAR", "CPAR"].includes(reportTypeCode));

    setIsROOTHidden(["OBS"].includes(reportTypeCode));

    setIsCAHidden(["NCR", "OBS"].includes(reportTypeCode));

    setIsPAPHidden(["NCR", "OBS"].includes(reportTypeCode));

    setIsOBSAHidden(["NCR", "CAR", "CPAR"].includes(reportTypeCode));

  };

  //=======================================================================
  const ComplaintFile_Get = async (cf_type: "Explain" | "Close") => {
    // ตรวจสอบว่ามี dataelement?.id หรือไม่  ไม่error หากไม่มีไฟล์
    if (!dataelement?.id) return;
  
    // setIsLoadingScreen(true);
    const dataset = {
      explain_id: dataelement.id,
      complaint_id: dataelement.complaint_id,
      cf_type,
    };

    try {
      let response = await _POST(dataset, "/ComplaintFile/ComplaintFileGet");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        const responseData: any = [];

        if (Array.isArray(response.data) && response.data.length > 0) {
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

          if (cf_type === "Explain") {
            setexplainFiles(mappedFiles);
          } else {
            setcloseFiles(mappedFiles);
          }
        } else {
          // ✅ ไม่มีไฟล์ → ล้างเฉพาะ type นี้
          if (cf_type === "Explain") {
            setexplainFiles([]);
          } else {
            setcloseFiles([]);
          }
        }
      }
    } catch (e) {
      if (cf_type === "Explain") {
        setexplainFiles([]);
      } else {
        setcloseFiles([]);
      }
    } finally {
      setIsLoadingScreen(false);
    }
  };

//===================================================================================================

  // CheckBox Tool used
  const handleCheckboxChangeTU = (item: LovType) => {
    setdataToolUse((prev: LovType[] = []) => {
      let newData: LovType[];

      if (prev.some((t) => t.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter((t) => t.id !== item.id);

        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        if (item.lov2 === "Y") {
          setToolOther("");
        }
      } else {
        // เพิ่ม object แบบเต็ม
        newData = [...prev, item];
      }

      // สร้าง array ลดรูป
      const reducedArray = newData.map((t) => ({
        explain_tu_id: t.id,
        label: t.lov1,
        isOther: t.lov2,
      }));
      // อัปเดตเข้า context
      setdataToolUseValue(reducedArray);

      if (onToolUseChange) {
        onToolUseChange(newData); // ส่งค่าใหม่กลับไปให้ Parent
      }
      return newData;
    });
  };

  // Check Box DD
  const handleCheckboxChangeDD = (item: LovType) => {
    setdataDecision((prev: LovType[] = []) => {
      let newData: LovType[];

      if (prev.some((dd) => dd.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter((dd) => dd.id !== item.id);

        if (item.lov2 === "Y") {
          setDecisionOther("");
        }
      } else {
        // เพิ่ม object แบบเต็ม
        newData = [...prev, item];
      }

      // สร้าง array ลดรูปสำหรับ context
      const reducedArray = newData.map((dd) => ({
        explain_dd_id: dd.id,
        label: dd.lov1,
        isOther: dd.lov2,
      }));

      setdataDecisionValue(reducedArray);

      if (onDdChange) {
        onDdChange(newData); // ส่งค่าใหม่กลับไปให้ Parent
      }
      return newData;
    });
  };

  const setExplainDD = (data: any) => {
    const newData: any[] = [];
    Array.isArray(data) &&
      data.forEach((el) => {
        const filter = dataDecision_Combobox.find(
          (item: any) => item.id === el.explain_dd_id
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

  const handleFileChange = (fileArray: ComplaintFile[], cf_type: "Explain" | "Close") => {
    if (!fileArray || fileArray.length === 0) return;
    if (cf_type === "Explain") {
      setexplainFiles((prev: any) => [...prev, ...fileArray]);
    } else {
      setcloseFiles((prev: any) => [...prev, ...fileArray]);
    }
  };

  const handleRemoveFile = (index: number, cf_type: "Explain" | "Close") => {
    if (cf_type === "Explain") {
      setexplainFiles((prev: any) =>
        prev.filter((_: any, i: any) => i !== index)
      );
    } else {
      setcloseFiles((prev: any) =>
        prev.filter((_: any, i: any) => i !== index)
      );
    }
  };

  const getApproveDetailLabel = (approveData: any) => {
    if (!approveData) return "หมายเหตุการอนุมัติ";

    // Check lov2 for REJECT status as per user request
    if (approveData.lov2 === "REJECT") {
      return "หมายเหตุการปฏิเสธ";
    }
    else if (approveData.lov2 === "APPROVE") {
      return "หมายเหตุการอนุมัติ";
    }
  };

  const getCloseDetailLabel = (approveData: any) => {
    if (!approveData) return "หมายเหตุการปิด";

    // Check lov2 for REJECT status as per user request
    if (approveData.lov2 === "REJECT") {
      return "หมายเหตุการปฏิเสธ";
    }
    else if (approveData.lov2 === "APPROVE") {
      return "หมายเหตุการปิดรายการ";
    }
  };
  //===================================================================================================

  //ดึงไฟล์ที่เคยเพิ่มไว้ตอน Explain อีกครั้ง
  React.useEffect(() => {
    if (isActionExplainAdd && prevFiles && prevFiles.length > 0) {
      setexplainFiles(prevFiles);
      setcomplaintFiles(prevFiles);
    }
  }, [prevFiles, isActionExplainAdd]);

  //แสดงไฟล์ตอนดูข้อมูล
  React.useEffect(() => {
    if (!dataelement?.id) return;
  
    if (!isActionExplainAdd) {
     ComplaintFile_Get("Explain");
    }
    ComplaintFile_Get("Close");
  }, [dataelement?.id]);


  React.useEffect(() => {
    const updateData = async () => {
      // ================================
      // Map ค่า default ของ company
      // ================================
      if (
        Array.isArray(dataset_company) &&
        dataelement?.respondent_company_id
      ) {
        const mappedCompany = await setValueMas(
          dataset_company,
          dataelement.respondent_company_id,
          "company_id"
        );

        if (mappedCompany) {
          setrespondent_company_id(mappedCompany); // ค่า default ของ Combobox
        }
      }
      // ================================
      // Map ค่า default ของ department
      // ================================
      if (
        Array.isArray(dataset_department) &&
        dataelement?.respondent_department_id
      ) {
        const mappedDept = await setValueMas(
          dataset_department,
          dataelement.respondent_department_id,
          "department_id"
        );
        if (mappedDept) {
          setrespondent_department_id(mappedDept); // ค่า default ของ Combobox
        } else {
        }
      }

      // ถ้าไม่มี anything ที่จำเป็นก็ยังไม่ return ทันที — เราต้องการให้ logic พยายามทำงานเมื่อข้อมูลพร้อม
      // 1) เตรียม newDataset จาก dataset_reporttype (ถ้ามี)
      let newDataset: LovType[] | undefined = Array.isArray(dataset_reporttype_inactive)
        ? dataset_reporttype_inactive
        : undefined;

      // ถ้ามี dataset_reporttype และ dataelement ให้เรียก setValueMas เพื่อ map ค่า (safe)
      if (Array.isArray(dataset_reporttype_inactive) && dataelement) {
        try {
          const mapped = await setValueMas(
            dataset_reporttype_inactive,
            dataelement.report_type,
            "id"
          );
          // mapped อาจเป็น undefined หรือ array — ให้ใช้ mapped ถ้ามีค่าที่แตกต่างจากเดิม
          if (mapped && Array.isArray(mapped)) {
            // ถ้า different -> update state
            if (JSON.stringify(mapped) !== JSON.stringify(dataset_reporttype_inactive)) {
              setdataset_reporttype_inactive(mapped);
            }
            newDataset = mapped;
          } else {
            // ถ้า mapped เป็น object เดียว ๆ (กรณีฟังก์ชันคืน object) — เราอยากให้ newDataset เป็น array

            if (mapped && !Array.isArray(mapped)) {
              newDataset = Array.isArray(dataset_reporttype_inactive)
                ? dataset_reporttype_inactive
                : [mapped];
            }
          }
        } catch (err) {
          console.error("setValueMas error:", err);
        }
      }
      //==============================================================

      if (
        Array.isArray(dataset_department) &&
        dataelement?.responsible_department_id
      ) {
        const mappedDept = await setValueMas(
          dataset_department,
          dataelement.responsible_department_id,
          "department_id"
        );

        if (mappedDept) {
          setresponsible_department_id(mappedDept); // ค่า default ของ Combobox
        } else {
        }
      }
      // 2) ถ้า action === "Read" หรือ "Explain" และมี dataelement.report_type ให้หา default จาก newDataset (ถ้ามี)
      if (
        (!isActionAdd || !isActionRead || !isActionEdit || !isActionDelete) &&
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
        } else {
        }
      }

      // 4) ถ้ามี dataReportTypeValue (จาก state หรือ เพิ่ง set ข้างบน) ให้กรอง complaint/attach/reference
      const reportTypeToUse = dataReportTypeValue; // ใช้ state ปัจจุบัน (ซึ่งเราเพิ่งอาจจะ set)
      if (reportTypeToUse) {
        const val = reportTypeToUse;

        if (!isItAdmin) {
          const newFilteredScApprove = (dataApprove_Combobox || []).filter(
            (item: LovType) => item.lov_type === "approve_select"
          );
          setFilteredScApprove(newFilteredScApprove);
        }
        if (!isItAdmin) {
          const newFilteredQmrApprove = (dataApprove_Combobox || []).filter(
            (item: LovType) => item.lov_type === "approve_select"
          );
          setFilteredQmrApprove((prev: LovType[]) => {
            if (JSON.stringify(prev) !== JSON.stringify(newFilteredQmrApprove))
              return newFilteredQmrApprove;
            return prev;
          });
        }
        // // Follow-up approve options
        {
          const newFilteredCloseApprove = isItAdmin
            ? (dataApprove_Combobox || []).filter(
                (item: LovType) =>
                  item.lov_type === "approve_select" &&
                  item.lov_group == dataelement?.responsible_company_id
              )
            : (dataApprove_Combobox || []).filter(
                (item: LovType) => item.lov_type === "approve_select"
              );

          setFilteredCloseApprove((prev: LovType[]) => {
            if (JSON.stringify(prev) !== JSON.stringify(newFilteredCloseApprove))
              return newFilteredCloseApprove;
            return prev;
          });
        }

      const newFilteredToolUse =
        isItAdmin ?
          (dataToolUse_Combobox || []).filter(
            (item: LovType) => item.lov_type === "tool_use" && item.lov_group == dataelement?.responsible_company_id
          )
          :
          (dataToolUse_Combobox || []).filter(
            (item: LovType) => item.lov_type === "tool_use"
          )
        setFilteredTooluse((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredToolUse))
            return newFilteredToolUse;
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
          const newFilteredDecision =
            isItAdmin ?
              (dataDecision_Combobox || []).filter(
                (item: LovType) => item.lov_type === "decision_disposition" && item.lov_group == dataelement?.responsible_company_id
              )
              :
              (dataDecision_Combobox || []).filter(
                (item: LovType) => item.lov_type === "decision_disposition"
              )

          setFilteredDecision((prev: LovType[]) => {
            if (JSON.stringify(prev) !== JSON.stringify(newFilteredDecision))
              return newFilteredDecision;
            return prev;
          });
        } else {
          setFilteredDecision([]);
        }
      } else {
        // ถ้ายังไม่มี reportType ก็ reset
        setFilteredTooluse([]);
        setFilteredDecision([]);
        setFilteredQmrApprove([]);
        setFilteredScApprove([]);
        setFilteredphoto([]);
      }
    };

    updateData();
  }, [
    action,
    dataelement?.report_type, // ใช้ property เพื่อให้ effect รันเมื่อ report_type เปลี่ยน
    dataset_reporttype,
    dataset_reporttype_inactive,
    dataToolUse_Combobox,
    dataDecision_Combobox,
    dataphoto_Combobox,
    dataApprove_Combobox,
    dataReportTypeValue, // เพราะเรใช้ state นี้ต่อใน effect (และต้องการให้ flow ใช้ค่าล่าสุด)
    dataset_department,
    dataset_company,
  ]);

  //===================================================================================================
  //===================================================================================================
  //===================================================================================================

  ////////////////////////// Set ค่า User Approve  //////////////////////////
  React.useEffect(() => {
    if (!user?.[0]) return; // รอ user โหลดก่อน

    // Variable
    const uidCompanyId = String(user[0].itasset_company_id ?? "");
    const uidDeptId = String(user[0].itasset_department_id ?? "");

    //==========================================================================

    // helper เพื่อหาจาก dataset ที่อาจมีคีย์ต่างกัน (itasset_company_id / company_id)
    const findCompany = (id: string) =>
      (Array.isArray(dataset_company) ? dataset_company : []).find(
        (c: any) =>
          String(c.itasset_company_id ?? c.company_id ?? "") === String(id)
      );
    const findDepartment = (id: string) =>
      (Array.isArray(dataset_department) ? dataset_department : []).find(
        (d: any) =>
          String(d.itasset_department_id ?? d.department_id ?? "") ===
          String(id)
      );

    //==========================================================================

    if (
      isActionExplainApproveScAdd ||
      isActionExplainApproveQcAdd ||
      isActionCloseAdd
    ) {
      setapprove_name(user[0].employee_username || "");
      setclose_name(user[0].employee_username || "");
      setapprove_position(user[0].employee_position || "");
      setclose_position(user[0].employee_position || "");
      setapprove_email(user[0].employee_email || "");
      setclose_email(user[0].employee_email || "");
      setapprove_date(dayjs());
      setqcapprove_date(dayjs());
      setclose_date(dayjs());

      const userCompany = findCompany(uidCompanyId);
      if (userCompany) setapprove_company_id(userCompany);
      if (userCompany) setclose_company_id(userCompany);

      const userDept = findDepartment(uidDeptId);
      if (userDept) setapprove_department_id(userDept);
      if (userDept) setclose_department_id(userDept);
    }
    else if (dataelement) {
      // ถ้า dataelement มี company/department ให้แมปกับ dataset (ถ้า available)
      if (dataelement.approve_company_id && Array.isArray(dataset_company)) {
        const compId =
          typeof dataelement.approve_company_id === "object"
            ? String(dataelement.approve_company_id.company_id ?? "")
            : String(dataelement.approve_company_id);
        const matched = findCompany(compId);
        if (matched) setapprove_company_id(matched);
        else setapprove_company_id(dataelement.approve_company_id);
      }

      if (
        dataelement.approve_department_id &&
        Array.isArray(dataset_department)
      ) {
        const deptId =
          typeof dataelement.approve_department_id === "object"
            ? String(dataelement.approve_department_id.department_id ?? "")
            : String(dataelement.approve_department_id);
        const matchedD = findDepartment(deptId);
        if (matchedD) setapprove_department_id(matchedD);
        else setapprove_department_id(dataelement.approve_department_id);
      }
    }
  }, [
    isActionExplainApproveScAdd,
    isActionExplainApproveQcAdd,
    isActionCloseAdd,
    isActionClose,
    dataset_company,
    dataset_department,
    dataelement,
    approveList,
  ]);

  //////////////////////// Read //////////////////////////
  React.useEffect(() => {
    if (
      dataelement &&
       (isActionExplainAdd ||
        isActionExplainRead ||
        isActionReadExplain ||
        isActionExplainApproveScAdd ||
        isActionExplainApproveQcAdd ||
        isActionCloseHistory ||
        isActionExplainReadApproveSc ||
        isActionExplainApproveScRead ||
        isActionExplainReadApproveQc ||
        isActionExplainApproveQcRead ||
        isActionClose ||
        isActionCloseAdd ||
        isActionReadClose)
    ) {
      // Set basic information
      setresponsible_name(
        dataelement?.responsible_name || dataelement?.request_name || ""
      );

      // Set company with null checks
      if (dataelement?.responsible_company_id) {
        const company = dataset_company?.find(
          (el: any) =>
            String(el.company_id) === String(dataelement.responsible_company_id)
        );
        if (company) {
          setresponsible_company_id(company);
        }
      }

      // Set other fields with proper null checks
      setresponsible_position(dataelement?.responsible_position || "");
      setresponsible_email(dataelement?.responsible_email || "");

      // Set dates with proper validation
      if (dataelement?.responsible_date) {
        setresponsible_date(dayjs(dataelement.responsible_date));
      }
      if (dataelement?.follow_up_date) {
        setfollow_up_date(dayjs(dataelement.follow_up_date));
      }

      //หาค่าลำดับขั้นการอนุมัติจาก approveList
      const TempscApprove = approveList?.find(
        (x: any) => x.explain_id === dataelement?.id && x.approve_seq === 1
      );
      const TempqmrApprove = approveList?.find(
        (x: any) => x.explain_id === dataelement?.id && x.approve_seq === 2
      );
      
      // Set explain fields
      setobservation_analysis(dataelement?.observation_analysis || "");
      setroot_cause(dataelement?.root_cause || "");
      setcorrective_action(dataelement?.corrective_action || "");
      setpreventive_action_plan(dataelement?.preventive_action_plan || "");

      if (!isActionExplainApproveScAdd) {
        const company =
          dataset_company?.find(
            (c: any) =>
              Number(c.company_id) === Number(TempscApprove?.approve_company_id)
          ) || null;
        setapprove_company_id(company);
        const department =
          dataset_department?.find(
            (c: any) =>
              Number(c.department_id) ===
              Number(TempscApprove?.approve_department_id)
          ) || null;
        setapprove_department_id(department);
        setdataSectionapp(
          dataApprove_Combobox.find(
            (item: any) => item.lov_code === TempscApprove?.approve_status
          ) || null
        );
        setapprove_name(TempscApprove?.approve_name || "");
        setapprove_company_id;
        setapprove_position(TempscApprove?.approve_position || "");
        setapprove_email(TempscApprove?.approve_email || "");
        if (TempscApprove?.approve_date) {
          setapprove_date(dayjs(TempscApprove.approve_date));
        }
        setapprove_detail(TempscApprove?.approve_detail || "");
        setapprove_note(TempscApprove?.approve_note || "");
      }
      
      if (dataelement) {
        const TempReportTypeobj = dataset_reporttype_inactive?.find(
          (item: LovType) =>
            item.id === dataelement.report_type ||
            item.lov_code === dataelement.report_type
        );
        if (TempReportTypeobj) {
          setVisibilityByReportType(TempReportTypeobj.lov_code);
        }
      }

      // Load QC approve data from dataelement (for CloseAdd mode)
      if (isActionCloseAdd || isActionClose || isActionCloseHistory) {
        // Set QC approve name
        if (TempqmrApprove?.approve_name) {
          setqcapprove_name(TempqmrApprove.approve_name);
        }

        // Set QC approve company
        if (TempqmrApprove?.approve_company_id) {
          const qmrCompany = dataset_company?.find(
            (el: any) =>
              String(el.company_id) === String(TempqmrApprove.approve_company_id)
          );
          if (qmrCompany) {
            setqcapprove_company_id(qmrCompany);
          }
        }

        // Set QC approve department
        if (TempqmrApprove?.approve_department_id) {
          const qmrDepartment = dataset_department?.find(
            (el: any) =>
              String(el.department_id) ===
              String(TempqmrApprove.approve_department_id)
          );
          if (qmrDepartment) {
            setqcapprove_department_id(qmrDepartment);
          }
        }

        // Set QC approve radio (dataQcapp) with filtering logic      
        let result = null;

        if (isItAdmin) {
          // ✅ เฉพาะ IT Admin: กรองตาม approve_company_id → lov_group
          const approveCompanyId = TempqmrApprove?.approve_company_id;

          result =
            dataApprove_Combobox
              .filter((item: any) => Number(item.lov_group) === Number(approveCompanyId))
              .find((item: any) => item.lov_code === TempqmrApprove?.approve_status) || null;

        } else {
          // ✅ แบบเดิม: จับแค่ lov_code
          result =
            dataApprove_Combobox.find(
              (item: any) => item.lov_code === TempqmrApprove?.approve_status
            ) || null;
        }

        setdataQcapp(result);

        // Set other QC approve fields
        if (TempqmrApprove?.approve_position) {
          setqcapprove_position(TempqmrApprove.approve_position);
        }
        if (TempqmrApprove?.approve_email) {
          setqcapprove_email(TempqmrApprove.approve_email);
        }
        if (TempqmrApprove?.approve_date) {
          setqcapprove_date(dayjs(TempqmrApprove.approve_date));
        }
        if (TempqmrApprove?.approve_detail) {
          setqcapprove_detail(TempqmrApprove.approve_detail);
        }
        if (TempqmrApprove?.approve_note) {
          setqcapprove_note(TempqmrApprove.approve_note);
        }
      }
      setTempDataSC(TempscApprove || null);
      setTempDataQMR(TempqmrApprove || null);

      // Filter SC Approve
      const scFiltered = isItAdmin
        ? dataApprove_Combobox.filter(
          (item: any) =>
            item.lov_type === "approve_select" &&
            item.lov_group == (TempscApprove?.approve_company_id ?? "")
        )
        : dataApprove_Combobox.filter(
          (item: any) => item.lov_type === "approve_select"
        );

      setFilteredScApprove(scFiltered);

      // Filter QMR Approve
      const qmrFiltered = isItAdmin
        ? (
          TempqmrApprove?.approve_company_id
            ? dataApprove_Combobox.filter(
              (item: any) =>
                item.lov_type === "approve_select" &&
                item.lov_group == TempqmrApprove.approve_company_id
            )
            : dataApprove_Combobox.filter(
              (item: any) => item.lov_type === "approve_select"
            )
        )
        : dataApprove_Combobox.filter(
          (item: any) => item.lov_type === "approve_select"
        );
      setFilteredQmrApprove(qmrFiltered);

      // Filter close Approve
      const closeFiltered = isItAdmin
        ? (dataApprove_Combobox || []).filter(
          (item: any) =>
            item.lov_type === "approve_select" &&
            item.lov_group == dataelement?.responsible_company_id
        )
        : (dataApprove_Combobox || []).filter(
          (item: any) => item.lov_type === "approve_select"
        );
      setFilteredCloseApprove(closeFiltered);

    }
  }, [
    dataelement,
    dataset_reporttype,
    dataset_department,
    dataset_company,
    dataApprove_Combobox,
    isActionCloseAdd,
    isActionClose,
    isActionCloseHistory,
    approveList,
  ]);

  const selectedClose = React.useMemo(() => {
    if (!explainList?.length || !dataelement) return null;
    if (isActionCloseAdd) return

    // 👉 PRIORITY 1: Return (ต้องมี dataelement ก่อน)
    if (dataelement) {
      const returnItem = explainList.find(
        (x: any) =>
          x.id === dataelement.id &&
          ["REJECT", "ADD"].includes(x.close_status)
      );

      if (returnItem) {
        return { type: "RETURN", data: returnItem };
      }
    }

    // 👉 PRIORITY 2: Close ปกติ
    return { type: "CLOSE", data: explainList[0] };

  }, [explainList, dataelement, action]);


  React.useEffect(() => {
    if (!selectedClose) return;

    if (selectedClose.type === "RETURN") {
      const c = selectedClose.data;

      setTempDataReturnClose((prev: any) =>
        prev?.id === c.id ? prev : c
      );
      setclose_name(c.return_name ?? "");
      setclose_company_id(
        dataset_company.find((x: any) => Number(x.company_id) === c.return_company_id) || null
      );
      setclose_department_id(
        dataset_department.find((x: any) => Number(x.department_id) === c.return_department_id) || null
      );
      setclose_position(c.return_position ?? "");
      setclose_email(c.return_email ?? "");
      setclose_date(c.return_datetime ? dayjs(c.return_datetime) : null);
      setfollowup_approve(
        isItAdmin
          ? dataApprove_Combobox.find(
              (x: any) =>
                x.lov_code === c.close_status &&
                x.lov_group == dataelement?.responsible_company_id
            ) || null
          : dataApprove_Combobox.find((x: any) => x.lov_code === c.close_status) || null
      );
      setclose_detail(c.return_detail ?? "");
      setclose_note(c.return_note ?? "");
      return;
    }

    if (selectedClose.type === "CLOSE") {
      const c = selectedClose.data;

      setclose_name(c.close_name || "");
      setclose_company_id(
        dataset_company.find((x: any) => Number(x.company_id) === c.close_company_id) || null
      );
      setclose_department_id(
        dataset_department.find((x: any) => Number(x.department_id) === c.close_department_id) || null
      );
      setclose_position(c.close_position || "");
      setclose_email(c.close_email || "");
      setclose_date(dayjs(c.close_date));
      setfollowup_approve(
        isItAdmin
          ? dataApprove_Combobox.find(
              (x: any) =>
                x.lov_code === c.close_status &&
                x.lov_group == dataelement?.responsible_company_id
            ) || null
          : dataApprove_Combobox.find((x: any) => x.lov_code === c.close_status) || null
      );
      setclose_detail(c.close_detail || "");
      setclose_note(c.close_note || "");
      
    }
  }, [
    selectedClose,
    dataset_company,
    dataset_department,
    dataApprove_Combobox
  ]);


  const closeAddInitRef = React.useRef(false);

  React.useEffect(() => {
    if (action !== "CloseAdd") {
      closeAddInitRef.current = false;
      return;
    }

    if (
      closeAddInitRef.current ||
      !user?.length ||
      !dataset_company?.length ||
      !dataset_department?.length
    ) {
      return;
    }

    closeAddInitRef.current = true;

    setclose_name(user[0]?.employee_username ?? "");

    setclose_company_id(
      dataset_company.find(
        (c: any) => Number(c.company_id) === user[0]?.itasset_company_id
      ) || null
    );

    setclose_department_id(
      dataset_department.find(
        (d: any) => Number(d.department_id) === user[0]?.itasset_department_id
      ) || null
    );

    setclose_position(user[0]?.employee_position ?? "");
    setclose_email(user[0]?.employee_email ?? "");
    setclose_date(dayjs());

  }, [action, user, dataset_company, dataset_department]);

  React.useEffect(() => {
    if (!dataelement) return;
    
    // 🔥 ถ้า record นี้ "ไม่มี explain" → reset แล้วจบ
    if (!dataelement?.explainTu) {
      setdataToolUse([]);
      setdataToolUseValue([]);
      setToolOther("");
      return;
    }

    const isComboReady =
      Array.isArray(dataToolUse_Combobox) && dataToolUse_Combobox.length > 0;
    if (!isComboReady) return;

    const rawTU = Array.isArray(dataelement?.explainTu)
      ? dataelement.explainTu
      : [];

    const tu = setExplainTU(rawTU);
    setdataToolUse(tu);

    setdataToolUseValue(
      tu.map((t) => ({
        explain_tu_id: t.id,
        label: t.lov1,
        isOther: t.lov2,
      }))
    );

    const otherTU = tu.find((el: any) => el.lov2 === "Y");
    setToolOther(otherTU?.other || "");
  }, [dataelement, dataToolUse_Combobox]);

  React.useEffect(() => {
    if (!dataelement) return;
    
    if (!dataelement?.explainDd) {
      setdataDecision([]);
      setdataDecisionValue([]);
      setDecisionOther("");
      return;
    }

    const isDecisionComboReady =
      Array.isArray(dataDecision_Combobox) &&
      dataDecision_Combobox.length > 0;
    if (!isDecisionComboReady) return;

    const rawDD = Array.isArray(dataelement?.explainDd)
      ? dataelement.explainDd
      : [];

    const dd = setExplainDD(rawDD);
    setdataDecision(dd);

    setdataDecisionValue(
      dd.map((d) => ({
        explain_dd_id: d.id,
        label: d.lov1,
        isOther: d.lov2,
      }))
    );

    const otherDD = dd.find((el: any) => el.lov2 === "Y");
    setDecisionOther(otherDD?.other || "");
  }, [dataelement, dataDecision_Combobox]);


  const setExplainTU = (data: any) => {

    const newData: any[] = [];
    if (Array.isArray(data)) {
      data.forEach((el, index) => {
        const targetId =
          (el &&
            (el.explain_tu_id || el.tool_use_id || el.tooluse_id || el.id)) ??
          null;

        const filter = dataToolUse_Combobox.find(
          (item: any) => String(item.id) === String(targetId)
        );

        if (filter) {
          const processedItem = {
            ...filter,
            other: el.other || "", // ⭐ เก็บค่าข้อความ Other มาด้วย
          };
          newData.push(processedItem);
        } else {
        }
      });
    } else {
    }
    return newData;
  };

  
  const checkQMRCondition = () => {
    let currentReportType = dataset_reporttype_inactive?.find(
      (item: any) =>
        item.id === dataelement?.report_type ||
        item.lov_code === dataelement?.report_type
    );
    
    if ( currentReportType.lov5) {
      const levels = String(currentReportType.lov5).split(',');
      return levels.length > 1;
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: "2px solid #F29739",
        borderRadius: 2,
        backgroundColor: "#ffffff",
      }}
    >
      <div className="px-2 pt-2 pb-5">
        <label className="sarabun-regular-datatable">
          สำหรับผู้รับผิดชอบหรือหน่วยงานที่เกี่ยวข้อง
        </label>
      </div>
      <Divider sx={{ my: 0.1, borderColor: "#F29739" }} />
      <Grid container spacing={2} mt={2}></Grid>

      {/* ====== Dynamic ฟอร์ม สำหรับเลือกประเภทเอกสาร ====== */}
      {!isFormHidden &&
        (isActionExplainAdd ||
          isActionReadExplain ||
          isActionExplainRead ||
          isActionExplainReadApproveSc ||
          isActionExplainApproveScRead ||
          isActionExplainReadApproveQc ||
          isActionReadClose ||
          isActionCloseHistory ||
          isActionExplainApproveScAdd ||
          isActionExplainApproveQcAdd ||
          isActionExplainApproveQcRead ||
          isActionCloseAdd) && (
          <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
            <label 
                className="sarabun-regular-datatable"
                style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
                margin: 0,
              }}>
              {dataReportTypeValue?.lov4}
            </label>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Accordion
                expanded={isMinimizeexplainOpen}
                onChange={() =>
                  setisMinimizeExplainOpen(!isMinimizeexplainOpen)
                }
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #ffebeb 0%, #ffffff 100%)",
                  border: "1px solid #f44336",
                  boxShadow: "0 4px 12px rgba(244,67,54,0.1)",
                }}
              >
                {/* 🔹 หัวข้อ */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#f44336" }} />}
                  aria-controls="dept-content"
                  id="dept-header"
                  sx={{ px: 2 }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 2,
                        px: 2,
                        borderBottom: "none", // 👈 ปิดไว้ก่อน
                        ".Mui-expanded &": {
                        borderBottom: "2px solid #f44336", // 👈 แสดงเฉพาะตอนเปิด
                        },
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
                      <Typography
                        className="sarabun-regular-datatable"
                        sx={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: "#d32f2f",
                        }}
                      >
                        ข้อมูลผู้ชี้แจง
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={
                        isActionExplainAdd
                          ? user[0]?.employee_username || "-"
                          : responsible_name ||
                          dataelement?.responsible_name ||
                          "-"
                      }
                      labelName="ชื่อผู้ดำเนินการ (Responsible Person)"
                      onchange={(e) => setresponsible_name(e.target.value)}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={
                        isActionExplainAdd
                          ? user[0]?.itasset_company_name || "-"
                          : (responsible_company_id as any)?.company_name || "-"
                      }
                      labelName="บริษัท (Company)"
                      onchange={(e) =>
                        setresponsible_company_id(e.target.value)
                      }
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={
                        isActionExplainAdd
                          ? user[0]?.itasset_department_name || "-"
                          : (responsible_department_id as any)
                            ?.department_name ||
                          dataelement?.responsible_department_id ||
                          "-"
                      }
                      labelName="แผนก (Department)"
                      onchange={(e) =>
                        setresponsible_department_id(e.target.value)
                      }
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={
                        isActionExplainAdd
                          ? user[0]?.employee_position || "-"
                          : responsible_position ||
                          dataelement?.responsible_position ||
                          "-"
                      }
                      labelName="ตำแหน่ง (Position)"
                      onchange={(e) => setresponsible_position(e.target.value)}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={
                        isActionExplainAdd
                          ? user[0]?.employee_email || "-"
                          : responsible_email ||
                          dataelement?.responsible_email ||
                          "-"
                      }
                      labelName="อีเมล (Email)"
                      onchange={(e) => setresponsible_email(e.target.value)}
                      bgcolorTextField={isActionExplainAdd ? false : true}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <DesktopDatePickers
                      labelName={"วันที่ชี้แจง (Date)"}
                      value={responsible_date}
                      handleChange={(val) => setresponsible_date(val ?? null)}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <DesktopDatePickers
                      required="required"
                      labelName={"กำหนดวันตรวจติดตามผลวันที่ (Follow-up Date)"}
                      value={follow_up_date}
                      handleChange={(val) => {
                        setfollow_up_date(val ?? null);
                        if (onFollowUpDateChange) {
                          onFollowUpDateChange(val);
                        }
                      }}
                      bgcolorTextField={isActionAdd ? false : true}
                      readonly={!isFollowUpDate}
                      Validate={validateText?.Follow_up_Date || false}
                      validateTextLable={
                        validateText?.Follow_up_Date
                          ? "กรุณาเลือกวันที่ตรวจติดตามผล"
                          : ""
                      }
                      shouldFocusError={firstErrorField === "Follow_up_Date"}
                      submitCount={submitCount}
                      minDate={dayjs()}
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
                    {!isTUHidden && dataReportTypeValue && (
                      <Grid size={12}>
                        <Accordion
                          expanded={isMinimizetoolOpen}
                          onChange={() =>
                            setisMinimizeToolOpen(!isMinimizetoolOpen)
                          }
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            border: validateText?.Tu
                              ? "1px solid #f44336"
                              : "1px solid #e0e0e0",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="complaint-type-content"
                            id="complaint-type-header"
                            ref={TuRef}
                          >
                            <Typography
                              className="sarabun-regular-datatable"
                              sx={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#333",
                              }}
                            >
                              เครื่องมือที่ใช้ (Tools Used)
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
                                {(filteredTooluse || []).map(
                                  (item: LovType) => (
                                    <Grid size={3} key={item.id}>
                                      <FullWidthCheckbox
                                        labelName={item.lov1}
                                        value={(dataTooluse || []).some(
                                          (t: any) => t.id === item.id
                                        )}
                                        onchange={() =>
                                          handleCheckboxChangeTU(item)
                                        }
                                        readonly={!isActionExplainAdd}
                                        Validate={validateText?.Tu || false}
                                      />
                                    </Grid>
                                  )
                                )}
                              </Grid>
                              <Box sx={{ mt: "auto", pt: 2 }}>
                                {(dataTooluse || []).some(
                                  (t: any) => t.lov2 === "Y"
                                ) && (
                                    <FullWidthTextArea
                                      value={ToolOther}
                                      labelName="Other:"
                                      placeholderlabel="กรุณากรอกรายละเอียด"
                                      onchange={(e) => {
                                        setToolOther(e);
                                        if (onToolOtherChange) {
                                          onToolOtherChange(e);
                                        }
                                      }}
                                      bgcolorTextField={
                                        isActionExplainAdd
                                          ? false
                                          : isActionEdit
                                            ? false
                                            : true
                                      }
                                      readonly={!isActionExplainAdd}
                                      Validate={validateText?.Tuother || false}
                                      validateTextLable={
                                        validateText?.Tuother
                                          ? "กรุณากรอกรายละเอียดอื่นๆ (Tools Used)"
                                          : ""
                                      }
                                      shouldFocusError={firstErrorField === "Tuother"}
                                      submitCount={submitCount}

                                    />
                                  )}
                              </Box>
                            </Box>
                            {validateText?.Tu && (
                              <label
                                className="fs-7 py-1 sarabun-regular-lable-validate"
                                style={{ color: "red" }}
                              >
                                กรุณาเลือกเครื่องมือที่ใช้ (Tools Used)
                              </label>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    )}

                    {!isDDHidden && dataReportTypeValue && (
                      <Grid size={12}>
                        <Accordion
                          expanded={isMinimizeddOpen}
                          onChange={() =>
                            setisMinimizeDdOpen(!isMinimizeddOpen)
                          }
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            border: validateText?.Dd
                              ? "1px solid #f44336"
                              : "1px solid #e0e0e0",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="reference-standard-content"
                            id="reference-standard-header"
                            ref={DdRef}
                          >
                            <Typography
                              className="sarabun-regular-datatable"
                              sx={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#333",
                              }}
                            >
                              การตัดสินใจเกี่ยวกับแนวทางการจัดการ (Decision on Disposition)
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
                                {filteredDecision.map((item: LovType) => (
                                  <Grid size={3} key={item.id}>
                                    <FullWidthCheckbox
                                      labelName={item.lov1}
                                      value={dataDecision.some(
                                        (dd: any) => dd.id === item.id
                                      )}
                                      onchange={() =>
                                        handleCheckboxChangeDD(item)
                                      }
                                      readonly={!isActionExplainAdd}
                                      Validate={validateText?.Dd || false}
                                    />
                                  </Grid>
                                ))}
                              </Grid>

                              <Box sx={{ mt: "auto", pt: 2 }}>
                                {dataDecision.some(
                                  (t: any) => t.lov2 === "Y"
                                ) && (
                                    <FullWidthTextArea
                                      value={DecisionOther}
                                      labelName="Other:"
                                      placeholderlabel="กรุณากรอกรายละเอียด"
                                      onchange={(e) => {
                                        setDecisionOther(e);
                                        if (onDecisionOtherChange) {
                                          onDecisionOtherChange(e);
                                        }
                                      }}
                                      bgcolorTextField={
                                        isActionAdd
                                          ? false
                                          : isActionEdit
                                            ? false
                                            : isActionExplainAdd
                                              ? false
                                              : true
                                      }
                                      readonly={!isActionExplainAdd}
                                      Validate={validateText?.Ddother || false}
                                      validateTextLable={
                                        validateText?.Ddother
                                          ? "กรุณากรอกรายละเอียดอื่นๆ (Decision on Disposition)"
                                          : ""
                                      }
                                      shouldFocusError={firstErrorField === "Ddother"}
                                      submitCount={submitCount}
                                    />
                                  )}
                              </Box>
                            </Box>
                            {validateText?.Dd && (
                              <label
                                className="fs-7 py-1 sarabun-regular-lable-validate"
                                style={{ color: "red" }}
                              >
                                กรุณาเลือกการตัดสินใจเกี่ยวกับแนวทางการจัดการ (Decision on Disposition)
                              </label>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    )}
                  </Grid>
                  {!isOBSAHidden && dataReportTypeValue && (
                    <Accordion
                      expanded={isMinimizeobservOpen}
                      onChange={() =>
                        setisMinimizeObservOpen(!isMinimizeobservOpen)
                      }
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                        mt: 2, // <-- เพิ่ม margin-top
                        border: validateText?.ObsAnaly
                          ? "1px solid #f44336"
                          : "1px solid #e0e0e0",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="detail-content"
                        id="detail-header"
                      >
                        <Typography
                          className="sarabun-regular-datatable"
                          sx={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          การวิเคราะห์เบื้องต้นของข้อสังเกต (Observation Analysis)
                          <span style={{ color: "red" }}> *</span>
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Box sx={{ mt: -3 }}>
                          <Divider sx={{ my: 1 }} />
                          <Grid
                            container
                            spacing={2}
                            sx={{
                              justifyContent: "center",
                              alignItems: "flex-start",
                            }}
                          >
                            <Grid size={12}>
                              <FullWidthTextArea
                                value={observation_analysis}
                                labelName=""
                                placeholderlabel="กรุณากรอกรายละเอียด"
                                onchange={(e) => {
                                  setobservation_analysis(e);
                                  if (onObsAnalyChange) {
                                    onObsAnalyChange(e);
                                  }
                                }}
                                bgcolorTextField={
                                  isActionExplainAdd
                                    ? false
                                    : isActionEdit
                                      ? false
                                      : true
                                }
                                readonly={!isActionExplainAdd}
                                Validate={validateText?.ObsAnaly || false}
                                validateTextLable={
                                  validateText?.ObsAnaly
                                    ? "กรุณากรอกการวิเคราะห์เบื้องต้นของข้อสังเกต"
                                    : ""
                                }
                                shouldFocusError={firstErrorField === "ObsAnaly"}
                                submitCount={submitCount}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {!isROOTHidden && dataReportTypeValue && (
                    <Accordion
                      expanded={isMinimizerootOpen}
                      onChange={() =>
                        setisMinimizeRootOpen(!isMinimizerootOpen)
                      }
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                        mt: 2, // <-- เพิ่ม margin-top
                        border: validateText?.Rc
                          ? "1px solid #f44336"
                          : "1px solid #e0e0e0",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="detail-content"
                        id="detail-header"
                      >
                        <Typography
                          className="sarabun-regular-datatable"
                          sx={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          คำอธิบายการวิเคราะห์ (Root Cause)
                          <span style={{ color: "red" }}> *</span>
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Box sx={{ mt: -3 }}>
                          <Divider sx={{ my: 1 }} />
                          <Grid
                            container
                            spacing={2}
                            sx={{
                              justifyContent: "center",
                              alignItems: "flex-start",
                            }}
                          >
                            <Grid size={12}>
                              <FullWidthTextArea
                                value={root_cause}
                                labelName=""
                                placeholderlabel="กรุณากรอกรายละเอียด"
                                onchange={(e) => {
                                  setroot_cause(e);
                                  if (onRootCauseChange) {
                                    onRootCauseChange(e);
                                  }
                                }}
                                bgcolorTextField={
                                  isActionAdd
                                    ? false
                                    : isActionEdit
                                      ? false
                                      : isActionExplainAdd
                                        ? false
                                        : true
                                }
                                readonly={!isActionExplainAdd}
                                Validate={validateText?.Rc || false}
                                validateTextLable={
                                  validateText?.Rc
                                    ? "กรุณากรอกคำอธิบายการวิเคราะห์ (Root Cause)"
                                    : ""
                                }
                                shouldFocusError={firstErrorField === "Rc"}
                                submitCount={submitCount}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {!isCAHidden && dataReportTypeValue && (
                    <Accordion
                      expanded={isMinimizecaOpen}
                      onChange={() => setisMinimizeCaOpen(!isMinimizecaOpen)}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                        mt: 2, // <-- เพิ่ม margin-top
                        border: validateText?.Ca
                          ? "1px solid #f44336"
                          : "1px solid #e0e0e0",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="detail-content"
                        id="detail-header"
                      >
                        <Typography
                          className="sarabun-regular-datatable"
                          sx={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          การดำเนินการแก้ไข (Corrective Action)
                          <span style={{ color: "red" }}> *</span>
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Box sx={{ mt: -3 }}>
                          <Divider sx={{ my: 1 }} />
                          <Grid
                            container
                            spacing={2}
                            sx={{
                              justifyContent: "center",
                              alignItems: "flex-start",
                            }}
                          >
                            <Grid size={12}>
                              <FullWidthTextArea
                                value={corrective_action}
                                labelName=""
                                placeholderlabel="กรุณากรอกรายละเอียด"
                                onchange={(e) => {
                                  setcorrective_action(e);
                                  if (onCorrectiveActionChange) {
                                    onCorrectiveActionChange(e);
                                  }
                                }}
                                bgcolorTextField={
                                  isActionAdd
                                    ? false
                                    : isActionEdit
                                      ? false
                                      : isActionExplainAdd
                                        ? false
                                        : true
                                }
                                readonly={!isActionExplainAdd}
                                Validate={validateText?.Ca || false}
                                validateTextLable={
                                  validateText?.Ca
                                    ? "กรุณากรอกการดำเนินการแก้ไข (Corrective Action)"
                                    : ""
                                }
                                shouldFocusError={firstErrorField === "Ca"}
                                submitCount={submitCount}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {!isPAPHidden && dataReportTypeValue && (
                    <Accordion
                      expanded={isMinimizepapOpen}
                      onChange={() => setisMinimizePapOpen(!isMinimizepapOpen)}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                        mt: 2, // <-- เพิ่ม margin-top
                        border: validateText?.Pap
                          ? "1px solid #f44336"
                          : "1px solid #e0e0e0",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="detail-content"
                        id="detail-header"
                      >
                        <Typography
                          className="sarabun-regular-datatable"
                          sx={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          แผนการป้องกันไม่ให้ปัญหาเกิดขึ้นซ้ำ (Preventive Action Plan)
                          <span style={{ color: "red" }}> *</span>
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Box sx={{ mt: -3 }}>
                          <Divider sx={{ my: 1 }} />
                          <Grid
                            container
                            spacing={2}
                            sx={{
                              justifyContent: "center",
                              alignItems: "flex-start",
                            }}
                          >
                            <Grid size={12}>
                              <FullWidthTextArea
                                value={preventive_action_plan}
                                labelName=""
                                placeholderlabel="กรุณากรอกรายละเอียด"
                                onchange={(e) => {
                                  setpreventive_action_plan(e);
                                  if (onPreventiveActionPlanChange) {
                                    onPreventiveActionPlanChange(e);
                                  }
                                }}
                                bgcolorTextField={
                                  isActionAdd
                                    ? false
                                    : isActionEdit
                                      ? false
                                      : isActionExplainAdd
                                        ? false
                                        : true
                                }
                                readonly={!isActionExplainAdd}
                                Validate={validateText?.Pap || false}
                                validateTextLable={
                                  validateText?.Pap
                                    ? "กรุณากรอกแผนการป้องกันไม่ให้ปัญหาเกิดขึ้นซ้ำ (Preventive Action Plan)"
                                    : ""
                                }
                                shouldFocusError={firstErrorField === "Pap"}
                                submitCount={submitCount}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* ไฟล์ */}
                  <Accordion
                    expanded={isMinimizefileOpen}
                    onChange={() => setisMinimizeFileOpen(!isMinimizefileOpen)}
                    sx={{
                      borderRadius: 1,
                      background:
                        "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                      border: "1px solid #616161",
                      boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
                      mt: 3,
                    }}
                  >
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
                        borderBottom: isMinimizefileOpen ? "2px solid #616161" : "none",
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
                            sx={{
                              fontSize: 18,
                              fontWeight: 600,
                              color: "#524f4fff",
                            }}
                          >
                            แนบไฟล์ (Attachments)
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        {
                          <Grid size={12}>
                            {(isActionExplainAdd) && !isViewMode && (
                              <BrowseFileUpload
                                setFile={(files) => handleFileChange(files, "Explain")}
                                setFileName={() => { }}
                                options={(filteredphoto || []).map((p: any) => ({
                                  id: p.id,
                                  lov1: p.lov1,
                                  lov2: p.lov2,
                                  isOther: p.lov2,
                                  lov_code: "CheckTypeFileImage",
                                }))}
                                grouped={grouped}
                                action={action}
                                isViewMode={isViewMode}
                              />
                            )}
                            <Box sx={{ mt: 1 }}>
                              {(filteredphoto || []).map((photoType: any) => {
                                const items = explainFiles.filter(
                                  (f: any) => f.attachmentType === photoType.id
                                );
                                if (items.length === 0) return null;
                                return (
                                  <Paper
                                    key={photoType.id}
                                    elevation={1}
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      mb: 2,
                                      width: "100%",
                                    }}
                                  >
                                    <label
                                      className="sarabun-regular-datatable"
                                      style={{
                                        fontWeight: 600,
                                        fontSize: "16px",
                                      }}
                                    >
                                      {photoType.lov1}
                                    </label>
                                    <Divider sx={{ my: 1 }} />
                                    {items.map((item: any, idx: any) => (
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
                                            {item.file.size < 1024 * 1024
                                              ? `${(item.file.size / 1024).toFixed(2)} KB`
                                              : `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`}
                                          </div>
                                          {photoType.lov2 === "Y" && (
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
                                          {(isActionEdit ||
                                            isActionAdd ||
                                            isActionAdd ||
                                            isActionExplainAdd) && (
                                              <IconButton
                                                color="error"
                                                onClick={() => {
                                                  // หา index ที่ถูกต้องใน fileList
                                                  const actualIndex =
                                                    explainFiles.findIndex(
                                                      (f: any) =>
                                                        f.file.name ===
                                                        item.file.name &&
                                                        f.attachmentType ===
                                                        item.attachmentType
                                                    );
                                                  if (actualIndex !== -1) {
                                                    handleRemoveFile(actualIndex, "Explain");
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
                                              // ตรวจสอบว่าเป็นไฟล์ใหม่ (ไม่มี full_path) หรือไฟล์เก่า (มี full_path)
                                              if (item.full_path) {
                                                // ไฟล์เก่า - เปิดจาก NAS
                                                window.open(
                                                  item.full_path,
                                                  "_blank"
                                                );
                                              } else if (
                                                item.file instanceof File
                                              ) {
                                                // ไฟล์ใหม่ - เปิดจาก File object
                                                const fileUrl =
                                                  URL.createObjectURL(
                                                    item.file
                                                  );
                                                window.open(fileUrl, "_blank");
                                                // Clean up URL after a delay to free memory
                                                setTimeout(
                                                  () =>
                                                    URL.revokeObjectURL(
                                                      fileUrl
                                                    ),
                                                  1000
                                                );
                                              } else {
                                              }
                                            }}
                                          >
                                            <VisibilityIcon />
                                          </IconButton>
                                          {/* //ปุ่มดาวน์โหลดไฟล์ */}
                                          {!isActionExplainAdd && (
                                            <IconButton
                                              color="primary"
                                              onClick={async () => {
                                                if (!item.full_path) return;

                                                try {
                                                  const response = await fetch(
                                                    item.full_path,
                                                    { method: "GET" }
                                                  );
                                                  const blob =
                                                    await response.blob();
                                                  const url =
                                                    URL.createObjectURL(blob);

                                                  const link =
                                                    document.createElement("a");
                                                  link.href = url;
                                                  link.setAttribute(
                                                    "download",
                                                    item.original_file_name ??
                                                    "file"
                                                  );
                                                  document.body.appendChild(
                                                    link
                                                  );
                                                  link.click();
                                                  document.body.removeChild(
                                                    link
                                                  );

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
                              {explainFiles.length === 0 && (
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 2,
                                    textAlign: "center",
                                    color: "#999",
                                  }}
                                >
                                  ยังไม่มีไฟล์ที่แนบ
                                </Paper>
                              )}
                            </Box>
                          </Grid>
                        }
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>

      {/* //ส่วนของ Section Head */}
        {(isActionExplainApproveScAdd ||
          isActionExplainApproveQcAdd ||
          isActionCloseAdd ||
          (isActionReadExplain && TempDataSC) ||
          (isActionExplainRead && TempDataSC) ||
          (isActionExplainReadApproveSc && TempDataSC) ||
          (isActionExplainApproveScRead && TempDataSC) ||
          (isActionExplainReadApproveQc && TempDataSC) ||
          isActionExplainApproveQcRead ||
          isActionCloseHistory ||
          (isActionReadClose && TempDataSC)) && (
            <Accordion
                expanded={isMinimizesectionappOpen}
                onChange={() =>
                  setisMinimizeSectionappOpen(!isMinimizesectionappOpen)
                }
                sx={{
                  borderRadius: 1,
                  background: "linear-gradient(135deg, #e9faeeff 0%, #ffffff 100%)",
                  border: "1px solid #22c55e",
                  boxShadow: "0 4px 14px rgba(34, 197, 94, 0.12)",
                  mt: 3,
                }}
              >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#16a34a" }} />}
                aria-controls="dept-content"
                id="dept-header"
                sx={{ px: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    py: 2,
                    px: 2,
                    borderBottom: "none", // 👈 ปิดไว้ก่อน
                    ".Mui-expanded &": {
                      borderBottom: "2px solid #22c55e", // 👈 แสดงเฉพาะตอนเปิด
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 24,
                        background: "#22c55e",
                        borderRadius: 1,
                        mr: 2,
                      }}
                    />
                    <Typography
                      className="sarabun-regular-datatable"
                      sx={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#15803d",
                      }}
                    >
                      ข้อมูลหัวหน้าส่วน (Section Head)
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={4}>
                    <FullWidthTextField value={approve_name || ""} labelName="ชื่อผู้อนุมัติ (Approved by)" readonly />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox value={approve_company_id} labelName={"บริษัท (Company)"} options={dataset_company} column="company_name" setvalue={(v) => setapprove_company_id(v)} bgcolorTextField={true} readonly />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox value={approve_department_id} labelName={"แผนก (Department)"} options={dataset_department} column="department_name" setvalue={(v) => setapprove_department_id(v)} bgcolorTextField={true} readonly />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField value={approve_position || ""} labelName="ตำแหน่ง (Position)" readonly />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField value={approve_email || ""} labelName="อีเมล (Email)" readonly />
                  </Grid>
                  <Grid size={4}>
                    <DesktopDatePickers labelName={"วันที่อนุมัติ (Date)"} value={approve_date} handleChange={(val) => setapprove_date(val ?? null)} bgcolorTextField={true} readonly />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      pb: 1,
                      borderBottom: "1px solid #22c55e",
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 16,
                        backgroundColor: "#22c55e",
                        borderRadius: 0.5,
                        mr: 1.5,
                      }}
                    />
                    <label
                      className="sarabun-regular-datatable"
                      style={{
                        fontSize: "19px",
                        fontWeight: "600",
                        color: "#15803d",
                        margin: 0,
                      }}
                    >
                      รายละเอียด
                    </label>
                  </Box>
                </Box>

                <Grid container spacing={1} sx={{ alignItems: "stretch" }}>
                  <Grid size={12}>
                    <Accordion
                      expanded={isMinimizesectionradioOpen}
                      onChange={() =>
                        setisMinimizeSectionradioOpen(!isMinimizesectionradioOpen)
                      }
                      sx={{ borderRadius: 1, backgroundColor: "#fafafa", mb: 2 }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="complaint-type-content"
                        id="complaint-type-header"
                      >
                        <Typography
                          className="sarabun-regular-datatable"
                          sx={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          อนุมัติ หัวหน้าส่วน (Section Approve)
                          <span style={{ color: "red" }}> *</span>
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Divider sx={{ my: 1 }} />
                        <Box
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <RadioGroup
                            row
                            value={dataSectionapp?.id || ""}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const selectedItem = (dataApprove_Combobox || []).find(
                                (item: any) => item.id === selectedId
                              );
                              if (onApproveChange) {
                                onApproveChange(selectedItem || null);
                              }
                              setdataSectionapp(
                                selectedItem ? { ...selectedItem } : null
                              );
                            }}
                          >
                            {(filteredScApprove || []).map((item: LovType) => (
                              <FormControlLabel
                                key={item.id}
                                value={item.id}
                                control={<Radio />}
                                label={item.lov1}
                                disabled={!isActionExplainApproveScAdd}
                                sx={{
                                  m: 1,
                                  px: 1,
                                  py: 1,
                                  borderRadius: 2,
                                  border:
                                    dataSectionapp?.id === item.id
                                      ? "2px solid #4caf50"
                                      : "none",
                                  bgcolor:
                                    dataSectionapp?.id === item.id
                                      ? "#d0f0c0"
                                      : "#f5f5f5",
                                  "&:hover": {
                                    bgcolor: "#c8e6c9",
                                  },
                                }}
                              />
                            ))}
                          </RadioGroup>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    <Collapse
                      sx={{ mt: 2 }} 
                      in={
                        dataSectionapp?.lov_code === "APPROVE" ||
                        dataSectionapp?.lov_code === "ADD" ||
                        dataSectionapp?.lov_code === "REJECT"
                      }
                      timeout={400}
                      unmountOnExit
                    >
                      <div>
                        <Accordion
                          expanded={isMinimizedeappOpen}
                          onChange={() =>
                            setisMinimizeDeappOpen(!isMinimizedeappOpen)
                          }
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            border: validateText?.ScDetail
                              ? "1px solid #f44336"
                              : "1px solid #e0e0e0",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="detail-content"
                            id="detail-header"
                          >
                            <Typography
                              className="sarabun-regular-datatable"
                              sx={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#333",
                              }}
                            >
                              {getApproveDetailLabel(dataSectionapp)}
                              {dataSectionapp?.lov_code !== "APPROVE" && (
                                <span style={{ color: "red" }}> *</span>
                              )}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box sx={{ mt: -3 }}>
                              <Divider sx={{ my: 1 }} />
                              <Grid
                                container
                                spacing={2}
                                sx={{
                                  justifyContent: "center",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Grid size={12}>
                                  <FullWidthTextArea
                                    value={approve_detail}
                                    labelName=""
                                    placeholderlabel={
                                      showPlaceholderscdetail
                                        ? isApprovesc
                                          ? `${getApproveDetailLabel(dataSectionapp)} (ถ้ามี)`
                                          : `กรอก${getApproveDetailLabel(dataSectionapp)}`
                                        : ""
                                    }
                                    onchange={(e) => {
                                      setapprove_detail(e);
                                      if (onSCDetailChange) {
                                        onSCDetailChange(e);
                                      }
                                    }}
                                    bgcolorTextField={
                                      isActionExplainApproveScAdd ? false : true
                                    }
                                    readonly={!isActionExplainApproveScAdd}
                                    Validate={validateText?.ScDetail || false}
                                    validateTextLable={
                                      validateText?.ScDetail
                                        ? `กรุณากรอก${getApproveDetailLabel(dataSectionapp)}`
                                        : ""
                                    }
                                    shouldFocusError={firstErrorField === "ScDetail"}
                                    submitCount={submitCount}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </Collapse>
                    <Collapse
                      sx={{ mt: 2 }} 
                      in={dataSectionapp?.lov_code === "APPROVE"}
                      timeout={400}
                      unmountOnExit
                    >
                      <div>
                        <Accordion
                          expanded={isMinimizeotappOpen}
                          onChange={() =>
                            setisMinimizeOtappOpen(!isMinimizeotappOpen)
                          }
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            mb: 2,
                            border: validateText?.ScNote
                              ? "1px solid #f44336"
                              : "1px solid #e0e0e0",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="detail-content"
                            id="detail-header"
                          >
                            <Typography
                              className="sarabun-regular-datatable"
                              sx={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#333",
                              }}
                            >
                              หมายเหตุเพิ่มเติม
                            </Typography>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Box sx={{ mt: -3 }}>
                              <Divider sx={{ my: 1 }} />
                              <Grid
                                container
                                spacing={2}
                                sx={{
                                  justifyContent: "center",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Grid size={12}>
                                  <FullWidthTextArea
                                    value={approve_note}
                                    labelName=""
                                    placeholderlabel={
                                      showPlaceholderscnote
                                        ? isApprovesc
                                          ? "หมายเหตุเพิ่มเติม (ถ้ามี)"
                                          : "กรอกหมายเหตุเพิ่มเติม"
                                        : ""
                                    }
                                    onchange={(e) => {
                                      setapprove_note(e);
                                      if (onSCNoteChange) {
                                        onSCNoteChange(e);
                                      }
                                    }}
                                    bgcolorTextField={
                                      isActionExplainApproveScAdd ? false : true
                                    }
                                    readonly={!isActionExplainApproveScAdd}
                                    Validate={validateText?.ScNote || false}
                                    validateTextLable={
                                      validateText?.ScNote
                                        ? "กรุณากรอกหมายเหตุเพิ่มเติม"
                                        : ""
                                    }
                                    shouldFocusError={firstErrorField === "ScNote"}
                                    submitCount={submitCount}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </Collapse>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
        )}

      {/* //ส่วนของ Qc */}
      {
        (isActionExplainApproveQcAdd  ||
          (isActionExplainReadApproveQc && TempDataQMR && checkQMRCondition()) ||
          (isActionExplainApproveQcRead && TempDataQMR && checkQMRCondition()) ||
          (isActionReadExplain && TempDataQMR) ||
          (isActionExplainRead && TempDataQMR) ||
          (isActionExplainApproveScRead && TempDataQMR && checkQMRCondition()) ||
          (isActionReadClose && TempDataQMR && checkQMRCondition()) ||
          (isActionCloseHistory && TempDataQMR && checkQMRCondition()) ||
          (isActionCloseAdd && checkQMRCondition())) && (
            <Accordion
               expanded={isMinimizeqmrappOpen}
                onChange={() =>
                  setisMinimizeQmrappOpen(!isMinimizeqmrappOpen)
                }
                sx={{
                  borderRadius: 1,
                  background: "linear-gradient(135deg, #e6f4ea 0%, #ffffff 100%)",
                  border: "1px solid #22c55e",
                  boxShadow: "0 4px 14px rgba(34, 197, 94, 0.12)",
                  mt: 3,
                }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#16a34a" }} />}
                aria-controls="dept-content"
                id="dept-header"
                sx={{ px: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    py: 2,
                    px: 2,
                    borderBottom: "none", // 👈 ปิดไว้ก่อน
                    ".Mui-expanded &": {
                      borderBottom: "2px solid #22c55e", // 👈 แสดงเฉพาะตอนเปิด
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 24,
                        backgroundColor: "#22c55e",
                        borderRadius: 1,
                        mr: 2,
                      }}
                    />
                    <Typography
                      className="sarabun-regular-datatable"
                      sx={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#15803d",
                      }}
                    >
                      ข้อมูลผู้อำนวยการโรงงาน (QMR) 
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={qcapprove_name}
                      labelName="ชื่อผู้อนุมัติ (Approved by)"
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox
                      value={qcapprove_company_id}
                      labelName={"บริษัท (Company)"}
                      options={dataset_company}
                      column="company_name"
                      setvalue={(v) => setqcapprove_company_id(v)}
                      bgcolorTextField={true}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox
                      value={qcapprove_department_id}
                      labelName={"แผนก (Department)"}
                      options={dataset_department}
                      column="department_name"
                      setvalue={(v) => setqcapprove_department_id(v)}
                      bgcolorTextField={true}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={qcapprove_position}
                      labelName="ตำแหน่ง (Position)"
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={qcapprove_email}
                      labelName="อีเมล (Email)"
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <DesktopDatePickers
                      labelName={"วันที่อนุมัติ (Date)"}
                      value={qcapprove_date}
                      handleChange={(val) => setqcapprove_date(val ?? null)}
                      bgcolorTextField={true}
                      readonly
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      pb: 1,
                      borderBottom: "1px solid #22c55e",
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 16,
                        backgroundColor: "#22c55e",
                        borderRadius: 0.5,
                        mr: 1.5,
                      }}
                    />
                    <label
                      className="sarabun-regular-datatable"
                      style={{
                        fontSize: "19px",
                        fontWeight: "600",
                        color: "#15803d",
                        margin: 0,
                      }}
                    >
                      รายละเอียด
                    </label>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                  {
                    <Grid size={12}>
                      <Accordion
                        expanded={isMinimizeqmrradioOpen}
                        onChange={() =>
                          setisMinimizeQmrradioOpen(!isMinimizeqmrradioOpen)
                        }
                        sx={{ borderRadius: 1, backgroundColor: "#fafafa" }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="complaint-type-content"
                          id="complaint-type-header"
                        >
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{
                              fontSize: "18px",
                              fontWeight: 600,
                              color: "#333",
                            }}
                          >
                            อนุมัติ ผู้อำนวยการโรงงาน (QMR Approve)
                            <span style={{ color: "red" }}> *</span>
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Divider sx={{ my: 1 }} />
                          <Box
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <RadioGroup
                              row
                              value={dataQcapp?.id || ""}
                              onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedItem = (
                                  dataApprove_Combobox || []
                                ).find((item: any) => item.id === selectedId);
                                if (onApproveChange) {
                                  onApproveChange(selectedItem || null);
                                }
                                setdataQcapp(
                                  selectedItem ? { ...selectedItem } : null
                                );
                              }}
                            >
                              {(() => {
                                return null;
                              })()}
                              {(filteredQmrApprove || []).map((item: LovType, index: number) => {

                                return (
                                  <FormControlLabel
                                    key={item.id}
                                    value={item.id}
                                    control={<Radio />}
                                    label={item.lov1}
                                    disabled={!isActionExplainApproveQcAdd}
                                    sx={{
                                      m: 1,
                                      px: 1,
                                      py: 1,
                                      borderRadius: 2,
                                      border:
                                        dataQcapp?.id === item.id ? "2px solid #4caf50" : "none",
                                      bgcolor:
                                        dataQcapp?.id === item.id ? "#d0f0c0" : "#f5f5f5",
                                      "&:hover": {
                                        bgcolor: "#c8e6c9",
                                      },
                                    }}
                                  />
                                );
                              })}

                            </RadioGroup>
                          </Box>
                        </AccordionDetails>
                      </Accordion>

                      <Collapse
                        sx={{ mt: 2 }} 
                        in={
                          dataQcapp?.lov_code === "APPROVE" ||
                          dataQcapp?.lov_code === "ADD" ||
                          dataQcapp?.lov_code === "REJECT"
                        }
                        timeout={400}
                        unmountOnExit
                      >
                        <div>
                          <Accordion
                            expanded={isMinimizeqmrdetailOpen}
                            onChange={() =>
                              setisMinimizeQmrdetailOpen(!isMinimizeqmrdetailOpen)
                            }
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fafafa",
                              border: validateText?.QcDetail
                                ? "1px solid #f44336"
                                : "1px solid #e0e0e0",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="detail-content"
                              id="detail-header"
                            >
                              <Typography
                                className="sarabun-regular-datatable"
                                sx={{
                                  fontSize: "18px",
                                  fontWeight: 600,
                                  color: "#333",
                                }}
                              >
                                {/* หมายเหตุการอนุมัติ */}
                                {getApproveDetailLabel(dataQcapp)}
                                {dataQcapp?.lov_code !== "APPROVE" && (<span style={{ color: "red" }}> *</span>)}
                              </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                              <Box sx={{ mt: -3 }}>
                                <Divider sx={{ my: 1 }} />
                                <Grid
                                  container
                                  spacing={2}
                                  sx={{
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Grid size={12}>
                                    <FullWidthTextArea
                                      value={qcapprove_detail}
                                      labelName=""
                                      placeholderlabel={
                                        showPlaceholderqmrdetail
                                          ? isApproveqmr
                                            ? `${getApproveDetailLabel(dataQcapp)} (ถ้ามี)`
                                            : `กรอก${getApproveDetailLabel(dataQcapp)}`
                                          : ""
                                      }
                                      onchange={(e) => {
                                        setqcapprove_detail(e);
                                        if (onQCDetailChange) {
                                          onQCDetailChange(e);
                                        }
                                      }}
                                      bgcolorTextField={
                                        isActionExplainApproveQcAdd ? false : true
                                      }
                                      readonly={!isActionExplainApproveQcAdd}
                                      Validate={validateText?.QcDetail || false}
                                      validateTextLable={
                                        validateText?.QcDetail
                                          ? `กรุณากรอก${getApproveDetailLabel(dataQcapp)}`
                                          : ""
                                      }
                                      shouldFocusError={firstErrorField === "QcDetail"}
                                      submitCount={submitCount}
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </div>
                      </Collapse>

                      <Collapse
                        sx={{ mt: 2 }} 
                        in={dataQcapp?.lov_code === "APPROVE"}
                        timeout={400}
                        unmountOnExit
                      >
                        <div>
                          <Accordion
                            expanded={isMinimizeqmrnoteOpen}
                            onChange={() =>
                              setisMinimizeQmrnoteOpen(!isMinimizeqmrnoteOpen)
                            }
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fafafa",
                              border: validateText?.QcNote
                                ? "1px solid #f44336"
                                : "1px solid #e0e0e0",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="detail-content"
                              id="detail-header"
                            >
                              <Typography
                                className="sarabun-regular-datatable"
                                sx={{
                                  fontSize: "18px",
                                  fontWeight: 600,
                                  color: "#333",
                                }}
                              >
                                หมายเหตุเพิ่มเติม
                                {dataQcapp?.lov_code !== "APPROVE" && (<span style={{ color: "red" }}> *</span>)}
                              </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                              <Box sx={{ mt: -3 }}>
                                <Divider sx={{ my: 1 }} />
                                <Grid
                                  container
                                  spacing={2}
                                  sx={{
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Grid size={12}>
                                    <FullWidthTextArea
                                      value={qcapprove_note}
                                      labelName=""
                                      placeholderlabel={
                                        showPlaceholderqmrnote
                                          ? isApproveqmr
                                            ? "หมายเหตุเพิ่มเติม (ถ้ามี)"
                                            : "กรอกหมายเหตุเพิ่มเติม"
                                          : ""
                                      }
                                      onchange={(e) => {
                                        setqcapprove_note(e);
                                        if (onQCNoteChange) {
                                          onQCNoteChange(e);
                                        }
                                      }}
                                      bgcolorTextField={
                                        isActionExplainApproveQcAdd ? false : true
                                      }
                                      readonly={!isActionExplainApproveQcAdd}
                                      Validate={validateText?.QcNote || false}
                                      validateTextLable={
                                        validateText?.QcNote
                                          ? "กรุณากรอกหมายเหตุเพิ่มเติม"
                                          : ""
                                      }
                                      shouldFocusError={firstErrorField === "QcNote"}
                                      submitCount={submitCount}
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </div>
                      </Collapse>
                    </Grid>
                  }
                </Grid>
              </AccordionDetails>
            </Accordion>
        )
      }

      {/* //ส่วนของ Close */}
      {
        (isActionCloseAdd ||
          (isActionReadClose && TempDataReturnClose) ||
          (isActionCloseHistory && TempDataReturnClose) ||
          (isActionReadExplain && TempDataReturnClose) ||
          (isActionExplainRead && TempDataReturnClose) ||
          (isActionExplainApproveScRead && TempDataReturnClose) ||
          (isActionExplainApproveQcRead && TempDataReturnClose)
        ) && (
            <Accordion
              expanded={isMinimizecloseOpen}
              onChange={() => setisMinimizeCloseOpen(!isMinimizecloseOpen)}
              sx={{
                width: "100%",
                borderRadius: 1,
                background:
                  "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
                border: "1px solid #424242",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                mt: 3,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#424242" }} />}
                aria-controls="dept-content"
                id="dept-header"
                sx={{ px: 2 }}
              >
                <Box sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 2,
                  px: 2,
                  borderBottom: "none", // 👈 ปิดไว้ก่อน
                  ".Mui-expanded &": {
                  borderBottom: "2px solid #424242", // 👈 แสดงเฉพาะตอนเปิด
                  },
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    backgroundColor: "#424242",
                    borderRadius: 1,
                    mr: 2,
                  }}
                />
                <Typography
                  className="sarabun-regular-datatable"
                  sx={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#000000",
                  }}
                >
                  ปิดรายการคำร้องเรียน (Close Complaint)
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 3,
                width: "100%",
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, #e0e0e0 0%, #fafafa 100%)",
                border: "1px solid #424242",
                boxShadow: "0 4px 12px rgba(158,158,158,0.12)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  pb: 2,
                  borderBottom: "2px solid #424242",
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    backgroundColor: "#424242",
                    borderRadius: 1,
                    mr: 2,
                  }}
                />
                <label
                  className="sarabun-regular-datatable"
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#000000",
                    margin: 0,
                  }}
                >
                  ข้อมูลผู้ตรวจติดตาม (แผนกต้นทาง)
                </label>
              </Box>
              <Grid container spacing={3}>
                <Grid size={4}>
                  <FullWidthTextField
                    value={close_name}
                    labelName="ผู้ตรวจติดตาม (Follow-up by)"
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <AutocompleteComboBox
                    value={close_company_id}
                    labelName={"บริษัท (Company)"}
                    options={dataset_company}
                    column="company_name"
                    setvalue={(v) => setclose_company_id(v)}
                    bgcolorTextField={true}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <AutocompleteComboBox
                    value={close_department_id}
                    labelName={"แผนก (Department)"}
                    options={dataset_department}
                    column="department_name"
                    setvalue={(e) => {
                      setclose_department_id(e);
                    }}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    value={close_position}
                    labelName="ตำแหน่ง (Position)"
                    onchange={(e) => setclose_position(e)}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    value={close_email}
                    labelName="อีเมล (Email)"
                    onchange={(e) => setclose_email(e)}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <DesktopDatePickers
                    labelName={"วันที่ปิดรายการ (Date)"}
                    value={close_date}
                    handleChange={(val) => setclose_date(val ?? null)}
                    readonly
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    pb: 1,
                    borderBottom: "1px solid #424242",
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 16,
                      backgroundColor: "#424242",
                      borderRadius: 0.5,
                      mr: 1.5,
                    }}
                  />
                  <label
                    className="sarabun-regular-datatable"
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#000000",
                      margin: 0,
                    }}
                  >
                    รายละเอียด
                  </label>
                </Box>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{ alignItems: "stretch" }}
              >
                <Grid size={12}>
                  <Accordion
                    expanded={isMinimizecloseradioOpen}
                    onChange={() =>
                      setisMinimizeCloseradioOpen(!isMinimizecloseradioOpen)
                    }
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="complaint-type-content"
                      id="complaint-type-header"
                    >
                      <Typography
                        className="sarabun-regular-datatable"
                        sx={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#333",
                        }}
                      >
                        ผลการตรวจติดตาม (Follow-up)
                        <span style={{ color: "red" }}> *</span>
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <RadioGroup
                          row
                          value={followup_approve?.id || ""}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedItem = (
                              filteredCloseApprove || []
                            ).find((item) => item.id === selectedId);
                            if (onApproveChange) {
                              onApproveChange(selectedItem || null);
                            }
                            setfollowup_approve(
                              selectedItem
                                ? { ...selectedItem }
                                : null
                            );
                          }}
                        >
                          {(filteredCloseApprove || []).map(
                            (item: LovType) => (
                              <FormControlLabel
                                key={item.id}
                                value={item.id}
                                control={<Radio />}
                                label={item.lov1}
                                disabled={!isActionCloseAdd}
                                sx={{
                                  m: 1,
                                  px: 1,
                                  py: 1,
                                  borderRadius: 2,
                                  border:
                                    followup_approve?.id === item.id
                                      ? "2px solid #4caf50"
                                      : "none",
                                  bgcolor:
                                    followup_approve?.id === item.id
                                      ? "#d0f0c0"
                                      : "#f5f5f5",
                                  "&:hover": {
                                    bgcolor: "#c8e6c9",
                                  },
                                }}
                              />
                            )
                          )}
                        </RadioGroup>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                            
                  <Collapse
                    sx={{ mt: 2 }} 
                    in={
                      followup_approve?.lov_code === "APPROVE" ||
                      followup_approve?.lov_code === "ADD" ||
                      followup_approve?.lov_code === "REJECT"
                    }
                    timeout={400}
                    unmountOnExit
                  >
                    <div style={{ marginBottom: '24px' }}>
                      <Accordion
                        expanded={isMinimizeclosedetailOpen}
                        onChange={() =>
                          setisMinimizeClosedetailOpen(!isMinimizeclosedetailOpen)
                        }
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          border: validateText?.CloseDetail
                            ? "1px solid #f44336"
                            : "1px solid #e0e0e0",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="detail-content"
                          id="detail-header"
                        >
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{
                              fontSize: "18px",
                              fontWeight: 600,
                              color: "#333",
                            }}
                          >
                            {/* หมายเหตุการปิดรายการ */}
                            {getCloseDetailLabel(followup_approve)}
                            {followup_approve?.lov_code !== "APPROVE" && (<span style={{ color: "red" }}> *</span>)}
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Box sx={{ mt: -3 }}>
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
                                  value={close_detail || return_detail}
                                  labelName=""
                                  placeholderlabel={
                                    showPlaceholderclosedetail
                                      ? isApproveClose
                                        ? `${getApproveDetailLabel(followup_approve)} (ถ้ามี)`
                                        : `กรอก${getApproveDetailLabel(followup_approve)}`
                                      : ""
                                  }
                                  onchange={(e) => {
                                    setclose_detail(e);
                                    if (onCloseDetailChange) {
                                      onCloseDetailChange(e);
                                    }
                                  }}
                                  bgcolorTextField={
                                    isActionCloseAdd ? false : true
                                  }
                                  readonly={!isActionCloseAdd}
                                  Validate={
                                    validateText?.CloseDetail || false
                                  }
                                  validateTextLable={
                                    validateText?.CloseDetail
                                      ? "กรุณากรอกหมายเหตุการปิดรายการ"
                                      : ""
                                  }
                                  shouldFocusError={firstErrorField === "CloseDetail"}
                                  submitCount={submitCount}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </Collapse>

                  <Collapse
                    sx={{ mt: 2 }} 
                    in={followup_approve?.lov_code === "APPROVE"}
                    timeout={400}
                    unmountOnExit
                  >
                    <div>
                      <Accordion
                        expanded={isMinimizeclosenoteOpen}
                        onChange={() =>
                          setisMinimizeClosenoteOpen(!isMinimizeclosenoteOpen)
                        }
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          border: validateText?.CloseNote
                            ? "1px solid #f44336"
                            : "1px solid #e0e0e0",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="detail-content"
                          id="detail-header"
                        >
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{
                              fontSize: "18px",
                              fontWeight: 600,
                              color: "#333",
                            }}
                          >
                            หมายเหตุเพิ่มเติม
                            {followup_approve?.lov_code !== "APPROVE" && (<span style={{ color: "red" }}> *</span>)}
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Box sx={{ mt: -3 }}>
                            <Divider sx={{ my: 1 }} />
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                justifyContent: "center",
                                alignItems: "flex-start",
                              }}
                            >
                              <Grid size={12}>
                                <FullWidthTextArea
                                  value={close_note}
                                  labelName=""
                                  placeholderlabel={
                                    showPlaceholderclosenote
                                      ? isApproveClose
                                      ? "หมายเหตุเพิ่มเติม (ถ้ามี)"
                                      : "กรอกหมายเหตุเพิ่มเติม"
                                      : ""
                                  }
                                  onchange={(e) => {
                                    setclose_note(e);
                                    if (onCloseNoteChange) {
                                      onCloseNoteChange(e);
                                    }
                                  }}
                                  bgcolorTextField={
                                    isActionCloseAdd ? false : true
                                  }
                                  readonly={!isActionCloseAdd}
                                  Validate={
                                    validateText?.CloseNote || false
                                  }
                                  validateTextLable={
                                    validateText?.CloseNote
                                      ? "กรุณากรอกหมายเหตุเพิ่มเติม"
                                      : ""
                                  }
                                  shouldFocusError={firstErrorField === "CloseNote"}
                                  submitCount={submitCount}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </Collapse>
                  
                  <Accordion
                    expanded={isMinimizefilecloseOpen}
                    onChange={() => setisMinimizeFilecloseOpen(!isMinimizefilecloseOpen)}
                    sx={{
                      borderRadius: 1,
                      background:
                        "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                      border: "1px solid #616161",
                      boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
                      mt: 1,
                    }}
                  >
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
                            py: 2,
                            px: 2,
                            borderBottom: isMinimizefilecloseOpen ? "2px solid #616161" : "none",
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
                            sx={{
                              fontSize: 18,
                              fontWeight: 600,
                              color: "#524f4fff",
                            }}
                          >
                            แนบไฟล์ (Attachments)
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        <Grid size={12}>
                          {(isActionCloseAdd) && !isViewMode && (
                            <BrowseFileUpload
                              setFile={(files) => handleFileChange(files, "Close")}
                              setFileName={() => { }}
                              options={(filteredphoto || []).map((p: any) => ({
                                id: p.id,
                                lov1: p.lov1,
                                lov2: p.lov2,
                                isOther: p.lov2,
                                lov_code: "CheckTypeFileImage",
                              }))}
                              grouped={grouped}
                              action={action}
                              isViewMode={isViewMode}
                            />
                          )}

                          {/* Grouped display by attachment type - Full width boxes stacked vertically */}
                          <Box sx={{ mt: 1 }}>
                            {(filteredphoto || []).map((photoType: any) => {
                              const items = closeFiles.filter(
                                (f: any) => f.attachmentType === photoType.id
                              );
                              if (items.length === 0) return null;
                              return (
                                <Paper
                                  key={photoType.id}
                                  elevation={1}
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 2,
                                    width: "100%",
                                  }}
                                >
                                  <label
                                    className="sarabun-regular-datatable"
                                    style={{
                                      fontWeight: 600,
                                      fontSize: "16px",
                                    }}
                                  >
                                    {photoType.lov1}
                                  </label>
                                  <Divider sx={{ my: 1 }} />
                                  {items.map((item: any, idx: any) => (
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
                                          {item.file.size < 1024 * 1024
                                            ? `${(item.file.size / 1024).toFixed(2)} KB`
                                            : `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`}
                                        </div>
                                        {photoType.lov2 === "Y" && (
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
                                        {(isActionEdit ||
                                          isActionAdd ||
                                          isActionExplainAdd ||
                                          isActionCloseAdd) && (
                                          <IconButton
                                            color="error"
                                            onClick={() => {
                                              // หา index ที่ถูกต้องใน fileList
                                              const actualIndex =
                                                closeFiles.findIndex(
                                                  (f: any) =>
                                                    f.file.name ===
                                                    item.file.name &&
                                                    f.attachmentType ===
                                                    item.attachmentType
                                                );
                                                if (actualIndex !== -1) {
                                                  handleRemoveFile(actualIndex, "Close");
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
                                            // ตรวจสอบว่าเป็นไฟล์ใหม่ (ไม่มี full_path) หรือไฟล์เก่า (มี full_path)
                                            if (item.full_path) {
                                              // ไฟล์เก่า - เปิดจาก NAS
                                              window.open(
                                                item.full_path,
                                                "_blank"
                                              );
                                            } else if (
                                              item.file instanceof File
                                            ) {
                                              // ไฟล์ใหม่ - เปิดจาก File object
                                              const fileUrl =
                                                URL.createObjectURL(
                                                  item.file
                                                );
                                              window.open(fileUrl, "_blank");
                                              // Clean up URL after a delay to free memory
                                              setTimeout(
                                                () =>
                                                  URL.revokeObjectURL(
                                                    fileUrl
                                                  ),
                                                1000
                                              );
                                            } else {
                                            }
                                          }}
                                        >
                                          <VisibilityIcon />
                                        </IconButton>

                                        {/* //ปุ่มดาวน์โหลดไฟล์ */}

                                        {!(isActionExplainAdd || isActionCloseAdd) && (
                                          <IconButton
                                            color="primary"
                                            onClick={async () => {
                                              if (!item.full_path) return;

                                              try {
                                                const response = await fetch(
                                                  item.full_path,
                                                  { method: "GET" }
                                                );
                                                const blob =
                                                  await response.blob();
                                                const url =
                                                  URL.createObjectURL(blob);

                                                const link =
                                                  document.createElement("a");
                                                link.href = url;
                                                link.setAttribute(
                                                  "download",
                                                  item.original_file_name ??
                                                  "file"
                                                );
                                                document.body.appendChild(
                                                  link
                                                );
                                                link.click();
                                                document.body.removeChild(
                                                  link
                                                );

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

                            {closeFiles.length === 0 && (
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  textAlign: "center",
                                  color: "#999",
                                }}
                              >
                                ยังไม่มีไฟล์ที่แนบ
                              </Paper>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Paper>
          </AccordionDetails>
        </Accordion>
      )
    }
  </Paper>
  )}
  </Box >
 );
}