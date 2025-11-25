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
};

export default function ExplaintBody({
  action,
  readonlyTextField,
  bgcolorTextField,
  validateText,
  onBlocksChange,
  validateDetailText,
  handleOpenAdd,
  handleOnclickExplainView,
  handleOnclickExplainApproveSc,
  currentExplainForApproval,

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

  isViewMode = false,
  complaint_status_lable,
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
  const isActionCloseHistory = action === "CloseHistoryRead";
  // const isActionRead = action === "Read" || isViewMode;
  // const isActionAdd = action === "Add";
  // const isActionEdit = action === "Edit";
  // const isActionDelete = action === "Delete";
  // // =====================================================
  // const isActionExplain = action === "Explain";
  // const isActionExplainAdd = action === "ExplainAdd";
  // const isActionReadExplain = action === "ExplainRead";
  // // =====================================================
  // const isActionExplainApproveSc = action === "ApproveSC";
  // const isActionExplainApproveScAdd = action === "ApproveScAdd";
  // const isActionExplainReadApproveSc = action === "ReadApproveSc";
  // // =====================================================
  // const isActionExplainApproveQc = action === "ApproveQC";
  // const isActionExplainApproveQcAdd = action === "ApproveQcAdd";
  // const isActionExplainReadApproveQc = action === "ReadApproveQc";
  // // =====================================================
  // const isActionClose = action === "Close";
  // const isActionCloseAdd = action === "CloseAdd";
  // const isActionReadClose = action === "ReadClose";
  // const isActionCloseHistory = action === "CloseHistory";

  // ตั้งค่า isROOTHidden เป็น false เมื่ออยู่ในโหมดดูข้อมูล
  React.useEffect(() => {
    console.log("🟣🟣🟣🟣🟣🟣 [1] 🟣🟣🟣🟣🟣🟣");
    if (action === "ExplainRead" || isViewMode) {
      // setIsROOTHidden(false);
    }
  }, [action, isViewMode]);

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
    date_of_detection,
    respondent_department_id,
    respondent_email,
    product_name,
    detail,
    compTypeOther,
    compRsOther,
    clauseOther,
    dataReportTypeValue,
    dataComplaintType_Combobox,
    dataComplaintRs_Combobox,
    dataphoto_Combobox,
    complaint_status_id,
    // Dataset
    dataset_reporttype,
    dataset_company,
    dataset_department,
    ToolOther,
    DecisionOther,

    //Explaint
    explainList,
    approveList,
    dataTooluse,
    dataToolUse_Combobox,
    dataToolUseValue_Combobox,
    dataDecision_Combobox,
    dataDecisionValue_Combobox,

    dataSectionapp,
    dataApprove_Combobox,
    dataSectionappValue,
    dataQcapp,
    dataQcappValue,
    explain_id,
    complaint_id,
    explain_seq,
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
    close_status,
    close_name,
    close_company_id,
    close_department_id,
    close_position,
    close_email,
    close_date,
    close_detail,
    close_note,
    return_detail,
    return_name,
    return_company_id,
    return_department_id,
    return_position,
    return_email,
    return_datetime,
    explain_record_status,
    explain_create_by,
    explain_create_datetime,
    explain_update_by,
    explain_update_datetime,
    dataFuapp,
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
    isApproveScBoxHidden,
    isApproveQcBoxHidden,
    isApproveCloseBoxHidden,

    setcas_number,
    setdoc_date,
    setdate_of_detection,
    setrequest_name,
    setrequest_company_id,
    setrequest_domain_id,
    setrequest_position,
    setrequest_email,
    setrequest_phone,
    setrespondent_company_id,
    setrespondent_domain_id,
    setrespondent_department_id,
    setrespondent_email,
    setproduct_name,
    setdetail,
    setrespond_date_within,
    setlot_no,
    setcompTypeOther,
    setotherText,
    setcompRsOther,
    setclauseOther,
    setphoTypeOther,
    setdataReportTypeValue,
    setdataComplaintTypeValue_Combobox,
    setdataComplaintRsValue_Combobox,
    setdataphotoValue_Combobox,
    setdatapriorityValue_Combobox,

    // Dataset
    setdataset_reporttype,
    setdataset_company,
    setdataset_department,
    setdataset_domain,
    setcomplaintFiles,

    //Explaint
    setExplainList,
    setApproveList,
    setdataToolUse,
    setdataToolUse_Combobox,
    setdataToolUseValue,
    setToolOther,
    setdataDecision_Combobox,
    setdataDecisionValue,
    setDecisionOther,
    setdataApprove_Combobox,
    setdataSectionapp,
    setdataSectionappValue,
    setdataQcapp,
    setdataQcappValue,
    setexplain_id,
    setcomplaint_id,
    setexplain_seq,
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
    setclose_status,
    setclose_name,
    setclose_company_id,
    setclose_department_id,
    setclose_position,
    setclose_email,
    setclose_date,
    setclose_detail,
    setclose_note,
    setreturn_detail,
    setreturn_name,
    setreturn_company_id,
    setreturn_department_id,
    setreturn_position,
    setreturn_email,
    setreturn_datetime,
    setexplain_record_status,
    setexplain_create_by,
    setexplain_create_datetime,
    setexplain_update_by,
    setexplain_update_datetime,
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
    setisApproveScBoxHidden,
    setisApproveQcBoxHidden,
    setisApproveCloseBoxHidden,

    setdataFuapp,
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

  // For On-Off Calling Function Log
  const [isCallFuncLogOn] = useState(true);

  // Get Master Variables ======================================================
  const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>(
    []
  );
  const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
  const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
  const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);
  const [filteredTooluse, setFilteredTooluse] = useState<LovType[]>([]);
  const [filteredDecision, setFilteredDecision] = useState<LovType[]>([]);
  const [filteredSecApprove, setFilteredSecApprove] = useState<LovType[]>([]);
  const [filteredQcApprove, setFilteredQcApprove] = useState<LovType[]>([]);
  const [filteredFuApprove, setFilteredFuApprove] = useState<LovType[]>([]);
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
  const [dataDecision, setdataDecision] = useState<LovType[]>([]);
  const [dataTooluseCheckbox, setdataTooluseCheckbox] = useState<LovType[]>([]);
  // Hidden Variables ======================================================
  const [isFormHidden, setIsFormHidden] = useState(false);
  const [isDDHidden, setIsDDHidden] = useState(true);
  const [isTUHidden, setIsTUHidden] = useState(true);
  const [isCAHidden, setIsCAHidden] = useState(true);
  const [isPAPHidden, setIsPAPHidden] = useState(true);
  const [isOBSAHidden, setIsOBSAHidden] = useState(true);
  const [isROOTHidden, setIsROOTHidden] = useState(false);
  const [isApprovalHidden, setIsApprovalHidden] = useState(false);

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
  const [isDetailHidden, setisDetailHidden] = useState(true);
  const [isPriority, setisPriority] = useState(true);
  const [isReportedByHidden, setisReportedByHidden] = useState(true);
  const [isPositionHidden, setisPositionHidden] = useState(true);
  const [isDepartmentHidden, setisDepartmentHidden] = useState(true);
  const [isEmailHidden, setisEmailHidden] = useState(true);
  const [isPhoneHidden, setisPhoneHidden] = useState(true);

  // สร้าง state สำหรับควบคุม Accordion
  const [isMinimizetoolOpen, setisMinimizeToolOpen] = useState(true);
  const [isMinimizeobservOpen, setisMinimizeObservOpen] = useState(true);
  const [isMinimizeddOpen, setisMinimizeDdOpen] = useState(true);
  const [isMinimizerootOpen, setisMinimizeRootOpen] = useState(true);
  const [isMinimizecaOpen, setisMinimizeCaOpen] = useState(true);
  const [isMinimizepapOpen, setisMinimizePapOpen] = useState(true);
  const [isMinimizefileOpen, setisMinimizeFileOpen] = useState(true);
  const [isMinimizesectionappOpen, setisMinimizeSectionappOpen] =
    useState(true);
  const [isMinimizeqcappOpen, setisMinimizeQcappOpen] = useState(true);
  const [isMinimizedeappOpen, setisMinimizeDeappOpen] = useState(true);
  const [isMinimizeotappOpen, setisMinimizeOtappOpen] = useState(true);
  const [isMinimizedeapp2Open, setisMinimizeDeapp2Open] = useState(true);
  const [isMinimizeotapp2Open, setisMinimizeOtapp2Open] = useState(true);

  const [isMinimizefuappOpen, setisMinimizeFuappOpen] = useState(true);
  const [isMinimizecloseOpen, setisMinimizeCloseOpen] = useState(true);
  // const [currentExplainForApproval, setCurrentExplainForApproval] = useState<any>(null);
  const [currentApproveData, setCurrentApproveData] = useState<any>(null);
  const [foundSC, setFoundSC] = useState(null);
  const [foundQC, setFoundQC] = useState(null);
  const [foundCLOSE, setFoundCLOSE] = useState(null);
  // const [approveList, setApproveList] = useState<any[]>([]);
  // Function Handlers (On Change Event) ======================================================
  const handleReportTypeChange = (val: LovType | null) => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleReportTypeChange"
      );
    console.log(": 😒Step : 01 handleReportTypeChange", val);

    const code = val?.lov_code || "";

    setIsFormHidden(["CAR", "OBS", "CPAR", "NCR"].includes(code));

    // Use the centralized visibility function
    setVisibilityByReportType(code);
    setdataReportTypeValue(val);

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
    setdataToolUseValue(null);
    setdataToolUse([]);
    setdataDecision([]);

    setresponsible_date(null);
    setfollow_up_date(null);
  };

  // CheckBox Tool used
  const handleCheckboxChangeTU = (item: LovType) => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleCheckboxChangeTU"
      );

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

  const setVisibilityByReportType = (reportTypeCode: string) => {
    console.log("👌👌👌👌👌 CHECK VALUE : ", reportTypeCode, "👌👌👌👌👌");

    setIsTUHidden(["OBS"].includes(reportTypeCode));

    setIsDDHidden(["OBS", "CAR", "CPAR"].includes(reportTypeCode));

    setIsROOTHidden(["OBS"].includes(reportTypeCode));

    setIsCAHidden(["NCR", "OBS"].includes(reportTypeCode));

    setIsPAPHidden(["NCR", "OBS", "CAR"].includes(reportTypeCode));

    setIsOBSAHidden(["NCR", "CAR", "CPAR"].includes(reportTypeCode));

    console.log(
      "👌👌👌👌👌 TRUE OR FALSE #1 : ",
      ["OBS"].includes(reportTypeCode),
      "👌👌👌👌👌"
    );
    console.log(
      "👌👌👌👌👌 TRUE OR FALSE #2 : ",
      ["NCR", "OBS"].includes(reportTypeCode),
      "👌👌👌👌👌"
    );
    console.log("👌👌👌👌👌 IsTUHidden : ", isTUHidden, "👌👌👌👌👌");
    console.log("👌👌👌👌👌 IsDDHidden : ", isDDHidden, "👌👌👌👌👌");
    console.log("👌👌👌👌👌 IsROOTHidden : ", isROOTHidden, "👌👌👌👌👌");
    console.log("👌👌👌👌👌 IsCAHidden : ", isCAHidden, "👌👌👌👌👌");
    console.log("👌👌👌👌👌 IsPAPHidden : ", isPAPHidden, "👌👌👌👌👌");
    console.log("👌👌👌👌👌 IsOBSAHidden : ", isOBSAHidden, "👌👌👌👌👌");
  };

  // Check Box DD
  const handleCheckboxChangeDD = (item: LovType) => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleCheckboxChangeDD"
      );

    setdataDecision((prev: LovType[] = []) => {
      //console.log("💚💚item", item);
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

  // ฟังก์ชัน setTooluse
  const setTooluse = (data: any) => {
    const newData: any[] = [];
    Array.isArray(data) &&
      data.forEach((el) => {
        const filter = dataToolUse_Combobox.find(
          (item: any) => item.id === el.tool_use_id
        );
        if (filter) {
          newData.push({
            ...filter,
            other: el.other || "",
          });
        }
      });
    return newData;
  };

  // ฟังก์ชัน handleCheckboxChangeTooluse
  const handleCheckboxChangeTooluse = (item: LovType) => {
    setdataTooluseCheckbox((prev: LovType[] = []) => {
      let newData: LovType[];
      if (prev.some((c) => c.id === item.id)) {
        newData = prev.filter((c) => c.id !== item.id);
      } else {
        newData = [...prev, item];
      }
      return newData;
    });
  };

  // รับ ComplaintFile[] จาก BrowseFileUpload
  const handleFileChange = (fileArray: ComplaintFile[]) => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleFileChange"
      );

    if (!fileArray || fileArray.length === 0) return;
    const updatedList = [...fileList, ...fileArray];
    setFileList(updatedList);
    setcomplaintFiles(updatedList);
  };

  // Functions (Initial, Calculation or ETC.) =================================================
  const resetForm = () => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  resetForm"
      );

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

  // ลบไฟล์
  const handleRemoveFile = (index: number) => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleRemoveFile"
      );

    setFileList((prev) => {
      const updatedList = prev.filter((_, i) => i !== index);
      return updatedList;
    });
  };
  useEffect(() => {
    console.log("🟣🟣🟣🟣🟣🟣 [2] 🟣🟣🟣🟣🟣🟣");
    setcomplaintFiles(fileList); // sync
  }, [fileList, filteredTooluse]);

  // Get File
  const ComplaintFile_Get = async () => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ComplaintFile_Get"
      );

    // ตรวจสอบว่ามี dataelement?.id หรือไม่  ไม่error หากไม่มีไฟล์
    if (!dataelement?.id) {
      console.log("No complaint ID, skipping file fetch");
      setFileList([]);
      setcomplaintFiles([]);
      return;
    }

    setIsLoadingScreen(true);
    const dataset = {
      explain_id: dataelement?.id,
      cf_type: "Explain",
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
  const ExplaintApprove_Get = async (explain_id: string) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        "[Calling Function] : ExplaintApprove_Get"
      );

    if (!explain_id) return [];

    setIsLoadingScreen(true);
    const dataset = { explain_id };

    try {
      const response = await _POST(
        dataset,
        "/ExplaintApprove/ExplaintApproveGet"
      );
      console.log("📡 Response ExplaintApprove_Get:", response.data);

      if (response?.status === "success") {
        setApproveList(response.data || []);
        return response.data || [];
      }
      return [];
    } catch (e) {
      console.error("ExplaintApprove_Get error:", e);
      return [];
    } finally {
      setIsLoadingScreen(false);
    }
  };

  //===================================================================================================
  //===================================================================================================
  //===================================================================================================

  React.useEffect(() => {
    console.log("🟣🟣🟣🟣🟣🟣 [3] 🟣🟣🟣🟣🟣🟣");
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
        console.log(
          "🗺️ Looking for department with ID:",
          dataelement.respondent_department_id
        );
        console.log("🗺️ Available departments:", dataset_department);
        console.log("🗺️🗺️🗺️ filteredTooluse:", filteredTooluse);

        const mappedDept = await setValueMas(
          dataset_department,
          dataelement.respondent_department_id,
          "department_id"
        );

        console.log("🗺️ Mapped department result:", mappedDept);
        if (mappedDept) {
          setrespondent_department_id(mappedDept); // ค่า default ของ Combobox
        } else {
          console.warn(
            "⚠️ No department found for ID:",
            dataelement.respondent_department_id
          );
        }
      }

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
      //==============================================================

      if (
        Array.isArray(dataset_department) &&
        dataelement?.responsible_department_id
      ) {
        console.log(
          "🗺️ Looking for department with ID:",
          dataelement.responsible_department_id
        );
        console.log("😡 Available departments:", dataset_department);

        const mappedDept = await setValueMas(
          dataset_department,
          dataelement.responsible_department_id,
          "department_id"
        );

        console.log("🗺️ Mapped department result:", mappedDept);
        if (mappedDept) {
          setresponsible_department_id(mappedDept); // ค่า default ของ Combobox
        } else {
          console.warn(
            "⚠️ No department found for ID:",
            dataelement.responsible_department_id
          );
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
            console.log("🔍 ExplaintBody - Setting Report Type:", defaultVal);
            setdataReportTypeValue(defaultVal);
          }
        } else {
          console.log(
            "🔍 ExplaintBody - No matching Report Type found for:",
            dataelement?.report_type
          );
        }
      }

      // Always prepare Follow-up approve options (not dependent on report type)
      const fuApproveAll = (dataApprove_Combobox || []).filter(
        (item: LovType) => item.lov_type === "approve_select"
      );
      setFilteredFuApprove((prev: LovType[]) => {
        if (JSON.stringify(prev) !== JSON.stringify(fuApproveAll))
          return fuApproveAll;
        return prev;
      });

      // 4) ถ้ามี dataReportTypeValue (จาก state หรือ เพิ่ง set ข้างบน) ให้กรอง complaint/attach/reference
      const reportTypeToUse = dataReportTypeValue; // ใช้ state ปัจจุบัน (ซึ่งเราเพิ่งอาจจะ set)
      if (reportTypeToUse) {
        const val = reportTypeToUse;
        console.log("### CHECK [val] : ", val);

        const newFilteredSecApprove = (dataApprove_Combobox || []).filter(
          (item: LovType) => item.lov_type === "approve_select"
        );
        setFilteredSecApprove((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredSecApprove))
            return newFilteredSecApprove;
          return prev;
        });

        const newFilteredQcApprove = (dataApprove_Combobox || []).filter(
          (item: LovType) => item.lov_type === "approve_select"
        );
        setFilteredQcApprove((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredQcApprove))
            return newFilteredQcApprove;
          return prev;
        });

        // Follow-up approve options
        const newFilteredFuApprove = (dataApprove_Combobox || []).filter(
          (item: LovType) => item.lov_type === "approve_select"
        );
        setFilteredFuApprove((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredFuApprove))
            return newFilteredFuApprove;
          return prev;
        });

        const newFilteredToolUse = (dataToolUse_Combobox || []).filter(
          (item: LovType) => item.lov_type === "tool_use"
        );
        setFilteredTooluse((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredToolUse))
            return newFilteredToolUse;
          return prev;
        });
        console.log("### CHECK VALUE [filteredTooluse] : ", filteredTooluse);

        const newFilteredPhoto = (dataphoto_Combobox || []).filter(
          (item: LovType) => item.lov_type === "attach_type"
        );
        setFilteredphoto((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredPhoto))
            return newFilteredPhoto;
          return prev;
        });

        if (val.lov_code === "NCR") {
          const newFilteredDecision = (dataDecision_Combobox || []).filter(
            (item: LovType) => item.lov_type === "decision_disposition"
          );
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
        setFilteredQcApprove([]);
        setFilteredSecApprove([]);
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
    console.log("🟣🟣🟣🟣🟣🟣 [4] 🟣🟣🟣🟣🟣🟣");
    if (!user?.[0]) return; // รอ user โหลดก่อน

    // Variable
    const uidCompanyId = String(user[0].itasset_company_id ?? "");
    const uidDeptId = String(user[0].itasset_department_id ?? "");

    //==========================================================================

    // Filter Variable
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
      // alert(1)
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
    } else if (dataelement) {
      setclose_name(dataelement.close_name || "");
      setapprove_position(dataelement.approve_position || "");
      setclose_position(dataelement.close_position || "");
      setapprove_email(dataelement.approve_email || "");
      setclose_email(dataelement.close_email || "");
      setapprove_date(
        dataelement?.approve_date
          ? dayjs(dataelement.setapprove_date, "DD-MM-YYYY")
          : dayjs()
      );
      setqcapprove_date(
        dataelement?.qcapprove_date
          ? dayjs(dataelement.setqcapprove_date, "DD-MM-YYYY")
          : dayjs()
      );
      setclose_date(
        dataelement?.close_date
          ? dayjs(dataelement.setclose_date, "DD-MM-YYYY")
          : dayjs()
      );

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
    // user,
    isActionClose,
    dataset_company,
    dataset_department,
    dataelement,
    approveList,
  ]);

  //////////////////////// Approve Read //////////////////////////
  React.useEffect(() => {
    console.log("🟣🟣🟣🟣🟣🟣 [5] 🟣🟣🟣🟣🟣🟣");
    console.log("ขั้นตอน: 5 เก็บข้อมูลเข้า ฺเต็dataelement ใหม่ ", dataelement);
    console.log("ขั้นตอน: 5 เก็บข้อมูลเข้า approveList ใหม่ ", approveList);
    // console.log("ขั้นตอน: 5 ", approveList[0].approve_name);
    console.log("ขั้นตอน: 5 ", approve_email);
    console.log("ขั้นตอน: 5 ", approve_company_id);
    console.log("ขั้นตอน: 5 ", approve_department_id);
    console.log("action", action);
    console.log("approve_note", approve_note);

    if (
      dataelement &&
      (action === "ExplainAdd" ||
        action === "ExplainRead" ||
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

      // SC Approve = approve_seq = 1
      const scApprove = approveList?.find(
        (x: any) => x.explain_id === dataelement?.id && x.approve_seq === 1
      );
      console.log("scApprove", scApprove);
      // QC Approve = approve_seq = 2
      const qcApprove = approveList?.find(
        (x: any) => x.explain_id === dataelement?.id && x.approve_seq === 2
      );
      console.log("qcApprove", qcApprove);

      // Close
      const close = explainList?.find(
        (x: any) => x.complaint_id === dataelement?.id
      );
      console.log("close", close);

      // Set explain fields
      setobservation_analysis(dataelement?.observation_analysis || "");
      setroot_cause(dataelement?.root_cause || "");
      setcorrective_action(dataelement?.corrective_action || "");
      setpreventive_action_plan(dataelement?.preventive_action_plan || "");

      if (!isActionExplainApproveScAdd) {
        const company =
          dataset_company?.find(
            (c: any) =>
              Number(c.company_id) === Number(scApprove?.approve_company_id)
          ) || null;
        setapprove_company_id(company);
        const department =
          dataset_department?.find(
            (c: any) =>
              Number(c.department_id) ===
              Number(scApprove?.approve_department_id)
          ) || null;
        setapprove_department_id(department);
        setdataSectionapp(
          dataApprove_Combobox.find(
            (item: any) => item.lov_code === scApprove?.approve_status
          ) || null
        );
        setapprove_name(scApprove?.approve_name || "");
        setapprove_company_id;
        setapprove_position(scApprove?.approve_position || "");
        setapprove_email(scApprove?.approve_email || "");
        setapprove_detail(scApprove?.approve_detail || "");
        setapprove_note(scApprove?.approve_note || "");
      }

      // setdataSectionapp(dataApprove_Combobox.find((item: any) => item.lov_code === scApprove?.approve_status) || null);
      console.log("scApprove?.approve_detail", scApprove?.approve_detail);
      console.log("scApprove?.approve_name", scApprove?.approve_name);
      console.log("scApprove?.approve_status", scApprove?.approve_status);

      // setdataSectionapp(dataApprove_Combobox.find((item: any) => item.lov_code === approveList[1]?.approve_status) || null);
      // setqcapprove_detail(approveList[1]?.approve_detail || "");
      console.log("qcapprove_detail", qcapprove_detail);

      // Set visibility based on report type from dataelement
      if (dataelement.report_type) {
        const reportTypeObj = dataset_reporttype?.find(
          (item: LovType) =>
            item.id === dataelement.report_type ||
            item.lov_code === dataelement.report_type
        );

        if (reportTypeObj) {
          setVisibilityByReportType(reportTypeObj.lov_code);
        }
      }

      // Load QC approve data from dataelement (for CloseAdd mode)
      if (isActionCloseAdd || isActionClose || isActionCloseHistory) {
        // Set QC approve name
        if (dataelement?.qcapprove_name) {
          setqcapprove_name(dataelement.qcapprove_name);
        }

        // Set QC approve company
        if (dataelement?.qcapprove_company_id) {
          const qcCompany = dataset_company?.find(
            (el: any) =>
              String(el.company_id) === String(dataelement.qcapprove_company_id)
          );
          if (qcCompany) {
            setqcapprove_company_id(qcCompany);
          }
        }

        // Set QC approve department
        if (dataelement?.qcapprove_department_id) {
          const qcDepartment = dataset_department?.find(
            (el: any) =>
              String(el.department_id) ===
              String(dataelement.qcapprove_department_id)
          );
          if (qcDepartment) {
            setqcapprove_department_id(qcDepartment);
          }
        }
        // setdataQcapp(
        //   dataApprove_Combobox.find(
        //     (item: any) => item.lov_code === dataelement?.approve_status
        //   ) || null
        // );


        // Set other QC approve fields
        if (dataelement?.qcapprove_position) {
          setqcapprove_position(dataelement.qcapprove_position);
        }
        if (dataelement?.qcapprove_email) {
          setqcapprove_email(dataelement.qcapprove_email);
        }
        if (dataelement?.qcapprove_date) {
          setqcapprove_date(dayjs(dataelement.qcapprove_date));
        }
        if (dataelement?.qcapprove_detail) {
          setqcapprove_detail(dataelement.qcapprove_detail);
        }
        if (dataelement?.qcapprove_note) {
          setqcapprove_note(dataelement.qcapprove_note);
        }


        // Set QC approve radio (dataQcapp) from dataelement
        // Try multiple possible field names for QC approve status
        const qcApproveStatus =
          dataelement?.approve_status ||
          dataelement?.qc_approve_status ||
          dataelement?.qc_approve_status_code ||
          dataelement?.approve_status_qc;

        // if (qcApproveStatus && dataApprove_Combobox?.length > 0) {
        //   const qcApproveItem = dataApprove_Combobox.find(
        //     (item: LovType) =>
        //       String(item.id) === String(qcApproveStatus) ||
        //       item.lov_code === qcApproveStatus ||
        //       String(item.lov_code) === String(qcApproveStatus) ||
        //       item.lov1 === qcApproveStatus
        //   );
        //   if (qcApproveItem) {
        //     setdataQcapp(qcApproveItem);
        //     console.log(
        //       "✅ QC Approve radio loaded from dataelement:",
        //       qcApproveItem
        //     );
        //   } else {
        //     console.log(
        //       "⚠️ QC Approve item not found in dataelement for status:",
        //       qcApproveStatus
        //     );
        //   }
        // }
      }
      setFoundSC(scApprove || null);
      setFoundQC(qcApprove || null);
      setFoundCLOSE(close || null);
      console.log("foundSC:", foundSC);
      console.log("foundQC:", foundQC);
      console.log("foundCLOSE:", foundCLOSE);
      // Process ToolUse data - wait until combobox loaded
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
    // dataTooluse,
    // dataDecision,
  ]);
  // useEffect(() => {
  //   if (!currentExplainForApproval) return;
  //   const fetchApproveData = async () => {
  //     const approveData = await ExplaintApprove_Get(currentExplainForApproval.id);
  //     console.log("approveData", approveData);

  //     if (approveData?.length > 0) {
  //       const firstApprove = approveData[0];
  //       setCurrentApproveData(firstApprove); // 🔹 เก็บ approve data ทั้ง object
  //       console.log("firstApprove", firstApprove);
  //       const company =
  //         dataset_company?.find((c: any) => Number(c.company_id) === Number(firstApprove?.approve_company_id)) || null;
  //       setapprove_company_id(company);
  //       const department =
  //         dataset_department?.find((c: any) => Number(c.department_id) === Number(firstApprove?.approve_department_id)) || null;
  //       setapprove_department_id(department);
  //       console.log("approve_department_id",approve_department_id);

  //       setapprove_position(firstApprove.approve_position || "");
  //       setapprove_email(firstApprove.approve_email || "");
  //       // setapprove_note(firstApprove.approve_note || "");
  //       // setapprove_detail(firstApprove.approve_detail || "");
  //       if (firstApprove.approve_date) setapprove_date(dayjs(firstApprove.approve_date));
  //       console.log("✅ Mappedddd approve data:", firstApprove);
  //     }
  //   };

  //   fetchApproveData();
  // }, [currentExplainForApproval]);

  // 🔹 Load QC approve data and radio when in CloseAdd mode
  React.useEffect(() => {
    if (
      !isActionCloseAdd ||
      !currentExplainForApproval ||
      !dataApprove_Combobox?.length
    )
      return;

    const fetchQcApproveData = async () => {
      const approveData = await ExplaintApprove_Get(
        currentExplainForApproval.id
      );

      if (approveData?.length > 0) {
        // หา QC approve record (approve_seq === 2)
        const qcApprove = approveData.find(
          (item: any) => item.approve_seq === 2
        );

        // if (qcApprove && qcApprove.approve_status) {
        //   // Set QC approve radio (dataQcapp) from approve_status
        //   const qcApproveItem = dataApprove_Combobox.find(
        //     (item: any) =>
        //       item.lov_code === qcApprove.approve_status ||
        //       item.id === qcApprove.approve_status ||
        //       String(item.id) === String(qcApprove.approve_status)
        //   );


        //   if (qcApproveItem) {
        //     setdataQcapp(qcApproveItem);
        //     console.log("✅ QC Approve radio loaded:", qcApproveItem);
        //   } else {
        //     console.log(
        //       "⚠️ QC Approve item not found for status:",
        //       qcApprove.approve_status
        //     );
        //     console.log("📋 Available approve items:", dataApprove_Combobox);
        //   }
        // }
      }
    };

    fetchQcApproveData();
  }, [isActionCloseAdd, currentExplainForApproval, dataApprove_Combobox]);

  React.useEffect(() => {
    if (
      !dataelement ||
      !(dataelement?.ToolUse || dataelement?.tooluse || dataelement?.explainTu)
    )
      return;

    const isComboReady =
      Array.isArray(dataToolUse_Combobox) && dataToolUse_Combobox.length > 0;
    if (!isComboReady) return;

    console.log("🔧 [Effect: ToolUse prefill check]", {
      isComboReady,
      currentSelected: (dataTooluse || []).length,
    });

    if (dataTooluse && dataTooluse.length > 0) return; // กัน loop

    const rawTU = Array.isArray(dataelement?.ToolUse)
      ? dataelement.ToolUse
      : Array.isArray(dataelement?.tooluse)
        ? dataelement.tooluse
        : Array.isArray(dataelement?.explainTu)
          ? dataelement.explainTu
          : [];

    const tu = setExplainTU(rawTU);
    setdataToolUse(tu);

    if (Array.isArray(dataelement?.tooluse)) {
      setdataTooluseCheckbox(setTooluse(dataelement.tooluse));
    }

    const otherTU = tu.find((el: any) => el.lov2 === "Y");
    setToolOther(otherTU?.other || "");
  }, [dataelement, dataToolUse_Combobox]); // ✅ แค่สองตัวนี้

  React.useEffect(() => {
    if (!dataelement || !(dataelement?.Decision || dataelement?.explainDd))
      return;

    const isDecisionComboReady =
      Array.isArray(dataDecision_Combobox) && dataDecision_Combobox.length > 0;
    if (!isDecisionComboReady) return;

    if (dataDecision && dataDecision.length > 0) return; // กัน loop

    const rawDD = Array.isArray(dataelement?.Decision)
      ? dataelement.Decision
      : Array.isArray(dataelement?.explainDd)
        ? dataelement.explainDd
        : [];

    const dd = setExplainDD(rawDD);
    setdataDecision(dd);

    const otherDD = dd.find((el: any) => el.lov2 === "Y");
    setDecisionOther(otherDD?.other || "");
  }, [dataelement, dataDecision_Combobox]); // ✅ แค่สองตัวนี้

  // Debug useEffect for dataTooluseCheckbox state changes
  React.useEffect(() => {
    console.log("🟣🟣🟣🟣🟣🟣 [6] 🟣🟣🟣🟣🟣🟣");
    console.log("🔧 dataTooluseCheckbox state changed:", dataTooluseCheckbox);
  }, [dataTooluseCheckbox]);

  React.useEffect(() => {
    console.log("🟣🟣🟣🟣🟣🟣 [7] 🟣🟣🟣🟣🟣🟣");
    console.log("🟡 current action:", action);
    if (
      (action === "ExplainRead" ||
        action === "ApproveSCAdd" ||
        action === "ApproveQCAdd" ||
        action === "CloseAdd") &&
      dataelement?.id
    ) {
      ComplaintFile_Get();
    }
  }, [action, dataelement]);
  const setExplainTU = (data: any) => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  setExplainTU"
      );
    console.log("🔍 setExplainTU input data:", data);
    console.log("🔍 dataToolUse_Combobox available:", dataToolUse_Combobox);

    const newData: any[] = [];
    if (Array.isArray(data)) {
      data.forEach((el, index) => {
        console.log(`🔍 Processing Tools Used item ${index}:`, el);
        // Support multiple possible key names from API: explain_tu_id, tool_use_id, id
        const targetId =
          (el &&
            (el.explain_tu_id || el.tool_use_id || el.tooluse_id || el.id)) ??
          null;

        const filter = dataToolUse_Combobox.find(
          (item: any) => String(item.id) === String(targetId)
        );
        console.log(`🔍 Found matching tool for ${targetId}:`, filter);

        if (filter) {
          const processedItem = {
            ...filter,
            other: el.other || "", // ⭐ เก็บค่าข้อความ Other มาด้วย
          };
          console.log(`🔍 Adding processed item:`, processedItem);
          newData.push(processedItem);
        } else {
          console.warn(`🚫 No matching tool found for targetId: ${targetId}`);
        }
      });
    } else {
      console.warn("🚫 setExplainTU input data is not an array:", data);
    }

    console.log("🔍 setExplainTU returning:", newData);
    return newData;
  };

  const setExplainDD = (data: any) => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  setExplainDD"
      );

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

  React.useEffect(() => {
    console.log("🟣🟣🟣🟣🟣🟣 [7] 🟣🟣🟣🟣🟣🟣");
    if (action === "ExplainRead" && dataelement?.id) {
      ComplaintFile_Get();
    }
  }, [action, dataelement]);

  console.log("complaint_status_id", complaint_status_id);

  console.log("Actionnnnnnn", action);
  console.log("isActionExplainReadApproveSc", isActionExplainReadApproveSc);

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
      <Grid container spacing={2} mt={2}>
        <Grid size={6}>
          {/* <AutocompleteComboBox
            required="required"
            value={dataReportTypeValue}
            labelName={"ประเภทรายงาน (Report Type)"}
            options={dataset_reporttype} // <-- แก้ตรงนี้
            column="lov_code"
            setvalue={handleReportTypeChange}
            readonly={isActionRead ? true : isActionEdit ? true : isActionDelete ? true : readonlyTextField}
            bgcolorTextField={isActionRead ? true : isActionEdit ? true : isActionDelete ? true : bgcolorTextField}

          /> */}
        </Grid>
      </Grid>

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
            <label className="sarabun-regular-datatable">
              {dataReportTypeValue?.lov4}
            </label>
            <Divider sx={{ my: 1 }} />
            <Grid container spacing={2}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mt: 3,
                  width: "100%",
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
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
                    ข้อมูลผู้ชี้แจง // {action}
                  </label>
                </Box>
                <Grid container spacing={3}>
                  <Grid size={4}>
                    <FullWidthTextField
                      required="required"
                      value={
                        isActionExplainAdd
                          ? user[0]?.employee_username || "-"
                          : responsible_name ||
                          dataelement?.responsible_name ||
                          "-"
                      }
                      labelName="ชื่อผู้ดำเนินการ (Responsible Person)"
                      onchange={(e) => setresponsible_name(e.target.value)}
                      readonly={
                        isActionRead ||
                        isActionDelete ||
                        isActionExplainAdd ||
                        isActionExplainApproveScAdd ||
                        isActionExplainApproveScRead ||
                        isActionExplainApproveQcAdd ||
                        isActionReadExplain ||
                        isActionExplainRead ||
                        isActionExplainApproveQcRead ||
                        isActionCloseAdd ||
                        isActionReadClose ||
                        isActionCloseHistory
                      }
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      required="required"
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
                      required="required"
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
                      required="required"
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
                      readonly={
                        isActionRead ||
                        isActionDelete ||
                        isActionExplainAdd ||
                        isActionExplainApproveScAdd ||
                        isActionExplainApproveScRead ||
                        isActionExplainApproveQcAdd ||
                        isActionReadExplain ||
                        isActionExplainRead ||
                        isActionExplainApproveQcRead ||
                        isActionCloseAdd ||
                        isActionReadClose ||
                        isActionCloseHistory
                      }
                    />
                  </Grid>
                  <Grid size={4}>
                    <DesktopDatePickers
                      required="required"
                      labelName={"วันที่ชี้แจง (Date)"}
                      value={responsible_date}
                      handleChange={(val) => setresponsible_date(val ?? null)}
                      //bgcolorTextField={isActionExplainAdd ? false : true}
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
                      readonly={
                        isActionRead ||
                        isActionEdit ||
                        isActionDelete ||
                        isActionExplainApproveScAdd ||
                        isActionExplainApproveScRead ||
                        isActionExplainApproveQcAdd ||
                        isActionReadExplain ||
                        isActionExplainRead ||
                        isActionExplainApproveQcRead ||
                        isActionCloseAdd ||
                        isActionReadClose ||
                        isActionCloseHistory
                      }
                      Validate={validateText?.Follow_up_Date || false}
                      validateTextLable={
                        validateText?.Follow_up_Date
                          ? "กรุณาเลือกวันที่ตรวจติดตามผล"
                          : ""
                      }
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
                    {/* ✅ Accordion แทน Paper */}
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
                                        readonly={
                                          isActionRead ||
                                          isActionDelete ||
                                          isActionReadExplain ||
                                          isActionExplainRead ||
                                          isActionExplainApproveQcRead ||
                                          isActionExplainApproveScAdd ||
                                          isActionExplainApproveScRead ||
                                          isActionExplainApproveQcAdd ||
                                          isActionCloseAdd ||
                                          isActionReadClose ||
                                          isActionCloseHistory
                                        }
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
                                      readonly={
                                        isActionRead ||
                                        isActionDelete ||
                                        isActionExplainRead ||
                                        isActionCloseAdd
                                      }
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
                          >
                            <Typography
                              className="sarabun-regular-datatable"
                              sx={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#333",
                              }}
                            >
                              การตัดสินใจเกี่ยวกับแนวทางการจัดการ (Decision on
                              Disposition)
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
                                      readonly={
                                        isActionRead ||
                                        isActionDelete ||
                                        isActionReadExplain ||
                                        isActionExplainRead ||
                                        isActionExplainApproveQcRead ||
                                        isActionExplainApproveScAdd ||
                                        isActionExplainApproveScRead ||
                                        isActionExplainApproveQcAdd ||
                                        isActionCloseAdd ||
                                        isActionReadClose ||
                                        isActionCloseHistory
                                      }
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
                                      readonly={
                                        isActionRead ||
                                        isActionDelete ||
                                        isActionExplainRead ||
                                        isActionCloseAdd
                                      }
                                    />
                                  )}
                              </Box>
                            </Box>
                            {validateText?.Dd && (
                              <label
                                className="fs-7 py-1 sarabun-regular-lable-validate"
                                style={{ color: "red" }}
                              >
                                กรุณาเลือกเครื่องมือที่ใช้ (Decision on
                                Disposition)
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
                          การวิเคราะห์เบื้องต้นของข้อสังเกต (Observation
                          Analysis)
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
                            {/* Response Date Field - positioned after Emergency option */}
                            <Grid size={12}>
                              <FullWidthTextArea
                                value={observation_analysis}
                                labelName=""
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
                                readonly={
                                  isActionRead ||
                                  isActionDelete ||
                                  isActionReadExplain ||
                                  isActionReadExplain ||
                                  isActionExplainRead ||
                                  isActionExplainApproveScRead ||
                                  isActionExplainApproveQcRead ||
                                  isActionCloseAdd ||
                                  isActionReadClose ||
                                  isActionCloseHistory
                                }
                                Validate={validateText?.ObsAnaly || false}
                                validateTextLable={
                                  validateText?.ObsAnaly
                                    ? "กรุณากรอกการวิเคราะห์เบื้องต้นของข้อสังเกต"
                                    : ""
                                }

                              // onchange={(e) => {
                              //     setqcapprove_note(e)
                              //     if (onQCNoteChange) {
                              //       onQCNoteChange(e);
                              //     }
                              //   }}
                              //   bgcolorTextField={isActionExplainApproveQcAdd ? false : true}
                              //   readonly={isActionRead || isActionExplainRead || isActionDelete || isActionCloseAdd || isActionExplainRead}
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
                            {/* Response Date Field - positioned after Emergency option */}
                            <Grid size={12}>
                              <FullWidthTextArea
                                value={root_cause}
                                labelName=""
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
                                readonly={
                                  isActionRead ||
                                  isActionDelete ||
                                  isActionReadExplain ||
                                  isActionExplainRead ||
                                  isActionExplainApproveScRead ||
                                  isActionExplainApproveQcRead ||
                                  isActionCloseAdd ||
                                  isActionReadClose ||
                                  isActionCloseHistory
                                }
                                Validate={validateText?.Rc || false}
                                validateTextLable={
                                  validateText?.Rc
                                    ? "กรุณากรอกคำอธิบายการวิเคราะห์ (Root Cause)"
                                    : ""
                                }
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
                            {/* Response Date Field - positioned after Emergency option */}
                            <Grid size={12}>
                              <FullWidthTextArea
                                value={corrective_action}
                                labelName=""
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
                                readonly={
                                  isActionRead ||
                                  isActionDelete ||
                                  isActionReadExplain ||
                                  isActionExplainRead ||
                                  isActionExplainApproveScRead ||
                                  isActionExplainApproveQcRead ||
                                  isActionCloseAdd ||
                                  isActionReadClose ||
                                  isActionCloseHistory
                                }
                                Validate={validateText?.Ca || false}
                                validateTextLable={
                                  validateText?.Ca
                                    ? "กรุณากรอกการดำเนินการแก้ไข (Corrective Action)"
                                    : ""
                                }
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
                          แผนการป้องกันไม่ให้ปัญหาเกิดขึ้นซ้ำ (Preventive Action
                          Plan)
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
                            {/* Response Date Field - positioned after Emergency option */}
                            <Grid size={12}>
                              <FullWidthTextArea
                                value={preventive_action_plan}
                                labelName=""
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
                                readonly={
                                  isActionRead ||
                                  isActionReadExplain ||
                                  isActionExplainRead ||
                                  isActionExplainApproveQcRead ||
                                  isActionDelete ||
                                  isActionExplainApproveScAdd ||
                                  isActionExplainApproveScRead ||
                                  isActionCloseAdd ||
                                  isActionReadClose ||
                                  isActionCloseHistory
                                }
                                Validate={validateText?.Pap || false}
                                validateTextLable={
                                  validateText?.Pap
                                    ? "กรุณากรอกแผนการป้องกันไม่ให้ปัญหาเกิดขึ้นซ้ำ (Preventive Action Plan)"
                                    : ""
                                }
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
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
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
                            sx={{
                              fontSize: 18,
                              fontWeight: 600,
                              color: "#616161",
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
                            <BrowseFileUpload
                              setFile={handleFileChange}
                              setFileName={() => { }}
                              options={(filteredphoto || []).map((p: any) => ({
                                id: p.id,
                                lov1: p.lov1,
                              }))}
                              action={action}
                              isViewMode={isViewMode}
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
                                            {(
                                              item.file.size /
                                              (1024 * 1024)
                                            ).toFixed(2)}{" "}
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
                                          {(isActionEdit ||
                                            isActionAdd ||
                                            isActionAdd ||
                                            isActionExplainAdd) && (
                                              <IconButton
                                                color="error"
                                                onClick={() => {
                                                  // หา index ที่ถูกต้องใน fileList
                                                  const actualIndex =
                                                    fileList.findIndex(
                                                      (f) =>
                                                        f.file.name ===
                                                        item.file.name &&
                                                        f.attachmentType ===
                                                        item.attachmentType
                                                    );
                                                  console.log(
                                                    "🔍 Remove file debug:",
                                                    {
                                                      itemName: item.file.name,
                                                      itemType:
                                                        item.attachmentType,
                                                      actualIndex,
                                                      fileListLength:
                                                        fileList.length,
                                                    }
                                                  );
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
                                              console.log(
                                                "full_path:",
                                                item.full_path
                                              );
                                              console.log(
                                                "file type:",
                                                typeof item.file
                                              );
                                              console.log(
                                                "file instanceof File:",
                                                item.file instanceof File
                                              );

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
                                                console.log(
                                                  "Cannot preview file - no full_path or File object"
                                                );
                                              }
                                            }}
                                          >
                                            <VisibilityIcon />
                                          </IconButton>

                                          {/* //ปุ่มดาวน์โหลดไฟล์ */}
                                          {isActionReadExplain && (
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

                              {fileList.length === 0 && (
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
              </Paper>
            </Grid>
          </Paper>
        )}

      {/* //ส่วนของ Section Head */}
      {(isActionExplainApproveScAdd ||
        isActionExplainApproveQcAdd ||
        isActionCloseAdd ||
        (isActionReadExplain && foundSC) ||
        (isActionExplainRead && foundSC) ||
        (isActionExplainReadApproveSc && foundSC) ||
        (isActionExplainApproveScRead && foundSC) ||
        (isActionExplainReadApproveQc && isApproveQcBoxHidden) ||
        isActionExplainApproveQcRead ||
        isActionCloseHistory ||
        isActionReadClose) && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 3,
              width: "100%",
              borderRadius: 3,
              background: "linear-gradient(135deg, #e6f4ea 0%, #ffffff 100%)",
              border: "1px solid #a5d6a7",
              boxShadow: "0 4px 12px rgba(158,158,158,0.12)",
            }}
          >
            <Accordion
              defaultExpanded
              sx={{ backgroundColor: "transparent", boxShadow: "none" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="section-head-content"
                id="section-head-header"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    pb: 2,
                    borderBottom: "2px solid #81c784",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 24,
                        backgroundColor: "#66bb6a",
                        borderRadius: 1,
                        mr: 2,
                      }}
                    />
                    <Typography
                      className="sarabun-regular-datatable"
                      sx={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#2e7d32",
                      }}
                    >
                      ข้อมูลผู้รับรอง (Section Head)
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={4}>
                    <FullWidthTextField
                      required="required"
                      value={approve_name || ""}
                      labelName="ชื่อผู้อนุมัติ (Approved by)"
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox
                      required="required"
                      value={approve_company_id}
                      labelName={"บริษัท (Company)"}
                      options={dataset_company}
                      column="company_name"
                      setvalue={(v) => setapprove_company_id(v)}
                      bgcolorTextField={true}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox
                      required="required"
                      value={approve_department_id}
                      labelName={"แผนก (Department)"}
                      options={dataset_department}
                      column="department_name"
                      setvalue={(v) => setapprove_department_id(v)}
                      bgcolorTextField={true}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      required="required"
                      value={approve_position || ""}
                      labelName="ตำแหน่ง (Position)"
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      required="required"
                      value={approve_email || ""}
                      labelName="อีเมล (Email)"
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <DesktopDatePickers
                      required="required"
                      labelName={"วันที่อนุมัติ (Date)"}
                      value={approve_date}
                      handleChange={(val) => setapprove_date(val ?? null)}
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
                      borderBottom: "1px solid #66bb6a",
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 16,
                        backgroundColor: "#388e3c",
                        borderRadius: 0.5,
                        mr: 1.5,
                      }}
                    />
                    <label
                      className="sarabun-regular-datatable"
                      style={{
                        fontSize: "19px",
                        fontWeight: "600",
                        color: "#2e7d32",
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
                        expanded={isMinimizesectionappOpen}
                        onChange={() =>
                          setisMinimizeSectionappOpen(!isMinimizesectionappOpen)
                        }
                        sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}
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
                            Approve หัวหน้าส่วน (Section Approve)
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
                                const selectedItem = (
                                  dataApprove_Combobox || []
                                ).find((item: any) => item.id === selectedId);
                                if (onApproveChange) {
                                  onApproveChange(selectedItem || null);
                                }
                                setdataSectionapp(
                                  selectedItem ? { ...selectedItem } : null
                                );
                              }}
                            >
                              {(dataApprove_Combobox || []).map(
                                (item: LovType) => (
                                  <FormControlLabel
                                    key={item.id}
                                    value={item.id}
                                    control={<Radio />}
                                    label={item.lov1}
                                    disabled={
                                      isActionRead ||
                                      isActionReadExplain ||
                                      isActionExplainRead ||
                                      isActionExplainApproveScRead ||
                                      isActionExplainApproveQcRead ||
                                      isActionDelete ||
                                      isActionExplainApproveQcAdd ||
                                      isActionCloseAdd ||
                                      isActionReadClose ||
                                      isActionCloseHistory
                                    }
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
                                )
                              )}
                            </RadioGroup>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                      {
                        <Accordion
                          expanded={isMinimizedeappOpen}
                          onChange={() =>
                            setisMinimizeDeappOpen(!isMinimizedeappOpen)
                          }
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            mt: 2,
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
                              หมายเหตุการอนุมัติ
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
                                  value={approve_detail}
                                  labelName=""
                                  onchange={(e) => {
                                    setapprove_detail(e);
                                    if (onSCDetailChange) {
                                      onSCDetailChange(e);
                                    }
                                  }}
                                  bgcolorTextField={
                                    isActionExplainApproveScAdd ? false : true
                                  }
                                  readonly={
                                    isActionRead ||
                                    isActionReadExplain ||
                                    isActionExplainRead ||
                                    isActionDelete ||
                                    isActionExplainApproveScRead ||
                                    isActionExplainApproveQcAdd ||
                                    isActionExplainApproveQcRead ||
                                    isActionCloseAdd ||
                                    isActionReadClose ||
                                    isActionCloseHistory
                                  }
                                  Validate={validateText?.ScDetail || false}
                                  validateTextLable={
                                    validateText?.ScDetail
                                      ? "กรุณากรอกหมายเหตุการอนุมัติ"
                                      : ""
                                  }
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    }
                    {
                      <Accordion
                        expanded={isMinimizeotappOpen}
                        onChange={() =>
                          setisMinimizeOtappOpen(!isMinimizeotappOpen)
                        }
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          mt: 2,
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
                                  value={approve_note}
                                  labelName=""
                                  onchange={(e) => {
                                    setapprove_note(e);
                                    if (onSCNoteChange) {
                                      onSCNoteChange(e);
                                    }
                                  }}
                                  bgcolorTextField={
                                    isActionExplainApproveScAdd ? false : true
                                  }
                                  readonly={
                                    isActionRead ||
                                    isActionReadExplain ||
                                    isActionExplainRead ||
                                    isActionDelete ||
                                    isActionExplainApproveScRead ||
                                    isActionExplainApproveQcAdd ||
                                    isActionExplainApproveQcRead ||
                                    isActionCloseAdd ||
                                    isActionReadClose ||
                                    isActionCloseHistory
                                  }
                                  Validate={validateText?.ScNote || false}
                                  validateTextLable={
                                    validateText?.ScNote
                                      ? "กรุณากรอกหมายเหตุเพิ่มเติม"
                                      : ""
                                  }
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    }
                  </Grid>
                }
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Paper>
      )}

      {/* //ส่วนของ Qc */}
      {(isActionExplainApproveQcAdd ||
        isActionExplainReadApproveQc ||
        (isActionReadExplain && foundQC) ||
        (isActionExplainRead && foundQC) ||
        (isActionExplainApproveScRead && foundQC) ||
        isActionReadClose ||
        isActionCloseHistory ||
        isActionCloseAdd) && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 3,
              width: "100%",
              borderRadius: 3,
              background: "linear-gradient(135deg, #e6f4ea 0%, #ffffff 100%)",
              border: "1px solid #a5d6a7",
              boxShadow: "0 4px 12px rgba(158,158,158,0.12)",
            }}
          >
            <Accordion
              defaultExpanded
              sx={{ backgroundColor: "transparent", boxShadow: "none" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="section-head-content"
                id="section-head-header"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    pb: 2,
                    borderBottom: "2px solid #81c784",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 24,
                        backgroundColor: "#66bb6a",
                        borderRadius: 1,
                        mr: 2,
                      }}
                    />
                    <Typography
                      className="sarabun-regular-datatable"
                      sx={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#2e7d32",
                      }}
                    >
                      ข้อมูลผู้รับรอง (QC)
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={4}>
                    <FullWidthTextField
                      required="required"
                      value={qcapprove_name}
                      labelName="ชื่อผู้อนุมัติ (Approved by)"
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox
                      required="required"
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
                      required="required"
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
                      required="required"
                      value={qcapprove_position}
                      labelName="ตำแหน่ง (Position)"
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      required="required"
                      value={qcapprove_email}
                      labelName="อีเมล (Email)"
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <DesktopDatePickers
                      required="required"
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
                      borderBottom: "1px solid #66bb6a",
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 16,
                        backgroundColor: "#388e3c",
                        borderRadius: 0.5,
                        mr: 1.5,
                      }}
                    />
                    <label
                      className="sarabun-regular-datatable"
                      style={{
                        fontSize: "19px",
                        fontWeight: "600",
                        color: "#2e7d32",
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
                        expanded={isMinimizesectionappOpen}
                        onChange={() =>
                          setisMinimizeSectionappOpen(!isMinimizesectionappOpen)
                        }
                        sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}
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
                            Approve ผู้จัดการคุณภาพ (QC)
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
                              {(dataApprove_Combobox || []).map(
                                (item: LovType) => (
                                  <FormControlLabel
                                    key={item.id}
                                    value={item.id}
                                    control={<Radio />}
                                    label={item.lov1}
                                    disabled={
                                      isActionRead ||
                                      isActionReadExplain ||
                                      isActionExplainRead ||
                                      isActionDelete ||
                                      isActionCloseAdd ||
                                      isActionReadClose ||
                                      isActionCloseHistory
                                    }
                                    sx={{
                                      m: 1,
                                      px: 1,
                                      py: 1,
                                      borderRadius: 2,
                                      border:
                                        dataQcapp?.id === item.id
                                          ? "2px solid #4caf50"
                                          : "none",
                                      bgcolor:
                                        dataQcapp?.id === item.id
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
                      {
                        <Accordion
                          expanded={isMinimizedeappOpen}
                          onChange={() =>
                            setisMinimizeDeappOpen(!isMinimizedeappOpen)
                          }
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            mt: 2,
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
                              หมายเหตุการอนุมัติ
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
                                  value={qcapprove_detail}
                                  labelName=""
                                  onchange={(e) => {
                                    setqcapprove_detail(e);
                                    if (onQCDetailChange) {
                                      onQCDetailChange(e);
                                    }
                                  }}
                                  bgcolorTextField={
                                    isActionExplainApproveQcAdd ? false : true
                                  }
                                  readonly={
                                    isActionRead ||
                                    isActionReadExplain ||
                                    isActionExplainRead ||
                                    isActionDelete ||
                                    isActionCloseAdd ||
                                    isActionReadClose ||
                                    isActionCloseHistory
                                  }
                                  Validate={validateText?.QcDetail || false}
                                  validateTextLable={
                                    validateText?.QcDetail
                                      ? "กรุณากรอกหมายเหตุการอนุมัติ"
                                      : ""
                                  }
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    }
                    {
                      <Accordion
                        expanded={isMinimizeotappOpen}
                        onChange={() =>
                          setisMinimizeOtappOpen(!isMinimizeotappOpen)
                        }
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          mt: 2,
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
                                    value={qcapprove_note}
                                    labelName=""
                                    onchange={(e) => {
                                      setqcapprove_note(e);
                                      if (onQCNoteChange) {
                                        onQCNoteChange(e);
                                      }
                                    }}
                                    bgcolorTextField={
                                      isActionExplainApproveQcAdd ? false : true
                                    }
                                    readonly={
                                      isActionRead ||
                                      isActionReadExplain ||
                                      isActionExplainRead ||
                                      isActionDelete ||
                                      isActionCloseAdd ||
                                      isActionReadClose ||
                                      isActionCloseHistory ||
                                      isActionReadExplain
                                    }
                                    Validate={validateText?.QcNote || false}
                                    validateTextLable={
                                      validateText?.QcNote
                                        ? "กรุณากรอกหมายเหตุเพิ่มเติม"
                                        : ""
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      }
                    </Grid>
                  }
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>
        )}

      {/* //ส่วนของ Close */}
      {(isActionCloseAdd ||
      (isActionExplainApproveScRead && foundCLOSE) ||
      (isActionExplainApproveQcRead && foundCLOSE) 
      ) && (
        <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 3,
              width: "100%",
              borderRadius: 3,
              background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
              border: "1px solid #9e9e9e",
              boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
            }}
          >
            <Grid container spacing={2}>
              <Grid size={12}>
                <Accordion
                  expanded={isMinimizecloseOpen}
                  onChange={() => setisMinimizeCloseOpen(!isMinimizecloseOpen)}
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
                    border: "1px solid #9e9e9e",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    mt: 3,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="reporting-dept-content"
                    id="reporting-dept-header"
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                        sx={{ fontSize: 18, fontWeight: 600, color: "#000000" }}
                      >
                        ปิดรายการคำร้องเรียน (Close Complaint)
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Divider
                      sx={{ my: 1, borderBottom: "2px solid #424242" }}
                    />
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        mt: 3,
                        width: "100%",
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg, #e0e0e0 0%, #fafafa 100%)",
                        border: "1px solid #9e9e9e",
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
                            required="required"
                            value={close_name}
                            labelName="ผู้ตรวจติดตาม (Follow-up by)"
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <AutocompleteComboBox
                            required="required"
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
                            required="required"
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
                            required="required"
                            value={close_position}
                            labelName="ตำแหน่ง (Position)"
                            onchange={(e) => setclose_position(e)}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            required="required"
                            value={close_email}
                            labelName="อีเมล (Email)"
                            onchange={(e) => setclose_email(e)}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <DesktopDatePickers
                            required="required"
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
                        {/* ✅ Accordion แทน Paper */}
                        {/* {dataReportTypeValue && ( */}
                        <Grid size={12}>
                          <Accordion
                            expanded={isMinimizefuappOpen}
                            onChange={() =>
                              setisMinimizeFuappOpen(!isMinimizefuappOpen)
                            }
                            sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}
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
                                {/* ✅ ใช้ RadioGroup แทน Checkbox */}
                                <RadioGroup
                                  row
                                  value={dataFuapp?.id || ""}
                                  onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selectedItem = (
                                      filteredFuApprove || []
                                    ).find((item) => item.id === selectedId);
                                    if (onApproveChange) {
                                      onApproveChange(selectedItem || null);
                                    }
                                    setdataFuapp(
                                      selectedItem ? { ...selectedItem } : null
                                    );
                                  }}
                                >
                                  {/* ให้ radio อยู่บรรทัดเดียวกัน */}
                                  {(filteredFuApprove || []).map(
                                    (item: LovType) => (
                                      <FormControlLabel
                                        key={item.id}
                                        value={item.id}
                                        control={<Radio />}
                                        label={item.lov1}
                                        // disabled={isActionRead || isActionDelete || isActionExplainApproveQcAdd}
                                        sx={{
                                          m: 1,
                                          px: 1,
                                          py: 1,
                                          borderRadius: 2,
                                          border:
                                            dataFuapp?.id === item.id
                                              ? "2px solid #4caf50"
                                              : "none",
                                          bgcolor:
                                            dataFuapp?.id === item.id
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
                          {/* {dataReportTypeValue && ( */}
                          <Accordion
                            expanded={isMinimizedeapp2Open}
                            onChange={() =>
                              setisMinimizeDeapp2Open(!isMinimizedeapp2Open)
                            }
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fafafa",
                              mt: 2, // <-- เพิ่ม margin-top
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
                                หมายเหตุการปิดรายการ
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
                                  {/* Response Date Field - positioned after Emergency option */}
                                  <Grid size={12}>
                                    <FullWidthTextArea
                                      value={close_detail || return_detail}
                                      labelName=""
                                      onchange={(e) => {
                                        setclose_detail(e);
                                        if (onCloseDetailChange) {
                                          onCloseDetailChange(e);
                                        }
                                      }}
                                      readonly={!isActionCloseAdd}
                                      Validate={
                                        validateText?.CloseDetail || false
                                      }
                                      validateTextLable={
                                        validateText?.CloseDetail
                                          ? "กรุณากรอกหมายเหตุการปิดรายการ"
                                          : ""
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                          <Accordion
                            expanded={isMinimizeotappOpen}
                            onChange={() =>
                              setisMinimizeOtappOpen(!isMinimizeotappOpen)
                            }
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fafafa",
                              mt: 2,
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
                                      value={close_note}
                                      labelName=""
                                      onchange={(e) => {
                                        setclose_note(e);
                                        if (onCloseNoteChange) {
                                          onCloseNoteChange(e);
                                        }
                                      }}
                                      readonly={!isActionCloseAdd}
                                      Validate={
                                        validateText?.CloseNote || false
                                      }
                                      validateTextLable={
                                        validateText?.CloseNote
                                          ? "กรุณากรอกหมายเหตุเพิ่มเติม"
                                          : ""
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      </Grid>
                    </Paper>
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
