import React, { useState, useMemo } from "react";
import { _GET, _POST, _POST_FORMDATA, _POST_SYNC, _POST_SYS_API } from "../../service/mas";
import { _formatNumber, conCatDateTime } from "../../../libs/datacontrol";
import { setValueMas } from "../../../libs/setvaluecallback";
import dayjs from "dayjs";
import { Alert, Snackbar, Box, Button, Divider, Paper, styled, Typography, Slide, Card, CardContent, IconButton, Grow } from "@mui/material";
import ActionManageCell from "../../components/MUI/ActionManageCell";
import { useAuth } from "../../auth/core/AuthContext";
import EnhancedTable from "../../components/MUI/DataTable";
import Grid from "@mui/material/Grid2";
import { useLayout } from "../../layout/core/LayoutProvider";
import { auth_role_menu_func } from "../../types/users";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DataTableCollapsible from "../../components/MUI/DataTableCollapsible";
import { useData } from "../../auth/core/DataContext";
import { Complaint_headCells } from "../../../libs/columnname";
import DataTable from "../../components/MUI/DataTable";
import ComplaintBody from "./components/ComplaintBody";
import { useListComplaint } from "./core/ListComplaintContext";
import { v4 as uuidv4 } from "uuid";
import { cleanAccessData } from "../../service/initmain/initmain";
import FuncDialog from "../../components/MUI/FullDialog";
import FullSweetalert from "../../components/MUI/Sweetalert";
import AutocompleteComboBox from "../../components/MUI/AutocompleteComboBox";
import FullWidthTextField from "../../components/MUI/FullWidthTextField";
import DesktopDatePickers from "../../components/MUI/DesktopDatePicker";
import BasicChips from "../../components/MUI/BasicChips";
import FullWidthButton from "../../components/MUI/FullWidthButton";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/CheckCircle';
import ExplaintBody from "./components/ExplaintBody";
import { mas_DepartmentGet_Complaint, mas_DomainRelateGet } from "../../service/mas/lov";

// =====================================================================================================
// TYPE DEFINITIONS
// =====================================================================================================
export type Launch = {
  id: string;
  report_type?: string;
  report_code?: string;
  status?: string;
  cas_number?: string;
  request_company_id?: any;
  request_domain_id?: any;
  employee_position?: any;
  doc_date: dayjs.Dayjs
  product_name?: string;
  lot_no?: string;
  user_file_name?: string;
  detail?: string;
  compTypeOther?: string;
  other?: string;
  clause?: string;
  respondent_company_id?: any;
  respondent_domain_id?: any;
  respondent_department_id?: any;
  respondent_email?: string;
  request_name?: string;
  request_position?: string;
  request_department_id?: any;
  request_email?: string;
  request_phone?: string;
  complaintType?: any;
  complaintRs?: any;
  complaintPhoto?: any;
  priority_level?: string;
  complaint_type_id?: string;
  complaint_at_id?: string;
  date_of_detection: dayjs.Dayjs | null
  respond_date_within: dayjs.Dayjs | null
}
interface LovType {
  id: string;
  lov_id: string;
  lov_group: string;
  lov_type: string;
  lov_code: string;
  lov1: string;
  lov2: string;
  lov3: string;
  complaint_type_id: string;
  complaint_at_id: string;
}
interface Complaint {
  id: string;
  cas_number: string;
  product_name: string;
}
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
// interface ComplaintCarData {
//   point_name: string;
//   value: number;
// }
// interface ComplaintServiceData {
//   service_name_TH: string;
//   amount: string;
//   contractor_name: number;
// }
// interface ComplaintImgData {
//   id: string;
//   file_name: string;
//   path: number;
//   location: string;
// }
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
  qty: number;
  pack_unit: any;
  total_weight_ton: any;
  note: any;
  isValid: boolean;
  validateMessage: string;
  req: any;
};

type data_detail = {
  tms_Complaint_no?: any;
  prod_id?: any;
  order_po?: any;
  cus_id?: any;
  cus_name?: any;
  cus_address_id?: any;
  cus_address?: any;
  order_do?: any;
  pack_unit_id?: any;
  qty?: any;
  total_weight_ton?: any;
  note?: any;
  pack_unit_name?: any;
  req_coa?: any;
  req_example?: any;
};

export default function Complaint() {
  // =====================================================================================================
  // AUTHENTICATION & USER DATA
  // =====================================================================================================
  const user = cleanAccessData("userSession");
  const { setIsLoadingScreen } = useLayout();
  const { menuFuncData, userData } = useAuth();
  const { Customer, ProductGroup, CustomerAddress } = useData();

  // =====================================================================================================
  // CONTEXT VARIABLES
  // =====================================================================================================
  const {
    // Main Complaint Fields
    dataelement, setdataelement,
    Complaint_no, no, id, report_type, cas_number, doc_date, date_of_detection,
    request_name, request_company_id, request_domain_id, request_department_id,
    request_position, request_email, request_phone, request_date,
    respondent_company_id, respondent_domain_id, respondent_department_id,
    respondent_email, respondent_other_name, respondent_other_email,
    product_name, detail, compTypeOther, compRsOther,
    priority_level, respond_date_within, lot_no, user_file_name,
    acknowledge_flag, acknowledge_name, acknowledge_company_id,
    acknowledge_department_id, acknowledge_position, acknowledge_email,
    acknowledge_datetime, complaint_status_id, status_last_datetime,
    return_from_status_id, return_from_status_datetime, dc_name,
    dc_company_id, dc_department_id, dc_position, dc_email,
    record_status, create_by, create_datetime, update_by, update_datetime,
    ComplaintStatusID_Combobox, dataReportTypeValue,

    dataComplaintTypeValue_Combobox, dataComplaintType_Combobox,
    dataComplaintRsValue_Combobox, dataComplaintRs_Combobox,

    dataphotoValue_Combobox, dataphoto_Combobox, datapriorityValue_Combobox, datastatus,
    datapriority_Combobox, datapriority, PriorityLevel, clauseOther, phoTypeOther,
    complaintFiles, RunningModel, approve_step, otherText,domainrelate,

    // Dataset Variables
    dataset_reporttype,
    dataset_department,
    dataset_company,
    dataset_domain,
    dataset_domainrelate,
    dataset_stepcomplaint,
    dataset_complaintAction,
    dataset_complaintActionNew,
    dataset_complaintActionExplain,
    dataset_complaintActionClose,
    dataset_activeCompany,
    dataset_roleAdmin,

    //Explaint
    dataTooluseValue,
    dataTooluse_Combobox,
    ToolOther,

    dataDecisionValue,
    dataDecision_Combobox,
    DecisionOther,

    dataApprove_Combobox,
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
    


    // Setter Functions
    setComplaint_no, setno, setid, setreport_type, setcas_number, setdoc_date,
    setdate_of_detection, setrequest_name, setrequest_company_id,
    setrequest_domain_id, setrequest_department_id, setrequest_position,
    setrequest_email, setrequest_phone, setuser_file_name, setrequest_date,
    setrespondent_company_id, setrespondent_domain_id, setrespondent_department_id,
    setrespondent_email, setrespondent_other_name, setrespondent_other_email,
    setproduct_name, setdetail, setcomplaint_type_other,
    setpriority_level, setrespond_date_within, setlot_no, setcompTypeOther,
    setcompRsOther, setreference_standard_other, setacknowledge_flag,
    setacknowledge_name, setacknowledge_company_id, setacknowledge_department_id,
    setacknowledge_position, setacknowledge_email, setacknowledge_datetime,
    setcomplaint_status_id, setstatus_last_datetime, setreturn_from_status_id,
    setreturn_from_status_datetime, setdc_name, setdc_company_id,
    setdc_department_id, setdc_position, setdc_email, setrecord_status,
    setcreate_by, setcreate_datetime, setupdate_by, setupdate_datetime,
    setComplaintStatusID_Combobox, setdataReportTypeValue, setdataComplaintType_Combobox,
    setdataComplaintTypeValue_Combobox, setdataComplaintRs_Combobox, setdatastatus,
    setdataComplaintRsValue_Combobox, setdataphoto_Combobox, setdataphotoValue_Combobox,
    setdatapriorityValue_Combobox, setdatapriority_Combobox, setdatapriority,
    setPriorityLevel, setclauseOther, setphoTypeOther, setdataset_reporttype,setdataset_activeCompany,setdataset_roleAdmin,
    setdataset_department, setdataset_company, setdataset_domain,setdataset_domainrelate, setcomplaintFiles, setotherText,
    set_domainrelate,

    //set Explaint
    setdataToolUse,
    setdataToolUse_Combobox,
    setToolOther,
    setdataDecision_Combobox,
    setdataApprove_Combobox,
    setdataDecision,
    setresponsible_date,
    setfollow_up_date,

    
    setdataset_stepcomplaint,
    setdataset_complaintAction,
    setdataset_complaintActionNew,
    setdataset_complaintActionExplain,
    setdataset_complaintActionClose,
    setroot_cause,
    setobservation_analysis,
    setcorrective_action,
    setpreventive_action_plan,
  } = useListComplaint();

  // =====================================================================================================
  // LOCAL STATE VARIABLES (from index.tsx)
  // =====================================================================================================

  // Variable for Data Table
  const [datalist, setdatalist] = React.useState<any>([]);

  // Variables for Dialogs and Modals
  const [openComplaintAdd, setOpenComplaintAdd] = React.useState(false);
  const [openComplaintView, setOpenComplaintView] = React.useState(false);
  const [openComplaintEdit, setOpenComplaintEdit] = React.useState(false);
  const [openComplaintDelete, setOpenComplaintDelete] = React.useState(false);
  const [openExplain, setOpenExplain] = React.useState(false);
  const [openExplainAdd, setOpenExplainAdd] = React.useState(false);
  const [openExplainView, setOpenExplainView] = React.useState(false);

  const [openExplainApproveSc, setOpenExplainApproveSc] = React.useState(false);

  const [openUpLoad, setOpenUpload] = React.useState(false);


  const [ComplaintBlocks, setComplaintBlocks] = useState<Block[]>([]);
  const [blockValidateErrors, setBlockValidateErrors] = useState<{ [index: number]: data_detail }>({});
  const [successCardOpen, setSuccessCardOpen] = React.useState(false);
  const [successCardMessage, setSuccessCardMessage] = React.useState("");
  const [openAddlist, setOpenAddlist] = React.useState(false);

  const [explainList, setExplainList] = useState<any[]>([]);
  const [approveSelectionCode, setApproveSelectionCode] = useState<string | null>(null);
  
  // const [openSync, setOpenSync] = React.useState(false);
  // const [statusMode, setstatusMode] = React.useState([]);
  // const [openSnackbar, setOpenSnackbar] = React.useState(false);
  // const [snackbarMessage, setSnackbarMessage] = React.useState("");
  // const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error">("success");
  // const [attach_type, setattach_type] = React.useState<any>([]);
  // const [complaint_status, setcomplaint_status] = React.useState<any>([]);
  // const [complaint_type, setcomplaint_type] = React.useState<any>([]);
  // const [reference_standard, setreference_standard] = React.useState<any>([]);
  // const [tool_use, settool_use] = React.useState<any>([]);
  // const [decision_disposition, setdecision_disposition] = React.useState<any>([]);

  const handleOpenAddList = () => setOpenAddlist(true);
  const handleCloseAddlist = () => setOpenAddlist(false);

  // Date Search Variables (from index.tsx)
  const [respondWithinSearch, setrespondWithinSearch] = React.useState<
    dayjs.Dayjs | undefined | null
  >(dayjs().subtract(1, "month"));
  const [documentDateSearch, setdocumentDateSearch] = React.useState<
    dayjs.Dayjs | null
  >(null);
  const [endDateSearch, setEndDateSearch] = React.useState<
    dayjs.Dayjs | undefined | null
  >(dayjs().add(3, "month"));

  // Search Variables (from index.tsx)
  const [TextNameSearch, setTextNameSearch] = React.useState({
    dataset_company: "",
    dataset_domainrelate: "",
    dataset_department: "",
    report_code: "",
    cas_number: "",
    product_name: "",
    lot_no: "",
    datastatus: "",
    dataset_stepcomplaint: "",
    // request_department_id: ""
  });

  // Additional State Variables (from ComplaintRead.tsx)
  // const [ComplaintCarData, setComplaintCarData] = useState<ComplaintCarData[] | null>(null);
  // const [ComplaintServiceData, setComplaintServiceData] = useState<ComplaintServiceData[] | null>(null);
  // const [ComplaintImgData, setComplaintImgData] = useState<ComplaintImgData[] | null>(null);
  const [open, setOpen] = React.useState(false);
  // const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  // const [imageLoading, setImageLoading] = React.useState(true);
  // const [startDueDate, setStartDueDate] = React.useState<dayjs.Dayjs | undefined | null>();
  // const [endDueDate, setEndDueDate] = React.useState<dayjs.Dayjs | undefined | null>();
  const [dataComplaintType, setdataComplaintType] = useState<LovType[]>([]);
  const [dataComplaintRs, setdataComplaintRs] = useState<LovType[]>([]);
  const [dataComplaintphoto, setdataComplaintphoto] = useState<LovType[]>([]);
  const [dataPriority, setdataPriority] = useState<string>("");
  const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>([]);
  const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
  const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
  const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);
  const [isRSHidden, setIsRSHidden] = React.useState(true);
  const [value, setValue] = React.useState(0);

  // =====================================================================================================
  // UTILITY FUNCTIONS (from index.tsx and ComplaintRead.tsx)
  // =====================================================================================================

  const [reportTypeError, setReportTypeError] = useState(false);
  const [respondentDepartmentError, setRespondentDepartmentError] = useState(false);
  const [dateOfDetectionError, setDateOfDetectionError] = useState(false);
  const [departmentAreaError, setDepartmentAreaError] = useState(false);
  const [productNameError, setProductNameError] = useState(false);
  const [lotNoError, setLotNoError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [complaintTypeError, setComplaintTypeError] = useState(false);
  const [otherTypeError, setOtherTypeError] = useState(false);
  const [complaintRsError, setComplaintRsError] = useState(false);
  const [otherRsError, setOtherRsError] = useState(false);
  const [clauseRsError, setClauseRsError] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [priorityError, setPriorityError] = useState(false);

  // For On-Off Calling Function Log
  const [isCallFuncLogOn] = useState(true);
// Event Handlers =========================================================
  const handleCompanyChange = (value: any) => {
    console.log('####### Onchange Company Value [event] : ', value);
    console.log("@@@@@@@@@@@@First", dataset_domainrelate);
    console.log("Render check respondent_domain_id:", respondent_domain_id);


    if (value != null) {
      mas_DomainRelateGet(value, set_domainrelate, isCallFuncLogOn);
    } else {
      
      setrespondent_domain_id(null);
    }
    console.log("@@@@@@@@@@@@second", dataset_domainrelate);
  };

const handleDomainChange = (value: any) => {
    console.log('####### Onchange Domain Value [event] : ', value);
    console.log("@@@@@@@@@@@@First", dataset_domainrelate);
    


    if (value != null) {
      console.log("😎😎", value);

      mas_DepartmentGet_Complaint(value, setdataset_department, isCallFuncLogOn, user);
    } else {
      
      setdataset_department([]);
      setrespondent_department_id(null);
    }
    console.log("@@@@@@@@@@@@second", domainrelate);
  };

  // Reset Form Function (from index.tsx)
  const resetSearchTable = () => {
    setdocumentDateSearch(null);
    setrespondWithinSearch(null);
    setEndDateSearch(null);

  };

  // Reset Form Function (from index.tsx)
  const resetForm = () => {
    setdataReportTypeValue("");
    setcas_number("");
    setproduct_name("");
    setlot_no("");
    setrespondent_company_id(null);
    setrespondent_domain_id("");
    setrespondent_department_id(null);
    setdate_of_detection(null);
    setrespondent_email("");
    setdetail("");
    setdatapriority(null);
    setcompTypeOther("");
    setcompRsOther("");
    setclauseOther("");
    setrequest_name("");
    setrequest_company_id(null);
    setrequest_domain_id("");
    setrequest_department_id(null);
    setrequest_position("");
    setrequest_email("");
    setrequest_phone("");

    // เคลียร์ข้อมูล  Explain
    setroot_cause("");
    setobservation_analysis("");
    setcorrective_action("");
    setpreventive_action_plan("");
    setdataToolUse([]); 
    setToolOther("");

    setresponsible_date(null);
    setfollow_up_date(null);


    // Clear ALL validation errors
    setReportTypeError(false);
    setRespondentDepartmentError(false);
    setDateOfDetectionError(false);
    setDepartmentAreaError(false);
    setProductNameError(false);
    setLotNoError(false);
    setEmailError(false);
    setComplaintTypeError(false);
    setOtherTypeError(false);
    setComplaintRsError(false);
    setOtherRsError(false);
    setClauseRsError(false);
    setDetailError(false);
    setPriorityError(false);

  };

  // Extract Report Type Function (from ComplaintRead.tsx)
  const extractReportType = (code?: string): string => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  extractReportType");

    if (!code) return "";
    const prefix = "TRR_RT_";
    if (code.includes(prefix)) {
      return code.split(prefix)[1].trim().toUpperCase();
    }
    const parts = code.split("_");
    return (parts[parts.length - 1] || "").trim().toUpperCase();
  };

  // Handle Change Functions (from ComplaintRead.tsx)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleChange");

    setValue(newValue);
  };

  const splitByDot = (str: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  splitByDot");

    return str.split('.');
  };

  // Update Complaint ID Functions (from index.tsx)
  function compTypeUpdateCompId(
    dataComplaintTypeValue_Combobox: any,
    complaintid: string,
    compTypeOther: string
  ) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  compTypeUpdateCompId");

    const updatedData = dataComplaintTypeValue_Combobox.map((item: any) => {
      return {
        ...item,
        complaint_id: complaintid,
        other: item.isOther === "Y" ? (compTypeOther?.trim() || null) : null

      };
    });
    return updatedData;
  }

  function compRsUpdateCompId(
    dataComplaintRsValue_Combobox: any,
    complaintid: string,
    compRsOther: string,
    clauseOther: string
  ) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  compRsUpdateCompId");

    const updatedData = dataComplaintRsValue_Combobox.map((item: any) => {
      return {
        ...item,
        complaint_id: complaintid,
        other: item.isClause === "Other" ? (compRsOther?.trim() || null) : null,
        clause: item.isClause === "Clause" ? (clauseOther?.trim() || null) : null
      };
    });
    return updatedData;
  }

  function compFileUpdateCompId(
    dataphotoValue_Combobox: any,
    complaintid: string,
    phoTypeOther: string
  ) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  compFileUpdateCompId");

    const updatedData = dataphotoValue_Combobox.map((item: any) => {
      return {
        ...item,
        complaint_id: complaintid,
        other: phoTypeOther != null && phoTypeOther != "" ? phoTypeOther : null,
      };
    });
    return updatedData;
  }

  function getPaddingYear() {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  getPaddingYear");

    const paddingYear = String(new Date().getFullYear() % 100).padStart(2, '0');

    return paddingYear;
  }

  // =====================================================================================================
  // UTILITY FUNCTIONS
  // =====================================================================================================

  // Update Complaint ID Functions
  function expToolUpdateCompId(
    dataTooluseValue: any,
    explain_id: string,
    ToolOther: string
  ) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  expToolUpdateCompId");

    const updatedData = dataTooluseValue.map((item: any) => {
      return {
        ...item,
        explain_id: explain_id,
        other: item.isOther === "Y" ? (ToolOther?.trim() || null) : null

      };
    });
    return updatedData;
  }

  function expDecisionUpdateCompId(
    dataDecisionValue: any,
    explain_id: string,
    DecisionOther: string
  ) {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  expDecisionUpdateCompId");

    const updatedData = dataDecisionValue.map((item: any) => {
      return {
        explain_dd_id: item.explain_dd_id,
        label: item.label,
        isOther: item.isOther,
        explain_id: explain_id,
        other: item.isOther === "Y" ? (DecisionOther?.trim() || null) : null
      };
    });
    return updatedData;
  }

  // =====================================================================================================
  // API FUNCTIONS - GET DATA MASTER
  // =====================================================================================================

  // Function - Get LOV Master Data
  const LovAll_Get = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  LovAll_Get");

    try {
      const dataset = {
        lov_group: "21,VARIABLE_CONSTANT",
        lov_type:
          "report_type,complaint_type,reference_standard,attach_type,complaint_status,tool_use,decision_disposition,approve_select,complaint_step,complaint_action,active_company,role_admin",
      };
      const response = await _POST(dataset, "/Lov/LovGet");

      if (response && response.status === "success") {
        const lovData = response.data || [];
        console.log("❇️❇️❇️❇️❇️❇️❇️ Call [Lov/LovGet] -> LovAll_Get :", response.data);

        // ✅ จัดกลุ่มตาม lov_type
        const grouped = lovData.reduce((acc: any, item: any) => {
          if (!acc[item.lov_type]) acc[item.lov_type] = [];
          acc[item.lov_type].push(item);
          return acc;
        }, {});

        // ตัวอย่างการ set state
        setdataset_reporttype?.(grouped["report_type"] || []);
        setdataComplaintType_Combobox?.(grouped["complaint_type"] || []);
        setdataComplaintRs_Combobox?.(grouped["reference_standard"] || []);
        setdataphoto_Combobox?.(grouped["attach_type"] || []);
        console.log("🔍 index.tsx - attach_type data:", grouped["attach_type"]);
        setdatastatus?.(grouped["complaint_status"] || []);
        setdataToolUse_Combobox?.(grouped["tool_use"] || []);
        setdataDecision_Combobox?.(grouped["decision_disposition"] || []);
        setdataApprove_Combobox?.(grouped["approve_select"] || []);
        setdataset_stepcomplaint?.(grouped["complaint_step"] || []);
        setdataset_complaintAction?.(grouped["complaint_action"] || []);
        setdataset_activeCompany?.(grouped["active_company"] || []);
        setdataset_roleAdmin?.(grouped["role_admin"] || []);

        setdataset_complaintActionNew(grouped["complaint_action"].filter((item: any) => item.lov_code === 'ACTION_NEW'));
        setdataset_complaintActionExplain(grouped["complaint_action"].filter((item: any) => item.lov_code === 'ACTION_EXPLAIN'));
        setdataset_complaintActionClose(grouped["complaint_action"].filter((item: any) => item.lov_code === 'ACTION_CLOSE'));
        

        console.log('⚠️⚠️⚠️⚠️ [grouped["active_company"]] :', grouped["active_company"])
        console.log('⚠️⚠️⚠️⚠️ [grouped["role_admin"]] :', grouped["role_admin"])



      }
    } catch (e) {
      console.log("error:", e);
    }
  };

  // Function - Get Priority Levels
  const priority_Get = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  priority_Get");

    try {
      const dataset = {
        lov_group: "SYSTEM",
        lov_type: "priority_level",
      };
      const response = await _POST(dataset, "/Lov/LovGet");
      if (response && response.status === "success") {
        // console.log("❇️ Call [Lov/LovGet] -> priority_level :", response.data);
        setdatapriority_Combobox && setdatapriority_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  };

  // Function - Get Domain
  const DomainGet = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DomainGet");

    try {
      const dataset = {
        company_id: user[0]?.itasset_company_id,
      };
      const response = await _POST(dataset, "/Complaint/CasDomainGet");
      if (response && response.status === "success") {
        // console.log("❇️ Call [Complaint/CasDomainGet] -> Domain_Get :",response.data);
        

        console.log(
          "❇️ Call [Complaint/DomainGet] -> DomainGet :",
          response.data
        );
        if (Array.isArray(response.data)) {
          let domain = response.data.filter(
            (item: any) => item.domain_id === user[0]?.employee_domain
          );
          if (domain) {
            setdataset_domain(domain);
            // setdataset_company(domain);
          }
        }
      }
    } catch (e) {
      console.log("error:", e);
    }
  };

  // Function - Get DomainRelate
  const DomainRelateGet = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DomainRelateGet");

    try {
      const dataset = {
        domain: user[0]?.employee_domain,
        company_id: user[0]?.itasset_company_id,
      };
      const response = await _POST(dataset, "/Complaint/CasDomainRelateGet");
      if (response && response.status === "success") {
        // console.log("❇️ Call [Complaint/CasDomainGet] -> DomainRelateGet :",response.data);
        

        console.log(
          "❇️ Call [Complaint/DomainRelateGet] -> DomainRelateGet :",
          response.data
        );
        if (Array.isArray(response.data)) {
          // let domain = response.data.filter(
          //   (item: any) => item.domain_id === user[0]?.employee_domain
          // );
          setdataset_domainrelate(response.data);
         
        }
      }
    } catch (e) {
      console.log("error:", e);
    }
  };
  // Function - Get Company
  const CompanyGet = async (action?: string) => {
  if (isCallFuncLogOn)
    console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CompanyGet");

  try {
    const response = await _POST({}, "/Complaint/CasCompanyGet");

    if (response && response.status === "success") {
      console.log("❇️ Call [Complaint/CasCompanyGet] -> Company_Get :", response.data);

      const activeCompany = dataset_activeCompany; // จาก LovAll_Get

      console.log("🧩 activeCompany sample:", activeCompany?.[0]);
      console.log("🧩 company sample:", response.data?.[0]);

      if (activeCompany?.length > 0) {
        const active = activeCompany[0]?.lov1 || "";

        const activeid = active.split(",").map((id: string) => id.trim());

        console.log("✅ activeid:", activeid);

         // ✅ filter บริษัทตาม company_id
        const filteredCompany = response.data.filter((company: any) =>
          activeid.includes(company.company_id.toString())
        );

        console.log("⚙️ [filteredCompany]:", filteredCompany);
        setdataset_company(filteredCompany);
      } else {
        console.log("⚠️ activeCompany ยังไม่มีค่า ใช้ company ทั้งหมดแทน");
        setdataset_company(response.data);
      }
    }
  } catch (e) {
    console.log("error:", e);
  }
};

  // Function - Get Department Domain
  const DepartmentDomainGet = async (action?: string) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentDomainGet");

    try {
      const dataset = {
        domain_id: respondent_domain_id.domain_id,
        company_id: user[0]?.itasset_company_id,
      };
      const response = await _POST(
        dataset,
        "/Complaint/CasDepartmentDomainGet"
      );
      if (response && response.status === "success") {
        console.log(
          "❇️ Call [Complaint/CasDepartmentDomainGet] -> Department_Domain_Get :",
          response.data
        );

        setdataset_department(response.data);

        if (action == "Add") {

          //================================================
          let department = response.data.filter(
            (item: any) => item.department_id != user[0]?.itasset_department_id
          );
          setdataset_department(department);
          // if (department) {
          //   // setdataset_domain(domain);
          //   setdataset_department(department);
          // }
          //================================================

        }
      }
    } catch (e) {
      console.log("error:", e);
    }
  };

  // =====================================================================================================
  // API FUNCTIONS - CRUD OPERATIONS
  // =====================================================================================================

  // Function - Get Complaints
  const Complaint_Get = async (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  Complaint_Get");

    setIsLoadingScreen(true)
    const dataset = {
      id: data.id,
      user_id: user[0]?.employee_username,
      domain_id: user[0]?.employee_domain,
      department_id: user[0]?.itasset_department_id,
      company_id: user[0]?.itasset_company_id,
    };
    console.log("Read step:4 dataset: ", dataset);


    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      console.log("Read step:4 ผลลัพธ์ : ", response);
      console.log("Read step:4 Normalize ปรับค่าใหม่ : ", response.data[0],);
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setdataelement(response.data[0])
      }
    } catch (e) {
      console.log("error");
    }
  };

  const ExplainGet = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  ExplainGet");

    if (!dataelement?.id) {
      console.log("No complaint ID, skipping explain fetch");
      return;
    }

    setIsLoadingScreen(true);
    const dataset = {
      complaint_id: dataelement?.id,
    };
    console.log("🔍 ExplainGet dataset:", dataset);

    try {
      let response = await _POST(dataset, "/Explain/ExplainGet");
      console.log("🔍 ExplainGet full response:", response);
      console.log("🔍 ExplainGet response data:", response?.data);
      console.log("🔍 ExplainGet response length:", response?.data?.length);

      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setExplainList(response.data || []);
        console.log("🔍 ExplainList set to:", response.data);

        // Debug each explain record
        if (Array.isArray(response.data)) {
          response.data.forEach((explain: any, index: number) => {
            console.log(`🔍 Explain record ${index}:`, explain);
            console.log(`🔍 Explain ${index} complaintType:`, explain.complaintType);
            console.log(`🔍 Explain ${index} complaintRs:`, explain.complaintRs);
          });
        }
      }
    } catch (e) {
      console.log("ExplainGet error:", e);
      setIsLoadingScreen(false);
    }
  };

  // Function - Search Complaints
  const ComplaintGet = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  ComplaintGet");
    console.log("step:2 เรียกฟังก์ชั่น ComplaintGet ใหม่");
    console.log("⭐️⭐️⭐️⭐️ CHECK DATA COMPLAINT ACTION : ", dataset_complaintAction, "⭐️⭐️⭐️");

    setIsLoadingScreen(true);
    const dataset = {
      user_id: user[0]?.employee_username,
      domain_id: user[0]?.employee_domain,
      department_id: user[0]?.itasset_department_id,
      company_id: user[0]?.itasset_company_id,    //@param Fixed
      
      domain: TextNameSearch.dataset_domainrelate ? TextNameSearch.dataset_domainrelate : null,
      department: TextNameSearch.dataset_department ? TextNameSearch.dataset_department : null,
      report_code: TextNameSearch.report_code ? TextNameSearch.report_code : null,
      cas_number: TextNameSearch.cas_number ? TextNameSearch.cas_number : null,
      product_name: TextNameSearch.product_name ? TextNameSearch.product_name : null,
      lot_no: TextNameSearch.lot_no ? TextNameSearch.lot_no : null,
      complaint_status_label: TextNameSearch.datastatus ? TextNameSearch.datastatus : null,
      doc_date: documentDateSearch ? documentDateSearch.format("DD-MM-YYYY") : null,
      step_label: TextNameSearch.dataset_stepcomplaint ? TextNameSearch.dataset_stepcomplaint : null,
    }

    console.log("step:2 dataset ก่อนส่ง API /Complaint/ComplaintGet ", dataset);
    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      console.log("step:2 ผลลัพธ์ที่ได้จาก API /Complaint/ComplaintGet ", response);
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        const responseData: any = [];
        if (Array.isArray(response.data)) {
          response.data.forEach((el: any) => {
            const ACTION = (
              <ActionManageCell
                hadleOnclickMenu={(name: any) => {
                  console.log("🎆 🎆 🎆 🎆 hadleOnclickMenu (name) :", name);
                  
                  if (name === "View") {
                    // DepartmentDomainGet("Read");
                    handleOnclickComplaintView(el);
                  } else if (name === "Edit") {
                    // DepartmentDomainGet("Edit");
                    handleOnclickComplaintEdit(el);
                  } else if (name === "Delete") {
                    // DepartmentDomainGet("Delete");
                    handleOnclickComplaintDelete(el);
                  } else if (name === "Detail") {
                    // DepartmentDomainGet("Explain");
                    handleOnclickExplain(el);
                  } else if (name === "ExplainAdd") {
                    // DepartmentDomainGet("Explain");
                    handleOnclickExplainAdd(el);
                  } else if (name === "ExplainView") {
                    // DepartmentDomainGet("Explain");
                    handleOnclickExplainView(el);
                  }
                  else if (name === "ExplainApproveSc") {
                    // DepartmentDomainGet("Explain");
                    handleOnclickExplainApproveSc(el);
                  }
                }}
                // hiddenEdit={el.complaint_status_label == 'SUBMIT'}

                //-----------------------------------------------------------------------
                //-----------------------------------------------------------------------

                

                // For Status [NEW]
                hiddenRead={
                  (dataset_complaintActionNew &&
                    !dataset_complaintActionNew.some((mode: any) =>
                      mode.lov1.split(",").includes(String(el.complaint_status_label))
                    )) ?? false
                }
                hiddenEdit={
                  (dataset_complaintActionNew &&
                    !dataset_complaintActionNew.some((mode: any) =>
                      mode.lov1.split(",").includes(String(el.complaint_status_label))
                    )) ?? false
                }
                hiddenDelete={
                  (dataset_complaintActionNew &&
                    !dataset_complaintActionNew.some((mode: any) =>
                      mode.lov1.split(",").includes(String(el.complaint_status_label))
                    )) ?? false
                }

                //-----------------------------------------------------------------------
                //-----------------------------------------------------------------------

                // For Status [SUBMIT, EXPLAIN, APPROVE]
                hiddenExplain={
                  (dataset_complaintActionExplain &&
                    !dataset_complaintActionExplain.some((mode: any) =>
                      mode.lov1.split(",").includes(String(el.complaint_status_label))
                    )) ?? false
                }

                //-----------------------------------------------------------------------
                //-----------------------------------------------------------------------

                // For Status [CLOSE]
                hiddenClose={
                  (dataset_complaintActionClose &&
                    !dataset_complaintActionClose.some((mode: any) =>
                      mode.lov1.split(",").includes(String(el.complaint_status_label))
                    )) ?? false
                }

              />
            );
            el.ACTION = ACTION;
            console.log("el.acknowledge_flag", el.acknowledge_flag)
            console.log("🎆 🎆 🎆 🎆 hadleOnclickMenu (el) :", el);
            console.log("🎆 🎆 🎆 🎆 complaint_status_label:", el.complaint_status_label);
            console.log(el.step_label)
            el.complaint_status_label = (
              <BasicChips label={`${el.complaint_status_label}`} acknowledge={el.acknowledge_flag}></BasicChips>
            );
            el.step_label = (
              <BasicChips label={`${el.step_label}`} type="step"></BasicChips>
            );
            responseData.push(el);
          });
        }
        console.log("step:2 ข้อมูลก่อนเข้า ตาราง ", responseData);
        setdatalist(responseData);
      }
    } catch (e) {
      console.log("error");

    }
  };

  // Function - Validate before Add Complaint
  const validateBeforeAdd = (): boolean => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  validateBeforeAdd");
    let valid = true;
    // Clear ALL validation errors before validation
    setReportTypeError(false);
    setRespondentDepartmentError(false);
    setDateOfDetectionError(false);
    setDepartmentAreaError(false);
    setProductNameError(false);
    setLotNoError(false);
    setEmailError(false);
    setComplaintTypeError(false);
    setOtherTypeError(false);
    setComplaintRsError(false);
    setOtherRsError(false);
    setClauseRsError(false);
    setDetailError(false);
    setPriorityError(false);

    // Validate Report Type - ตรวจสอบก่อนและถ้าไม่มีให้ return false ทันที
    if (!dataReportTypeValue || !dataReportTypeValue.id) {
      setReportTypeError(true);
      document.getElementById("reportTypeField")?.focus();
      return false; // หยุดการตรวจสอบส่วนอื่น
    }

    if (!date_of_detection) {
      setDateOfDetectionError(true);
      valid = false;
    }

    if (!respondent_department_id || !respondent_department_id.department_id) {
      setDepartmentAreaError(true);
      valid = false;
    }

    if (!product_name || product_name.trim() === "") {
      setProductNameError(true);
      valid = false;
    }

    if (!lot_no || lot_no.trim() === "") {
      setLotNoError(true);
      valid = false;
    }

    if (!respondent_email || respondent_email.trim() === "") {
      setEmailError(true);
      valid = false;
    }

  
    if (!dataComplaintTypeValue_Combobox || dataComplaintTypeValue_Combobox.length === 0) {
      setComplaintTypeError(true);
      valid = false;
    } else {
    }

    if (dataComplaintTypeValue_Combobox && dataComplaintTypeValue_Combobox.some((item: any) => item.isOther === "Y")) {
      if (!compTypeOther || compTypeOther.trim() === "") {
        setOtherTypeError(true);
        valid = false;
      } else {
        //console.log("✅ Other Type validation passed");
      }
    }

    const reportTypeCode = dataReportTypeValue?.lov_code;
    console.log("🔍 Report Type Code:", reportTypeCode);

    // เฉพาะ NCR เท่านั้นที่ต้อง validate Complaint Rs
    if (reportTypeCode === "NCR") {
      if (!dataComplaintRsValue_Combobox || dataComplaintRsValue_Combobox.length === 0) {
        setComplaintRsError(true);
        valid = false;
      }
    }

    // Validate Other Rs 
    if (reportTypeCode === "NCR" && dataComplaintRsValue_Combobox && dataComplaintRsValue_Combobox.some((item: any) => item.isClause === "Other")) {
      if (!compRsOther || compRsOther.trim() === "") {
        setOtherRsError(true);
        valid = false;
      }
    }

    // Validate Clause Rs
    if (reportTypeCode === "NCR" && dataComplaintRsValue_Combobox && dataComplaintRsValue_Combobox.some((item: any) => item.isClause === "Clause")) {
      if (!clauseOther || clauseOther.trim() === "") {
        setClauseRsError(true);
        valid = false;
      }
    }

    // Validate Detail
    if (!detail || detail.trim() === "") {
      setDetailError(true);
      valid = false;
    }

    // Validate Priority
    if (!datapriorityValue_Combobox || datapriorityValue_Combobox.trim() === "") {
      setPriorityError(true);
      valid = false;
    }
    return valid;
  }

  //validate Edit
  const validateBeforeEdit = (): boolean => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  validateBeforeEdit");
    let valid = true;
    setReportTypeError(false);
    setRespondentDepartmentError(false);
    setDateOfDetectionError(false);
    setDepartmentAreaError(false);
    setProductNameError(false);
    setLotNoError(false);
    setEmailError(false);
    setComplaintTypeError(false);
    setOtherTypeError(false);
    setComplaintRsError(false);
    setOtherRsError(false);
    setClauseRsError(false);
    setDetailError(false);
    setPriorityError(false);

    // Validate Report Type - ตรวจสอบก่อนและถ้าไม่มีให้ return false ทันที
    if (!dataReportTypeValue || !dataReportTypeValue.id) {
      console.log("❌ Report Type validation failed");
      setReportTypeError(true);
      document.getElementById("reportTypeField")?.focus();
      return false;
    }
    console.log("✅ Report Type validation passed");

    // Validate Date of Detection
    if (!date_of_detection) {
      setDateOfDetectionError(true);
      valid = false;
    }

    // Validate Department/Area of Detection
    if (!respondent_department_id || !respondent_department_id.department_id) {
      setDepartmentAreaError(true);
      valid = false;
    }

    // Validate Product Name
    if (!product_name || product_name.trim() === "") {
      setProductNameError(true);
      valid = false;
    }

    // Validate Lot no
    if (!lot_no || lot_no.trim() === "") {
      setLotNoError(true);
      valid = false;
    }

    // Validate Email
    if (!respondent_email || respondent_email.trim() === "") {
      setEmailError(true);
      valid = false;
    }

    // Validate Complaint Type
    if (!dataComplaintTypeValue_Combobox || dataComplaintTypeValue_Combobox.length === 0) {
      console.log("❌ Complaint Type validation failed");
      setComplaintTypeError(true);
      valid = false;
    } else {
      console.log("✅ Complaint Type validation passed");
    }

    // Validate Other Type (if complaint type has "Other" selected)
    if (dataComplaintTypeValue_Combobox && dataComplaintTypeValue_Combobox.some((item: any) => item.isOther === "Y")) {
      if (!compTypeOther || compTypeOther.trim() === "") {
        console.log("❌ Other Type validation failed");
        setOtherTypeError(true);
        valid = false;
      } else {
        console.log("✅ Other Type validation passed");
      }
    }


    // Validate Rs 
    const reportTypeCode = dataReportTypeValue?.lov_code;

    // เฉพาะ NCR เท่านั้นที่ต้อง validate Complaint Rs
    if (reportTypeCode === "NCR") {
      if (!dataComplaintRsValue_Combobox || dataComplaintRsValue_Combobox.length === 0) {
        console.log("❌ Complaint Rs validation failed for NCR");
        setComplaintRsError(true);
        valid = false;
      } else {
        console.log("✅ Complaint Rs validation passed for NCR");
      }
    } else {
      console.log("✅ Complaint Rs validation skipped for", reportTypeCode);
    }

    // Validate Other Rs 
    if (reportTypeCode === "NCR" && dataComplaintRsValue_Combobox && dataComplaintRsValue_Combobox.some((item: any) => item.isClause === "Other")) {
      if (!compRsOther || compRsOther.trim() === "") {
        console.log("❌ Other Rs validation failed for NCR");
        setOtherRsError(true);
        valid = false;
      } else {
        console.log("✅ Other Rs validation passed for NCR");
      }
    }

    // Validate Clause Rs
    if (reportTypeCode === "NCR" && dataComplaintRsValue_Combobox && dataComplaintRsValue_Combobox.some((item: any) => item.isClause === "Clause")) {
      if (!clauseOther || clauseOther.trim() === "") {
        console.log("❌ Clause Rs validation failed for NCR");
        setClauseRsError(true);
        valid = false;
      } else {
        console.log("✅ Clause Rs validation passed for NCR");
      }
    }

    // Validate Detail
    if (!detail || detail.trim() === "") {
      setDetailError(true);
      valid = false;
    }

    // 
    if (!datapriorityValue_Combobox) {
      // ถ้าไม่มีข้อมูลใหม่ ให้ใช้ข้อมูลเก่า
      if (dataelement?.priority_level) {
        //console.log("Using old priority data:", dataelement.priority_level);
      } else {
        setPriorityError(true);
        valid = false;
      }

    } else {
      // console.log("✅ Priority validation passed");
    }
    return valid;
  }

  // CREATE -SaveDraft Add Complaint
  const ComplaintSavedraftAdd = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  ComplaintSavedraftAdd");

    const tempid = uuidv4();

    //Function Split Domain (For using with Complaint Status)
    const tempComplaintStatus = splitByDot(user[0]?.employee_domain)

    // เตรียม Models
    const complainttypeModel = dataComplaintTypeValue_Combobox
      ? compTypeUpdateCompId(
        dataComplaintTypeValue_Combobox,
        tempid,
        compTypeOther
      )
      : null;



    const complaintRsModel = dataComplaintRsValue_Combobox
      ? compRsUpdateCompId(
        dataComplaintRsValue_Combobox,
        tempid,
        compRsOther,
        clauseOther
      )
      : null;

    // สร้าง JSON payload
    const complaintPayload = {
      complaintModel: {
        id: tempid,
        report_type: dataReportTypeValue?.id,
        cas_number: cas_number,
        date_of_detection: date_of_detection
          ? date_of_detection
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        request_name: user[0]?.employee_username || "",
        request_company_id: request_company_id?.company_id,
        // ? Number(request_company_id.company_id)
        // : undefined,
        request_domain_id: user[0]?.employee_domain,
        request_department_id: user[0].itasset_department_id,
        request_position: user[0]?.employee_position || "",
        request_email: user[0]?.employee_email || "",
        request_phone: user[0]?.employee_tel || "",
        request_date: new Date().toISOString(),
        respondent_company_id: respondent_company_id?.company_id,
        // ? Number(respondent_company_id.company_id)
        // : undefined,
        respondent_domain_id: respondent_domain_id?.domain_id,
        respondent_department_id: respondent_department_id?.department_id,
        // ? Number(respondent_department_id.department_id)
        // : undefined,
        respondent_email: respondent_email,
        respondent_other_name: respondent_other_name,
        respondent_other_email: respondent_other_email,
        product_name: product_name,
        detail: detail,
        priority_level: datapriorityValue_Combobox,
        respond_date_within: respond_date_within
          ? respond_date_within
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        lot_no: lot_no,
        complaint_status_id: tempComplaintStatus[0] + "_CS_NEW",
        create_by: user[0]?.employee_username || "",
        save_type: "save_draft",
        complaintType: complainttypeModel,
        complaintRs: complaintRsModel,
        // เพิ่ม complaintFile
        complaintFile:
          complaintFiles?.map((item: any, index: number) => {
            return {
              cf_type: "Complaint",
              complaint_id: tempid,
              complaint_at_id: item.attachmentType,
              other: item.otherText?.trim() || null,
              cf_file_seq: (index + 1).toString(),
              user_file_name: item.file.name,
              file_name: item.file.name,
              file_type: item.file.type.split("/")[1] || "",
              file_size: item.file.size.toString(),
              record_status: true,
              create_by: user[0]?.employee_username || "",
              create_datetime: new Date().toISOString(),
              remark: item.otherText || null,
            };
          }) || []
      },
      RunningModel: {
        code_group: dataReportTypeValue.lov_code,
        code_type: dataReportTypeValue.lov1 + "-" + getPaddingYear(),
        code_num: 1,
      },
      CurrentAccessModel: {
        user_id: user[0]?.employee_username || "",
      },
    };

    // สร้าง FormData
    const formData = new FormData();
    formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

    // แนบไฟล์จริง
    if (complaintFiles && complaintFiles.length > 0) {
      complaintFiles.forEach((fileItem: any) => {
        formData.append("complaintFiles", fileItem.file);
      });
    }

    console.log("📤 complaintPayloadSavedraft:", complaintPayload);
    setIsLoadingScreen(true);

    try {
      const response = await _POST_FORMDATA(
        formData,
        "/Complaint/ComplaintAdd"
      );
      if (response && response.status === "success") {
        FullSweetalert({
          title: 'Success',
          text: `บันทึกข้อมูลสำเร็จ`,
          icon: 'success'
        });
        console.log("✅ Complaint Add successfully:", response);
      } else {
        FullSweetalert({
          title: 'Failed',
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: 'error'
        });
        console.log("⚠️ Add failed:", response);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoadingScreen(false);
      handleClose();

      // Complaint_Get();
      ComplaintGet();
    }
  };

  // Function - Add Complaint
  const ComplaintAdd = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  ComplaintAdd");

    if (!validateBeforeAdd()) {
      return;
    }

    const tempid = uuidv4();

    //Function Split Domain (For using with Complaint Status)
    const tempComplaintStatus = splitByDot(user[0]?.employee_domain)

    // เตรียม Models
    const complainttypeModel = dataComplaintTypeValue_Combobox
      ? compTypeUpdateCompId(
        dataComplaintTypeValue_Combobox,
        tempid,
        compTypeOther
      )
      : null;

    const complaintRsModel = dataComplaintRsValue_Combobox
      ? compRsUpdateCompId(
        dataComplaintRsValue_Combobox,
        tempid,
        compRsOther,
        clauseOther
      )
      : null;

    // สร้าง JSON payload
    const complaintPayload = {
      complaintModel: {
        id: tempid,
        report_type: dataReportTypeValue?.id,
        cas_number: cas_number,
        cf_type: "Complain",
        date_of_detection: date_of_detection
          ? date_of_detection
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        request_name: user[0]?.employee_username || "",
        request_company_id: request_company_id?.company_id,
        // ? Number(request_company_id.company_id)
        // : undefined,
        request_domain_id: user[0]?.employee_domain,
        request_department_id: user[0]?.itasset_department_id || "",
        request_position: user[0]?.employee_position || "",
        request_email: user[0]?.employee_email || "",
        request_phone: user[0]?.employee_tel || "",
        request_date: new Date().toISOString(),
        respondent_company_id: respondent_company_id?.company_id,
        // ? Number(respondent_company_id.itasset_company_id)
        // : undefined,
        respondent_domain_id: respondent_domain_id?.domain_id,
        respondent_department_id: respondent_department_id?.department_id,
        // ? Number(respondent_department_id.department_id)
        // : undefined,
        respondent_email: respondent_email,
        respondent_other_name: respondent_other_name,
        respondent_other_email: respondent_other_email,
        product_name: product_name,
        detail: detail,
        priority_level: datapriorityValue_Combobox,
        respond_date_within: respond_date_within
          ? respond_date_within
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        lot_no: lot_no,
        complaint_status_id: tempComplaintStatus[0] + "_CS_SUBMIT",
        create_by: user[0]?.employee_username || "",
        save_type: "save_submit",
        complaintType: complainttypeModel,
        complaintRs: complaintRsModel,
        // เพิ่ม complaintFile
        complaintFile:
          complaintFiles?.map((item: any, index: number) => {
            return {
              cf_type: "Complaint",
              complaint_id: tempid,
              complaint_at_id: item.attachmentType,
              other: item.attachmentType === "TRR_AT_4" ? (item.otherText?.trim() || null) : null,
              cf_file_seq: (index + 1).toString(),
              user_file_name: item.file.name,
              file_name: item.file.name,
              file_type: item.file.type.split("/")[1] || "",
              file_size: item.file.size.toString(),
              record_status: true,
              create_by: user[0]?.employee_username || "",
              create_datetime: new Date().toISOString(),
              remark: item.attachmentType === "TRR_AT_4" ? (item.otherText?.trim() || null) : null,
            };
          }) || []

      },
      RunningModel: {
        code_group: dataReportTypeValue.lov_code,
        code_type: dataReportTypeValue.lov1 + "-" + getPaddingYear(),
        code_num: 1,
      },
      CurrentAccessModel: {
        user_id: user[0]?.employee_username || "",
      },
    };
    console.log("complaintFile:", complaintPayload.complaintModel.complaintFile);

    // สร้าง FormData
    const formData = new FormData();
    formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

    // แนบไฟล์จริง
    if (complaintFiles && complaintFiles.length > 0) {
      complaintFiles.forEach((fileItem: any) => {
        formData.append("complaintFiles", fileItem.file);
      });
    }

    console.log("📤 FormData prepared:", formData);
    console.log("📤 complaintPayload:", complaintPayload);
    console.log("📤 dataReportTypeValue.id:", dataReportTypeValue.id);
    console.log(
      "📤 dataReportTypeValue.lov_code:",
      dataReportTypeValue.lov_code
    );
    console.log("📤 dataReportTypeValue.lov1:", dataReportTypeValue.lov1);
    setIsLoadingScreen(true);

    try {
      const response = await _POST_FORMDATA(
        formData,
        "/Complaint/ComplaintAdd"
      );
      if (response && response.status === "success") {
        FullSweetalert({
          title: 'Success',
          text: `บันทึกข้อมูลสำเร็จ`,
          icon: 'success'
        });
        console.log("✅ Complaint Add successfully:", response);
      } else {
        FullSweetalert({
          title: 'Failed',
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: 'error'
        });
        console.log("⚠️ Add failed:", response);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoadingScreen(false);
      handleClose();

      // Complaint_Get();
      ComplaintGet();
    }
  };


  // Function - Edit Complaint
  const ComplaintEdit = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  ComplaintEdit");

    if (!validateBeforeEdit()) {
      return;
    }

    const tempid = uuidv4();

    const tempComplaintStatus = splitByDot(user[0]?.employee_domain)
    // เตรียม Models
    const complainttypeModel = dataComplaintTypeValue_Combobox
      ? compTypeUpdateCompId(dataComplaintTypeValue_Combobox, tempid, compTypeOther)
      : null;

    const complaintRsModel = dataComplaintRsValue_Combobox
      ? compRsUpdateCompId(dataComplaintRsValue_Combobox, tempid, compRsOther, clauseOther)
      : null;

    // สร้าง JSON payload

    const complaintPayload = {

      complaintModel: {
        id: dataelement?.id,
        report_type: dataReportTypeValue?.id,
        cas_number: cas_number,
        date_of_detection: date_of_detection
          ? date_of_detection
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        request_name: dataelement?.request_name,
        request_company_id: dataelement?.request_company_id,
        request_domain_id: dataelement?.request_domain_id,
        request_department_id: dataelement?.request_department_id,
        request_position: dataelement?.request_position,
        request_email: dataelement?.request_email,
        request_phone: dataelement?.request_phone,
        request_date: new Date().toISOString(),
        respondent_company_id: dataelement?.respondent_company_id,
        respondent_domain_id: dataelement?.respondent_domain_id,
        respondent_department_id: respondent_department_id?.department_id,
        // ? Number(respondent_department_id.department_id)
        // : undefined,
        respondent_email: respondent_email,
        respondent_other_name: respondent_other_name,
        respondent_other_email: respondent_other_email,
        product_name: product_name,
        detail: detail,
        priority_level: datapriority?.id ?? dataelement?.priority_level,
        respond_date_within: respond_date_within
          ? respond_date_within
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        lot_no: lot_no,
        complaint_status_id: tempComplaintStatus[0] + "_CS_SUBMIT",
        create_by: user[0]?.employee_username || '',
        update_by: user[0]?.employee_username || '',
        action_type: null,
        complaintType: complainttypeModel,
        complaintRs: complaintRsModel,
        // เพิ่ม complaintFile
        complaintFile:
          complaintFiles?.map((item: any, index: number) => {
            return {
              id: item.id || undefined,
              cf_type: "Complaint",
              complaint_id: dataelement?.id,
              complaint_at_id: item.attachmentType,
              other: item.attachmentType === "TRR_AT_4" ? (item.otherText?.trim() || null) : null,
              cf_file_seq: (index + 1).toString(),
              user_file_name: item.file.name,
              file_name: item.file.name,
              file_type: item.file.type,
              file_size: item.file.size.toString(),
              record_status: true,
              create_by: user[0]?.employee_username || "",
              create_datetime: new Date().toISOString(),
              remark: item.attachmentType === "TRR_AT_4" ? (item.otherText?.trim() || null) : null,
            };
          },
          ) || []
      },

      RunningModel: {
        code_group: dataReportTypeValue.lov_code,
        code_type: dataReportTypeValue.lov1 + "-" + getPaddingYear(),
        code_num: 1,
      },
      CurrentAccessModel: {
        user_id: user[0]?.employee_username || '',
      }
    };

    // สร้าง FormData
    const formData = new FormData();
    formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

    // แนบไฟล์จริง
    if (complaintFiles && complaintFiles.length > 0) {
      complaintFiles.forEach((fileItem: any) => {
        formData.append("complaintFiles", fileItem.file);
      });
    }
    console.log("🧡dataelement", dataelement);

    console.log("💨💨💨 FormData prepared:", formData);
    console.log("💨💨💨 complaintPayload:", complaintPayload);
    console.log("💨💨💨 dataReportTypeValue.id:", dataReportTypeValue.id);
    console.log("💨💨💨 dataReportTypeValue.lov_code:", dataReportTypeValue.lov_code);
    console.log("💨💨💨 dataReportTypeValue.lov1:", dataReportTypeValue.lov1);
    setIsLoadingScreen(true);

    try {
      const response = await _POST_FORMDATA(formData, "/Complaint/ComplaintEdit");
      if (response && response.status === "success") {
        FullSweetalert({
          title: 'Success',
          text: `บันทึกข้อมูลสำเร็จ`,
          icon: 'success'
        });
        console.log("✅ Complaint edittt successfully:", response);
      } else {
        FullSweetalert({
          title: 'Failed',
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: 'error'
        });
        console.log("⚠️ Edit failed:", response);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoadingScreen(false);
      handleClose();
      FullSweetalert({
        title: 'Success',
        text: `บันทึกข้อมูลสำเร็จ`,
        icon: 'success'
      });
      // Complaint_Get();
      ComplaintGet();
    }
  };

  // Function - Delete Complaint
  const ComplaintDelete = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  ComplaintDelete");

    // สร้าง JSON payload
    const complaintPayload = {
      ComplaintModel: {
        id: dataelement?.id,
      },
      CurrentAccessModel: {
        user_id: user[0]?.employee_username || '',
      }
    };

    console.log("📤 complaintPayload:", complaintPayload);
    console.log("📤 dataReportTypeValue.id:", dataReportTypeValue.id);
    console.log("📤 dataReportTypeValue.lov_code:", dataReportTypeValue.lov_code);
    console.log("📤 dataReportTypeValue.lov1:", dataReportTypeValue.lov1);
    setIsLoadingScreen(true);

    try {
      let response = await _POST(complaintPayload, "/Complaint/ComplaintDelete");
      if (response && response.status === "success") {
        FullSweetalert({
          title: 'Success',
          text: `บันทึกข้อมูลสำเร็จ`,
          icon: 'success'
        });
        console.log("✅ Complaint edittt successfully:", response);
      } else {
        FullSweetalert({
          title: 'Failed',
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: 'error'
        });
        console.log("⚠️ Edit failed:", response);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoadingScreen(false);
      handleClose();
      FullSweetalert({
        title: 'Success',
        text: `ลบข้อมูลสำเร็จ`,
        icon: 'success'
      });
      // Complaint_Get();
      ComplaintGet();
    }
  };

  // READ - Preview Complaint (from ComplaintRead.tsx)
  const previewComplaint = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  previewComplaint");

    console.log(dataelement, "dataelement");
    console.log("dataset_reporttype", dataset_reporttype);
    console.log("NCR TEST", extractReportType("TRR_RT_NCR"));
    console.log("OBS TEST", extractReportType("TRR_RT_OBS"));
    console.log("CAR TEST", extractReportType("TRR_RT_CAR"));
    console.log("CPAR TEST", extractReportType("TRR_RT_CPAR"));

    if (dataelement) {
      console.log("dataelement.report_type", dataelement.report_type);

      // setIsRSHidden(extractReportType(dataelement.report_type) != "NCR" ? true : false);

      // แปลง priority text → id ของ RadioGroup
      const selectedPriority = datapriority_Combobox.find(
        (item: any) =>
          item.lov_code === dataelement.priority_level ||
          item.lov1 === dataelement.priority_level
      );
      setdataPriority(selectedPriority?.id || "");

      console.log("dataComplaintType_Combobox", dataComplaintType_Combobox);
      console.log("dataelement?.complaint_type_id", dataelement?.complaintType);
      console.log("dataelement?.complaint_type_id", dataelement?.complaintRs);
      console.log("dataelement?.complaint_at_id", dataelement?.complaintPhoto);
      console.log("dataelement?.priority_level", dataelement?.priority_level);

      const data_ComplaintType = await setValueMas(
        dataComplaintType_Combobox,
        dataelement?.complaint_type_id,
        "id"
      );
      const data_ComplaintRs = await setValueMas(
        dataComplaintRs_Combobox,
        dataelement?.complaint_type_id,
        "id"
      );
      const data_ComplaintPhoto = await setValueMas(
        dataphoto_Combobox,
        dataelement?.complaint_at_id,
        "id"
      );
      const data_Priority = await setValueMas(
        datapriority_Combobox,
        dataelement?.priority_level,
        "id"
      );

      console.log("data_ComplaintType", data_ComplaintType);
      console.log("data_ComplaintRs", data_ComplaintRs);
      console.log("data_ComplaintPhoto", data_ComplaintPhoto);
      console.log("data_Priority", data_Priority);
      console.log(dataset_reporttype);
    }
  };

  // CREATE - Add Complaint
  const ExplainAdd = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  ExplainAdd");

    //await ExplainGet();

    const tempid = uuidv4();

    //Function Split Domain (For using with Complaint Status)
    const tempComplaintStatus = splitByDot(user[0]?.employee_domain)

    // Helper: resolve the real complaint id from current context (complaint or explain)
    const resolveComplaintId = () => {
      const el: any = dataelement || {};
      // prefer explicit complaint_id if available (object or primitive)
      if (el.complaint_id) {
        if (typeof el.complaint_id === 'object') return el.complaint_id.id ?? el.complaint_id;
        return el.complaint_id;
      }
      // sometimes nested as complaint.id
      if (el.complaint && el.complaint.id) return el.complaint.id;
      // fallback to current id (when dataelement is the complaint row)
      return el.id;
    };

    const complaintRootId = resolveComplaintId();

    let currentExplainList: any[] = [];
    if (complaintRootId) {
      try {
        const dataset = {
          complaint_id: complaintRootId,
        };
        const response = await _POST(dataset, "/Explain/ExplainGet");
        if (response && response.status === "success") {
          currentExplainList = response.data || [];
        }
      } catch (error) {
        console.error("Error fetching explain data:", error);
      }
    }

    const ExplainTuModel = dataTooluseValue
      ? expToolUpdateCompId(
        dataTooluseValue,
        tempid,
        ToolOther
      )
      : null;

    const ExplainDdModel = dataDecisionValue
      ? expDecisionUpdateCompId(
        dataDecisionValue,
        tempid,
        DecisionOther
      )
      : null;

    // สร้าง JSON payload สำหรับ Explain
    // Find the maximum explain_seq for current complaint and add 1
    const maxExplainSeq = currentExplainList && currentExplainList.length > 0
      ? Math.max(...currentExplainList.map((item: any) => parseInt(item.explain_seq) || 0))
      : 0;
    const nextSeq = maxExplainSeq + 1;

    console.log('🔍 Current explainList:', explainList);
    console.log('🔍 Max explain_seq found:', maxExplainSeq);
    console.log('🔍 Next explain_seq will be:', nextSeq);

    const explainPayload = {
      ExplainModel: {
        id: tempid,
        complaint_id: complaintRootId,
        explain_seq: nextSeq,
        observation_analysis: observation_analysis || null,
        root_cause: root_cause || null,
        corrective_action: corrective_action || null,
        preventive_action_plan: preventive_action_plan || null,
        follow_up_date: follow_up_date
          ? follow_up_date
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        responsible_name: user[0]?.employee_username || "",
        responsible_company_id: responsible_company_id?.company_id
          ? Number(responsible_company_id.company_id)
          : user[0]?.itasset_company_id || "",
        responsible_department_id: responsible_department_id?.department_id
          ? Number(responsible_department_id.department_id)
          : user[0]?.itasset_department_id || "",
        responsible_position: user[0]?.employee_position || "",
        responsible_email: user[0]?.employee_email || "",
        responsible_date: responsible_date
          ? responsible_date
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : new Date().toISOString(),
        close_status: close_status || null,
        close_name: close_name || null,
        close_company_id: close_company_id || 0,
        close_department_id: close_department_id || 0,
        close_position: close_position || null,
        close_email: close_email || null,
        close_date: close_date
          ? close_date
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        return_detail: return_detail || null,
        return_name: return_name || null,
        return_company_id: return_company_id || 0,
        return_department_id: return_department_id || 0,
        return_position: return_position || null,
        return_email: return_email || null,
        return_datetime: return_datetime
          ? return_datetime
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        cf_type: "Explain",
        create_by: user[0]?.employee_username || "",
        domain_id: user[0]?.employee_domain || "",
      
        ExplainTu: ExplainTuModel,
        ExplainDd: ExplainDdModel,
        // เพิ่ม ComplainFile
        ComplaintFile:
          complaintFiles?.map((item: any, index: number) => {
            return {
              cf_type: "Explain",
              complaint_id: complaintRootId,
              complaint_at_id: item.attachmentType,
              explain_id: tempid,
              other: item.attachmentType === "TRR_AT_4" ? (item.otherText?.trim() || null) : null,
              cf_file_seq: (index + 1).toString(),
              user_file_name: item.file.name,
              file_name: item.file.name,
              file_type: item.file.type.split("/")[1] || "",
              file_size: item.file.size.toString(),
              record_status: true,
              create_by: user[0]?.employee_username || "",
              create_datetime: new Date().toISOString(),
              remark: item.attachmentType === "TRR_AT_4" ? (item.otherText?.trim() || null) : null,
            };
          }) || []
      },

      // RunningModel: {
      //   code_group: dataReportTypeValue?.lov_code || "EXPLAIN",
      //   code_type: (dataReportTypeValue?.lov1 || "EXPLAIN") + "-" + getPaddingYear(),
      //   code_num: 1,
      // },
      // RunningModel: {
      //   code_group: dataReportTypeValue.lov_code,
      //   code_type: dataReportTypeValue.lov1 + "-" + getPaddingYear(),
      //   code_num: 1,
      // },

      CurrentAccessModel: {
        user_id: user[0]?.employee_username || "",
      },
    };
    console.log("📦 explainPayload.ExplainModel.ComplaintFile:", explainPayload.ExplainModel.ComplaintFile);



    // สร้าง FormData
    const formData = new FormData();
    formData.append("explainPayloadJson", JSON.stringify(explainPayload));

    // แนบไฟล์จริง
    if (complaintFiles && complaintFiles.length > 0) {
      complaintFiles.forEach((fileItem: any) => {
        formData.append("explainFiles", fileItem.file);
      });
    }

    console.log("📤 FormData prepared:", formData);
    console.log("📤 explaintPayload:", explainPayload);
    setIsLoadingScreen(true);

    try {
      const response = await _POST_FORMDATA(
        formData,
        "/Explain/ExplainAdd"
      );
      if (response && response.status === "success") {
        FullSweetalert({
          title: 'Success',
          text: `บันทึกข้อมูลชี้แจงสำเร็จ`,
          icon: 'success'
        });
        console.log("✅ Explain Add successfully:", response);
      } else {
        FullSweetalert({
          title: 'Failed',
          text: `บันทึกข้อมูลชี้แจงไม่สำเร็จ`,
          icon: 'error'
        });
        console.log("⚠️ Explain Add failed:", response);
      }
    } catch (error) {
      console.error("Explain Upload failed:", error);
    } finally {
      setIsLoadingScreen(false);
      handleClose();
      ComplaintGet();
    }
  };

  // =====================================================================================================
  // EVENT HANDLERS (from index.tsx)
  // =====================================================================================================

  // Dialog Handlers
  const handleOnclickMenuSync = () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickMenuSync");

    // setOpenSync(true);
  };

  const handleOnclickComplaintAdd = () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickComplaintAdd");

    resetForm();
    setdataelement(null);
    setOpenComplaintAdd(true);
  };

  const handleOnclickComplaintView = async (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  Explaint_Get");

    console.log("Read step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuView ");
    console.log("Read step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    Complaint_Get(data);
    resetForm();
    setOpenComplaintView(true); // แล้วค่อยเปิด Dialog
  };

  const handleOnclickComplaintEdit = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickComplaintEdit");

    console.log("Edit step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuEdit ");
    console.log("Edit step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    Complaint_Get(data);
    resetForm();
    setOpenComplaintEdit(true);
  };

  const handleOnclickComplaintDelete = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickComplaintDelete");

    console.log("Delete step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuDelete ");
    console.log("Delete step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    Complaint_Get(data);
    resetForm();
    setOpenComplaintDelete(true);
  };

  // -------- Explain Dialog Handlers --------
  const handleOnclickExplain = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickExplain");

    resetForm();
    setOpenExplain(true);
    setdataelement(data);
  };

  const handleOnclickExplainAdd = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ",dayjs().format('HH:mm:ss.SSS')," [Calling Function]  :  handleOnclickExplainAdd");

      


    resetForm();
    setOpenExplainAdd(true);
    // ใช้ข้อมูลที่ส่งมาจากหน้า Explain รายละเอียด
    if (data) {
      setdataelement(data);
    } else {
      setdataelement(null);
    }
  };

  const handleOnclickExplainView = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickExplainView");

    console.log("🔍 handleOnclickExplainView called with data:", data);

    // ตั้งค่า dataelement ก่อนเพื่อให้ useEffect ใน ExplaintBody ทำงานได้
    setdataelement(data);

    // ไม่ reset form ในโหมดดูข้อมูล เพื่อไม่ให้ dataReportTypeValue หาย
    setOpenExplainView(true);

    // ใช้ข้อมูลที่ส่งมาจากรายการ explain โดยตรง
    if (data) {
      console.log("🔍 Setting explain data for View:", data);
      console.log("🔍 Explain data complaintType:", data.complaintType);
      console.log("🔍 Explain data complaintRs:", data.complaintRs);
      console.log("🔍 Explain data other:", data.other);

      // Set ข้อมูล explain ลงใน context
      setobservation_analysis(data.observation_analysis || "");
      setroot_cause(data.root_cause || "");
      setcorrective_action(data.corrective_action || "");
      setpreventive_action_plan(data.preventive_action_plan || "");

      // 🔧 เพิ่ม: ตั้งค่าการแสดง/ซ่อน sections ตาม report_type สำหรับ View mode
      // ใช้ dataelement.report_type หรือ data.complaint.report_type ขึ้นกับโครงสร้างข้อมูล
      const reportType = data.complaint?.report_type || data.report_type || dataelement?.report_type;
      console.log("🔍 ExplainView - Setting visibility for report type:", reportType);

      if (reportType && dataset_reporttype) {
        const reportTypeObj = dataset_reporttype.find(
          (item: any) =>
            item.id === reportType ||
            item.lov_code === reportType
        );

        if (reportTypeObj) {
          console.log("🔍 ExplainView - Found report type object:", reportTypeObj);
          // บังคับส่งข้อมูลไปให้ ExplaintBody ผ่าน dataelement 
          const updatedDataElement = {
            ...data,
            report_type: reportTypeObj.lov_code,
            _forceVisibilityUpdate: true // flag เพื่อบังคับ update visibility
          };
          setdataelement(updatedDataElement);
        }

      }
    }
  };

  // const handleOnclickExplainView = async (data: any) => {
  //   if (isCallFuncLogOn) console.log("🕑 ",dayjs().format('HH:mm:ss.SSS')," [Calling Function]  :  Explaint_Get");

  //   setIsLoadingScreen(true)
  //   const dataset = {
  //     id: data.id,
  //   };
  //   console.log("Read step:4 dataset: ", dataset);


  //   try {
  //     let response = await _POST(dataset, "/Explaint/ExplaintGet");
  //     console.log("Read step:4 ผลลัพธ์ : ", response);
  //     console.log("Read step:4 Normalize ปรับค่าใหม่ : ", response.data[0],);
  //     if (response && response.status === "success") {
  //       setIsLoadingScreen(false);
  //       setdataelement(response.data[0])
  //     }
  //   } catch (e) {
  //     console.log("error");
  //   }
  // };

  const handleOnclickExplainApproveSc = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickExplainApproveSc");

    resetForm();
    setOpenExplainApproveSc(true);
    // ใช้ข้อมูลที่ส่งมาจากหน้า Explain รายละเอียด
    if (data) {
      setdataelement(data);
    } else {
      setdataelement(null);
    }
  };



  // const handleOnclickMenuUpload = () => {
  //   setOpenUpload(true);
  // };

  // const handleTableButtonClick = (func_name: string) => {
  //   switch (func_name) {
  //     case "Add":
  //       handleOnclickComplaintAdd();
  //       break;
  //     case "Upload":
  //       handleOnclickMenuUpload();
  //       break;
  //     case "Print":
  //       console.log("Print clicked");
  //       break;
  //     default:
  //       console.warn("No handler for", func_name);
  //   }
  // };

  // Search Handlers
  const handleCloseSearch = () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleCloseSearch");

    setdataReportTypeValue(null);
    setdataComplaintTypeValue_Combobox([]);
    setdataComplaintRsValue_Combobox([]);
    setdataphotoValue_Combobox([]);
    setrespondWithinSearch(null);
    setdocumentDateSearch(null);
    setTextNameSearch({
      dataset_company: "",
      dataset_domainrelate: "",
      dataset_department: "",
      report_code: "",
      cas_number: "",
      product_name: "",
      lot_no: "",
      datastatus: "",
      dataset_stepcomplaint: "",
      // request_department_id: ""
    });
    // Complaint_Get()
    // ListSearchGet();
  };

  // Close Dialog Handler
  const handleClose = () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleClose");

    setOpenComplaintAdd(false);
    // setOpenSync(false);
    setOpenComplaintView(false);
    setOpenComplaintEdit(false);
    setOpenComplaintDelete(false);
    setOpenExplain(false);
    setOpenExplainAdd(false);
    setOpenExplainView(false);
    setOpenExplainApproveSc(false);
    setOpenUpload(false);
    setApproveSelectionCode(null); // รีเซ็ตค่าเมื่อปิด Dialog
    resetForm();
  };

  // Set Data Handler
  const setData = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  setData");

    setcompTypeOther("");
    setComplaint_no("");
    setno("");
    setcas_number("");
  };

  // =====================================================================================================
  // USEEFFECT - INITIALIZATION (from index.tsx and ComplaintRead.tsx)
  // =====================================================================================================

  // Initialize data on component mount
  React.useEffect(() => {
    resetSearchTable();

    // Complaint_Get();
    console.log("step:1 เรียกฟังก์ชั่น ComplaintGet();");
    LovAll_Get();
    // ListSearchGet();
    // ReportType_Get();
    // ComplaintType_Get();
    // ComplaintRs_Get();
    // photo_Get();
    priority_Get();
    // DomainGet();
    DomainRelateGet();
    // DepartmentDomainGet();
    CompanyGet();

    // complaint_status_Get();
    // ToolUse_Get();
    // Decision_Get();
  }, []);

  React.useEffect(() => {
  if (dataset_activeCompany) {
    console.log("🔁 activeCompany พร้อมแล้ว → เรียก CompanyGet()");
    CompanyGet();
  }
}, [dataset_activeCompany]);

  React.useEffect(() => {
    if (dataset_complaintAction) {
      ComplaintGet();
    }
  }, [dataset_complaintAction]);

  

  // Filter complaint types based on selected report type (from ComplaintRead.tsx)
  React.useEffect(() => {
    // previewComplaint();
    if (!dataelement) return;

    // กรอง complaint type
    const filtered = (dataComplaintType_Combobox || []).filter(
      (item: LovType) =>
        item.lov_type === "complaint_type" &&
        item.lov_code === dataelement?.report_type
    );
    const filteredRs = (dataComplaintRs_Combobox || []).filter(
      (item: LovType) =>
        item.lov_type === "reference_standard" &&
        item.lov_code === dataelement?.report_type
    );
    const filteredpriority = (datapriority_Combobox || []).filter(
      (item: LovType) => item.lov_type === "priority_level"
    );
    const filteredphoto = (dataphoto_Combobox || []).filter(
      (item: LovType) => item.lov_type === "attach_type"
    );

    console.log("filtered", filtered);
    setFilteredComplaintType(filtered);
    console.log("filteredRS", filteredRs);
    setFilteredComplaintRs(filteredRs);
    console.log("filteredpriority", filteredpriority);
    setFilteredpriority(filteredpriority);
    console.log("filteredphoto", filteredphoto);
    setFilteredphoto(filteredphoto);
  }, [
    dataComplaintType_Combobox,
    dataComplaintRs_Combobox,
    datapriority_Combobox,
    dataphoto_Combobox,
    dataelement,
  ]);

  // =====================================================================================================
  // RETURN SECTION - RENDER COMPONENT
  // =====================================================================================================

  // #F29739

  return (
    <>
      {/* Search Section */}
      <Box
        sx={{
          p: 2,
          mt: 8,
          mb: 2,
          border: "2px solid #39a2f2",
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <div className="px-2 pt-2 pb-5">
          <label className="sarabun-regular-datatable">ค้นหา</label>
        </div>
        <Divider sx={{ my: 0.1, borderColor: "#39a2f2" }} />
        <Grid container spacing={2} mt={2}>
          <Grid size={4}>
            <AutocompleteComboBox
              value={
                dataset_company?.find(
                  (item: any) =>
                    String(item.company_id) === String(TextNameSearch.dataset_company)
                ) || dataset_company?.find(
                  (item: any) =>
                    String(item.company_id) === String(user[0]?.itasset_company_id)
                ) || null
              }

              labelName="บริษัท (Company)"
              options={dataset_company || []}
              column="company_name"
              setvalue={(val) => {
                handleCompanyChange(val);
                setTextNameSearch({
                  ...TextNameSearch,
                  dataset_company: val?.company_id || "", // เก็บแค่ id เป็น string
                })
              }}
              readonly
            />
          </Grid>
          <Grid size={4}>
            <AutocompleteComboBox
              value={
                dataset_domainrelate?.find(
                (item: any) => item.domain_id === TextNameSearch.dataset_domainrelate
              ) || null}
              labelName="โดเมน (Domain)"
              options={dataset_domainrelate || []}
              column="domain_name"
              setvalue={(val) => {
                handleDomainChange(val);
                setTextNameSearch({
                  ...TextNameSearch,
                  dataset_domainrelate: val?.domain_id || "", // เก็บแค่ id เป็น string
                })
              }}
            />
          </Grid>
          <Grid size={4}>
            <AutocompleteComboBox
              value={dataset_department?.find(
                (item: any) => item.department_id === TextNameSearch.dataset_department
              ) || null}
              labelName="แผนก (Department)"
              options={dataset_department || []}
              column="department_name"
              setvalue={(val) => {
                setTextNameSearch({
                  ...TextNameSearch,
                  dataset_department: val?.department_id || "", // เก็บแค่ id เป็น string
                })
              }}
              readonly={!TextNameSearch.dataset_domainrelate}
            />
          </Grid>

          <Grid size={4}>
            <AutocompleteComboBox
              value={dataset_reporttype?.find(
                (item: any) => item.id === TextNameSearch.report_code
              ) || null}
              labelName="ประเภทเอกสาร (Report Type)"
              options={dataset_reporttype || []}
              column="lov_code"
              setvalue={(val) => {
                setTextNameSearch({
                  ...TextNameSearch,
                  report_code: val?.id || "", // เก็บแค่ id เป็น string
                })
                setdataReportTypeValue(val);
                setReportTypeError(false);
              }}
              error={reportTypeError}
            />
          </Grid>
          <Grid size={4}>
            <FullWidthTextField
              value={TextNameSearch.cas_number}
              labelName={"CAS Number"}
              onchange={(value) =>
                setTextNameSearch({
                  ...TextNameSearch,
                  ...{ cas_number: value },
                })
              }
            />
          </Grid>
          <Grid size={4}>
            <FullWidthTextField
              value={TextNameSearch.product_name}
              labelName={"ชื่อสินค้า (Product Name)"}
              onchange={(value) =>
                setTextNameSearch({
                  ...TextNameSearch,
                  ...{ product_name: value },
                })
              }
            />
          </Grid>
          <Grid size={4}>
            <FullWidthTextField
              value={TextNameSearch.lot_no}
              labelName={"Lot No./Bag No"}
              onchange={(value) =>
                setTextNameSearch({ ...TextNameSearch, ...{ lot_no: value } })
              }
            />
          </Grid>
          <Grid size={4}>

            <AutocompleteComboBox
              value={datastatus?.find(
                (item: any) => item.id === TextNameSearch.datastatus
              ) || null}
              labelName="สถานะ (Status)"
              options={datastatus}
              column="lov_code" // หรือชื่อ field ที่คุณต้องการแสดง
              setvalue={(val) =>
                setTextNameSearch({
                  ...TextNameSearch,
                  datastatus: val?.id || "", // เก็บแค่ id เป็น string
                })
              }
            />
          </Grid>
          <Grid size={4}>
            <DesktopDatePickers
              labelName={"วันที่ออกเอกสาร (Document Issuance Date)"}
              value={documentDateSearch}
              handleChange={(val) => setdocumentDateSearch(val ?? null)}
            />
          </Grid>

          <Grid size={4}>
            <AutocompleteComboBox
              value={dataset_stepcomplaint?.find(
                (item: any) => item.lov_code === TextNameSearch.dataset_stepcomplaint
              ) || null}
              labelName="ขั้นตอน (Action Step)"
              options={dataset_stepcomplaint}
              column="lov_code" // หรือชื่อ field ที่คุณต้องการแสดง
              setvalue={(val) =>
                setTextNameSearch({
                  ...TextNameSearch,
                  dataset_stepcomplaint: val?.lov_code || "", // เก็บแค่ id เป็น string
                })
              }
            />
          </Grid>

        </Grid>

        {/* ======================================================================== */}
        {/* ======================================================================== */}

        <Grid
          container
          spacing={2}
          sx={{ mt: 2 }}
          justifyContent="flex-end"
          gap={1}
        >
          <Grid>
            <FullWidthButton
              labelName={"ค้นหา"}
              handleonClick={ComplaintGet}
              variant_text="contained"
              colorname={"primary"}
            />
          </Grid>
          <Grid>
            <FullWidthButton
              labelName={"รีเซท"}
              handleonClick={handleCloseSearch}
              variant_text="outlined"
              colorname={"inherit"}
            />
          </Grid>
        </Grid>
      </Box>


      {/* Data Table Section */}
      <DataTable
        colum={Complaint_headCells}
        rows={datalist}
        titlename={"ข้อมูล Complaint"}
        buttonElement={
          <div className="flex gap-x-4">
            <Button
              variant="contained"
              hidden={menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? false : true}
              color="success"
              onClick={() => {
                DepartmentDomainGet("Add");
                handleOnclickComplaintAdd();
              }}
            >
              {menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? "เพิ่มข้อมูล" : ""}
              <AddIcon sx={{}} />
            </Button>
          </div>
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* ------------------------ Complaint FuncDialog ------------------------ */}
      {/* ---------------------------------------------------------------------- */}

      <FuncDialog
        open={openComplaintAdd}
        dialogWidth="xl"
        openBottonHidden={true}
        hideReject={true}
        titlename={"Complaint // เพิ่มข้อมูล"}
        buttonText={"Save & Submit"}
        handleClose={handleClose}
        handlefunction={ComplaintAdd}
        handlesavedraft={ComplaintSavedraftAdd}
        buttonColor="success"
        element={
          <ComplaintBody
            action="Add"
            validateDetailText={blockValidateErrors}
            handleOpenAdd={handleOpenAddList}
            validateText={{
              Product_Group: false,
              Report_Type: reportTypeError,
              Respondent_Department: false,
              Date_of_Detection: dateOfDetectionError,
              Department_Area: departmentAreaError,
              Product_Name: productNameError,
              Lot_No: lotNoError,
              Email: emailError,
              Complaint_Type: complaintTypeError,
              Other_Type: otherTypeError,
              Complaint_Rs: complaintRsError,
              Other_Rs: otherRsError,
              Clause_Rs: clauseRsError,
              Detail: detailError,
              Priority: priorityError,
            }}
            onReportTypeChange={(val) => {
              setdataReportTypeValue(val);
              setReportTypeError(false);
              // Clear all validation errors when report type changes
              setDateOfDetectionError(false);
              setDepartmentAreaError(false);
              setProductNameError(false);
              setLotNoError(false);
              setEmailError(false);
              setComplaintTypeError(false);
              setOtherTypeError(false);
              setComplaintRsError(false);
              setOtherRsError(false);
              setClauseRsError(false);
              setDetailError(false);
              setPriorityError(false);
            }}
            onDateOfDetectionChange={(val) => {
              setdate_of_detection(val);
              setDateOfDetectionError(false);
            }}
            onDepartmentAreaChange={(val) => {
              setrespondent_department_id(val);
              setDepartmentAreaError(false);
            }}
            onProductNameChange={(val) => {
              setproduct_name(val);
              setProductNameError(false);
            }}
            onLotNoChange={(val) => {
              setlot_no(val);
              setLotNoError(false);
            }}

            onEmailChange={(val) => {
              setrespondent_email(val);
              setEmailError(false);
            }}
            onComplaintTypeChange={(val) => {
              setComplaintTypeError(false);
              setOtherTypeError(false);
            }}
            onOtherTypeChange={(val) => {
              setOtherTypeError(false);
            }}
            onComplaintRsChange={(val) => {
              setComplaintRsError(false);
              setOtherRsError(false);
              setClauseRsError(false);
            }}
            onOtherRsChange={(val) => {
              setOtherRsError(false);
            }}
            onClauseChange={(val) => {
              setClauseRsError(false);
            }}
            onDetailChange={(val) => {
              setDetailError(false);
            }}
            onPriorityChange={(val) => {
              setPriorityError(false);
            }}
          />
        }
      />

      <FuncDialog
        open={openComplaintView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"Complaint // ดูข้อมูล"}
        handleClose={handleClose}
        buttonColor="success"
        element={<ComplaintBody
          action="Read"
        />}
      />


      <FuncDialog
        open={openComplaintEdit}
        dialogWidth="xl"
        openBottonHidden={true}
        hideReject={true}
        titlename={'Complaint // แก้ไขข้อมูล'}
        buttonText={"Save & Submit"}
        handleClose={handleClose}
        handlefunction={ComplaintEdit}
        handlesavedraft={ComplaintSavedraftAdd}
        hideSaveDraft={true}
        buttonColor="success"
        element={<ComplaintBody
          action="Edit"
          onBlocksChange={(data) => setComplaintBlocks(data)}
          validateDetailText={blockValidateErrors}
          handleOpenAdd={handleOpenAddList}
          validateText={{
            Product_Group: false,
            Report_Type: reportTypeError,
            Respondent_Department: false,
            Date_of_Detection: dateOfDetectionError,
            Department_Area: departmentAreaError,
            Product_Name: productNameError,
            Lot_No: lotNoError,
            Email: emailError,
            Complaint_Type: complaintTypeError,
            Other_Type: otherTypeError,
            Complaint_Rs: complaintRsError,
            Other_Rs: otherRsError,
            Clause_Rs: clauseRsError,
            Detail: detailError,
            Priority: priorityError,
          }}
          onReportTypeChange={(val) => {
            setdataReportTypeValue(val);
            setReportTypeError(false);
            setDateOfDetectionError(false);
            setDepartmentAreaError(false);
            setProductNameError(false);
            setLotNoError(false);
            setEmailError(false);
            setComplaintTypeError(false);
            setOtherTypeError(false);
            setComplaintRsError(false);
            setOtherRsError(false);
            setClauseRsError(false);
            setDetailError(false);
            setPriorityError(false);
          }}
          onDateOfDetectionChange={(val) => {
            setdate_of_detection(val);
            setDateOfDetectionError(false);
          }}
          onDepartmentAreaChange={(val) => {
            setrespondent_department_id(val);
            setDepartmentAreaError(false);
          }}
          onProductNameChange={(val) => {
            setproduct_name(val);
            setProductNameError(false);
          }}
          onLotNoChange={(val) => {
            setlot_no(val);
            setLotNoError(false);
          }}

          onEmailChange={(val) => {
            setrespondent_email(val);
            setEmailError(false);
          }}
          onComplaintTypeChange={(val) => {
            setComplaintTypeError(false);
            setOtherTypeError(false);
          }}
          onOtherTypeChange={(val) => {
            setOtherTypeError(false);
          }}
          onComplaintRsChange={(val) => {
            setComplaintRsError(false);
            setOtherRsError(false);
            setClauseRsError(false);
          }}
          onOtherRsChange={(val) => {
            setOtherRsError(false);
          }}
          onClauseChange={(val) => {
            setClauseRsError(false);
          }}
          onDetailChange={(val) => {
            setDetailError(false);
          }}
          onPriorityChange={(val) => {
            setPriorityError(false);
          }}
        />}
      />

      <FuncDialog
        open={openComplaintDelete}
        dialogWidth="xl"
        hideSaveDraft={true}
        openBottonHidden={true}
        hideReject={true}
        titlename={'Complaint // ลบข้อมูล'}
        buttonText={"Delete"}
        handleClose={handleClose}
        handlefunction={ComplaintDelete}
        buttonColor="error"
        element={<ComplaintBody
          action="Delete"
        />}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* ------------------------ Explain FuncDialog ------------------------ */}
      {/* ---------------------------------------------------------------------- */}

      <FuncDialog
        open={openExplain}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"Explain // รายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={<ComplaintBody
          action="Explain"
          handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
          handleOnclickExplainView={handleOnclickExplainView}
        />}
      />

      <FuncDialog
        open={openExplainAdd}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={"Explain // เพิ่มข้อมูล"}
        buttonText={"Save & Submit"}
        handleClose={handleClose}
        handlefunction={ExplainAdd}
        hideSaveDraft={true}
        buttonColor="success"
        element={<ExplaintBody
          action="ExplainAdd"
        />}
      />

      <FuncDialog
        open={openExplainView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"Explain // ดูข้อมูล"}
        handleClose={handleClose}
        handlefunction={ExplainGet}
        buttonColor="success"
        element={<ExplaintBody
          action="ExplainRead"
          //isViewMode={true}
        />}
      />


      {/* 
      <FuncDialog
        open={openExplainEdit}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={'Explain // แก้ไขข้อมูล'}
        handleClose={handleClose}
        handlefunction={ComplaintEdit}
        buttonColor="success"
        element={<ComplaintBody
          action="Explain_Edit"
        />}
      />

      <FuncDialog
        open={openExplainDelete}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={'Explain // ลบข้อมูล'}
        handleClose={handleClose}
        handlefunction={ComplaintDelete}
        buttonColor="success"
        element={<ComplaintBody
          action="Explain_Delete"
        />}
      />

      {/* Dialog Sections */}

      {/* <FuncDialog
        open={openAddlist}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={"เพิ่มข้อมูล"}
        handleClose={handleCloseAddlist}
        handlefunction={ExplainAdd}
        buttonColor="success"
        element={
          <ExplaintBody
            action="Add"
            // onBlocksChange={(data) => setComplaintBlocks(data)}
            validateDetailText={blockValidateErrors}

          />
        }
      /> */}

      {/* <FuncDialog
        open={openComplaintView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"Approve Section Head // รายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={<ComplaintBody
          action="ApproveScAdd"
          handleOpenAdd={() => handleOnclickExplainApproveSc(dataelement)}
        />}
      /> */}

      <FuncDialog
         open={openExplainApproveSc}
         dialogWidth="xl"
         openBottonHidden={true}
         hideSaveDraft
         hideReject={approveSelectionCode === "APPROVE"} // ซ่อนปุ่ม Reject ถ้าเลือก Approve
         hideSaveSubmit={approveSelectionCode === "ADD" || approveSelectionCode === "REJECT"} 
         titlename={"Approve Section Head // เพิ่มข้อมูล"}
         buttonText={"Approve"}
         handleClose={handleClose}
         buttonColor="success"
         element={<ExplaintBody
           action="ApproveScAdd"
           handleOpenAdd={() => handleOnclickExplainApproveSc(dataelement)}
           onApproveChange={(value) => {
             setApproveSelectionCode(value?.lov_code ?? null);
           }}
         />}
       />

      {/* =================== Dialog Sections =================== */}

      <Grow in={successCardOpen} mountOnEnter unmountOnExit>
        <Card
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1500,
            minWidth: 300,
            bgcolor: "#e8f5e9",
            boxShadow: 8,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CheckCircleIcon color="success" fontSize="large" />
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {successCardMessage}
            </Typography>
            <IconButton size="small" onClick={() => setSuccessCardOpen(false)}>
              <CloseIcon />
            </IconButton>
          </CardContent>
        </Card>
      </Grow>
    </>
  );
}
