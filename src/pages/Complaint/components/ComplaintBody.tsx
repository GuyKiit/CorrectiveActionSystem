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
import DoneIcon from "@mui/icons-material/Done";
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
import {
  mas_DepartmentDomainGet,
  mas_DepartmentGet_Complaint,
  mas_DomainGet,
  mas_DomainRelateGet,
} from "../../../service/mas/lov";
import { isAction } from "redux";
import FuncDialog from "../../../components/MUI/FullDialog";

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
  isAcknowledge?: boolean;
  dataelement?: any;
  validateText?: Validate;
  validateDetailText?: { [index: number]: detail };
  hideReject?: boolean;
  onBlocksChange?: (blocks: Block[]) => void;
  onReportTypeChange?: (val: any) => void;
  onDateOfDetectionChange?: (val: any) => void;
  onDepartmentAreaChange?: (val: any) => void;
  onProductNameChange?: (val: any) => void;
  onLotNoChange?: (val: any) => void;
  onEmailChange?: (val: any) => void;
  onRespondentDepartmentChange?: (val: any) => void;

  onComplaintTypeChange?: (val: any) => void;
  onOtherTypeChange?: (val: any) => void;

  onComplaintRsChange?: (val: any) => void;
  onOtherRsChange?: (val: any) => void;
  onClauseChange?: (val: any) => void;

  onDetailChange?: (val: any) => void;
  onPriorityChange?: (val: any) => void;

  handleOpenAdd?: () => void;
  openExplainView?: boolean;
  handleCloseExplainView?: () => void;
  handleOnclickExplainView?: (item: any, name: string) => void;
  handleOnclickExplainApproveSc?: (item: any) => void;
  handleOnclickExplainApproveQc?: (item: any) => void;

  handleOnclickComplainCloseAdd?: (item: any) => void;
  submitCount?: number;
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
  isAcknowledge,
  validateText,
  onBlocksChange,
  validateDetailText,
  // openExplainView,
  // handleCloseExplainView,

  onReportTypeChange,
  onDateOfDetectionChange,
  onDepartmentAreaChange,
  onProductNameChange,
  onLotNoChange,
  onEmailChange,
  onRespondentDepartmentChange,

  onComplaintTypeChange,
  submitCount,
  onOtherTypeChange,

  onComplaintRsChange,
  onOtherRsChange,
  onClauseChange,

  onDetailChange,
  onPriorityChange,

  handleOpenAdd,
  handleOnclickExplainView,
  handleOnclickExplainApproveSc,
  handleOnclickExplainApproveQc,

  handleOnclickComplainCloseAdd,
}: ComplaintBody) {



  const isActionRead = action === "Read";
  const isActionAdd = action === "Add";
  const isActionEdit = action === "Edit";
  const isActionDelete = action === "Delete";

  const isActionExplain = action === "Explain";
  const isActionReadExplain = action === "ReadExplain";

  const isActionClose = action === "Close";
  const isActionExplainApproveSc = action === "ApproveSC";
  const isActionExplainApproveQc = action === "ApproveQC";
  const isActionCloseHistory = action === "CloseHistory";

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
    setdataelement,
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
    complaint_status_label,
    step_label,
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
    datapriority,
    dataphoto_Combobox,
    datapriority_Combobox,
    datapriorityValue_Combobox,
    dataApprove_Combobox,
    root_cause,
    close_name,
    close_company_id,
    close_department_id,
    close_position,
    close_email,
    close_date,
    close_detail,
    close_note,

    // Dataset
    dataset_crosscompany,
    dataset_reporttype,
    dataset_company,
    dataset_department,
    dataset_domain,
    dataset_domainrelate,
    complaintFiles,
    dataFuapp,
    domainrelate,
    departmentrelate,
    department,
    domain,
    explainList,
    dataset_configfile,

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
    setdatapriority,

    setreference_standard_other,
    setacknowledge_flag,
    setacknowledge_name,
    setacknowledge_company_id,
    setacknowledge_department_id,
    setacknowledge_position,
    setacknowledge_email,
    setacknowledge_datetime,
    setcomplaint_status_id,
    setcomplaint_status_label,
    setstep_label,
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
    setdataApprove_Combobox,
    setroot_cause,

    setclose_name,
    setclose_company_id,
    setclose_department_id,
    setclose_position,
    setclose_email,
    setclose_date,
    setclose_detail,
    setclose_note,

    // Dataset
    setdataset_crosscompany,
    setdataset_reporttype,
    setdataset_company,
    setdataset_department,
    setdataset_domain,
    setdataset_domainrelate,
    setcomplaintFiles,
    setdataFuapp,
    set_domainrelate,
    set_departmentrelate,
    set_department,
    set_domain,
    setExplainList,
    setdataset_configfile,
  } = useListComplaint();

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const complaintTypeRef = useRef<HTMLDivElement>(null);
  const complaintRsRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);
  const [firstErrorField, setFirstErrorField] = useState<string | null>(null);

  useEffect(() => {
    if (!validateText) return;

    // Define the order of fields from top to bottom based on Validate type
    const fieldOrder: (keyof Validate)[] = [
      "Product_Group",
      "Report_Type",
      "Respondent_Department",
      "Date_of_Detection",
      "Department_Area",
      "Product_Name",
      "Lot_No",
      "Email",
      "Complaint_Type",
      "Other_Type",
      "Complaint_Rs",
      "Clause_Rs",
      "Other_Rs",
      "Detail",
      "Priority",
    ];

    // Find the first field that has an error
    const firstError = fieldOrder.find((field) => validateText[field]);

    if (firstError) {
      setFirstErrorField(firstError);
      
      // Handle scrolling for Accordions
      if (firstError === "Complaint_Type" && complaintTypeRef.current) {
        complaintTypeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstError === "Complaint_Rs" && complaintRsRef.current) {
        complaintRsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (firstError === "Priority" && priorityRef.current) {
        priorityRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setFirstErrorField(null);
    }
  }, [submitCount]);


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
  const [filteredFuApprove, setFilteredFuApprove] = useState<LovType[]>([]);
  // Value Variables ======================================================
  const [dataComplaintType, setdataComplaintType] = useState<LovType[]>([]);
  const [dataComplaintRs, setdataComplaintRs] = useState<LovType[]>([]);
  const [dataphoto, setdataphoto] = useState<LovType[]>([]);
  // const [datapriority, setdatapriority] = useState<LovType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileAttachmentTypes, setFileAttachmentTypes] = useState<{
    [fileIndex: number]: string;
  }>({});
  const [fileOtherTexts, setFileOtherTexts] = useState<{
    [fileIndex: number]: string;
  }>({});
  const [fileList, setFileList] = useState<FileData[]>([]);
  // const [explainList, setExplainList] = useState<any[]>([]);

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

  const lastFetchedDepartment = React.useRef<{
    company: any;
    domain: any;
  } | null>(null);

  // สร้าง state สำหรับควบคุม Accordion
  const [isMinimizedefaultOpen, setisMinimizeDefaultOpen] = useState(true);
  const [isMinimizetypeOpen, setisMinimizeTypeOpen] = useState(
    action === "Explain" || action === "ApproveSCAdd" ? false : true
  );
  const [isMinimizersOpen, setisMinimizeRsOpen] = useState(
    action === "Explain" || action === "ApproveSCAdd" ? false : true
  );
  const [isMinimizedetailOpen, setisMinimizeDetailOpen] = useState(
    action === "Explain" || action === "ApproveSCAdd" ? false : true
  );
  const [isMinimizepriorityOpen, setisMinimizePriorityOpen] = useState(
    action === "Explain" || action === "ApproveSCAdd" ? false : true
  );
  const [isMinimizefileOpen, setisMinimizeFileOpen] = useState(true);
  const [isMinimizerespondOpen, setisMinimizeRespondOpen] = useState(true);
  const [isMinimizeexlistOpen, setisMinimizeExlistOpen] = useState(true);
  const [isMinimizecloseOpen, setisMinimizeCloseOpen] = useState(true);
  const [isMinimizefuappOpen, setisMinimizeFuappOpen] = useState(true);
  const [isMinimizedeapp2Open, setisMinimizeDeapp2Open] = useState(true);
  const [isMinimizeotapp2Open, setisMinimizeOtapp2Open] = useState(true);
  const isCrossCompany = dataset_crosscompany?.[0]?.lov_code == "1";
  const grouped = {
  config_file: dataset_configfile || [],
};
  // Check Acknowledge flag =========================================================
  const updateAcknowledgeFlag = (value: any) => {
    // console.log("####### Onchange Company Value [event] : ", value);
    // console.log("@@@@@@@@@@@@First", dataset_domainrelate);
    // console.log("Render check respondent_domain_id:", respondent_domain_id);

    if (value != null) {
      mas_DomainRelateGet(value, set_domainrelate,user , isCallFuncLogOn);
    } else {
      setrespondent_domain_id(null);
    }
    // console.log("@@@@@@@@@@@@second", dataset_domainrelate);
  };

  // Event Handlers =========================================================
  const handleCompanyChange = (value: any) => {
    if (value != null) {
      // เรียก fetch domain ของ company ทั้งหมด
      mas_DomainRelateGet(value.company_id, set_domainrelate, user, isCallFuncLogOn);

      // เคลียร์ domain ที่เลือกก่อน
      setrespondent_domain_id(null);

      // เคลียร์ department ที่เกี่ยวข้องด้วย
      setdataset_department([]);
      setrespondent_department_id(null);
    } else {
      set_domainrelate([]);
      setrespondent_domain_id(null);
      setdataset_department([]);
      setrespondent_department_id(null);
    }
  };

  const handleDomainChange = async (value: any) => {
    // เคลียร์ข้อมูลแผนกทันที (ทั้ง list และค่าเลือก)
    setdataset_department([]);
    setrespondent_department_id(null);
    setrespondent_email("");

    if (!value) return;

    const dataset = {
      domain_id: value.domain_id,
      company_id: respondent_company_id?.company_id,
    };

    await mas_DepartmentGet_Complaint(
      dataset,
      setdataset_department,
      isCallFuncLogOn,
      user,
      action
    );
  };

  // Function Handlers (On Change Event) ======================================================
  const handleReportTypeChange = async (val: LovType | null) => {
    // if (true)console.log( "🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  handleReportTypeChange");

    // console.log(val, "valvalvalvalvalvalvalvalvalvalvalvalvalvalvalval");

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
    // console.log(dataReportTypeValue, "dataReportTypeValue");

    // Clear validation error when user selects a value
    if (onReportTypeChange) {
      onReportTypeChange(val);
    }

    setrespondent_domain_id(dataset_company[0]);
    setrespondent_company_id(dataset_company[0]);

    if (Array.isArray(dataset_company)) {
      const mappedCompany = await setValueMas(
        dataset_company,
        user[0]?.itasset_company_id,
        "company_id"
      );

      if (mappedCompany) {
        setrespondent_company_id(mappedCompany); // ค่า default ของ Combobox
      }
    }

    if (Array.isArray(dataset_company)) {
      const mappedCompany = await setValueMas(
        dataset_company,
        user[0]?.itasset_company_id,
        "company_id"
      );

      if (mappedCompany) {
        setrequest_company_id(mappedCompany); // ค่า default ของ Combobox
      }
    }

    setcas_number("");

    setdate_of_detection(null);
    setrespondent_department_id(null);
    setproduct_name("");
    setlot_no("");
    setrespondent_email("");
    setdataComplaintTypeValue_Combobox([]);
    setdataComplaintType([]);
    setcompTypeOther("");
    setdataComplaintRsValue_Combobox([]);
    setdataComplaintRs([]);
    setcompRsOther("");
    setclauseOther("");
    setdetail("");
    setdatapriorityValue_Combobox(null);
    setdatapriority(null);
    setrespond_date_within(null);
    setdataphotoValue_Combobox([]);
    setdataphoto([]);
    setotherText("");
    setphoTypeOther("");

    setrequest_name("");
    setrequest_position("");
    setrespondent_domain_id("");
    // setrequest_department_id(dataset_department[0]);
    setrequest_email("");
    setrequest_phone("");
    setrequest_domain_id(dataset_company[0]);
    // setrequest_company_id(dataset_company[0]);
    setFileList([]);
    setcomplaintFiles([]);
  };

  const handleCheckboxChangeCT = (item: LovType) => {
    // if (true)console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  handleCheckboxChangeCT");

    // console.log("💛💛item", item);

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
      // console.log("Reduced array:", reducedArray);

      // อัปเดตเข้า context
      setdataComplaintTypeValue_Combobox(reducedArray);
      // console.log(newData, "newData");

      // Clear validation error when user selects/deselects complaint type
      if (onComplaintTypeChange) {
        onComplaintTypeChange(newData);
      }

      return newData;
    });
  };

  const handleCheckboxChangeRS = (item: LovType) => {
    // if (true) console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  handleCheckboxChangeRS");

    setdataComplaintRs((prev: LovType[] = []) => {
      // console.log("💚💚item", item);
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

      // console.log("Reduced array:", reducedArray);

      setdataComplaintRsValue_Combobox(reducedArray);

      // Clear validation error when user selects/deselects complaint rs
      if (onComplaintRsChange) {
        onComplaintRsChange(newData);
      }

      return newData;
    });
  };

  const handleCheckboxChangePhotoType = (item: LovType) => {
    // if (true)console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  handleCheckboxChangePhotoType");

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

      // console.log("Reduced array:", reducedArray);

      setdataphotoValue_Combobox(reducedArray);

      return newData;
    });
  };

  // รับ ComplaintFile[] จาก BrowseFileUpload
  const handleFileChange = (fileArray: ComplaintFile[]) => {
    // if (true)console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  handleFileChange");

    if (!fileArray || fileArray.length === 0) return;
    const updatedList = [...fileList, ...fileArray];
    setFileList(updatedList);
    setcomplaintFiles(updatedList);
  };

  // const handleFileAttachmentTypeChange = (index: number, type: string) => {
  //   if (true)
  //     console.log(
  //       "🕑 ",
  //       dayjs().format("HH:mm:ss.SSS"),
  //       " [Calling Function]  :  handleFileAttachmentTypeChange"
  //     );

  //   const updated = [...fileList];
  //   updated[index] = {
  //     ...updated[index],
  //     attachmentType: type,
  //     otherText: type === "TRR_AT_4" ? updated[index].otherText : "",
  //   };
  //   setFileList(updated);
  //   setcomplaintFiles(updated);
  // };

  // const handleFileOtherTextChange = (index: number, text: string) => {
  //   if (true)
  //     console.log(
  //       "🕑 ",
  //       dayjs().format("HH:mm:ss.SSS"),
  //       " [Calling Function]  :  handleFileOtherTextChange"
  //     );

  //   const updated = [...fileList];
  //   updated[index] = { ...updated[index], otherText: text };
  //   setFileList(updated);
  //   setcomplaintFiles(updated);
  //   return updated;
  // };

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

  const priorityCalculateRespondDate = (
    daysToAdd: number,
    checked: boolean
  ) => {
    if (true)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  priorityCalculateRespondDate"
      );

    if (checked) {
      const newDate = dayjs().add(daysToAdd, "day"); // use dayjs instead of Date
      setrespond_date_within(newDate);
    } else {
      setrespond_date_within(null);
    }
  };

  const arraysAreEqual = (a: any[], b: any[]) => {
    // if (true) console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  arraysAreEqual");

    if (a.length !== b.length) return false;
    return a.every(
      (item, index) => JSON.stringify(item) === JSON.stringify(b[index])
    );
  };

  const handleRemoveFile = async (index: number) => {
    // if (true)console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  handleRemoveFile");

    const fileToRemove = fileList[index];

    // ถ้าเป็นไฟล์ที่มีอยู่แล้วในฐานข้อมูล (มี id)
    if (fileToRemove && fileToRemove.id) {
      try {
        // เรียกใช้ endpoint ลบไฟล์จากฐานข้อมูล
        const deletePayload = {
          id: fileToRemove.id,
          update_by: user[0]?.employee_username || "",
        };

        // console.log("🗑️ Deleting file from database:", deletePayload);
        const response = await _POST(
          deletePayload,
          "/ComplaintFile/ComplaintFileEdit"
        );
        // console.log("🗑️ Delete response:", response);

        if (response && response.status === "success") {
          // console.log("✅ File deleted from database successfully");
        } else {
          // console.log("⚠️ Failed to delete file from database:", response);
        }
      } catch (error) {
        // console.error("❌ Error deleting file from database:", error);
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

  const Dept_setup_By_Domain_dept_id_Get = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  Dept_setup_By_Domain_dept_id_Get"
      );

    if (!data?.domain_dept_id) {
      console.warn("⚠️ ไม่มี domain_dept_id ใน data:", data);
      return null;
    }

    setIsLoadingScreen(false);
    const dataset = { domain_dept_id: data.domain_dept_id };
    console.log("🧩 Payload ส่งเข้า SP :", dataset);

    try {
      const response = await _POST(
        dataset,
        "/DeptSetup/DeptSetupByDomaindeptidGet"
      );
      console.log("📥 DeptSetup Response (full):", response);
      console.log("🧩 Payload ส่งเข้า SP :", dataset);

      // คืน response ทั้งก้อน ให้ caller เลือกเอา element ที่ต้องการ
      return response || null;
    } catch (e) {
      console.error("❌ Error DeptSetupByDomaindeptidGet:", e);
      return null;
    } finally {
      setIsLoadingScreen(false);
    }
  };

  const Acknowledge_Update = async (data: any) => {
    // if (isCallFuncLogOn)console.log("🕑 ", dayjs().format("HH:mm:ss.SSS"), " [Calling Function]  :  Acknowledge_Update");

    // setIsLoadingScreen(true)
    const dataset = {
      id: data.id,
      acknowledge_flag: data.acknowledge_flag,
      acknowledge_name: user[0]?.employee_username,
      acknowledge_company_id: user[0]?.itasset_company_id,
      acknowledge_department_id: user[0]?.itasset_department_id,
      acknowledge_position: user[0]?.employee_position,
      acknowledge_email: user[0]?.employee_email,
      update_by: user[0]?.employee_username,
    };

    try {
      let response = await _POST(dataset, "/Acknowledge/AcknowledgeEdit");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setdataelement(response.data[0]);
      }
    } catch (e) {}
  };

  // Function - Get Complaints
  const Complaint_Get = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  Complaint_Get"
      );

    // setIsLoadingScreen(true)
    const dataset = {
      id: data.id,
      user_id: user[0]?.employee_username,
      domain_id: user[0]?.employee_domain,
      department_id: user[0]?.itasset_department_id,
      company_id: user[0]?.itasset_company_id,
    };
    // console.log("Read step:4 dataset: ", dataset);

    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      // console.log("Read step:4 ผลลัพธ์ : ", response);
      // console.log("Read step:4 Normalize ปรับค่าใหม่ : ", response.data[0]);
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setdataelement(response.data[0]);
      }
    } catch (e) {
      // console.log("error");
    }
  };

  // Function - Get Explain List
  const ExplainGet = async () => {
    if (isCallFuncLogOn)
      if (!dataelement?.id) {
        // console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  ExplainGet");

        // console.log("No complaint ID, skipping explain fetch");
        return;
      }

    setIsLoadingScreen(true);
    const dataset = {
      complaint_id: dataelement?.id,
    };

    try {
      let response = await _POST(dataset, "/Explain/ExplainGet");
      console.log("ExplainGet response:", response);
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setExplainList(response.data || []);
        setcomplaint_status_id(dataelement?.complaint_status_id);
        console.log("dataelementdataelement", dataelement);

        console.log("Explain list:", response.data);
        console.log("explainList list:", explainList);
      }
    } catch (e) {
      // console.log("ExplainGet error:", e);
      setIsLoadingScreen(false);
    }
  };

  useEffect(() => {
    console.log("complaint_status_id", complaint_status_id);
  }),
    [complaint_status_id];

  // READ - Get Complaints
  const ComplaintFile_Get = async () => {
    if (true)
      if (!dataelement?.id) {
        // console.log("🕑 ", dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  ComplaintFile_Get");

        // ตรวจสอบว่ามี dataelement?.id หรือไม่  ไม่error หากไม่มีไฟล์
        // console.log("No complaint ID, skipping file fetch");
        setFileList([]);
        setcomplaintFiles([]);
        return;
      }

    // ✅ Safety Check: ป้องกันการเรียกด้วย Explain Data หรือข้อมูลที่ไม่ใช่ Complaint
    if (dataelement?.complaint_id || !dataelement?.cas_number) {
      console.log("⏭️ Skip ComplaintFile_Get - Invalid data type (likely Explain data)");
      setFileList([]);
      setcomplaintFiles([]);
      return;
    }

    //setIsLoadingScreen(true);
    const dataset = {
      complaint_id: dataelement?.id,
      cf_type: "Complaint",
    };

    try {
      let response = await _POST(dataset, "/ComplaintFile/ComplaintFileGet");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        const responseData: any = [];

        if (Array.isArray(response.data) && response.data.length > 0) {
          // console.log("################# FILE #######################:",response.data); // เช็คว่ามีกี่แถวจริง ๆ

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
          // console.log("No files found");
          setFileList([]);
          setcomplaintFiles([]);
        }
      } else {
        // Response ไม่สำเร็จ
        // console.log("Failed to get files:", response);
        setFileList([]);
        setcomplaintFiles([]);
      }
    } catch (e) {
      setFileList([]);
      setcomplaintFiles([]);
    } finally {
      setIsLoadingScreen(false);
    }
  };

  // ⭐⭐⭐⭐⭐ Start : ==============================================================================================//
  // const effectRan = React.useRef(false); // ป้องกัน run ซ้ำใน dev mode
  const lastDataElement = React.useRef<any>(null); // Track last processed data
  const hasMappedDepartment = React.useRef(false); // Track if department has been mapped
  React.useEffect(() => {
    if (respondent_company_id) {
      mas_DomainRelateGet(
        respondent_company_id.company_id,
        set_domainrelate,
        user,
        isCallFuncLogOn
      );
    }
  }, [respondent_company_id]);

  // 🧩 1️⃣ โหลดข้อมูลหลัก (ReportType, Company, Domain, Department)
  React.useEffect(() => {
    if (!dataelement || action === "Add") return; // 👈 ป้องกันตอน New

    // ✅ ป้องกันการทำงานเมื่อเป็น Explain Data (มี complaint_id)
    if (dataelement?.complaint_id) {
      console.log("⏭️ Skip master data load - dataelement is Explain data");
      return;
    }

    // if (effectRan.current) return;
    // effectRan.current = true;

    // Prevent double invoke on same data object (Strict Mode protection)
    // But allow run if dataelement object reference changes (e.g. Refresh/Cancel)
    if (lastDataElement.current === dataelement) return;
    lastDataElement.current = dataelement;
    hasMappedDepartment.current = false;

    const loadInitialData = async () => {
      try {
        // 1) Report Type
        if (Array.isArray(dataset_reporttype) && dataelement?.report_type) {
          const defaultVal =
            (await setValueMas(
              dataset_reporttype,
              dataelement.report_type,
              "id"
            )) ||
            dataset_reporttype.find(
              (item: LovType) =>
                item.lov_code === dataelement.report_type ||
                item.id === dataelement.report_type
            );
            // f (defaultVal) setdataReportTypeValue(defaultVal);
          if (defaultVal) {
            setdataReportTypeValue({
              ...defaultVal,
              displayText: defaultVal.lov3
                ? `${defaultVal.lov_code} (${defaultVal.lov3})`
                : defaultVal.lov_code,
            });
          }
        }

        // 2) Company
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
            setrespondent_company_id(mappedCompany);
            setrequest_company_id(mappedCompany);
          }
        }

        // 3) Domain relate
          await mas_DomainRelateGet(
          dataelement.respondent_company_id?.company_id ?? dataelement.respondent_company_id,
          set_domainrelate,
          user,
          isCallFuncLogOn
        );

        // // 4) Domain default
        // if (Array.isArray(domainrelate) && dataelement?.respondent_domain_id) {
        //   const mappedDomain = await setValueMas(
        //     domainrelate,
        //     dataelement.respondent_domain_id,
        //     "domain_id"
        //   );
        //   if (mappedDomain) setrespondent_domain_id(mappedDomain);
        // }

        // 5) โหลด Department
        if (dataelement?.respondent_department_id) {
          const currentCompanyId =
            dataelement.respondent_company_id?.company_id ??
            dataelement.respondent_company_id;
          const currentDomainId =
            dataelement.respondent_domain_id?.domain_id ??
            dataelement.respondent_domain_id ??
            null;

          const shouldFetch =
            !lastFetchedDepartment.current ||
            lastFetchedDepartment.current.company !== currentCompanyId ||
            lastFetchedDepartment.current.domain !== currentDomainId;

          if (shouldFetch) {
            await mas_DepartmentGet_Complaint(
              {
                domain_id: dataelement?.respondent_domain_id ?? null,
                company_id: dataelement.respondent_company_id,
              },
              setdataset_department,
              isCallFuncLogOn,
              user,
              action
            );
            lastFetchedDepartment.current = {
              company: currentCompanyId,
              domain: currentDomainId,
            };
          }
        }
      } catch (err) {
        console.error("❌ loadInitialData error:", err);
      }
    };

    loadInitialData();
  }, [dataelement]);

  React.useEffect(() => {
  if (
    Array.isArray(domainrelate) &&
    domainrelate.length > 0 &&
    dataelement?.respondent_domain_id
  ) {
    const run = async () => {
      const mapped = await setValueMas(
        domainrelate,
        dataelement.respondent_domain_id,
        "domain_id"
      );

      if (mapped) {
        setrespondent_domain_id(mapped);
        console.log("🎯 domain mapped:", mapped);
      }
    };

    run();
  }
}, [domainrelate, dataelement?.respondent_domain_id]);

React.useEffect(() => {
  if (
    Array.isArray(dataset_department) &&
    dataset_department.length > 0 &&
    dataelement?.respondent_department_id
  ) {
    const run = async () => {
      const mappedDept = await setValueMas(
        dataset_department,
        dataelement.respondent_department_id,
        "department_id"
      );

      if (mappedDept) {
        setrespondent_department_id(mappedDept);
        console.log("🏬 Department mapped:", mappedDept);
      }
    };

    run();
  }
}, [dataset_department, dataelement?.respondent_department_id]);

  // 🧩 2️⃣ เมื่อ dataset_department พร้อมจริง → map default
  React.useEffect(() => {
    const mapDepartment = async () => {
      if (
        !hasMappedDepartment.current &&
        Array.isArray(dataset_department) &&
        dataset_department.length > 0 &&
        dataelement?.respondent_department_id
      ) {
        console.log("🏬 Mapping department (ready):", {
          target: dataelement.respondent_department_id,
          dataset: dataset_department.map((d: any) => d.department_id),
        });

        const mappedDept = await setValueMas(
          dataset_department,
          dataelement.respondent_department_id,
          "department_id"
        );

        if (mappedDept) {
          setrespondent_department_id(mappedDept);
          console.log("✅ Department mapped:", mappedDept);
        } else {
          console.warn(
            "⚠️ Department not found:",
            dataelement.respondent_department_id
          );
        }
        hasMappedDepartment.current = true;
      }
    };

    mapDepartment();
  }, [dataset_department]); // 🔁 trigger เฉพาะตอน department dataset update จริง

  // --------------------
  // Filter Priority
  // --------------------
  React.useEffect(() => {
    if (!Array.isArray(datapriority_Combobox)) return;

    const newFilteredPriority = datapriority_Combobox.filter(
      (item: LovType) => item.lov_type === "priority_level"
    );

    setFilteredpriority((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newFilteredPriority)
        ? newFilteredPriority
        : prev
    );
  }, [datapriority_Combobox]);

  // --------------------
  // Filter Complaint/Attach/Reference ตาม reportType
  // --------------------
  React.useEffect(() => {
    if (!dataReportTypeValue) {
      setFilteredComplaintType([]);
      setFilteredComplaintRs([]);
      setFilteredFuApprove([]);
      setFilteredphoto([]);
      return;
    }

    const val = dataReportTypeValue;

    // Approve
    const newFilteredFuApprove = (dataApprove_Combobox || []).filter(
      (item: LovType) => item.lov_type === "approve_select"
    );
    setFilteredFuApprove((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newFilteredFuApprove)
        ? newFilteredFuApprove
        : prev
    );

    // Complaint Type
    const newComplaintType = (dataComplaintType_Combobox || []).filter(
      (item: LovType) =>
        item.lov_type === "complaint_type" && item.lov_code === val.id
    );
    setFilteredComplaintType((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newComplaintType)
        ? newComplaintType
        : prev
    );

    // Attach Type
    const newPhoto = (dataphoto_Combobox || []).filter(
      (item: LovType) => item.lov_type === "attach_type"
    );
    setFilteredphoto((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newPhoto) ? newPhoto : prev
    );

    // Reference Standard (เฉพาะ NCR)
    if (val.lov_code === "NCR") {
      const newComplaintRs = (dataComplaintRs_Combobox || []).filter(
        (item: LovType) =>
          item.lov_type === "reference_standard" && item.lov_code === val.id
      );
      setFilteredComplaintRs((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newComplaintRs)
          ? newComplaintRs
          : prev
      );
    } else {
      setFilteredComplaintRs([]);
    }
  }, [
    dataReportTypeValue,
    dataApprove_Combobox,
    dataComplaintType_Combobox,
    dataphoto_Combobox,
    dataComplaintRs_Combobox,
  ]);
  // ⭐⭐⭐⭐⭐ Start : ==============================================================================================//

  //////////////////////// Complaint Read //////////////////////////
  React.useEffect(() => {
    console.log("step: 5 เก็บข้อมูลเข้า ฺsetdataelement ใหม่ ", dataelement);
    console.log("DEBUG DATAELEMENT FIELDS:", {
      date_of_detection: dataelement?.date_of_detection,
      product_name: dataelement?.product_name,
      lot_no: dataelement?.lot_no,
      respondent_email: dataelement?.respondent_email
    });
    console.log("step: 5 เก็บข้อมูลเข้า ฺsetdataelement ใหม่ ", explainList);
    console.log("💾 close_name:", explainList?.close_name);
    console.log("💾 close_company_id:", explainList?.close_company_id);
    console.log("💾 close_email:", explainList?.close_email);
    console.log("💾 product_name:", dataelement?.product_name);

    if (dataelement && action != "Add") {
      // setrespondent_company_id(dataset_company.find((el: any) => String(el.itasset_company_id) === String(dataelement.respondent_company_id?.company_id)));
      setcas_number(dataelement?.cas_number || "");
      setdoc_date(
        dataelement?.doc_date
          ? dayjs(dataelement.doc_date, "DD-MM-YYYY")
          : dayjs()
      );
      setdate_of_detection(
        dataelement?.date_of_detection
          ? dayjs(dataelement.date_of_detection)
          : null
      );

      // Map respondent_department_id
      // console.log("🔍 Department mapping debug:", {respondent_department_id: dataelement.respondent_department_id,dataset_department_sample: dataset_department?.[0], });

      // const foundDept = dataset_department.find((el: any) => {
      //   return String(el.department_id) === String(dataelement.respondent_department_id);
      // });

      // console.log("🎯 Found department:", foundDept);
      // setrespondent_department_id(foundDept || null);

      setproduct_name(
        dataelement?.product_name ? dataelement?.product_name : ""
      );
      setlot_no(dataelement?.lot_no ? dataelement?.lot_no : "");
      setrespondent_email(
        dataelement?.respondent_email ? dataelement?.respondent_email : ""
      );
      setdataComplaintType(setComplaintType(dataelement?.complaintType));
      // setcompTypeOther(dataelement?.other ? dataelement?.other : "");
      setdataComplaintRs(setComplaintRs(dataelement?.complaintRs));
      // setcompRsOther(dataelement?.other ? dataelement?.other : "");
      // setclauseOther(dataelement?.clause ? dataelement?.clause : "");
      setdetail(dataelement?.detail ? dataelement?.detail : "");
      setpriority_level(setPriorityLevel(dataelement?.priority_level));
      setrespond_date_within(
        dataelement?.respond_date_within
          ? dayjs(dataelement.respond_date_within, "DD-MM-YYYY")
          : null
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
      // setrequest_company_id(dataset_company.find((el: any) => String(el.itasset_company_id) == String(dataelement.request_company_id?.company_id)));
      setcomplaint_status_label(dataelement?.complaint_status_label);

      // สมมติ LovType คือ { id: string; label: string }
      // if (dataelement && dataComplaintType?.length && dataComplaintRs?.length > 0) {

      // }

      const ct = setComplaintType(dataelement?.complaintType);
      setdataComplaintType(ct);

      // ⭐ สร้าง reducedArray สำหรับ dataComplaintTypeValue_Combobox
      // เพื่อให้ข้อมูลถูกส่งไปตอน save แม้ว่าจะไม่ได้คลิก checkbox
      const ctReducedArray = ct.map((c: any) => ({
        complaint_type_id: c.id,
        label: c.lov1,
        isOther: c.lov2,
      }));
      setdataComplaintTypeValue_Combobox(ctReducedArray);
      console.log("🔄 Loaded Complaint Type reduced array:", ctReducedArray);

      // ถ้ามี complaintType ที่เป็น Other ให้ดึงค่ามา
      const otherCT = ct.find((el: any) => el.lov2 === "Y");
      setcompTypeOther(otherCT?.other || "");

      const rs = setComplaintRs(dataelement?.complaintRs);
      setdataComplaintRs(rs);

      // ⭐ สร้าง reducedArray สำหรับ dataComplaintRsValue_Combobox
      const rsReducedArray = rs.map((r: any) => ({
        complaint_type_id: r.id,
        label: r.lov1,
        isOther: r.lov2,
        isClause: r.lov3,
      }));
      setdataComplaintRsValue_Combobox(rsReducedArray);
      console.log("🔄 Loaded Complaint RS reduced array:", rsReducedArray);

      // ⭐ ดึงค่า Other และ Clause จาก RS
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
      setdatapriorityValue_Combobox(dataelement?.priority_level || "");
      setpriority_level(selectedPriority);
      if (dataelement?.report_type === "TRR_RT_NCR") {
        setIsRSHidden(false);
      } else {
        setIsRSHidden(true);
      }
    }
  }, [dataelement, dataset_reporttype, dataset_company]);

  React.useEffect(() => {
    console.log("🔄 explainList UPDATED:", explainList);
    if (explainList?.length > 0 && action != "Add") {
      const close = explainList[0];

      console.log("👉 SELECTED explain for close:", close);

      setclose_name(close?.close_name || "");
      setclose_company_id(
        dataset_company?.find(
          (c: any) => Number(c.company_id) == close.close_company_id
        ) || null
      );
      setclose_department_id(
        dataset_department?.find(
          (d: any) => Number(d.department_id) == close.close_department_id
        ) || null
      );
      setclose_position(close?.close_position ? close?.close_position : "");
      setclose_email(close?.close_email ? close?.close_email : "");
      setclose_date(dayjs(close.close_date));
      setdataFuapp(
        dataApprove_Combobox.find(
          (item: any) => item.lov_code === close.close_status
        ) || null
      );
      setclose_detail(close?.close_detail ? close?.close_detail : "");
      setclose_note(close?.close_note ? close?.close_note : "");

      // console.log("💾2 close_name:", close?.close_name);
      // console.log("💾2 close_company_id:", close?.close_company_id);
      // console.log("💾2 close_company_id:", close_company_id);
      // console.log("💾2 close_email:", close?.close_email);
      // console.log("💾2 close_department_id:", close?.close_department_id);
      // console.log("💾2 close_department_id:", close_department_id);
      // console.log("💾2 close_position:", close?.close_position);
      // console.log("💾2 close_detail:", close?.close_detail);
      // console.log("💾2 close_note:", close?.close_note);
    }
  }, [explainList, dataset_department]);

  // ✅ ใช้ ref เพื่อเก็บ complaint ID ก่อนหน้า
  const prevComplaintIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const currentId = dataelement?.id;
    
    // ⚠️ ป้องกันการ fetch ซ้ำเมื่อ ID เหมือนเดิม
    // เมื่อปิด ExplainView → setdataelement(complaintMainData) → dataelement object เปลี่ยนแต่ ID เหมือนเดิม
    if (prevComplaintIdRef.current === currentId && currentId) {
      console.log("⏭️ Skip fetch - same complaint ID:", currentId);
      return;
    }

    if (!isActionAdd && currentId) {
      // ✅ ตรวจสอบว่าเป็น Complaint Object จริงหรือไม่
      // ถ้ามี complaint_id แสดงว่าเป็น Explain Data (ลูก) ที่ถูกส่งเข้ามาแทนที่ -> ข้ามการ fetch
      // (Complaint Data จะไม่มี field complaint_id ในตัวเอง)
      if (dataelement?.complaint_id) {
        console.log("⏭️ Skip fetch - dataelement has complaint_id (is Explain data)");
        return;
      }

      console.log("📥 Fetching data for complaint ID:", currentId);
      ComplaintFile_Get();
      ExplainGet();
      prevComplaintIdRef.current = currentId; // บันทึก ID ปัจจุบัน
    } else if (!currentId) {
      // ถ้าไม่มี ID ให้ reset ref
      prevComplaintIdRef.current = null;
    }
  }, [action, dataelement]); // ใช้ dataelement ทั้งหมดเป็น dependency

  React.useEffect(() => {
    const fetchAcknowlege = async () => {
      if (
        (isActionExplain ||
          (isActionReadExplain &&
            dataelement?.request_name != user[0].employee_username)) &&
        dataelement?.id
      ) {
        if (dataelement?.acknowledge_flag == 0) {
          await Acknowledge_Update(dataelement);
        }
        await Complaint_Get(dataelement); // ✅ Move inside: Only fetch if updated
      }
    };
    fetchAcknowlege();
  }, [action, dataelement?.id, dataelement?.acknowledge_flag]);

  const setComplaintType = (data: any) => {
    // console.log("🔍 setComplaintType input data:", data);
    // console.log("🔍 dataComplaintType_Combobox:", dataComplaintType_Combobox);

    const newData: any[] = [];

    if (!Array.isArray(data)) {
      console.warn("⚠️ setComplaintType: data is not an array", data);
      return newData;
    }

    data.forEach((el, index) => {
      console.log(`🔍 Processing element ${index}:`, el);

      // Try to find the complaint_type_id from the element
      const typeId = el.complaint_type_id;

      if (!typeId) {
        console.warn(
          `⚠️ setComplaintType: No complaint_type_id found in element ${index}`,
          el
        );
        return;
      }

      const filter = dataComplaintType_Combobox.find(
        (item: any) => item.id === typeId
      );

      if (filter) {
        console.log(`✅ Found matching type for ID ${typeId}:`, filter);
        newData.push({
          ...filter,
          other: el.other || "", // ⭐ เก็บค่าข้อความ Other มาด้วย
        });
      } else {
        console.warn(
          `⚠️ setComplaintType: No matching type found for ID ${typeId}`
        );
        console.warn(
          `⚠️ Available IDs:`,
          dataComplaintType_Combobox.map((item: any) => item.id)
        );
      }
    });

    console.log("🔍 setComplaintType output:", newData);
    return newData;
  };

  const setComplaintRs = (data: any) => {
    console.log("🔍 setComplaintRs input data:", data);
    console.log("🔍 dataComplaintRs_Combobox:", dataComplaintRs_Combobox);

    const newData: any[] = [];

    if (!Array.isArray(data)) {
      console.warn("⚠️ setComplaintRs: data is not an array", data);
      return newData;
    }

    data.forEach((el, index) => {
      console.log(`🔍 Processing RS element ${index}:`, el);

      // Try to find the complaint_type_id from the element
      const typeId = el.complaint_type_id;

      if (!typeId) {
        console.warn(
          `⚠️ setComplaintRs: No complaint_type_id found in element ${index}`,
          el
        );
        return;
      }

      const filter = dataComplaintRs_Combobox.find(
        (item: any) => item.id === typeId
      );

      if (filter) {
        console.log(`✅ Found matching RS for ID ${typeId}:`, filter);
        newData.push({
          ...filter,
          other: el.other || "", // ⭐ เก็บค่าข้อความ Other มาด้วย
          clause: el.clause || "",
        });
      } else {
        console.warn(
          `⚠️ setComplaintRs: No matching RS found for ID ${typeId}`
        );
        console.warn(
          `⚠️ Available RS IDs:`,
          dataComplaintRs_Combobox.map((item: any) => item.id)
        );
      }
    });

    console.log("🔍 setComplaintRs output:", newData);
    return newData;
  };
  const setPriorityLevel = (value: any) => {
    // if (true) console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  setPriorityLevel");

    if (!value) return null;

    // หา object ที่ id ตรงกับค่าที่ DB ส่งมา
    const selected =
      datapriority_Combobox.find((item: any) => item.id === value) || null;

    // console.log("🎯 Priority matched:", selected);
    return selected;
  };

  // #F29739

  return (
      <Box
        id="complaint-content-capture"  
        sx={{
          p: 2,
          mb: 2,
        border: "2px solid #39a2f2",
        borderRadius: 2,
        backgroundColor: "#ffffff",
      }}
    >
      <div className="px-2 pt-2 pb-5">
        <label className="sarabun-regular-datatable">
          ประเภทข้อมูลแบบฟอร์ม
        </label>
      </div>
      <Divider sx={{ my: 0.1, borderColor: "#39a2f2" }} />
      <Grid container spacing={2} mt={2}>
        <Grid size={6}>
          <AutocompleteComboBox
            required="required"
            value={dataReportTypeValue}
            labelName={"ประเภทรายงาน (Report Type)"}
            // options={dataset_reporttype} // <-- แก้ตรงนี้
            options={(dataset_reporttype || []).map((item: any) => ({
                ...item, // ✅ เก็บค่าทุกอย่างของ item เดิมไว้ (รวมถึง lov4)
                displayText: item.lov3
                  ? `${item.lov_code} (${item.lov3})`
                  : item.lov_code,
              }))}
            // column="lov_code"
            column="displayText"
            setvalue={handleReportTypeChange}
            readonly={!isActionAdd}
            bgcolorTextField={!isActionAdd}
            Validate={validateText?.Report_Type || false}
            shouldFocusError={firstErrorField === "Report_Type"}
            validateTextLable={
              validateText?.Report_Type
                ? "กรุณาเลือกประเภทรายงาน (Report Type)"
                : ""
            }
          />
        </Grid>
      </Grid>

      {/* ====== Dynamic ฟอร์ม สำหรับเลือกประเภทเอกสาร ====== */}
      {isFormHidden && dataReportTypeValue && (
        <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
          <Accordion
            expanded={isMinimizedefaultOpen}
            onChange={() => setisMinimizeDefaultOpen(!isMinimizedefaultOpen)}
            sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}
          >
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
                <Grid size={3} mt={2}>
                  <AutocompleteComboBox
                    value={respondent_company_id}
                    labelName={"โรงงาน (Factory)"}
                    options={dataset_company}
                    column="company_name"
                    // setvalue={(v) => setrespondent_company_id(v)}
                    setvalue={(val) => {
                      console.log("Company selected:", val?.company_name);
                      handleCompanyChange(val);

                      setrespondent_company_id(val);
                      console.log("cccccc", val);
                    }}
                    bgcolorTextField={true}
                    readonly={!isActionAdd || !isCrossCompany}
                  />
                </Grid>
                <Grid size={3} mt={2}>
                  <AutocompleteComboBox
                    value={respondent_domain_id}
                    labelName={"โดเมน (Domain)"}
                    options={domainrelate}
                    column="domain_name"
                    // setvalue={(v) => setrespondent_company_id(v)}
                    setvalue={(val) => {
                      console.log("Domain selected:", val?.domain_name);
                      console.log("Domain selected:", val?.domain_id);
                      console.log("😍val:", val);
                      handleDomainChange(val);

                      setrespondent_domain_id(val);
                      console.log("cccccc", val);

                      if (onRespondentDepartmentChange) {
                        onRespondentDepartmentChange(val);
                      }
                    }}
                    bgcolorTextField={true}
                    readonly={!isActionAdd && !isActionEdit}
                    required="required"
                    Validate={validateText?.Respondent_Department || false}
                    shouldFocusError={firstErrorField === "Respondent_Department"}
                    validateTextLable={
                      validateText?.Respondent_Department
                        ? "กรุณาเลือกโดเมน"
                        : ""
                    }
                  />
                </Grid>
                <Grid size={3} mt={2}>
                  <FullWidthTextField
                    value={cas_number || "AUTO"}
                    labelName="CAS Number"
                    onchange={(e) => {
                      setcas_number(e);
                    }}
                    readonly
                  />
                </Grid>
                <Grid size={3} mt={2}>
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
                    background: "#ffebeb",
                    // background: "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
                    border: "1px solid #f44336",
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
                      แผนกผู้ถูกร้องเรียน (Respondent Department) + {action}
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
                        readonly={!isActionAdd && !isActionEdit}
                        Validate={validateText?.Date_of_Detection || false}
                        shouldFocusError={firstErrorField === "Date_of_Detection"}
                        validateTextLable={
                          validateText?.Date_of_Detection
                            ? "กรุณาเลือกวันที่พบปัญหา"
                            : ""
                        }
                        submitCount={submitCount}
                      />
                    </Grid>
                    <Grid size={4}>
                      <AutocompleteComboBox
                        key={respondent_domain_id?.domain_id || "no-domain"}
                        required="required"
                        value={respondent_department_id}
                        labelName={"แผนกที่พบปัญหา (Department / Area of Detection)"}
                        options={dataset_department}
                        column="department_name"
                        setvalue={async (val) => {
                          console.log(
                            "Selected value:",
                            val,
                            "respondent_department_id :",
                            respondent_department_id
                          );
                          setrespondent_department_id(val);

                          // ✅ ดึงข้อมูล Email จากแผนกที่เลือก
                          // ดึงข้อมูลจาก API (คืน response ทั้งก้อน)
                          const resp = await Dept_setup_By_Domain_dept_id_Get(
                            val
                          );
                          // resp?.data อาจเป็น Array หรือ undefined
                          const arr = Array.isArray(resp?.data)
                            ? resp.data
                            : resp?.data
                            ? [resp.data]
                            : [];

                          const found =
                            arr.find((d: any) => d?.dept_email || d?.email) ??
                            arr ??
                            null;

                          const email = found?.dept_email ?? "ไม่พบ Email";

                          console.log(
                            "📧 Selected dept email extracted:",
                            email,
                            "from",
                            found
                          );
                          setrespondent_email(email);
                          if (!val) {
                            setrespondent_email("");
                            return;
                          }

                          if (onDepartmentAreaChange) {
                            onDepartmentAreaChange(val);
                          }
                        }}
                        bgcolorTextField={
                          isActionAdd ? false : isActionEdit ? false : true
                        }
                        readonly={
                          (!isActionAdd && !isActionEdit) ||
                          !respondent_domain_id
                        }
                        Validate={validateText?.Department_Area || false}
                        shouldFocusError={firstErrorField === "Department_Area"}
                        validateTextLable={
                          validateText?.Department_Area
                            ? "กรุณาเลือกแผนกที่พบปัญหา"
                            : ""
                        }
                        submitCount={submitCount}
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
                        //readonly={isActionRead || isActionDelete || isActionExplain}
                        readonly={!isActionAdd && !isActionEdit}
                        Validate={validateText?.Product_Name || false}
                        shouldFocusError={firstErrorField === "Product_Name"}
                        validateTextLable={
                          validateText?.Product_Name
                            ? "กรุณากรอกชื่อสินค้า"
                            : ""
                        }
                        submitCount={submitCount}
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
                        bgcolorTextField={true}
                        //readonly={isActionRead || isActionDelete || isActionExplain}
                        readonly={!isActionAdd && !isActionEdit}
                        Validate={validateText?.Lot_No || false}
                        shouldFocusError={firstErrorField === "Lot_No"}
                        validateTextLable={
                          validateText?.Lot_No ? "กรุณากรอก Lot No./Bag No" : ""
                        }
                        submitCount={submitCount}
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
                        readonly
                        Validate={validateText?.Email || false}
                        shouldFocusError={firstErrorField === "Email"}
                        validateTextLable={
                          validateText?.Email ? "กรุณากรอกอีเมล" : ""
                        }
                        submitCount={submitCount}
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
                      {dataReportTypeValue && action !== "ApproveSCAdd" && (
                        <Grid size={12} sx={{ display: "flex" }}>
                          <Accordion
                            expanded={isMinimizetypeOpen}
                            onChange={() =>
                              setisMinimizeTypeOpen(!isMinimizetypeOpen)
                            }
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fafafa",
                              border: validateText?.Complaint_Type
                                ? "1px solid #f44336"
                                : "1px solid #e0e0e0",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="reference-standard-content"
                              id="reference-standard-header"
                              ref={complaintTypeRef}
                            >
                              <Typography
                                className="sarabun-regular-datatable"
                                sx={{
                                  fontSize: "18px",
                                  fontWeight: 600,
                                  color: "#333",
                                }}
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
                                          readonly={
                                            !isActionAdd && !isActionEdit
                                          }
                                        />
                                      </Grid>
                                    )
                                  )}
                                </Grid>
                                <Box sx={{ mt: "auto", pt: 2 }}>
                                  {dataComplaintType.some(
                                    (c) => c.lov2 === "Y"
                                  ) && (
                                    <FullWidthTextArea
                                      value={compTypeOther}
                                      labelName="Other:"
                                      onchange={(e) => {
                                        setcompTypeOther(e);
                                        if (onOtherTypeChange) {
                                          onOtherTypeChange(e);
                                        }
                                      }}
                                      bgcolorTextField={
                                        isActionAdd
                                          ? false
                                          : isActionEdit
                                          ? false
                                          : true
                                      }
                                      readonly={!isActionAdd && !isActionEdit}
                                      // shouldFocusError={validateText?.Other_Type}
                                      submitCount={submitCount}
                                      Validate={validateText?.Other_Type || false}
                                      shouldFocusError={firstErrorField === "Other_Type"}
                                      validateTextLable={
                                        validateText?.Other_Type
                                          ? "กรุณากรอกรายละเอียด"
                                          : ""
                                      }
                                    />
                                  )}
                                </Box>
                              </Box>

                              {validateText?.Complaint_Type && (
                                <label
                                  className="fs-7 py-1 sarabun-regular-lable-validate"
                                  style={{ color: "red" }}
                                >
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
                            onChange={() =>
                              setisMinimizeRsOpen(!isMinimizersOpen)
                            }
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fafafa",
                              border: validateText?.Complaint_Rs
                                ? "1px solid #f44336"
                                : "1px solid #e0e0e0",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="reference-standard-content"
                              id="reference-standard-header"
                              ref={complaintRsRef}
                            >
                              <Typography
                                className="sarabun-regular-datatable"
                                sx={{
                                  fontSize: "18px",
                                  fontWeight: 600,
                                  color: "#333",
                                }}
                              >
                                มาตรฐานอ้างอิง (Reference Standard){" "}
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
                                        onchange={() =>
                                          handleCheckboxChangeRS(item)
                                        }
                                        readonly={!isActionAdd && !isActionEdit}
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
                                      bgcolorTextField={
                                        isActionAdd
                                          ? false
                                          : isActionEdit
                                          ? false
                                          : true
                                      }
                                      readonly={!isActionAdd && !isActionEdit}
                                      Validate={validateText?.Clause_Rs || false}
                                      shouldFocusError={firstErrorField === "Clause_Rs"}
                                      validateTextLable={
                                        validateText?.Clause_Rs
                                          ? "กรุณากรอกรายละเอียด Clause"
                                          : ""
                                      }
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
                                      bgcolorTextField={
                                        isActionAdd
                                          ? false
                                          : isActionEdit
                                          ? false
                                          : true
                                      }
                                      readonly={!isActionAdd && !isActionEdit}
                                      shouldFocusError={firstErrorField === "Other_Rs"}
                                      submitCount={submitCount}
                                      Validate={validateText?.Other_Rs || false}
                                      validateTextLable={
                                        validateText?.Other_Rs
                                          ? "กรุณากรอกรายละเอียด Other"
                                          : ""
                                      }
                                    />
                                  )}
                                </Box>
                              </Box>
                              {validateText?.Complaint_Rs && (
                                <label
                                  className="fs-7 py-1 sarabun-regular-lable-validate"
                                  style={{ color: "red" }}
                                >
                                  กรุณาเลือกมาตรฐานอ้างอิง
                                </label>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      )}
                    </Grid>

                    {dataReportTypeValue && (
                      <Box sx={{ mt: 3 }}>
                        <Accordion
                          expanded={isMinimizedetailOpen}
                          onChange={() =>
                            setisMinimizeDetailOpen(!isMinimizedetailOpen)
                          }
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            border: validateText?.Detail
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
                              รายละเอียด (Detail){" "}
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
                                  bgcolorTextField={
                                    action === "Add"
                                      ? false
                                      : isActionEdit
                                      ? false
                                      : true
                                  }
                                  readonly={!isActionAdd && !isActionEdit}
                                  Validate={validateText?.Detail || false}
                                  shouldFocusError={firstErrorField === "Detail"}
                                  validateTextLable={
                                    validateText?.Detail
                                      ? "กรุณากรอกรายละเอียด (Detail)"
                                      : ""
                                  }
                                  submitCount={submitCount}
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
                          onChange={() =>
                            setisMinimizePriorityOpen(!isMinimizepriorityOpen)
                          }
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            border: validateText?.Priority
                              ? "1px solid #f44336"
                              : "1px solid #e0e0e0",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="reference-standard-content"
                            id="reference-standard-header"
                            ref={priorityRef}
                          >
                            <Typography
                              className="sarabun-regular-datatable"
                              sx={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#333",
                              }}
                            >
                              ระดับความสำคัญ (Priority){" "}
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
                                            checked={
                                              datapriority?.id === item.id
                                            }
                                            onChange={(e) => {
                                              console.log(
                                                "🎯 Priority radio clicked:",
                                                item
                                              );
                                              setdatapriority(item);
                                              setdatapriorityValue_Combobox(
                                                item.id
                                              );
                                              setpriority_level(item.id);
                                              const days = Number(
                                                item.lov3 ?? 0
                                              );
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
                                            // disabled={
                                            //   isActionRead ||
                                            //   isActionEdit ||
                                            //   isActionDelete ||
                                            //   isActionExplain
                                            // }
                                            disabled={
                                              !isActionAdd && !isActionEdit
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
                              <label
                                className="fs-7 py-1 sarabun-regular-lable-validate"
                                style={{ color: "red" }}
                              >
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
                    background:
                      "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
                  }}
                >
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
                              setFileName={() => {}}
                              options={(filteredphoto || []).map((p: any) => ({
                                id: p.id,
                                lov1: p.lov1,
                                lov2: "Y",
                                lov_code: "CheckTypeFileImage",
                              }))}
                              grouped={grouped}
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
                                            {item.file.size < 1024 * 1024
                                              ? `${(item.file.size / 1024).toFixed(2)} KB`
                                              : `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`}
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
                                          {(action == "Edit" ||
                                            action == "Add") && (
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
                                          {/* {(action === "Read" || isActionExplain) && ( */}
                                          {!isActionAdd && (
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
                </Paper>

                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    mt: 3,
                    width: "100%",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
                  }}
                >
                  <Accordion
                    expanded={isMinimizerespondOpen}
                    onChange={() =>
                      setisMinimizeRespondOpen(!isMinimizerespondOpen)
                    }
                    sx={{
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)",
                      border: "1px solid #bbdefb",
                      boxShadow: "0 4px 12px rgba(33,150,243,0.1)",
                      // mt: 3,
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
                            // pb: 2,
                            py: 2,
                            px: 2,
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
                            sx={{
                              fontSize: 18,
                              fontWeight: 600,
                              color: "#1976d2",
                            }}
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
                              isActionAdd
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
                              isActionAdd
                                ? user[0]?.employee_position || "-"
                                : dataelement?.request_position || "-"
                            }
                            labelName="ตำแหน่ง (Position)"
                            onchange={(e) =>
                              setrequest_position(e.target.value)
                            }
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            value={
                              isActionAdd
                                ? user[0]?.itasset_department_name || "-"
                                : dataelement?.request_department_name || "-"
                            }
                            labelName="แผนก (Department)"
                            onchange={(e) => {
                              // ถึง readonly แต่เผื่ออนาคตจะเปิดให้แก้
                              setrequest_department_id(
                                user[0]?.itasset_department_id
                                // action === "Add"
                                //   ? user[0]?.itasset_department_id
                                //   : dataelement?.request_department_id
                              );
                            }}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            value={
                              isActionAdd
                                ? user[0]?.employee_email || "-"
                                : dataelement?.request_email || "-"
                            }
                            labelName="อีเมล (Email)"
                            onchange={(e) => setrequest_email(e.target.value)}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            value={
                              isActionAdd
                                ? user[0]?.employee_tel || "-"
                                : dataelement?.request_phone || "-"
                            }
                            labelName="โทรศัพท์ (Phone)"
                            onchange={(e) => setrequest_phone(e.target.value)}
                            readonly
                          />
                        </Grid>
                        <Grid size={4}>
                          <AutocompleteComboBox
                            value={request_company_id}
                            labelName={"โรงงาน (Factory)"}
                            options={dataset_company}
                            column="company_name"
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

      {/* {isActionClose || isActionExplain || isActionExplainApproveSc || isActionExplainApproveQc && dataReportTypeValue && ( */}
      {!isActionAdd &&
        !isActionRead &&
        !isActionEdit &&
        !isActionDelete &&
        dataReportTypeValue && (
          <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 3,
                width: "100%",
                borderRadius: 3,
                background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
                border: "1px solid #ffe0b2",
                boxShadow: "0 4px 12px rgba(255,152,0,0.1)",
              }}
            >
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Accordion
                    expanded={isMinimizeexlistOpen}
                    onChange={() =>
                      setisMinimizeExlistOpen(!isMinimizeexlistOpen)
                    }
                    sx={{
                      width: "100%",
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)",
                      border: "1px solid #ff9800",
                      boxShadow: "0 4px 12px rgba(255,152,0,0.15)",
                      mt: 3,
                    }}
                  >
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
                            sx={{
                              fontSize: 18,
                              fontWeight: 600,
                              color: "#000000",
                            }}
                          >
                            รายการคำชี้แจง (Explain List)
                          </Typography>
                        </Box>

                        {/* === ฝั่งขวา ปุ่ม Add === */}
                        {action !== "ReadExplain" &&
                          (dataelement?.complaint_status_label === "SUBMITED" ) &&
                          dataelement?.step_label === "EXPLAIN" && (
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: "#2b72d7ff",
                                "&:hover": {
                                  backgroundColor: "#1657b1ff",
                                },
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                transition: "all 0.2s ease-in-out",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // ✅ ป้องกัน accordion toggle
                                handleOpenAdd?.(); // ✅ เรียกถ้ามีค่าเท่านั้น
                              }}
                            >
                              เพิ่มคำชี้แจง
                            </Button>
                          )}
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Divider
                        sx={{ my: 1, borderBottom: "2px solid #ff9800" }}
                      />
                      <Grid container spacing={3}>
                        {/* รายการคำชี้แจง (Explain List) */}
                        <Grid size={12}>
                          {explainList && explainList.length > 0 ? (
                            <Box sx={{ mt: 2 }}>
                              {explainList
                                .sort(
                                  (a: any, b: any) =>
                                    new Date(a.create_datetime).getTime() -
                                    new Date(b.create_datetime).getTime()
                                )
                                .reverse()
                                .map((item: any, index: any) => (
                                  <Paper
                                    key={index}
                                    elevation={2}
                                    sx={{
                                      p: 2,
                                      mb: 2,
                                      borderRadius: 2,
                                      border: "1px solid #e0e0e0",
                                      backgroundColor: "#fafafa",
                                      "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                      },
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Box sx={{ flex: 1 }}>
                                        <Typography
                                          className="sarabun-regular-datatable"
                                          sx={{
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            color: "#333",
                                            mb: 1,
                                          }}
                                        >
                                          #{explainList.length - index}{" "}
                                          รายละเอียดการชี้แจง
                                        </Typography>
                                        <Typography
                                          className="sarabun-regular-datatable"
                                          sx={{
                                            fontSize: "14px",
                                            color: "#666",
                                          }}
                                        >
                                          สร้างเมื่อ:{" "}
                                          {item.create_datetime
                                            ? dayjs(
                                                item.create_datetime
                                              ).format("DD/MM/YYYY HH:mm")
                                            : "-"}
                                        </Typography>
                                      </Box>

                                      <Box sx={{ display: "flex", gap: 1 }}>
                                        <Box sx={{ display: "flex", gap: 1.5 }}>
                                          {/* ปุ่มอนุมัติ */}
                                          {(isActionExplainApproveSc ||
                                            isActionExplainApproveQc ||
                                            isActionClose) &&
                                            ((isActionExplainApproveSc &&
                                              index === 0) ||
                                              (isActionExplainApproveQc &&
                                                index === 0) ||
                                              (isActionClose &&
                                                index === 0)) && (
                                              <Button
                                                variant="contained"
                                                size="medium"
                                                onClick={(e) => {
                                                  e.stopPropagation();

                                                  if (
                                                    isActionExplainApproveSc
                                                  ) {
                                                    handleOnclickExplainApproveSc?.(
                                                      item
                                                    );
                                                  } else if (
                                                    isActionExplainApproveQc
                                                  ) {
                                                    handleOnclickExplainApproveQc?.(
                                                      item
                                                    );
                                                  } else if (isActionClose) {
                                                    handleOnclickComplainCloseAdd?.(
                                                      item
                                                    );
                                                  }
                                                }}
                                                sx={{
                                                  backgroundColor: "#45bc4bff",
                                                  color: "#FFFFFF",
                                                  "&:hover": {
                                                    backgroundColor: "#1b5e20",
                                                  },
                                                  textTransform: "none",
                                                  fontWeight: 600,
                                                  borderRadius: 2,
                                                  px: 4,
                                                }}
                                              >
                                                {isActionClose
                                                  ? "ปิดรายการ"
                                                  : "อนุมัติ"}
                                              </Button>
                                            )}
                                          {/* {
                                            (isActionExplainApproveSc || isActionExplainApproveQc)&&
                                            (
                                              (
                                                // dataelement?.complaint_status_label === "EXPLAINED" &&
                                                // dataelement?.step_label === "EXPLAIN" &&
                                                isActionExplainApproveSc &&
                                                index === 0
                                              )
                                              ||
                                              (
                                                // dataelement?.complaint_status_label === "APPROVED" &&
                                                // dataelement?.step_label === "COMPLAINT" &&
                                                isActionExplainApproveQc &&
                                                index === 0
                                              )
                                            ) &&
                                            (
                                              <Button
                                                variant="contained"
                                                size="medium"
                                                onClick={(e) => {
                                                  e.stopPropagation();

                                                  if (
                                                    // dataelement?.complaint_status_label === "EXPLAINED" &&
                                                    // dataelement?.step_label === "EXPLAIN"
                                                    isActionExplainApproveSc
                                                  ) {
                                                    handleOnclickExplainApproveSc?.(item);
                                                  } else if (
                                                    // dataelement?.complaint_status_label === "APPROVED" &&
                                                    // dataelement?.step_label === "COMPLAINT"
                                                    isActionExplainApproveQc
                                                  ) {
                                                    handleOnclickExplainApproveQc?.(item);
                                                  }
                                                }}
                                                sx={{
                                                  backgroundColor: "#45bc4bff",
                                                  color: "#FFFFFF",
                                                  "&:hover": {
                                                    backgroundColor: "#1b5e20",
                                                  },
                                                  textTransform: "none",
                                                  fontWeight: 600,
                                                  borderRadius: 2,
                                                  px: 4,
                                                }}
                                              >
                                                อนุมัติ
                                              </Button>
                                            )
                                          } */}

                                          {/* ปุ่มปิดรายการ */}
                                          {/* {
                                            isActionClose &&
                                            index === 0 &&
                                            (
                                              <Button
                                                variant="contained"
                                                size="medium"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleOnclickComplainCloseAdd &&
                                                    handleOnclickComplainCloseAdd(
                                                      item
                                                    )
                                                }
                                                }
                                                sx={{
                                                  backgroundColor: "#45bc4bff",
                                                  color: "#FFFFFF",
                                                  "&:hover": {
                                                    backgroundColor: "#1b5e20",
                                                  },
                                                  textTransform: "none",
                                                  fontWeight: 600,
                                                  borderRadius: 2,
                                                  px: 4,
                                                }}
                                              >
                                                ปิดรายการ
                                              </Button>
                                            )
                                          } */}

                                          {/* ปุ่มดูข้อมูล */}
                                          <Button
                                            variant="contained"
                                            size="medium"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // console.log("🧩 handleOnclickExplainView click:", { action, item });
                                              console.log("🧩 item:", { item });
                                              handleOnclickExplainView &&
                                                handleOnclickExplainView(
                                                  item,
                                                  action
                                                );
                                            }}
                                            sx={{
                                              backgroundColor: "#7e828cff",
                                              color: "#FFFFFF",
                                              "&:hover": {
                                                backgroundColor: "#4B5563",
                                              },
                                              textTransform: "none",
                                              fontWeight: 600,
                                              borderRadius: 2,
                                              px: 4,
                                            }}
                                          >
                                            ดูข้อมูล
                                          </Button>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Paper>
                                ))}
                            </Box>
                          ) : (
                            <Paper
                              elevation={0}
                              sx={{
                                p: 4,
                                textAlign: "center",
                                color: "#999",
                                backgroundColor: "#f9f9f9",
                                borderRadius: 2,
                                border: "2px dashed #e0e0e0",
                              }}
                            >
                              <Typography
                                className="sarabun-regular-datatable"
                                sx={{ fontSize: "16px", color: "#999" }}
                              >
                                ไม่พบรายการคำชี้แจง
                              </Typography>
                            </Paper>
                          )}
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Paper>
          </Paper>
        )}

      {/*  CLOSE  */}
      {isActionCloseHistory && (
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
                            onchange={(e) => setclose_name(e)}
                            readonly={
                              isActionRead ||
                              isActionDelete ||
                              isActionCloseHistory
                            }
                          />
                        </Grid>
                        {/* <Grid size={4}>
                          <FullWidthTextField
                            required="required"
                            value={close_company_id}
                            labelName="บริษัท (Company)"
                            onchange={(e) => setclose_company_id(e)}
                            readonly={isActionRead || isActionDelete || isActionCloseHistory}
                          />
                        </Grid> */}
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
                              // //console.log(e); // ดูค่าของ e ที่ถูกส่งมาจาก AutocompleteComboBox
                              setclose_department_id(e);
                            }}
                            bgcolorTextField={
                              isActionAdd ? false : isActionEdit ? false : true
                            }
                            readonly={
                              isActionRead ||
                              isActionDelete ||
                              isActionCloseHistory
                            }
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            required="required"
                            value={close_position}
                            labelName="แผนก (Position)"
                            onchange={(e) => setclose_position(e)}
                            readonly={
                              isActionRead ||
                              isActionDelete ||
                              isActionCloseHistory
                            }
                          />
                        </Grid>
                        <Grid size={4}>
                          <FullWidthTextField
                            required="required"
                            value={close_email}
                            labelName="อีเมล (Email)"
                            onchange={(e) => setclose_email(e)}
                            readonly={
                              isActionRead ||
                              isActionDelete ||
                              isActionCloseHistory
                            }
                          />
                        </Grid>
                        <Grid size={4}>
                          <DesktopDatePickers
                            required="required"
                            labelName={"วันที่อนุมัติ (Date)"}
                            value={close_date}
                            handleChange={(val) => setclose_date(val ?? null)}
                            bgcolorTextField={isActionAdd ? false : true}
                            readonly={
                              isActionRead ||
                              isActionEdit ||
                              isActionDelete ||
                              isActionCloseHistory
                            }
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
                                  value={dataFuapp?.id || ""} // เก็บ id ของที่เลือก
                                  onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selectedItem = (
                                      filteredFuApprove || []
                                    ).find((item) => item.id === selectedId);
                                    setdataFuapp(
                                      selectedItem ? { ...selectedItem } : null
                                    ); // เก็บแค่ 1 ค่า
                                  }}
                                >
                                  <Grid container spacing={2}>
                                    {(filteredFuApprove || []).map(
                                      (item: LovType) => (
                                        <Grid key={item.id}>
                                          <FormControlLabel
                                            value={item.id}
                                            control={<Radio />}
                                            label={item.lov1}
                                            disabled={
                                              isActionRead ||
                                              isActionDelete ||
                                              isActionCloseHistory
                                            }
                                            sx={{
                                              m: 2,
                                              px: 2,
                                              py: 1,
                                              borderRadius: 2,
                                              border:
                                                dataFuapp?.id === item.id
                                                  ? "2px solid #424242"
                                                  : "none",
                                              bgcolor:
                                                dataFuapp?.id === item.id
                                                  ? "#d0f0c0"
                                                  : "#f5f5f5", // ✅ เขียวพาสเทลถ้าเลือก, เทาอ่อนถ้ายังไม่เลือก
                                              "&:hover": {
                                                bgcolor: "#c8e6c9", // สี hover
                                              },
                                            }}
                                          />
                                        </Grid>
                                      )
                                    )}
                                  </Grid>
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
                                  {/* Response Date Field - positioned after Emergency option */}
                                  <Grid size={12}>
                                    <FullWidthTextArea
                                      value={close_detail}
                                      labelName=""
                                      onchange={(e) => setclose_detail(e)}
                                      bgcolorTextField={
                                        isActionAdd
                                          ? false
                                          : isActionEdit
                                          ? false
                                          : true
                                      }
                                      readonly={
                                        isActionRead ||
                                        isActionDelete ||
                                        isActionCloseHistory
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                          {/* )} */}
                          {/* {dataReportTypeValue && ( */}
                          <Accordion
                            expanded={isMinimizeotapp2Open}
                            onChange={() =>
                              setisMinimizeOtapp2Open(!isMinimizeotapp2Open)
                            }
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fafafa",
                              mt: 2, // <-- เพิ่ม margin-top
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
                                  {/* Response Date Field - positioned after Emergency option */}
                                  <Grid size={12}>
                                    <FullWidthTextArea
                                      value={close_note}
                                      labelName=""
                                      onchange={(e) => setclose_note(e)}
                                      bgcolorTextField={
                                        isActionAdd
                                          ? false
                                          : isActionEdit
                                          ? false
                                          : true
                                      }
                                      readonly={
                                        isActionRead ||
                                        isActionDelete ||
                                        isActionCloseHistory
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                          {/* )} */}
                        </Grid>
                        {/* )} */}
                      </Grid>
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Paper>
        </Paper>
      )}

      {/* <FuncDialog
              open={openExplainView}
              dialogWidth="md"
              openBottonHidden={false}
              titlename={"[Explain] ดูข้อมูล"}
              handleClose={()=>handleCloseExplainView}
              // handleClose={() => handleOnclickCloseReadExplain(dataelement)}
              handlefunction={ExplainGet}
              buttonColor="success"
              
            /> */}
    </Box>
  );
}
