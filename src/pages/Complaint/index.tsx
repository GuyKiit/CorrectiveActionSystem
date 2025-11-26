import React, { useState, useMemo, useEffect } from "react";
import { _GET, _POST, _POST_FORMDATA, _POST_SYS_API } from "../../service/mas";
import { _formatNumber, conCatDateTime } from "../../../libs/datacontrol";
import { setValueMas } from "../../../libs/setvaluecallback";
import dayjs from "dayjs";
import {
  Alert,
  Snackbar,
  Box,
  Button,
  Divider,
  Paper,
  styled,
  Typography,
  Slide,
  Card,
  CardContent,
  IconButton,
  Grow,
} from "@mui/material";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/CheckCircle";
import ExplaintBody from "./components/ExplaintBody";
import {
  mas_DepartmentDomainGet,
  mas_DepartmentDomainGetAll,
  mas_DepartmentGet_Complaint,
  mas_DomainGet,
  mas_DomainRelateGet,
} from "../../service/mas/lov";
import { data } from "react-router-dom";

// =====================================================================================================
// TYPE DEFINITIONS : โอมสุดหล่อ
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
  doc_date: dayjs.Dayjs;
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
  date_of_detection: dayjs.Dayjs | null;
  respond_date_within: dayjs.Dayjs | null;
};
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
    dataelement,
    setdataelement,
    Complaint_no,
    no,
    id,
    report_type,
    cas_number,
    doc_date,
    date_of_detection,
    request_name,
    request_company_id,
    request_domain_id,
    request_department_id,
    request_position,
    request_email,
    request_phone,
    request_date,
    respondent_company_id,
    respondent_domain_id,
    respondent_department_id,
    respondent_email,
    respondent_other_name,
    respondent_other_email,
    product_name,
    detail,
    compTypeOther,
    compRsOther,
    priority_level,
    respond_date_within,
    lot_no,
    user_file_name,
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
    datapriorityValue_Combobox,
    datastatus,
    datastatusconfig,
    datapriority_Combobox,
    datapriority,
    PriorityLevel,
    clauseOther,
    phoTypeOther,
    complaintFiles,
    RunningModel,
    approve_step,
    otherText,
    domainrelate,
    dataapproveValue_Combobox,

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
    dataset_roleProfile,
    dataset_complaintActionApproveSC,
    dataset_complaintActionApproveQC,
    dataset_crosscompany,

    // Temp Domain Variable
    domain,

    //Explaint
    explainList,
    approveList,
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
    approve_status,
    approve_detail,
    approve_note,
    approve_name,
    approve_company_id,
    approve_department_id,
    apprvove_position,
    approve_email,
    approve_date,

    qcapprove_name,
    qcapprove_company_id,
    qcapprove_department_id,
    qcapprove_position,
    qcapprove_email,
    qcapprove_date,
    qcapprove_detail,
    qcapprove_note,

    // Setter Functions
    setComplaint_no,
    setno,
    setid,
    setreport_type,
    setcas_number,
    setdoc_date,
    setdate_of_detection,
    setrequest_name,
    setrequest_company_id,
    setrequest_domain_id,
    setrequest_department_id,
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
    setcompTypeOther,
    setcompRsOther,
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
    setdatastatus,
    setdatastatusconfig,
    setdataComplaintRsValue_Combobox,
    setdataphoto_Combobox,
    setdataphotoValue_Combobox,
    setdatapriorityValue_Combobox,
    setdatapriority_Combobox,
    setdatapriority,
    setPriorityLevel,
    setclauseOther,
    setphoTypeOther,
    setdataset_reporttype,
    setdataset_activeCompany,
    setdataset_roleProfile,
    setdataset_department,
    setdataset_company,
    set_domain,
    setdataset_domain,
    setdataset_domainrelate,
    setcomplaintFiles,
    setotherText,
    set_domainrelate,
    setdataset_complaintActionApproveSC,
    setdataset_complaintActionApproveQC,
    setdataset_crosscompany,

    //set Explaint
    setExplainList,
    setApproveList,
    setdataToolUse,
    setdataToolUse_Combobox,
    setToolOther,
    dataSectionapp,
    setdataSectionapp,
    setdataQcapp,
    setdataFuapp,
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

    //set Approve
    setapprove_date,
    setapprove_status,
    setapprove_detail,
    setapprove_note,
    setapprove_name,
    setapprove_company_id,
    setapprove_department_id,
    setapprove_position,
    setapprove_email,

    setqcapprove_name,
    setqcapprove_company_id,
    setqcapprove_department_id,
    setqcapprove_position,
    setqcapprove_email,
    setqcapprove_date,
    setqcapprove_detail,
    setqcapprove_note,

    //set Close
    setclose_name,
    setclose_company_id,
    setclose_department_id,
    setclose_position,
    setclose_email,
    setclose_date,
    setclose_detail,
    setclose_note,

    isApproveScBoxHidden,
    setisApproveScBoxHidden,
    isApproveQcBoxHidden,
    setisApproveQcBoxHidden,
    isApproveCloseBoxHidden,
    setisApproveCloseBoxHidden,
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
  const [openReadExplain, setOpenReadExplain] = React.useState(false);
  const [openApproveSC, setOpenApproveSC] = React.useState(false);
  const [openReadApproveSC, setOpenReadApproveSC] = React.useState(false);
  //const [openApproveQC, setOpenApproveQC] = React.useState(false);
  const [openReadApproveQC, setOpenReadApproveQC] = React.useState(false);
  const [openReadClose, setOpenReadClose] = React.useState(false);
  const [openCloseHistory, setOpenCloseHistory] = React.useState(false);
  // Close Dialog Handler

  const [openExplainApproveSc, setOpenExplainApproveSc] = React.useState(false);
  const [openExplainApproveQc, setOpenExplainApproveQc] = React.useState(false);

  const [openComplainClose, setOpenComplainClose] = React.useState(false);
  const [openComplainCloseAdd, setOpenComplainCloseAdd] = React.useState(false);

  const [openApproveQC, setOpenApproveQC] = React.useState(false);
  const [openApproveQCAdd, setOpenApproveQCAdd] = React.useState(false);

  const [openUpLoad, setOpenUpload] = React.useState(false);

  const [ComplaintBlocks, setComplaintBlocks] = useState<Block[]>([]);
  const [blockValidateErrors, setBlockValidateErrors] = useState<{
    [index: number]: data_detail;
  }>({});
  const [successCardOpen, setSuccessCardOpen] = React.useState(false);
  const [successCardMessage, setSuccessCardMessage] = React.useState("");
  const [openAddlist, setOpenAddlist] = React.useState(false);

  // const [explainList, setExplainList] = useState<any[]>([]);
  // const [approveList, setApproveList] = useState<any[]>([]);
  const [currentExplainForApproval, setCurrentExplainForApproval] =
    useState<any>(null);
  const [complaintMainData, setComplaintMainData] = useState<any>(null);
  const [approveSelectionCode, setApproveSelectionCode] = useState<
    string | null
  >(null);
  const [action, setAction] = React.useState("");

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

  // Date Search Variables (from index.tsx)
  const [respondWithinSearch, setrespondWithinSearch] = React.useState<
    dayjs.Dayjs | undefined | null
  >(dayjs().subtract(1, "month"));
  const [documentDateSearch, setdocumentDateSearch] =
    React.useState<dayjs.Dayjs | null>(null);
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
  const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>(
    []
  );
  const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
  const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
  const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);
  const [isRSHidden, setIsRSHidden] = React.useState(true);
  const [value, setValue] = React.useState(0);
  // ถ้าสถานะเป็น EXPLAIN หรือ CLOSED ไม่ต้องให้กด Reject
  const hideReject = dataelement?.complaint_status_label == "EXPLAINED";

  // =====================================================================================================
  // UTILITY FUNCTIONS (from index.tsx and ComplaintRead.tsx)
  // =====================================================================================================

  const [reportTypeError, setReportTypeError] = useState(false);
  const [respondentDepartmentError, setRespondentDepartmentError] =
    useState(false);
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

  const [scDetailError, setScDetailError] = useState(false);
  const [scNoteError, setScNoteError] = useState(false);

  const [followUpDateError, setFollowUpDateError] = useState(false);
  const [obsAnalyError, setObsAnalyError] = useState(false);
  const [toolUseError, setToolUseError] = useState(false);
  const [toolUseOtherError, setToolUseOtherError] = useState(false);
  const [rootCauseError, setRootCauseError] = useState(false);
  const [ddError, setDdError] = useState(false);
  const [ddOtherError, setDdOtherError] = useState(false);
  const [correctiveActionError, setCorrectiveActionError] = useState(false);
  const [preventiveActionPlanError, setPreventiveActionPlanError] =
    useState(false);
  const [qcDetailError, setQcDetailError] = useState(false);
  const [qcNoteError, setQcNoteError] = useState(false);

  const [closeDetailError, setCloseDetailError] = useState(false);
  const [closeNoteError, setCloseNoteError] = useState(false);

  const handleOpenAddList = () => setOpenAddlist(true);
  const handleCloseAddlist = () => setOpenAddlist(false);

  // For On-Off Calling Function Log
  const [isCallFuncLogOn] = useState(true);

  // const handleClose = () => {
  //   if (isCallFuncLogOn)
  //     console.log(
  //       "🕑 ",
  //       dayjs().format("HH:mm:ss.SSS"),
  //       " [Calling Function]  :  handleClose"
  //     );

  //   setOpenComplaintAdd(false);
  //   // setOpenSync(false);
  //   setOpenComplaintView(false);
  //   setOpenComplaintEdit(false);
  //   setOpenComplaintDelete(false);
  //   setOpenExplain(false);
  //   setOpenReadExplain(false);
  //   setOpenApproveSC(false);
  //   setOpenReadApproveSC(false);
  //   setOpenApproveQC(false);
  //   setOpenReadApproveQC(false);
  //   setOpenExplainAdd(false);
  //   setOpenExplainView(false);
  //   setOpenExplainApproveSc(false);
  //   setOpenExplainApproveQc(false);
  //   setOpenApproveQC(false);
  //   setOpenComplainClose(false);
  //   setOpenComplainCloseAdd(false);
  //   setOpenUpload(false);
  //   setApproveSelectionCode(null); // รีเซ็ตค่าเมื่อปิด Dialog
  //   //setdataFuapp(null); // รีเซ็ตค่า Approve ที่เลือกไว้
  //   // resetForm();
  // };

  // const handleOnclickCloseHistory = async (data: any) => {
  //     if (isCallFuncLogOn)
  //       console.log(
  //         "🕑 ",
  //         dayjs().format("HH:mm:ss.SSS"),
  //         " [Calling Function]  :  handleOnclickCloseHistory"
  //       );
  //     // ดึง complaint ข้อมูลจริงจาก API
  //     // const complaintData = await Complaint_Get(data);

  //     // if (!complaintData) return;
  //     // setdataelement(complaintData);

  //     // // ดึง explain ของ complaint
  //     // await Explain_Get(complaintData.id);

  //     // setOpenApproveSC(true);

  //     // เซ็ต state ของ complaint
  //     //console.log("Read step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuView ");
  //     //console.log("Read step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
  //     resetForm();
  //     setdataelement(data);
  //     setopenCloseHistory(true);
  //   };
  //   // ------------------------------------------------------//

  //   // -------------------------  QC  ---------------------------//
  //   const handleOnclickApproveQC = async (data: any, name: string) => {
  //     setAction(name);
  //     if (isCallFuncLogOn)
  //       console.log("🕑 ", dayjs().format("HH:mm:ss.SSS"), " [Calling Function]  :  handleOnclickApproveQC");

  //     resetForm();
  //     Complaint_Get(data);
  //     setOpenApproveQC(true);
  //     setdataelement(data);
  //   };

  // =====================================================================================================
  // EVENT HANDLERS (On Change Functions)
  // =====================================================================================================

  const handleCompanyChange = (value: any) => {
    if (value != null) {
      mas_DomainRelateGet(value, set_domainrelate, isCallFuncLogOn);
    } else {
      setrespondent_domain_id(null);
    }
    //console.log("@@@@@@@@@@@@second", dataset_domainrelate);
  };

  const handleDomainChange = (value: any) => {
    //console.log('####### Onchange Domain Value [event] : ', value);
    //console.log("@@@@@@@@@@@@First", dataset_domainrelate);

    if (value != null) {
      //console.log("😎😎", value);
      mas_DepartmentGet_Complaint(
        value,
        setdataset_department,
        isCallFuncLogOn,
        user
      );
    } else {
      setdataset_department([]);
      setrespondent_department_id(null);
    }
    //console.log("@@@@@@@@@@@@second", domainrelate);
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
    setapprove_name("");
    setapprove_company_id(0);
    setapprove_department_id(null);
    setapprove_position("");
    setapprove_email("");

    // เคลียร์ข้อมูล Approve
    setdataFuapp(null);
    setapprove_date(null);
    setapprove_detail("");
    setapprove_note("");
    setdataSectionapp("");
    setdataQcapp("");
    setqcapprove_detail("");
    setqcapprove_note("");
    setclose_detail("");
    setclose_note("");

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
    setQcDetailError(false);
    setQcNoteError(false);
    setScDetailError(false);
    setScNoteError(false);
  };

  // Extract Report Type Function (from ComplaintRead.tsx)
  const extractReportType = (code?: string): string => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  extractReportType"
      );

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
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleChange"
      );

    setValue(newValue);
  };

  const splitByDot = (str: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  splitByDot"
      );

    return str.split(".");
  };

  // Update Complaint ID Functions (from index.tsx)
  function compTypeUpdateCompId(
    dataComplaintTypeValue_Combobox: any,
    complaintid: string,
    compTypeOther: string
  ) {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  compTypeUpdateCompId"
      );

    const updatedData = dataComplaintTypeValue_Combobox.map((item: any) => {
      return {
        ...item,
        complaint_id: complaintid,
        other: item.isOther === "Y" ? compTypeOther?.trim() || null : null,
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
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  compRsUpdateCompId"
      );

    const updatedData = dataComplaintRsValue_Combobox.map((item: any) => {
      return {
        ...item,
        complaint_id: complaintid,
        other: item.isClause === "Other" ? compRsOther?.trim() || null : null,
        clause: item.isClause === "Clause" ? clauseOther?.trim() || null : null,
      };
    });
    return updatedData;
  }

  function compFileUpdateCompId(
    dataphotoValue_Combobox: any,
    complaintid: string,
    phoTypeOther: string
  ) {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  compFileUpdateCompId"
      );

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
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  getPaddingYear"
      );

    const paddingYear = String(new Date().getFullYear() % 100).padStart(2, "0");

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
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  expToolUpdateCompId"
      );

    const updatedData = dataTooluseValue.map((item: any) => {
      return {
        ...item,
        explain_id: explain_id,
        other: item.isOther === "Y" ? ToolOther?.trim() || null : null,
      };
    });
    return updatedData;
  }

  function expDecisionUpdateCompId(
    dataDecisionValue: any,
    explain_id: string,
    DecisionOther: string
  ) {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  expDecisionUpdateCompId"
      );

    const updatedData = dataDecisionValue.map((item: any) => {
      return {
        explain_dd_id: item.explain_dd_id,
        label: item.label,
        isOther: item.isOther,
        explain_id: explain_id,
        other: item.isOther === "Y" ? DecisionOther?.trim() || null : null,
      };
    });
    return updatedData;
  }

  // =====================================================================================================
  // API FUNCTIONS - GET DATA MASTER
  // =====================================================================================================

  // Function - Get LOV Master Data
  const LovAll_Get = async (mode?: any, respondent_domain_id?: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  LovAll_Get"
      );

    if (mode == "complaint_status") {
      try {
        const dataset = {
          lov_group: String(user[0]?.itasset_company_id),
          lov_type: "complaint_status",
          lov7:
            typeof respondent_domain_id === "object"
              ? respondent_domain_id?.domain_id
              : respondent_domain_id,
        };
        const response = await _POST(dataset, "/Lov/LovGet");

        if (response && response.status === "success") {
          const lovData = response.data || [];
          console.log(
            "❇️❇️❇️❇️❇️❇️❇️ Call [Lov/LovGet] -> LovAll_Get :",
            response.data
          );

          // ✅ จัดกลุ่มตาม lov_type
          const grouped = lovData.reduce((acc: any, item: any) => {
            if (!acc[item.lov_type]) acc[item.lov_type] = [];
            acc[item.lov_type].push(item);
            return acc;
          }, {});

          // return grouped["complaint_status"].filter((item: any) => item.lov7 === respondent_domain_id?.domain_id)
          return grouped["complaint_status"].filter(
            (item: any) =>
              item.lov7 ===
              (typeof respondent_domain_id === "object"
                ? respondent_domain_id?.domain_id
                : respondent_domain_id)
          );
        }
      } catch (e) {
        //console.log("error:", e);
      }
    } else {
      try {
        const dataset = {
          lov_group: user[0]?.itasset_company_id + ",VARIABLE_CONSTANT",
          lov_type:
            "report_type,complaint_type,cross_company_check,reference_standard,priority_level,attach_type,complaint_status,tool_use,decision_disposition,approve_select,complaint_step,complaint_action,active_company,role_profile",
        };
        const response = await _POST(dataset, "/Lov/LovGet");

        if (response && response.status === "success") {
          const lovData = response.data || [];
          //console.log("❇️❇️❇️❇️❇️❇️❇️ Call [Lov/LovGet] -> LovAll_Get :", response.data);

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
          setdataComplaintRs_Combobox?.(grouped["reference_standard"] || []);
          setdatapriority_Combobox?.(grouped["priority_level"] || []);
          setdataphoto_Combobox?.(grouped["attach_type"] || []);

          setdataToolUse_Combobox?.(grouped["tool_use"] || []);
          setdataDecision_Combobox?.(grouped["decision_disposition"] || []);
          setdataApprove_Combobox?.(grouped["approve_select"] || []);
          setdataset_stepcomplaint?.(grouped["complaint_step"] || []);
          setdataset_complaintAction?.(grouped["complaint_action"] || []);
          setdataset_activeCompany?.(grouped["active_company"] || []);
          setdataset_roleProfile?.(grouped["role_profile"] || []);
          setdataset_crosscompany?.(grouped["cross_company_check"] || []);

          setdatastatus?.(
            grouped["complaint_status"].filter(
              (item: any) => item.lov7 === user[0].employee_domain
            )
          );

          setdataset_complaintActionNew(
            grouped["complaint_action"].filter(
              (item: any) => item.lov_code === "ACTION_NEW"
            )
          );
          setdataset_complaintActionExplain(
            grouped["complaint_action"].filter(
              (item: any) => item.lov_code === "ACTION_EXPLAIN"
            )
          );
          setdataset_complaintActionApproveSC(
            grouped["complaint_action"].filter(
              (item: any) => item.lov_code === "ACTION_APPROVE_SC"
            )
          );
          setdataset_complaintActionApproveQC(
            grouped["complaint_action"].filter(
              (item: any) => item.lov_code === "ACTION_APPROVE_QC"
            )
          );
          setdataset_complaintActionClose(
            grouped["complaint_action"].filter(
              (item: any) => item.lov_code === "ACTION_CLOSE"
            )
          );

          console.log(
            '⚠️⚠️⚠️⚠️ [grouped["complaint_status"]] :',
            grouped["complaint_status"]
          );
          //console.log('⚠️⚠️⚠️⚠️ [grouped["active_company"]] :', grouped["active_company"])
          console.log(
            '⚠️⚠️⚠️⚠️ grouped["cross_company_check"] :',
            grouped["cross_company_check"]
          );
        }
      } catch (e) {
        //console.log("error:", e);
      }
    }
  };

  // Function - Get Priority Levels
  // const priority_Get = async () => {
  //   if (isCallFuncLogOn) //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  priority_Get");

  //   try {
  //     const dataset = {
  //       lov_group: "21",
  //       lov_type: "priority_level",
  //     };
  //     const response = await _POST(dataset, "/Lov/LovGet");
  //     if (response && response.status === "success") {
  //       // //console.log("❇️ Call [Lov/LovGet] -> priority_level :", response.data);
  //       setdatapriority_Combobox && setdatapriority_Combobox(response.data);
  //     }
  //   } catch (e) {
  //     //console.log("error:", e);
  //   }
  // };

  // Function - Get Domain
  const DomainGet = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  DomainGet"
      );

    try {
      const dataset = {
        company_id: user[0]?.itasset_company_id,
      };
      const response = await _POST(dataset, "/Complaint/CasDomainGet");
      if (response && response.status === "success") {
        // //console.log("❇️ Call [Complaint/CasDomainGet] -> Domain_Get :",response.data);

        // console.log("❇️ Call [Complaint/DomainGet] -> DomainGet :",response.data );
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
      //console.log("error:", e);
    }
  };

  // Function - Get Company
  const CompanyGet = async (action?: string) => {
    if (isCallFuncLogOn)
      //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CompanyGet");

      try {
        const response = await _POST({}, "/Complaint/CasCompanyGet");

        if (response && response.status === "success") {
          //console.log("❇️ Call [Complaint/CasCompanyGet] -> Company_Get :", response.data);

          const activeCompany = dataset_activeCompany; // จาก LovAll_Get

          //console.log("🧩 activeCompany sample:", activeCompany);
          //console.log("🧩 company sample:", response.data);

          if (activeCompany?.length > 0) {
            const active = activeCompany[0]?.lov1 || "";

            const activeid = active.split(",").map((id: string) => id.trim());

            //console.log("✅ activeid:", activeid);

            // ✅ filter บริษัทตาม company_id
            const filteredCompany = response.data.filter((company: any) =>
              activeid.includes(company.company_id.toString())
            );

            //console.log("⚙️ [filteredCompany]:", filteredCompany);
            setdataset_company(filteredCompany);
          } else {
            //console.log("⚠️ activeCompany ยังไม่มีค่า ใช้ company ทั้งหมดแทน");
            setdataset_company(response.data);
          }
        }
      } catch (e) {
        //console.log("error:", e);
      }
  };
  // Function - Get DomainRelate
  const DomainRelateGet = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  DomainRelateGet"
      );

    try {
      const dataset = {
        domain: user[0]?.employee_domain,
        company_id: user[0]?.itasset_company_id,
      };
      const response = await _POST(dataset, "/Complaint/CasDomainRelateGet");
      if (response && response.status === "success") {
        // //console.log("❇️ Call [Complaint/CasDomainGet] -> DomainRelateGet :",response.data);

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
      //console.log("error:", e);
    }
  };

  // Function - Get Department Domain
  // const DepartmentDomainGet = async (action?: string) => {
  //   if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentDomainGet");

  //   try {
  //     const dataset = {
  //       domain_id: respondent_domain_id.domain_id,
  //       company_id: user[0]?.itasset_company_id,
  //     };
  //     const response = await _POST(
  //       dataset,
  //       "/Complaint/CasDepartmentDomainGet"
  //     );
  //     if (response && response.status === "success") {
  //       //console.log("❇️ Call [Complaint/CasDepartmentDomainGet] -> Department_Domain_Get :",response.data);

  //       setdataset_department(response.data);

  //       if (action == "Add") {

  //         //================================================
  //         let department = response.data.filter(
  //           (item: any) => item.department_id != user[0]?.itasset_department_id
  //         );
  //         setdataset_department(department);
  //         // if (department) {
  //         //   // setdataset_domain(domain);
  //         //   setdataset_department(department);
  //         // }
  //         //================================================

  //       }
  //     }
  //   } catch (e) {
  //     //console.log("error:", e);
  //   }
  // };

  // Function - Get Complaints
  const Dept_setup_By_Domain_dept_id_Get = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  Dept_setup_By_Domain_dept_id_Get"
      );

    setIsLoadingScreen(true);
    const dataset = {
      domain_dept_id: data.domain_dept_id,
    };

    try {
      let response = await _POST(
        dataset,
        "/DeptSetup/DeptSetupByDomaindeptidGet"
      );
      if (
        response &&
        response.status === "success" &&
        response.data?.length > 0
      ) {
        setIsLoadingScreen(false);
        setdataelement(response.data[0]);
        return response.data[0]; // 👈 คืนค่าข้อมูลกลับไป (สำคัญ)
      } else {
        setdataelement(null);
      }
    } catch (e) {
      console.error("error", e);
    }
  };
  // =====================================================================================================
  // API FUNCTIONS - CRUD OPERATIONS
  // =====================================================================================================

  // Function - Get Complaints
  const Complaint_Get = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  Complaint_Get"
      );

    setIsLoadingScreen(true);
    const dataset = {
      id: data.id,
      user_id: user[0]?.employee_username,
      domain_id: user[0]?.employee_domain,
      department_id: user[0]?.itasset_department_id,
      company_id: user[0]?.itasset_company_id,
    };
    //console.log("Read step:4 dataset: ", dataset);

    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      //console.log("Read step:4 ผลลัพธ์ : ", response);
      //console.log("Read step:4 Normalize ปรับค่าใหม่ : ", response.data[0],);
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setdataelement(response.data[0]);
        console.log("response.data[0]", response.data[0]);

        setcomplaint_status_id(response.data[0]?.complaint_status_id);
        return response.data[0];
      }
    } catch (e) {
      //console.log("error");
    }
  };

  const ExplainGet = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ExplainGet"
      );

    if (!dataelement?.id) {
      //console.log("No complaint ID, skipping explain fetch");
      return;
    }

    setIsLoadingScreen(true);
    const dataset = {
      complaint_id: dataelement?.id,
    };
    //console.log("🔍 ExplainGet dataset:", dataset);

    try {
      let response = await _POST(dataset, "/Explain/ExplainGet");

      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setExplainList(response.data || []);
        //console.log("🔍 ExplainList set to:", response.data);

        // Debug each explain record
        if (Array.isArray(response.data)) {
          response.data.forEach((explain: any, index: number) => {
            //console.log(`🔍 Explain record ${index}:`, explain);
            //console.log(`🔍 Explain ${index} complaintType:`, explain.complaintType);
            //console.log(`🔍 Explain ${index} complaintRs:`, explain.complaintRs);
          });
        }
      }
    } catch (e) {
      //console.log("ExplainGet error:", e);
      setIsLoadingScreen(false);
    }
  };

  const Explain_Get = async (complaint_id: string) => {
    if (!complaint_id) return;

    setIsLoadingScreen(true);
    try {
      const response = await _POST({ complaint_id }, "/Explain/ExplainGet");
      console.log("📡 Response Explaint_Get:", response.data);

      if (response?.status === "success") {
        setExplainList(response.data || []);
      }
    } catch (e) {
      console.error("Explain_Get error:", e);
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

  // Function - Search Complaints
  const ComplaintGet = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ComplaintGet"
      );
    console.log("step:2 เรียกฟังก์ชั่น ComplaintGet ใหม่");
    //console.log("⭐️⭐️⭐️⭐️ CHECK DATA COMPLAINT ACTION : ", dataset_complaintAction, "⭐️⭐️⭐️");

    setIsLoadingScreen(true);
    const dataset = {
      // Required Parameter
      user_id: user[0]?.employee_username,
      domain_id: user[0]?.employee_domain,
      department_id: user[0]?.itasset_department_id,
      company_id: user[0]?.itasset_company_id, //@param Fixed
      //=======================================================
      domain: TextNameSearch.dataset_domainrelate
        ? TextNameSearch.dataset_domainrelate
        : null,
      department: TextNameSearch.dataset_department
        ? TextNameSearch.dataset_department
        : null,
      report_code: TextNameSearch.report_code
        ? TextNameSearch.report_code
        : null,
      cas_number: TextNameSearch.cas_number ? TextNameSearch.cas_number : null,
      product_name: TextNameSearch.product_name
        ? TextNameSearch.product_name
        : null,
      lot_no: TextNameSearch.lot_no ? TextNameSearch.lot_no : null,
      complaint_status_label: TextNameSearch.datastatus
        ? TextNameSearch.datastatus
        : null,
      doc_date: documentDateSearch
        ? documentDateSearch.format("DD-MM-YYYY")
        : null,
      step_label: TextNameSearch.dataset_stepcomplaint
        ? TextNameSearch.dataset_stepcomplaint
        : null,
    };

    console.log("step:2 dataset ก่อนส่ง API /Complaint/ComplaintGet ", dataset);
    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      console.log(
        "step:2 ผลลัพธ์ที่ได้จาก API /Complaint/ComplaintGet ",
        dataset
      );

      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        const responseData: any = [];

        if (Array.isArray(response.data)) {
          console.log("@@@@@@@@        @@@@@@@@", response.data);
          // 🔹 กรองข้อมูลก่อน
          const filteredData = response.data.filter(
            (item: any) =>
              // กรณีที่เป็นของตัวเอง => เห็นทั้งหมด
              item.request_name === user[0].employee_username ||
              // กรณีที่เป็นของคนอื่น => เห็นได้ถ้าไม่ใช่สถานะ NEW
              (item.request_name !== user[0].employee_username &&
                item.complaint_status_label !== "NEW")
          );

          console.log("filteredData", filteredData);

          filteredData.forEach((el: any) => {
            const tempApproveInfo = (datastatus || []).filter(
              //const tempApproveInfo = datastatus.filter(
              (val: any) =>
                val["id"] == el.complaint_status_id && val["lov3"] !== null
            );
            const tempApproveSeq =
              tempApproveInfo.length > 0 ? tempApproveInfo[0]["lov3"] : null;

            const ACTION = (
              <ActionManageCell
                hadleOnclickMenu={(name: any) => {
                  // -------- For Status [NEW] -------------
                  if (name === "View") {
                    handleOnclickComplaintView(el);
                  } else if (name === "Edit") {
                    handleOnclickComplaintEdit(el);
                  } else if (name === "Delete") {
                    handleOnclickComplaintDelete(el);

                    // -------- For Status [SUBMITED] ----------
                  } else if (name === "Explain") {
                    handleOnclickExplain(el);
                  } else if (name === "ReadExplain") {
                    handleOnclickReadExplain(el);

                    // -------- For Status [EXPLAINED] ----------
                  } else if (name === "ApproveSC") {
                    handleOnclickApproveSC(el, name);
                  } else if (name === "ReadApproveSC") {
                    handleOnclickReadApproveSC(el);

                    // -------- For Status [APPROVED][SC] --------
                  } else if (name === "ApproveQC") {
                    handleOnclickApproveQC(el, name);
                  } else if (name === "ReadApproveQC") {
                    handleOnclickReadApproveQC(el);

                    // -------- For Status [APPROVED][QC] --------
                  } else if (name === "Close") {
                    handleOnclickComplainClose(el, name);
                  } else if (name === "ReadClose") {
                    // DepartmentDomainGet("Explain");
                    handleOnclickReadClose(el);

                    // -------- For Status [CLOSED] --------------
                  } else if (name === "CloseHistory") {
                    // DepartmentDomainGet("Explain");
                    handleOnclickCloseHistory(el);
                  }

                  // else if (name === "ExplainApproveSc") {
                  //   // DepartmentDomainGet("Explain");
                  //   handleOnclickExplainApproveSc(el);
                  // }
                }}
                //-----------------------------------------------------------------------
                //-----------------------------------------------------------------------

                // For Status [NEW]
                hiddenRead={
                  (dataset_complaintActionNew &&
                    !dataset_complaintActionNew.some((mode: any) =>
                      mode.lov1
                        .split(",")
                        .includes(String(el.complaint_status_label))
                    )) ??
                  false
                }
                hiddenEdit={
                  (dataset_complaintActionNew &&
                    !dataset_complaintActionNew.some((mode: any) =>
                      mode.lov1
                        .split(",")
                        .includes(String(el.complaint_status_label))
                    )) ??
                  false
                }
                hiddenDelete={
                  (dataset_complaintActionNew &&
                    !dataset_complaintActionNew.some((mode: any) =>
                      mode.lov1
                        .split(",")
                        .includes(String(el.complaint_status_label))
                    )) ??
                  false
                }
                //-----------------------------------------------------------------------
                //-----------------------------------------------------------------------

                // For Status [SUBMITED]
                hiddenExplain={
                  (dataset_complaintActionExplain &&
                    !dataset_complaintActionExplain.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        el.step_label === "EXPLAIN"
                    )) ??
                  false
                }
                hiddenReadExplain={
                  (dataset_complaintActionExplain &&
                    !dataset_complaintActionExplain.some((mode: any) =>
                      mode.lov1
                        .split(",")
                        .includes(String(el.complaint_status_label))
                    )) ??
                  false
                }
                //-----------------------------------------------------------------------
                //-----------------------------------------------------------------------

                // For Status [EXPLAINED]
                hiddenApproveSC={
                  (dataset_complaintActionApproveSC &&
                    !dataset_complaintActionApproveSC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        el.step_label === "EXPLAIN"
                      // ) &&
                      // splitNextStepName(el.approve_step
                    )) ??
                  false
                }
                hiddenReadApproveSC={
                  (dataset_complaintActionApproveSC &&
                    !dataset_complaintActionApproveSC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label))
                      // ) &&
                      // splitNextStepName(el.approve_step
                    )) ??
                  false
                }
                // -----------------------------------------------------------------------
                // -----------------------------------------------------------------------

                // For Status [APPROVED][SC]
                hiddenApproveQC={
                  (dataset_complaintActionApproveQC &&
                    !dataset_complaintActionApproveQC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        tempApproveSeq == "1"
                      // ) &&
                      // splitNextStepName(el.approve_step
                    )) ??
                  false
                }
                hiddenReadApproveQC={
                  (dataset_complaintActionApproveQC &&
                    !dataset_complaintActionApproveQC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        tempApproveSeq == "1"
                      // ) &&
                      // splitNextStepName(el.approve_step
                    )) ??
                  false
                }
                //-----------------------------------------------------------------------
                //-----------------------------------------------------------------------

                // For Status [APPROVED][QC]
                hiddenClose={
                  (dataset_complaintActionApproveQC &&
                    !dataset_complaintActionApproveQC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label))
                        && el.step_label === "COMPLAINT"
                        && tempApproveSeq == "2"
                        && el.request_department_id == user[0]?.itasset_department_id
                      // ) &&
                      // splitNextStepName(el.approve_step
                    )) ??
                  false
                }
                hiddenReadClose={
                  (dataset_complaintActionApproveQC &&
                    !dataset_complaintActionApproveQC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        tempApproveSeq == "2"
                    )) ??
                  false
                }
                //-----------------------------------------------------------------------
                //-----------------------------------------------------------------------

                // For Status [CLOSED]
                hiddenCloseHistory={
                  (dataset_complaintActionClose &&
                    !dataset_complaintActionClose.some((mode: any) =>
                      mode.lov1
                        .split(",")
                        .includes(String(el.complaint_status_label))
                    )) ??
                  false
                }
              />
            );

            el.approve_by = el.approve_by.replace(/\s*\(/, "<br/>(");
            el.ACTION = ACTION;

            // Prepare Role From Role Profile
            const tempRoleUser = dataset_roleProfile.filter(
              (item: any) => item.lov1 === String(user[0].role_id)
            );
            const tempRolename = tempRoleUser[0].lov_code;

            // console.log("🦄🦄🦄🦄🦄🦄 tempApproveSeq : ", tempApproveSeq);
            // console.log("🎆 🎆 🎆 🎆 complaint_status_label:", el.complaint_status_label);
            // console.log("🎆 🎆 🎆 🎆 setdataset_roleProfile :", dataset_roleProfile);
            // console.log("🎆 🎆 🎆 🎆 el :", el);
            // console.log("🎆 🎆 🎆 🎆 user[0] :", user[0]);
            // console.log("🎆 🎆 🎆 🎆 tempRoleUser :", tempRoleUser);

            //console.log(el.step_label)

            // For Display Status on Datatable [NEW, SUBMITED, EXPLAINED, APPROVED, CLOSED]
            el.complaint_status_label = (
              <BasicChips
                label={`${el.complaint_status_label}`}
                acknowledge={el.acknowledge_flag}
                step={`${el.step_label}`}
                role={tempRolename}
                approveseq={tempApproveSeq}
                userdept={user[0]?.itasset_department_id}
                requestdept={el.request_department_id}
              ></BasicChips>
            );

            // For Display Step on Datatable [COMPLAINT, EXPLAIN]
            el.step_label = (
              <BasicChips label={`${el.step_label}`} type="step"></BasicChips>
            );

            responseData.push(el);
          });
        }
        //console.log("step:2 ข้อมูลก่อนเข้า ตาราง ", responseData);
        setdatalist(responseData);
      }
    } catch (e) {
      //console.log("error");
    }
  };

  const splitNextStepName = (str: string) => {
    const parts = str.split("_");
    return parts.length >= 3 ? parts.slice(2).join("_") : str;
  };

  // Function - Validate before Add Complaint
  const validateBeforeAdd = (): boolean => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  validateBeforeAdd"
      );
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

    // Validate Respondent Domain
    if (!respondent_domain_id || !respondent_domain_id.domain_id) {
      setRespondentDepartmentError(true);
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

    // if (!respondent_email || respondent_email.trim() === "") {
    //   setEmailError(true);
    //   valid = false;
    // }

    if (
      !dataComplaintTypeValue_Combobox ||
      dataComplaintTypeValue_Combobox.length === 0
    ) {
      setComplaintTypeError(true);
      valid = false;
    } else {
    }

    if (
      dataComplaintTypeValue_Combobox &&
      dataComplaintTypeValue_Combobox.some((item: any) => item.isOther === "Y")
    ) {
      if (!compTypeOther || compTypeOther.trim() === "") {
        setOtherTypeError(true);
        valid = false;
      } else {
        ////console.log("✅ Other Type validation passed");
      }
    }

    const reportTypeCode = dataReportTypeValue?.lov_code;
    //console.log("🔍 Report Type Code:", reportTypeCode);

    // เฉพาะ NCR เท่านั้นที่ต้อง validate Complaint Rs
    if (reportTypeCode === "NCR") {
      if (
        !dataComplaintRsValue_Combobox ||
        dataComplaintRsValue_Combobox.length === 0
      ) {
        setComplaintRsError(true);
        valid = false;
      }
    }

    // Validate Other Rs
    if (
      reportTypeCode === "NCR" &&
      dataComplaintRsValue_Combobox &&
      dataComplaintRsValue_Combobox.some(
        (item: any) => item.isClause === "Other"
      )
    ) {
      if (!compRsOther || compRsOther.trim() === "") {
        setOtherRsError(true);
        valid = false;
      }
    }

    // Validate Clause Rs
    if (
      reportTypeCode === "NCR" &&
      dataComplaintRsValue_Combobox &&
      dataComplaintRsValue_Combobox.some(
        (item: any) => item.isClause === "Clause"
      )
    ) {
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
    if (
      !datapriorityValue_Combobox ||
      datapriorityValue_Combobox.trim() === ""
    ) {
      setPriorityError(true);
      valid = false;
    }
    return valid;
  };

  //validate Edit
  const validateSaveDraft = (): boolean => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  validateSaveDraft"
      );
    let valid = true;

    setRespondentDepartmentError(false);
    setDateOfDetectionError(false);
    setDepartmentAreaError(false);
    // setProductNameError(false);
    // setLotNoError(false);
    // setEmailError(false);
    // setComplaintTypeError(false);
    // setOtherTypeError(false);
    // setComplaintRsError(false);
    // setOtherRsError(false);
    // setClauseRsError(false);
    // setDetailError(false);
    // setPriorityError(false);

    // Validate Report Type - ตรวจสอบก่อนและถ้าไม่มีให้ return false ทันที
    if (!respondent_domain_id || !respondent_domain_id.domain_id) {
      setRespondentDepartmentError(true);
      valid = false;
    }

    if (!respondent_department_id || !respondent_department_id.department_id) {
      setDepartmentAreaError(true);
      valid = false;
    }
    return valid;
  };

  const validateSCApprove = (): boolean => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  validateSCApprove"
      );
    let valid = true;
    // Clear ALL validation errors before validation
    setScDetailError(false);
    setScNoteError(false);

    if (!approve_detail || approve_detail.trim() === "") {
      setScDetailError(true);
      valid = false;
    }

    if (!approve_note || approve_note.trim() === "") {
      setScNoteError(true);
      valid = false;
    }
    return valid;
  };

  const validateQCApprove = (): boolean => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  validateQCApprove"
      );
    let valid = true;
    // Clear ALL validation errors before validation
    setQcDetailError(false);
    setQcNoteError(false);

    if (!qcapprove_detail || qcapprove_detail.trim() === "") {
      setQcDetailError(true);
      valid = false;
    }

    if (!qcapprove_note || qcapprove_note.trim() === "") {
      setQcNoteError(true);
      valid = false;
    }
    return valid;
  };

  const validateClose = (): boolean => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  validateClose"
      );
    let valid = true;
    // Clear ALL validation errors before validation
    setCloseDetailError(false);
    setCloseNoteError(false);

    if (!close_detail || close_detail.trim() === "") {
      setCloseDetailError(true);
      valid = false;
    }

    if (!close_note || close_note.trim() === "") {
      setCloseNoteError(true);
      valid = false;
    }
    return valid;
  };

  // CREATE -SaveDraft Add Complaint
  const ComplaintSavedraftAdd = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ComplaintSavedraftAdd"
      );

    if (!validateSaveDraft()) {
      return;
    }

    const tempid = uuidv4();

    //Function Split Domain (For using with Complaint Status)
    //const tempComplaintStatus = splitByDot(user[0]?.employee_domain);
    console.log(
      "📡 Sending respondent_domain_id to LovAll_Get:",
      respondent_domain_id
    );
    console.log(
      "📡 Sending respondent_domain_id to LovAll_Get:",
      respondent_domain_id?.domain_id
    );
    const tempComplaintStatus = await LovAll_Get(
      "complaint_status",
      respondent_domain_id
    );
    // console.log("🧩 tempComplaintStatus raw:", tempComplaintStatus);
    // console.log("💕 tempvalue 1 id", tempComplaintStatus[1]?.id);
    // console.log("💕 tempvalue 2 id", tempComplaintStatus[2]?.id);
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
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        request_name: user[0]?.employee_username || "",
        request_company_id: request_company_id?.company_id,
        request_domain_id: user[0]?.employee_domain,
        request_department_id: user[0].itasset_department_id,
        request_position: user[0]?.employee_position || "",
        request_email: user[0]?.employee_email || "",
        request_phone: user[0]?.employee_tel || "",
        request_date: new Date().toISOString(),
        respondent_company_id: respondent_company_id?.company_id,
        respondent_domain_id: respondent_domain_id?.domain_id,
        respondent_department_id: respondent_department_id?.department_id,
        respondent_email: respondent_email,
        product_name: product_name,
        detail: detail,
        priority_level: datapriorityValue_Combobox,
        respond_date_within: respond_date_within
          ? respond_date_within
              .hour(23)
              .minute(59)
              .second(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        lot_no: lot_no,
        complaint_status_id: tempComplaintStatus[0]?.id,
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
          }) || [],
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

    //console.log("📤 complaintPayloadSavedraft:", complaintPayload);
    setIsLoadingScreen(true);

    try {
      const response = await _POST_FORMDATA(
        formData,
        "/Complaint/ComplaintAdd"
      );
      if (response && response.status === "success") {
        FullSweetalert({
          title: "Success",
          text: `บันทึกข้อมูลสำเร็จ`,
          icon: "success",
        });
        //console.log("✅ Complaint Add successfully:", response);
      } else {
        FullSweetalert({
          title: "Failed",
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: "error",
        });
        //console.log("⚠️ Add failed:", response);
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

  // const ComplaintSavedraftEdit = async (mode: string) => {
  //   if (isCallFuncLogOn)
  //     console.log(
  //       "🕑 ",
  //       dayjs().format("HH:mm:ss.SSS"),
  //       " [Calling Function]  :  ComplaintSavedraftEdit"
  //     );

  //   // สร้าง FormData
  //   const formData = new FormData();

  //   if (mode == "NEW") {
  //     console.log("❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️");
  //     const tempid = uuidv4();

  //     //Function Split Domain (For using with Complaint Status)
  //     // const tempComplaintStatus = splitByDot(user[0]?.employee_domain);
  //     const tempComplaintStatus = await LovAll_Get("complaint_status");

  //     // เตรียม Models
  //     const complainttypeModel = dataComplaintTypeValue_Combobox
  //       ? compTypeUpdateCompId(
  //         dataComplaintTypeValue_Combobox,
  //         tempid,
  //         compTypeOther
  //       )
  //       : null;

  //     const complaintRsModel = dataComplaintRsValue_Combobox
  //       ? compRsUpdateCompId(
  //         dataComplaintRsValue_Combobox,
  //         tempid,
  //         compRsOther,
  //         clauseOther
  //       )
  //       : null;

  //     // สร้าง JSON payload
  //     const complaintPayload = {
  //       complaintModel: {
  //         id: dataelement?.id,
  //         report_type: dataReportTypeValue?.id,
  //         cas_number: cas_number,
  //         date_of_detection: date_of_detection
  //           ? date_of_detection
  //             .hour(dayjs().hour())
  //             .minute(dayjs().minute())
  //             .second(dayjs().second())
  //             .format("YYYY-MM-DDTHH:mm:ss.SSS")
  //           : null,
  //         request_name: user[0]?.employee_username || "",
  //         request_company_id: request_company_id?.company_id,
  //         // ? Number(request_company_id.company_id)
  //         // : undefined,
  //         request_domain_id: user[0]?.employee_domain,
  //         request_department_id: user[0].itasset_department_id,
  //         request_position: user[0]?.employee_position || "",
  //         request_email: user[0]?.employee_email || "",
  //         request_phone: user[0]?.employee_tel || "",
  //         request_date: new Date().toISOString(),
  //         respondent_company_id: respondent_company_id?.company_id,
  //         // ? Number(respondent_company_id.company_id)
  //         // : undefined,
  //         respondent_domain_id: respondent_domain_id?.domain_id,
  //         respondent_department_id: respondent_department_id?.department_id,
  //         // ? Number(respondent_department_id.department_id)
  //         // : undefined,
  //         respondent_email: respondent_email,
  //         respondent_other_name: respondent_other_name,
  //         respondent_other_email: respondent_other_email,
  //         product_name: product_name,
  //         detail: detail,
  //         //priority_level: datapriorityValue_Combobox,
  //         priority_level:
  //           datapriorityValue_Combobox || dataelement?.priority_level,
  //         respond_date_within: respond_date_within
  //           ? respond_date_within
  //             .hour(dayjs().hour())
  //             .minute(dayjs().minute())
  //             .second(dayjs().second())
  //             //.format("YYYY-MM-DDTHH:mm:ss.fff")
  //             .format("YYYY-MM-DDTHH:mm:ss.SSS")
  //           : null,
  //         lot_no: lot_no,
  //         complaint_status_id: tempComplaintStatus[0]?.id,
  //         create_by: user[0]?.employee_username || "",
  //         save_type: "save_draft_edit",
  //         complaintType: complainttypeModel,
  //         complaintRs: complaintRsModel,
  //         complaintFile:
  //           complaintFiles?.map((item: any, index: number) => {
  //             return {
  //               cf_type: "Complaint",
  //               complaint_id: tempid,
  //               complaint_at_id: item.attachmentType,
  //               other: item.otherText?.trim() || null,
  //               cf_file_seq: (index + 1).toString(),
  //               user_file_name: item.file.name,
  //               file_name: item.file.name,
  //               file_type: item.file.type.split("/")[1] || "",
  //               file_size: item.file.size.toString(),
  //               record_status: true,
  //               create_by: user[0]?.employee_username || "",
  //               create_datetime: new Date().toISOString(),
  //               remark: item.otherText || null,
  //             };
  //           }) || [],
  //       },
  //       RunningModel: {
  //         code_group: dataReportTypeValue.lov_code,
  //         code_type: dataReportTypeValue.lov1 + "-" + getPaddingYear(),
  //         code_num: 1,
  //       },
  //       CurrentAccessModel: {
  //         user_id: user[0]?.employee_username || "",
  //       },
  //     };

  //     formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

  //     // แนบไฟล์จริง
  //     if (complaintFiles && complaintFiles.length > 0) {
  //       complaintFiles.forEach((fileItem: any) => {
  //         formData.append("complaintFiles", fileItem.file);
  //       });
  //     }

  //     //console.log("📤 complaintPayloadSavedraft:", complaintPayload);
  //     setIsLoadingScreen(true);

  //     try {
  //       const response = await _POST_FORMDATA(
  //         formData,
  //         "/Complaint/ComplaintEdit"
  //       );
  //       if (response && response.status === "success") {
  //         FullSweetalert({
  //           title: "Success",
  //           text: `บันทึกข้อมูลสำเร็จ`,
  //           icon: "success",
  //         });
  //         //console.log("✅ Complaint Add successfully:", response);
  //       } else {
  //         FullSweetalert({
  //           title: "Failed",
  //           text: `บันทึกไม่ข้อมูลสำเร็จ`,
  //           icon: "error",
  //         });
  //         //console.log("⚠️ Add failed:", response);
  //       }
  //     } catch (error) {
  //       console.error("Upload failed:", error);
  //     } finally {
  //       setIsLoadingScreen(false);
  //       handleClose();

  //       // Complaint_Get();
  //       ComplaintGet();
  //     }
  //   }
  // };

  // Function - Add Complaint

  const ComplaintAdd = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ComplaintAdd"
      );

    if (!validateBeforeAdd()) {
      return;
    }

    // Get LOV
    //let tempComplaintStatus: any
    console.log(
      "📡 Sending respondent_domain_id to LovAll_Get:",
      respondent_domain_id
    );
    console.log(
      "📡 Sending respondent_domain_id to LovAll_Get:",
      respondent_domain_id?.domain_id
    );
    const tempComplaintStatus = await LovAll_Get(
      "complaint_status",
      respondent_domain_id
    );
    console.log("🧩 tempComplaintStatus raw:", tempComplaintStatus);
    console.log("💕 tempvalue 1 id", tempComplaintStatus[1]?.id);
    console.log("💕 tempvalue 2 id", tempComplaintStatus[2]?.id);

    // const tempComplaintStatus = await LovAll_Get("complaint_status", dataelement?.respondent_domain_id);
    // // console.log("💕 tempvalue", tempvalue);
    // console.log("💕 tempvalue 0", tempComplaintStatus[0]);
    // console.log("💕 tempvalue 1", tempComplaintStatus[1]);
    // console.log("💕 tempvalue 1 id", tempComplaintStatus[1]?.id);
    // console.log("💕 tempvalue 2 id", tempComplaintStatus[2]?.id);

    const tempid = uuidv4();

    //Function Split Domain (For using with Complaint Status)
    // const tempComplaintStatus = splitByDot(user[0]?.employee_domain);

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

    console.log("💕#### tempvalue 1 id", tempComplaintStatus[1]?.id);
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
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,

        // Request Metadata
        request_name: user[0]?.employee_username || "",
        request_company_id: request_company_id?.company_id,
        request_domain_id: user[0]?.employee_domain,
        request_department_id: user[0]?.itasset_department_id || "",
        request_position: user[0]?.employee_position || "",
        request_email: user[0]?.employee_email || "",
        request_phone: user[0]?.employee_tel || "",

        // Respondent Metadata
        respondent_company_id: respondent_company_id?.company_id,
        respondent_domain_id: respondent_domain_id?.domain_id,
        respondent_department_id: respondent_department_id?.department_id,
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
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        lot_no: lot_no,
        complaint_status_id: tempComplaintStatus[1]?.id,
        create_by: user[0]?.employee_username || "",
        save_type: "save_submit",

        // เพิ่ม Complaint Type + Complaint RS
        complaintType: complainttypeModel,
        complaintRs: complaintRsModel,

        // เพิ่ม complaintFile
        complaintFile:
          complaintFiles?.map((item: any, index: number) => {
            return {
              cf_type: "Complaint",
              complaint_id: tempid,
              complaint_at_id: item.attachmentType,
              other:
                item.attachmentType === "TRR_AT_4"
                  ? item.otherText?.trim() || null
                  : null,
              cf_file_seq: (index + 1).toString(),
              user_file_name: item.file.name,
              file_name: item.file.name,
              file_type: item.file.type.split("/")[1] || "",
              file_size: item.file.size.toString(),
              record_status: true,
              create_by: user[0]?.employee_username || "",
              create_datetime: new Date().toISOString(),
              remark:
                item.attachmentType === "TRR_AT_4"
                  ? item.otherText?.trim() || null
                  : null,
            };
          }) || [],
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
    //console.log("complaintFile:", complaintPayload.complaintModel.complaintFile);

    // สร้าง FormData
    const formData = new FormData();
    formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

    // แนบไฟล์จริง
    if (complaintFiles && complaintFiles.length > 0) {
      complaintFiles.forEach((fileItem: any) => {
        formData.append("complaintFiles", fileItem.file);
      });
    }

    //console.log("📤 FormData prepared:", formData);
    //console.log("📤 complaintPayload:", complaintPayload);
    //console.log("📤 dataReportTypeValue.id:", dataReportTypeValue.id);
    //console.log("📤 dataReportTypeValue.lov_code:",dataReportTypeValue.lov_code);
    //console.log("📤 dataReportTypeValue.lov1:", dataReportTypeValue.lov1);
    // setIsLoadingScreen(true);

    try {
      const response = await _POST_FORMDATA(
        formData,
        "/Complaint/ComplaintAdd"
      );
      if (response && response.status === "success") {
        FullSweetalert({
          title: "Success",
          text: `บันทึกข้อมูลสำเร็จ`,
          icon: "success",
        });
        //console.log("✅ Complaint Add successfully:", response);
      } else {
        FullSweetalert({
          title: "Failed",
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: "error",
        });
        //console.log("⚠️ Add failed:", response);
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
  const ComplaintEdit = async (mode: string) => {
    console.log("💬 Mode received:", mode);
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ComplaintEdit"
      );

    // if (!validateBeforeEdit()) {
    //   return;
    // }

    console.log(
      "📡 Sending respondent_domain_id to LovAll_Get:",
      respondent_domain_id
    );
    console.log(
      "📡 Sending respondent_domain_id to LovAll_Get:",
      respondent_domain_id?.domain_id
    );
    const tempComplaintStatus = await LovAll_Get(
      "complaint_status",
      dataelement?.respondent_domain_id
    );
    console.log("💕 tempvalue 0 id", tempComplaintStatus[0]?.id);
    console.log("💕 tempvalue 1 id", tempComplaintStatus[1]?.id);
    console.log("💕 tempvalue 2 id", tempComplaintStatus[2]?.id);
    console.log("💕 tempvalue 3 id", tempComplaintStatus[3]?.id);
    console.log("💕 tempvalue 4 id", tempComplaintStatus[4]?.id);

    const formData = new FormData();
    if (mode == "SUBMIT") {
      const tempid = uuidv4();

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

      const complaintPayload = {
        complaintModel: {
          id: dataelement?.id,
          mode: mode,
          date_of_detection: date_of_detection
            ? date_of_detection
                .hour(23)
                .minute(59)
                .second(59)
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          respondent_domain_id: respondent_domain_id?.domain_id,
          respondent_department_id: respondent_department_id?.department_id,
          product_name: product_name,
          lot_no: lot_no,
          respondent_email: respondent_email,
          detail: detail,
          priority_level:
            datapriorityValue_Combobox || dataelement?.priority_level,
          respond_date_within: respond_date_within
            ? respond_date_within
                .hour(23)
                .minute(59)
                .second(59)
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          complaint_status_id: tempComplaintStatus[1]?.id,
          complaintType: complainttypeModel,
          complaintRs: complaintRsModel,
          complaintFile:
            complaintFiles?.map((item: any, index: number) => {
              return {
                id: item.id || undefined,
                cf_type: "Complaint",
                complaint_id: dataelement?.id,
                complaint_at_id: item.attachmentType,
                other:
                  item.attachmentType === "TRR_AT_4"
                    ? item.otherText?.trim() || null
                    : null,
                cf_file_seq: (index + 1).toString(),
                user_file_name: item.file.name,
                file_name: item.file.name,
                file_type: item.file.type,
                file_size: item.file.size.toString(),
                record_status: true,
                create_by: user[0]?.employee_username || "",
                create_datetime: new Date().toISOString(),
                remark:
                  item.attachmentType === "TRR_AT_4"
                    ? item.otherText?.trim() || null
                    : null,
              };
            }) || [],
        },

        CurrentAccessModel: {
          user_id: user[0]?.employee_username || "",
        },
      };

      formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

      // แนบไฟล์จริง
      if (complaintFiles && complaintFiles.length > 0) {
        complaintFiles.forEach((fileItem: any) => {
          formData.append("complaintFiles", fileItem.file);
        });
      }
      try {
        const response = await _POST_FORMDATA(
          formData,
          "/Complaint/ComplaintEdit"
        );
        if (response && response.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกข้อมูลสำเร็จ`,
            icon: "success",
          });
          //console.log("✅ Complaint Add successfully:", response);
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกไม่ข้อมูลสำเร็จ`,
            icon: "error",
          });
          //console.log("⚠️ Add failed:", response);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    } else if (mode == "NEW") {
      const tempid = uuidv4();

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
          id: dataelement?.id,
          mode: mode,
          date_of_detection: date_of_detection
            ? date_of_detection
                .hour(23)
                .minute(59)
                .second(59)
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          respondent_domain_id: respondent_domain_id?.domain_id,
          respondent_department_id: respondent_department_id?.department_id,
          product_name: product_name,
          lot_no: lot_no,
          respondent_email: respondent_email,
          detail: detail,
          priority_level:
            datapriorityValue_Combobox || dataelement?.priority_level,
          respond_date_within: respond_date_within
            ? respond_date_within
                .hour(23)
                .minute(59)
                .second(59)
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          complaint_status_id: tempComplaintStatus[0]?.id,
          complaintType: complainttypeModel,
          complaintRs: complaintRsModel,
          complaintFile:
            complaintFiles?.map((item: any, index: number) => {
              return {
                id: item.id || undefined,
                cf_type: "Complaint",
                complaint_id: dataelement?.id,
                complaint_at_id: item.attachmentType,
                other:
                  item.attachmentType === "TRR_AT_4"
                    ? item.otherText?.trim() || null
                    : null,
                cf_file_seq: (index + 1).toString(),
                user_file_name: item.file.name,
                file_name: item.file.name,
                file_type: item.file.type,
                file_size: item.file.size.toString(),
                record_status: true,
                create_by: user[0]?.employee_username || "",
                create_datetime: new Date().toISOString(),
                remark:
                  item.attachmentType === "TRR_AT_4"
                    ? item.otherText?.trim() || null
                    : null,
              };
            }) || [],
        },

        CurrentAccessModel: {
          user_id: user[0]?.employee_username || "",
        },
      };

      formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

      // แนบไฟล์จริง
      if (complaintFiles && complaintFiles.length > 0) {
        complaintFiles.forEach((fileItem: any) => {
          formData.append("complaintFiles", fileItem.file);
        });
      }

      //console.log("📤 complaintPayloadSavedraft:", complaintPayload);
      setIsLoadingScreen(true);

      try {
        const response = await _POST_FORMDATA(
          formData,
          "/Complaint/ComplaintEdit"
        );
        if (response && response.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกข้อมูลสำเร็จ`,
            icon: "success",
          });
          //console.log("✅ Complaint Add successfully:", response);
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกไม่ข้อมูลสำเร็จ`,
            icon: "error",
          });
          //console.log("⚠️ Add failed:", response);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsLoadingScreen(false);
        handleClose();

        ComplaintGet();
      }
    } else if (mode == "EXPLAIN") {
      console.log("🔧 Updating complaint status to EXPLAIN...");
      // สร้าง JSON payload
      const complaintPayload = {
        complaintModel: {
          id: dataelement?.id,
          mode: mode,
          complaint_status_id: tempComplaintStatus[2]?.id,
        },

        CurrentAccessModel: {
          user_id: user[0]?.employee_username || "",
        },
      };
      console.log("💬 tempComplaintStatus: ", tempComplaintStatus);

      formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

      // แนบไฟล์จริง
      if (complaintFiles && complaintFiles.length > 0) {
        complaintFiles.forEach((fileItem: any) => {
          formData.append("complaintFiles", fileItem.file);
        });
      }

      //console.log("📤 complaintPayloadSavedraft:", complaintPayload);
      setIsLoadingScreen(true);

      try {
        const response = await _POST_FORMDATA(
          formData,
          "/Complaint/ComplaintEdit"
        );
        if (response && response.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกข้อมูลสำเร็จ`,
            icon: "success",
          });
          //console.log("✅ Complaint Add successfully:", response);
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกไม่ข้อมูลสำเร็จ`,
            icon: "error",
          });
          //console.log("⚠️ Add failed:", response);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsLoadingScreen(false);
        handleClose();

        ComplaintGet();
      }
    } else if (mode == "APPROVE_SC") {
      console.log("🔧 Updating complaint status to EXPLAIN...");
      // สร้าง JSON payload
      const complaintPayload = {
        complaintModel: {
          id: dataelement?.id,
          mode: mode,
          complaint_status_id: tempComplaintStatus[3]?.id,
        },

        CurrentAccessModel: {
          user_id: user[0]?.employee_username || "",
        },
      };
      console.log("💬 tempComplaintStatus: ", tempComplaintStatus);

      formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

      // แนบไฟล์จริง
      if (complaintFiles && complaintFiles.length > 0) {
        complaintFiles.forEach((fileItem: any) => {
          formData.append("complaintFiles", fileItem.file);
        });
      }

      //console.log("📤 complaintPayloadSavedraft:", complaintPayload);
      setIsLoadingScreen(true);

      try {
        const response = await _POST_FORMDATA(
          formData,
          "/Complaint/ComplaintEdit"
        );
        if (response && response.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกข้อมูลสำเร็จ`,
            icon: "success",
          });
          //console.log("✅ Complaint Add successfully:", response);
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกไม่ข้อมูลสำเร็จ`,
            icon: "error",
          });
          //console.log("⚠️ Add failed:", response);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsLoadingScreen(false);
        handleClose();

        ComplaintGet();
      }
    } else if (mode == "APPROVEQC") {
    } else if (mode == "CLOSE") {
    }
  };

  // Function - Delete Complaint
  const ComplaintDelete = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ComplaintDelete"
      );

    // สร้าง JSON payload
    const complaintPayload = {
      ComplaintModel: {
        id: dataelement?.id,
      },
      CurrentAccessModel: {
        user_id: user[0]?.employee_username || "",
      },
    };

    //console.log("📤 complaintPayload:", complaintPayload);
    //console.log("📤 dataReportTypeValue.id:", dataReportTypeValue.id);
    //console.log("📤 dataReportTypeValue.lov_code:", dataReportTypeValue.lov_code);
    //console.log("📤 dataReportTypeValue.lov1:", dataReportTypeValue.lov1);
    setIsLoadingScreen(true);

    try {
      let response = await _POST(
        complaintPayload,
        "/Complaint/ComplaintDelete"
      );
      if (response && response.status === "success") {
        FullSweetalert({
          title: "Success",
          text: `บันทึกข้อมูลสำเร็จ`,
          icon: "success",
        });
        //console.log("✅ Complaint edittt successfully:", response);
      } else {
        FullSweetalert({
          title: "Failed",
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: "error",
        });
        //console.log("⚠️ Edit failed:", response);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoadingScreen(false);
      handleClose();
      FullSweetalert({
        title: "Success",
        text: `ลบข้อมูลสำเร็จ`,
        icon: "success",
      });
      // Complaint_Get();
      ComplaintGet();
    }
  };

  // READ - Preview Complaint (from ComplaintRead.tsx)
  // const previewComplaint = async () => {
  //   if (isCallFuncLogOn)
  //     console.log(
  //       "🕑 ",
  //       dayjs().format("HH:mm:ss.SSS"),
  //       " [Calling Function]  :  previewComplaint"
  //     );

  //   //console.log(dataelement, "dataelement");
  //   //console.log("dataset_reporttype", dataset_reporttype);
  //   //console.log("NCR TEST", extractReportType("TRR_RT_NCR"));
  //   //console.log("OBS TEST", extractReportType("TRR_RT_OBS"));
  //   //console.log("CAR TEST", extractReportType("TRR_RT_CAR"));
  //   //console.log("CPAR TEST", extractReportType("TRR_RT_CPAR"));

  //   if (dataelement) {
  //     //console.log("dataelement.report_type", dataelement.report_type);

  //     // setIsRSHidden(extractReportType(dataelement.report_type) != "NCR" ? true : false);

  //     // แปลง priority text → id ของ RadioGroup
  //     const selectedPriority = datapriority_Combobox.find(
  //       (item: any) =>
  //         item.lov_code === dataelement.priority_level ||
  //         item.lov1 === dataelement.priority_level
  //     );
  //     setdataPriority(selectedPriority?.id || "");

  //     //console.log("dataComplaintType_Combobox", dataComplaintType_Combobox);
  //     //console.log("dataelement?.complaint_type_id", dataelement?.complaintType);
  //     //console.log("dataelement?.complaint_type_id", dataelement?.complaintRs);
  //     //console.log("dataelement?.complaint_at_id", dataelement?.complaintPhoto);
  //     //console.log("dataelement?.priority_level", dataelement?.priority_level);

  //     const data_ComplaintType = await setValueMas(
  //       dataComplaintType_Combobox,
  //       dataelement?.complaint_type_id,
  //       "id"
  //     );
  //     const data_ComplaintRs = await setValueMas(
  //       dataComplaintRs_Combobox,
  //       dataelement?.complaint_type_id,
  //       "id"
  //     );
  //     const data_ComplaintPhoto = await setValueMas(
  //       dataphoto_Combobox,
  //       dataelement?.complaint_at_id,
  //       "id"
  //     );
  //     const data_Priority = await setValueMas(
  //       datapriority_Combobox,
  //       dataelement?.priority_level,
  //       "id"
  //     );

  //     //console.log("data_ComplaintType", data_ComplaintType);
  //     //console.log("data_ComplaintRs", data_ComplaintRs);
  //     //console.log("data_ComplaintPhoto", data_ComplaintPhoto);
  //     //console.log("data_Priority", data_Priority);
  //     //console.log(dataset_reporttype);
  //   }
  // };

  const ComplaintReturn = async (mode: string) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ComplaintReturn"
      );

    const tempComplaintStatus = await LovAll_Get(
      "complaint_status",
      user[0]?.employee_domain
    );

    console.log("💕 tempvalue 0 id", tempComplaintStatus[0]?.id);
    console.log("💕 tempvalue 1 id", tempComplaintStatus[1]?.id);
    console.log("💕 tempvalue 2 id", tempComplaintStatus[2]?.id);
    console.log("💕 tempvalue 3 id", tempComplaintStatus[3]?.id);
    console.log("💕 tempvalue 4 id", tempComplaintStatus[4]?.id);

    const formData = new FormData();
    if (mode == "EXPLAIN") {
      const complaintReturnPayload = {
        complaintReturnModel: {
          id: dataelement?.id,
          return_from_status_id: tempComplaintStatus[1]?.id,
          complaint_status_id: tempComplaintStatus[0]?.id,
          mode: mode,
        },

        CurrentAccessModel: {
          user_id: user[0]?.employee_username || "",
        },
      };

      try {
        const response = await _POST(
          complaintReturnPayload,
          "/Complaint/ComplaintReturn"
        );
        if (response && response.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกข้อมูลสำเร็จ`,
            icon: "success",
          });
          console.log("✅ Complaint Add successfully:", response);
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกไม่ข้อมูลสำเร็จ`,
            icon: "error",
          });
          console.log("⚠️ Add failed:", response);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    } else if (mode == "APPROVE_SC") {
      if (!validateSCApprove()) {
        return;
      }
      const tempid = uuidv4();
      const domainId = dataelement?.respondent_domain_id;

      // 🧩 โหลดค่า Complaint Status ทั้งหมด (ของ respondent domain)
      // const tempComplaintStatus = await LovAll_Get(
      //   "complaint_status",
      //   dataelement?.respondent_domain_id
      // );

      // console.log("📡 Current tempComplaintStatus:", tempComplaintStatus);

      // 🧩 Helper: หา explain_id ที่แท้จริงจาก dataelement
      const resolveExplainId = () => {
        return currentExplainForApproval?.id;
      };

      const explainRootId = resolveExplainId();

      const approveInfo = (datastatus || []).filter(
        (val: any) => val["lov_code"] === "APPROVED"
      );
      const approveSeq = approveInfo.filter(
        (val: any) => val["lov5"] == user[0].role_id
      );

      // 🧩 สร้าง payload สำหรับ Approve
      const approvePayload = {
        ExplaintApproveModel: {
          id: tempid,
          explain_id: explainRootId,
          approve_seq: approveSeq[0].lov3,
          complaint_status_id: tempComplaintStatus[3]?.id,
          approve_status: approveSelectionCode,
          approve_detail: approve_detail || null,
          approve_note: approve_note || null,
          approve_name: user[0]?.employee_username || "",
          approve_company_id: approve_company_id?.company_id
            ? Number(approve_company_id.company_id)
            : user[0]?.itasset_company_id || "",
          approve_department_id: approve_department_id?.department_id
            ? Number(approve_department_id.department_id)
            : user[0]?.itasset_department_id || "",
          approve_position: user[0]?.employee_position || "",
          approve_email: user[0]?.employee_email || "",
          approve_date: approve_date
            ? approve_date
                .hour(dayjs().hour())
                .minute(dayjs().minute())
                .second(dayjs().second())
                .format("YYYY-MM-DDTHH:mm:ss")
            : new Date().toISOString(),
          create_by: user[0]?.employee_username || "",
          domain_id: user[0]?.employee_domain || "",
        },
        CurrentAccessModel: {
          user_id: user[0]?.employee_username || "",
        },
      };

      setIsLoadingScreen(true);

      try {
        // 🧩 บันทึกข้อมูล Approve
        const response = await _POST(
          approvePayload.ExplaintApproveModel,
          "/ExplaintApprove/ExplaintApproveAdd"
        );

        console.log(return_detail, "return_detail");

        if (response && response.status === "success") {
          // ✅ หลังบันทึก Approve สำเร็จ → อัปเดตสถานะ Complaint
          const complaintId =
            currentExplainForApproval?.complaint_id ?? dataelement?.id;

          const complaintReturnPayload = {
            ComplaintReturnModel: {
              id: dataelement?.id,
              return_detail: approve_detail,
              return_name: user[0]?.employee_username || "",
              return_company_id: return_company_id?.company_id
                ? Number(return_company_id.company_id)
                : user[0]?.itasset_company_id || "",
              return_department_id: return_department_id?.department_id
                ? Number(return_department_id.department_id)
                : user[0]?.itasset_department_id || "",
              return_position: user[0]?.employee_position || "",
              return_email: user[0]?.employee_email || "",
              return_from_status_id: tempComplaintStatus[2]?.id,
              complaint_status_id: tempComplaintStatus[1]?.id,
              mode: mode,
            },
            CurrentAccessModel: {
              user_id: user[0]?.employee_username || "",
            },
          };

          // const complaintFormData = new FormData();
          // complaintFormData.append(
          //   "complaintPayloadJson",
          //   JSON.stringify(complaintReturnPayload));

          //const response = await _POST(approvePayload.ExplaintApproveModel,"/ExplaintApprove/ExplaintApproveAdd");
          const updateRes = await _POST(
            complaintReturnPayload,
            "/Complaint/ComplaintReturn"
          );

          if (updateRes && updateRes.status === "success") {
            FullSweetalert({
              title: "Success",
              text: `เธเธฑเธเธ—เธถเธเธเธฒเธฃเธญเธเธธเธกเธฑเธ•เธดเนเธฅเธฐเธญเธฑเธเน€เธ”เธ•เธชเธ–เธฒเธเธฐเธชเธณเน€เธฃเนเธ`,
              icon: "success",
            });
          } else {
            FullSweetalert({
              title: "Warning",
              text: `เธเธฑเธเธ—เธถเธเธเธฒเธฃเธญเธเธธเธกเธฑเธ•เธดเธชเธณเน€เธฃเนเธ เนเธ•เนเนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธญเธฑเธเน€เธ”เธ•เธชเธ–เธฒเธเธฐเนเธ”เน`,
              icon: "warning",
            });
          }
        } else {
          FullSweetalert({
            title: "Failed",
            text: `เธเธฑเธเธ—เธถเธเธเธฒเธฃเธญเธเธธเธกเธฑเธ•เธดเนเธกเนเธชเธณเน€เธฃเนเธ`,
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Approve Upload failed:", error);
        FullSweetalert({
          title: "Error",
          text: `เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”เธฃเธฐเธซเธงเนเธฒเธเธเธฒเธฃเธเธฑเธเธ—เธถเธเธเธฒเธฃเธญเธเธธเธกเธฑเธ•เธด`,
          icon: "error",
        });
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    } else if (mode == "APPROVE_SC") {
      const tempid = uuidv4();

      // ๐งฉ Helper: เธซเธฒ explain_id เธ—เธตเนเนเธ—เนเธเธฃเธดเธเธเธฒเธ dataelement
      const resolveExplainId = () => {
        return currentExplainForApproval?.id;
      };

      const explainRootId = resolveExplainId();

      // ๐งฉ เธซเธฒเธฅเธณเธ”เธฑเธ approve_seq เธฅเนเธฒเธชเธธเธ” เนเธฅเนเธงเน€เธเธดเนเธก +1
      const currentApproveList = currentExplainForApproval?.approveList || [];
      const maxApproveSeq =
        currentApproveList.length > 0
          ? Math.max(
              ...currentApproveList.map(
                (item: any) => parseInt(item.approve_seq, 10) || 0
              )
            )
          : 0;
      const nextSeq = maxApproveSeq + 1;

      // ๐งฉ เธชเธฃเนเธฒเธ payload เธชเธณเธซเธฃเธฑเธ Approve
      const approvePayload = {
        ExplaintApproveModel: {
          id: tempid,
          explain_id: explainRootId,
          approve_seq: nextSeq,
          complaint_status_id: tempComplaintStatus[4]?.id,
          approve_status: approveSelectionCode,
          approve_detail: approve_detail || null,
          approve_note: approve_note || null,
          approve_name: user[0]?.employee_username || "",
          approve_company_id: approve_company_id?.company_id
            ? Number(approve_company_id.company_id)
            : user[0]?.itasset_company_id || "",
          approve_department_id: approve_department_id?.department_id
            ? Number(approve_department_id.department_id)
            : user[0]?.itasset_department_id || "",
          approve_position: user[0]?.employee_position || "",
          approve_email: user[0]?.employee_email || "",
          approve_date: approve_date
            ? approve_date
                .hour(dayjs().hour())
                .minute(dayjs().minute())
                .second(dayjs().second())
                .format("YYYY-MM-DDTHH:mm:ss")
            : new Date().toISOString(),
          create_by: user[0]?.employee_username || "",
          domain_id: user[0]?.employee_domain || "",
        },
        CurrentAccessModel: {
          user_id: user[0]?.employee_username || "",
        },
      };

      setIsLoadingScreen(true);

      try {
        // ๐งฉ เธเธฑเธเธ—เธถเธเธเนเธญเธกเธนเธฅ Approve
        const response = await _POST(
          approvePayload.ExplaintApproveModel,
          "/ExplaintApprove/ExplaintApproveAdd"
        );

        console.log(return_detail, "return_detail");

        if (response && response.status === "success") {
          // 🧩 ใช้ complaint_id จาก currentExplainForApproval แทน dataelement?.id
          // เพราะ dataelement?.id อาจเป็น explain id แทน complaint id
          const complaintId =
            currentExplainForApproval?.complaint_id ?? dataelement?.id;

          const complaintReturnPayload = {
            ComplaintReturnModel: {
              id: dataelement?.id,
              return_detail: approve_detail,
              return_name: user[0]?.employee_username || "",
              return_company_id: return_company_id?.company_id
                ? Number(return_company_id.company_id)
                : user[0]?.itasset_company_id || "",
              return_department_id: return_department_id?.department_id
                ? Number(return_department_id.department_id)
                : user[0]?.itasset_department_id || "",
              return_position: user[0]?.employee_position || "",
              return_email: user[0]?.employee_email || "",
              return_from_status_id: tempComplaintStatus[2]?.id,
              complaint_status_id: tempComplaintStatus[1]?.id,
              mode: mode,
            },
            CurrentAccessModel: {
              user_id: user[0]?.employee_username || "",
            },
          };

          // const complaintFormData = new FormData();
          // complaintFormData.append(
          //   "complaintPayloadJson",
          //   JSON.stringify(complaintReturnPayload));

          //const response = await _POST(approvePayload.ExplaintApproveModel,"/ExplaintApprove/ExplaintApproveAdd");
          const updateRes = await _POST(
            complaintReturnPayload,
            "/Complaint/ComplaintReturn"
          );

          if (updateRes && updateRes.status === "success") {
            FullSweetalert({
              title: "Success",
              text: `บันทึกการอนุมัติและอัปเดตสถานะสำเร็จ`,
              icon: "success",
            });
          } else {
            FullSweetalert({
              title: "Warning",
              text: `บันทึกการอนุมัติสำเร็จ แต่ไม่สามารถอัปเดตสถานะได้`,
              icon: "warning",
            });
          }
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกการอนุมัติไม่สำเร็จ`,
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Approve Upload failed:", error);
        FullSweetalert({
          title: "Error",
          text: `เกิดข้อผิดพลาดระหว่างการบันทึกการอนุมัติ`,
          icon: "error",
        });
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    }  else if (mode == "APPROVE_QC") {

      setIsLoadingScreen(true);

      try {
        // 🧩 บันทึกข้อมูล Approve
        const response = await _POST(
          approvePayload.ExplaintApproveModel,
          "/ExplaintApprove/ExplaintApproveAdd"
        );

        console.log(return_detail, "return_detail");

        if (response && response.status === "success") {
          // ✅ หลังบันทึก Approve สำเร็จ → อัปเดตสถานะ Complaint
          // 🧩 ใช้ complaint_id จาก currentExplainForApproval แทน dataelement?.id
          // เพราะ dataelement?.id อาจเป็น explain id แทน complaint id
          const complaintId =
            currentExplainForApproval?.complaint_id ?? dataelement?.id;

          const complaintReturnPayload = {
            ComplaintReturnModel: {
              id: complaintId,
              explain_id: explainRootId,
              return_detail: approve_detail,
              return_name: user[0]?.employee_username || "",
              return_company_id: return_company_id?.company_id
                ? Number(return_company_id.company_id)
                : user[0]?.itasset_company_id || "",
              return_department_id: return_department_id?.department_id
                ? Number(return_department_id.department_id)
                : user[0]?.itasset_department_id || "",
              return_position: user[0]?.employee_position || "",
              return_email: user[0]?.employee_email || "",
              return_from_status_id: tempComplaintStatus[2]?.id,
              complaint_status_id: tempComplaintStatus[1]?.id,
              mode: mode,
            },
            CurrentAccessModel: {
              user_id: user[0]?.employee_username || "",
            },
          };

          const updateRes = await _POST(
            complaintReturnPayload,
            "/Complaint/ComplaintReturn"
          );

          if (updateRes && updateRes.status === "success") {
            FullSweetalert({
              title: "Success",
              text: `บันทึกการอนุมัติและอัปเดตสถานะสำเร็จ`,
              icon: "success",
            });
          } else {
            FullSweetalert({
              title: "Warning",
              text: `บันทึกการอนุมัติสำเร็จ แต่ไม่สามารถอัปเดตสถานะได้`,
              icon: "warning",
            });
          }
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกการอนุมัติไม่สำเร็จ`,
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Approve Upload failed:", error);
        FullSweetalert({
          title: "Error",
          text: `เกิดข้อผิดพลาดระหว่างการบันทึกการอนุมัติ`,
          icon: "error",
        });
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    } else if (mode == "APPROVE_QC") {
      if (!validateQCApprove()) {
        return;
      }

      const tempid = uuidv4();

      // 🧩 Helper: หา explain_id ที่แท้จริงจาก dataelement
      const resolveExplainId = () => {
        return currentExplainForApproval?.id;
      };

      const approveInfo = (datastatus || []).filter(
        (val: any) => val["lov_code"] === "APPROVED"
      );
      const approveSeq = approveInfo.filter(
        (val: any) => val["lov5"] == user[0].role_id
      );
      const explainRootId = resolveExplainId();

      // 🧩 สร้าง payload สำหรับ Approve
      const approvePayload = {
        ExplaintApproveModel: {
          id: tempid,
          explain_id: explainRootId,
          approve_seq: approveSeq[0].lov3,
          complaint_status_id: tempComplaintStatus[4]?.id,
          approve_status: approveSelectionCode,
          approve_detail: approve_detail || null,
          approve_note: approve_note || null,
          approve_name: user[0]?.employee_username || "",
          approve_company_id: approve_company_id?.company_id
            ? Number(approve_company_id.company_id)
            : user[0]?.itasset_company_id || "",
          approve_department_id: approve_department_id?.department_id
            ? Number(approve_department_id.department_id)
            : user[0]?.itasset_department_id || "",
          approve_position: user[0]?.employee_position || "",
          approve_email: user[0]?.employee_email || "",
          approve_date: approve_date
            ? approve_date
                .hour(dayjs().hour())
                .minute(dayjs().minute())
                .second(dayjs().second())
                .format("YYYY-MM-DDTHH:mm:ss")
            : new Date().toISOString(),
          create_by: user[0]?.employee_username || "",
          domain_id: user[0]?.employee_domain || "",
        },
        CurrentAccessModel: {
          user_id: user[0]?.employee_username || "",
        },
      };

      setIsLoadingScreen(true);

      try {
        // 🧩 บันทึกข้อมูล Approve
        const response = await _POST(
          approvePayload.ExplaintApproveModel,
          "/ExplaintApprove/ExplaintApproveAdd"
        );

        if (response && response.status === "success") {
          // 🧩 ใช้ complaint_id จาก currentExplainForApproval แทน dataelement?.id
          // เพราะ dataelement?.id อาจเป็น explain id แทน complaint id
          const complaintId =
            currentExplainForApproval?.complaint_id ?? dataelement?.id;

          const complaintReturnPayload = {
            ComplaintReturnModel: {
              id: complaintId,
              explain_id: explainRootId,
              return_detail: approve_detail,
              return_name: user[0]?.employee_username || "",
              return_company_id: return_company_id?.company_id
                ? Number(return_company_id.company_id)
                : user[0]?.itasset_company_id || "",
              return_department_id: return_department_id?.department_id
                ? Number(return_department_id.department_id)
                : user[0]?.itasset_department_id || "",
              return_position: user[0]?.employee_position || "",
              return_email: user[0]?.employee_email || "",
              return_from_status_id: tempComplaintStatus[3]?.id,
              complaint_status_id: tempComplaintStatus[1]?.id,
              mode: mode,
            },
            CurrentAccessModel: {
              user_id: user[0]?.employee_username || "",
            },
          };

          const updateRes = await _POST(
            complaintReturnPayload,
            "/Complaint/ComplaintReturn"
          );

          if (updateRes && updateRes.status === "success") {
            FullSweetalert({
              title: "Success",
              text: `บันทึกการอนุมัติและอัปเดตสถานะสำเร็จ`,
              icon: "success",
            });
          } else {
            FullSweetalert({
              title: "Warning",
              text: `บันทึกการอนุมัติสำเร็จ แต่ไม่สามารถอัปเดตสถานะได้`,
              icon: "warning",
            });
          }
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกการอนุมัติไม่สำเร็จ`,
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Approve Upload failed:", error);
        FullSweetalert({
          title: "Error",
          text: `เกิดข้อผิดพลาดระหว่างการบันทึกการอนุมัติ`,
          icon: "error",
        });
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    } else if (mode == "CLOSE") {
      // 🧩 Helper: หา explain_id ที่แท้จริงจาก dataelement
      if (!validateClose()) {
        return;
      }
      const resolveExplainId = () => {
        return currentExplainForApproval?.id;
      };

      const explainRootId = resolveExplainId();

      setIsLoadingScreen(true);

      const complaintId =
        currentExplainForApproval?.complaint_id ?? dataelement?.id;

      const complaintReturnPayload = {
        ComplaintReturnModel: {
          id: complaintId,
          explain_id: explainRootId,
          return_detail: close_detail,
          return_note: close_note,
          return_name: user[0]?.employee_username || "",
          return_company_id: return_company_id?.company_id
            ? Number(return_company_id.company_id)
            : user[0]?.itasset_company_id || "",
          return_department_id: return_department_id?.department_id
            ? Number(return_department_id.department_id)
            : user[0]?.itasset_department_id || "",
          return_position: user[0]?.employee_position || "",
          return_email: user[0]?.employee_email || "",
          return_from_status_id: tempComplaintStatus[4]?.id,
          complaint_status_id: tempComplaintStatus[1]?.id,
          close_status: approveSelectionCode,
          mode: mode,
        },
        CurrentAccessModel: {
          user_id: user[0]?.employee_username || "",
        },
      };

      try {
        const response = await _POST(
          complaintReturnPayload,
          "/Complaint/ComplaintReturn"
        );
        if (response && response.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกข้อมูลสำเร็จ`,
            icon: "success",
          });
          console.log("✅ Complaint Add successfully:", response);
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกไม่ข้อมูลสำเร็จ`,
            icon: "error",
          });
          console.log("⚠️ Add failed:", response);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    }
  };

  // CREATE - Add Complaint
  const ExplainAdd = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ExplainAdd"
      );

    const tempid = uuidv4();
    console.log(
      "📡 Sending respondent_domain_id to LovAll_Get:",
      dataelement?.respondent_domain_id
    );
    console.log(
      "📡 Sending respondent_domain_id to LovAll_Get:",
      dataelement?.respondent_domain_id?.domain_id
    );
    const tempComplaintStatus = await LovAll_Get(
      "complaint_status",
      dataelement?.respondent_domain_id
    );
    // console.log("🧩 tempComplaintStatus raw:", tempComplaintStatus);
    // console.log("💕 tempvalue 1 id", tempComplaintStatus[1]?.id);
    // console.log("💕 tempvalue 2 id", tempComplaintStatus[2]?.id);

    const resolveComplaintId = () => {
      const el: any = dataelement || {};
      if (el.complaint_id) {
        if (typeof el.complaint_id === "object")
          return el.complaint_id.id ?? el.complaint_id;
        return el.complaint_id;
      }
      if (el.complaint && el.complaint.id) return el.complaint.id;
      return el.id;
    };

    const complaintRootId = resolveComplaintId();

    let currentExplainList: any[] = [];
    if (complaintRootId) {
      try {
        const dataset = { complaint_id: complaintRootId };
        const response = await _POST(dataset, "/Explain/ExplainGet");
        if (response && response.status === "success") {
          currentExplainList = response.data || [];
        }
      } catch (error) {
        console.error("Error fetching explain data:", error);
      }
    }

    const ExplainTuModel = dataTooluseValue
      ? expToolUpdateCompId(dataTooluseValue, tempid, ToolOther)
      : null;

    const ExplainDdModel = dataDecisionValue
      ? expDecisionUpdateCompId(dataDecisionValue, tempid, DecisionOther)
      : null;

    const maxExplainSeq =
      currentExplainList && currentExplainList.length > 0
        ? Math.max(
            ...currentExplainList.map(
              (item: any) => parseInt(item.explain_seq) || 0
            )
          )
        : 0;
    const nextSeq = maxExplainSeq + 1;

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
              .hour(23)
              .minute(59)
              .second(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
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
              .hour(23)
              .minute(59)
              .second(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        cf_type: "Explain",
        create_by: user[0]?.employee_username || "",
        domain_id: user[0]?.employee_domain || "",
        ExplainTu: ExplainTuModel,
        ExplainDd: ExplainDdModel,
        ComplaintFile:
          complaintFiles?.map((item: any, index: number) => ({
            cf_type: "Explain",
            complaint_id: complaintRootId,
            complaint_at_id: item.attachmentType,
            explain_id: tempid,
            cf_file_seq: (index + 1).toString(),
            user_file_name: item.file.name,
            file_name: item.file.name,
            file_type: item.file.type.split("/")[1] || "",
            file_size: item.file.size.toString(),
            record_status: true,
            create_by: user[0]?.employee_username || "",
            create_datetime: new Date().toISOString(),
          })) || [],
      },
      CurrentAccessModel: {
        user_id: user[0]?.employee_username || "",
      },
    };

    const formData = new FormData();
    formData.append("explainPayloadJson", JSON.stringify(explainPayload));

    if (complaintFiles && complaintFiles.length > 0) {
      complaintFiles.forEach((fileItem: any) => {
        formData.append("explainFiles", fileItem.file);
      });
    }

    setIsLoadingScreen(true);

    try {
      const response = await _POST_FORMDATA(formData, "/Explain/ExplainAdd");

      if (response && response.status === "success") {
        // ✅ สร้าง payload สำหรับอัปเดตสถานะ Complaint
        const complaintEditPayload = {
          complaintModel: {
            id: dataelement?.id,
            mode: "EXPLAIN",
            complaint_status_id: tempComplaintStatus[2]?.id,
          },
          CurrentAccessModel: {
            user_id: user[0]?.employee_username || "",
          },
        };

        // ✅ ต้องส่งเป็น FormData เพราะ backend ต้องการ complaintPayloadJson
        const complaintFormData = new FormData();
        complaintFormData.append(
          "complaintPayloadJson",
          JSON.stringify(complaintEditPayload)
        );

        const updateRes = await _POST_FORMDATA(
          complaintFormData,
          "/Complaint/ComplaintEdit"
        );

        if (updateRes && updateRes.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกข้อมูลชี้แจงและอัปเดตสถานะสำเร็จ`,
            icon: "success",
          });
        } else {
          FullSweetalert({
            title: "Warning",
            text: `บันทึกชี้แจงสำเร็จ แต่ไม่สามารถอัปเดตสถานะได้`,
            icon: "warning",
          });
        }
      } else {
        FullSweetalert({
          title: "Failed",
          text: `บันทึกข้อมูลชี้แจงไม่สำเร็จ`,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("ExplainAdd failed:", error);
      FullSweetalert({
        title: "Error",
        text: `เกิดข้อผิดพลาดระหว่างการบันทึก`,
        icon: "error",
      });
    } finally {
      setIsLoadingScreen(false);
      handleClose();
      ComplaintGet();
    }
  };

  // const ApproveScAdd = async () => {
  //   if (isCallFuncLogOn)
  //     console.log("🕑 ", dayjs().format("HH:mm:ss.SSS"), " [Calling Function]  :  ApproveScAdd");

  //   const tempid = uuidv4();
  //   // 🧩 โหลดค่า Complaint Status ทั้งหมด (ของ respondent domain)
  //   console.log(
  //     "📡 Sending respondent_domain_id to LovAll_Get:",
  //     dataelement?.respondent_domain_id
  //   );
  //   console.log(
  //     "📡 Sending respondent_domain_id to LovAll_Get:",
  //     dataelement?.respondent_domain_id?.domain_id
  //   );
  //   console.log("🧩 dataelement", dataelement);
  //   console.log("🧩 respondent_domain_id raw:", dataelement?.respondent_domain_id);
  //   const tempComplaintStatus = await LovAll_Get("complaint_status", dataelement?.respondent_domain_id);
  //   console.log("📡 Current tempComplaintStatus:", tempComplaintStatus);
  //   console.log("📡 Current tempComplaintStatus:", tempComplaintStatus[3]?.id);

  //   console.log("📡 Current tempComplaintStatus:", tempComplaintStatus);
  //   console.log("💕 tempvalue 0 id", tempComplaintStatus[0]?.id);
  //   console.log("💕 tempvalue 1 id", tempComplaintStatus[1]?.id);
  //   console.log("💕 tempvalue 2 id", tempComplaintStatus[2]?.id);
  //   console.log("💕 tempvalue 3 id", tempComplaintStatus[3]?.id);
  //   console.log("💕 tempvalue 4 id", tempComplaintStatus[4]?.id);

  //   // 🧩 โหลดค่า Complaint Status ทั้งหมด (ของ respondent domain)

  //   // 🧩 Helper: หา explain_id ที่แท้จริงจาก dataelement
  //   const resolveExplainId = () => {
  //     return currentExplainForApproval?.id;
  //   };

  //   const explainRootId = resolveExplainId();

  //   // 🧩 หาลำดับ approve_seq ล่าสุด แล้วเพิ่ม +1
  //   const currentApproveList = currentExplainForApproval?.approveList || [];
  //   const maxApproveSeq =
  //     currentApproveList.length > 0
  //       ? Math.max(...currentApproveList.map((item: any) => parseInt(item.approve_seq, 10) || 0)) : 0;
  //   const nextSeq = maxApproveSeq + 1;

  //   // 🧩 สร้าง payload สำหรับ Approve
  //   const approvePayload = {
  //     ExplaintApproveModel: {
  //       id: tempid,
  //       explain_id: explainRootId,
  //       approve_seq: nextSeq,
  //       complaint_status_id: tempComplaintStatus[3]?.id,
  //       approve_status: approveSelectionCode,
  //       approve_detail: approve_detail || null,
  //       approve_note: approve_note || null,
  //       approve_name: user[0]?.employee_username || "",
  //       approve_company_id: approve_company_id?.company_id
  //         ? Number(approve_company_id.company_id)
  //         : user[0]?.itasset_company_id || "",
  //       approve_department_id: approve_department_id?.department_id
  //         ? Number(approve_department_id.department_id)
  //         : user[0]?.itasset_department_id || "",
  //       approve_position: user[0]?.employee_position || "",
  //       approve_email: user[0]?.employee_email || "",
  //       approve_date: approve_date
  //         ? approve_date
  //           .hour(dayjs().hour())
  //           .minute(dayjs().minute())
  //           .second(dayjs().second())
  //           .format("YYYY-MM-DDTHH:mm:ss")
  //         : new Date().toISOString(),
  //       create_by: user[0]?.employee_username || "",
  //       domain_id: user[0]?.employee_domain || "",
  //     },
  //     CurrentAccessModel: {
  //       user_id: user[0]?.employee_username || "",
  //     },
  //   };

  //   setIsLoadingScreen(true);

  //   try {
  //     // 🧩 บันทึกข้อมูล Approve
  //     const response = await _POST(approvePayload.ExplaintApproveModel, "/ExplaintApprove/ExplaintApproveAdd");

  //     if (response && response.status === "success") {
  //       // ✅ หลังบันทึก Approve สำเร็จ → อัปเดตสถานะ Complaint
  //       const complaintEditPayload = {
  //         complaintModel: {
  //           id: dataelement?.id,
  //           mode: "APPROVE_SC",
  //           complaint_status_id: tempComplaintStatus[3]?.id,
  //         },
  //         CurrentAccessModel: {
  //           user_id: user[0]?.employee_username || "",
  //         },
  //       };

  //       const complaintFormData = new FormData();
  //       complaintFormData.append(
  //         "complaintPayloadJson",
  //         JSON.stringify(complaintEditPayload)
  //       );

  //       const updateRes = await _POST_FORMDATA(
  //         complaintFormData,
  //         "/Complaint/ComplaintEdit"
  //       );

  //       if (updateRes && updateRes.status === "success") {
  //         FullSweetalert({
  //           title: "Success",
  //           text: `บันทึกการอนุมัติและอัปเดตสถานะสำเร็จ`,
  //           icon: "success",
  //         });
  //       } else {
  //         FullSweetalert({
  //           title: "Warning",
  //           text: `บันทึกการอนุมัติสำเร็จ แต่ไม่สามารถอัปเดตสถานะได้`,
  //           icon: "warning",
  //         });
  //       }
  //     } else {
  //       FullSweetalert({
  //         title: "Failed",
  //         text: `บันทึกการอนุมัติไม่สำเร็จ`,
  //         icon: "error",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Approve Upload failed:", error);
  //     FullSweetalert({
  //       title: "Error",
  //       text: `เกิดข้อผิดพลาดระหว่างการบันทึกการอนุมัติ`,
  //       icon: "error",
  //     });
  //   } finally {
  //     setIsLoadingScreen(false);
  //     handleClose();
  //     ComplaintGet();
  //   }
  // };

  const ApproveScAdd = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ApproveScAdd"
      );

    const tempid = uuidv4();

    // ใช้ currentExplainForApproval เป็น source สำหรับ approve
    const approvalSource = currentExplainForApproval;
    if (!approvalSource) {
      FullSweetalert({
        title: "Error",
        text: "ไม่มีข้อมูล explain สำหรับ approve",
        icon: "error",
      });
      return;
    }

    // โหลดค่า Complaint Status จาก respondent_domain_id
    const tempComplaintStatus = await LovAll_Get(
      "complaint_status",
      approvalSource?.respondent_domain_id
    );

    //ขั้นตอนการเตรียมลำดับการอนุมัติ (Approve Seq)
    //const approveInfo = datastatus.filter(
    const approveInfo = (datastatus || []).filter(
      (val: any) => val["lov_code"] === "APPROVED"
    );
    const approveSeq = approveInfo.filter(
      (val: any) => val["lov5"] == user[0].role_id
    );
    // console.log("datastatus", datastatus);
    // console.log("🤑🤑approveSeq", approveInfo);
    // console.log("🤑🤑🤑🤑🤑🤑🤑", approveSeq[0].lov3);

    // หา explain_id และ nextSeq
    const explainRootId = approvalSource.id;
    const currentApproveList = approvalSource?.approveList || [];
    const nextSeq =
      (currentApproveList.length > 0
        ? Math.max(
            ...currentApproveList.map(
              (item: any) => parseInt(item.approve_seq, 10) || 0
            )
          )
        : 0) + 1;

    const approvePayload = {
      ExplaintApproveModel: {
        id: tempid,
        explain_id: explainRootId,
        approve_seq: approveSeq[0].lov3,
        complaint_status_id: tempComplaintStatus[3]?.id,
        approve_status: approveSelectionCode,
        approve_detail: approve_detail || null,
        approve_note: approve_note || null,
        approve_name: user[0]?.employee_username || "",
        approve_company_id: approve_company_id?.company_id
          ? Number(approve_company_id.company_id)
          : user[0]?.itasset_company_id || "",
        approve_department_id: approve_department_id?.department_id
          ? Number(approve_department_id.department_id)
          : user[0]?.itasset_department_id || "",
        approve_position: user[0]?.employee_position || "",
        approve_email: user[0]?.employee_email || "",
        approve_date: approve_date
          ? approve_date
              .hour(dayjs().hour())
              .minute(dayjs().minute())
              .second(dayjs().second())
              .format("YYYY-MM-DDTHH:mm:ss")
          : new Date().toISOString(),
        create_by: user[0]?.employee_username || "",
        domain_id: user[0]?.employee_domain || "",
        respondent_domain_id: approvalSource?.respondent_domain_id, // ✅ เพิ่ม field นี้
      },
      CurrentAccessModel: {
        user_id: user[0]?.employee_username || "",
      },
    };

    setIsLoadingScreen(true);

    try {
      // 🧩 บันทึกข้อมูล Approve
      const response = await _POST(
        approvePayload.ExplaintApproveModel,
        "/ExplaintApprove/ExplaintApproveAdd"
      );

      if (response && response.status === "success") {
        // ✅ หลังบันทึก Approve สำเร็จ → อัปเดตสถานะ Complaint
        const complaintEditPayload = {
          ComplaintModel: {
            id: currentExplainForApproval?.complaint_id,
            mode: "APPROVE_SC",
            complaint_status_id: tempComplaintStatus[3]?.id,
          },
          CurrentAccessModel: {
            user_id: user[0]?.employee_username || "",
          },
        };

        const complaintFormData = new FormData();
        complaintFormData.append(
          "complaintPayloadJson",
          JSON.stringify(complaintEditPayload)
        );

        const updateRes = await _POST_FORMDATA(
          complaintFormData,
          "/Complaint/ComplaintEdit"
        );

        if (updateRes && updateRes.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกการอนุมัติและอัปเดตสถานะสำเร็จ`,
            icon: "success",
          });
        } else {
          FullSweetalert({
            title: "Warning",
            text: `บันทึกการอนุมัติสำเร็จ แต่ไม่สามารถอัปเดตสถานะได้`,
            icon: "warning",
          });
        }
      } else {
        FullSweetalert({
          title: "Failed",
          text: `บันทึกการอนุมัติไม่สำเร็จ`,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Approve Upload failed:", error);
      FullSweetalert({
        title: "Error",
        text: `เกิดข้อผิดพลาดระหว่างการบันทึกการอนุมัติ`,
        icon: "error",
      });
    } finally {
      setIsLoadingScreen(false);
      handleClose();
      ComplaintGet();
    }
  };

  const ApproveQcAdd = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  ApproveQcAdd"
      );

    //   if (!validateQCApprove()) {
    //   return;
    // }

    const tempid = uuidv4();

    // ใช้ currentExplainForApproval เป็น source สำหรับ approve
    const approvalSource = currentExplainForApproval;
    if (!approvalSource) {
      FullSweetalert({
        title: "Error",
        text: "ไม่มีข้อมูล explain สำหรับ approve",
        icon: "error",
      });
      return;
    }

    // โหลดค่า Complaint Status จาก respondent_domain_id
    const tempComplaintStatus = await LovAll_Get(
      "complaint_status",
      approvalSource?.respondent_domain_id
    );

    // const approveInfo = datastatus.filter(
    const approveInfo = (datastatus || []).filter(
      (val: any) => val["lov_code"] === "APPROVED"
    );
    const approveSeq = approveInfo.filter(
      (val: any) => val["lov5"] == user[0].role_id
    );
    // console.log("datastatus", datastatus);
    // console.log("🤑🤑approveSeq", approveInfo);
    // console.log("🤑🤑🤑🤑🤑🤑🤑", approveSeq[0].lov3);

    // หา explain_id และ nextSeq
    const explainRootId = approvalSource.id;
    const currentApproveList = approvalSource?.approveList || [];
    const nextSeq =
      (currentApproveList.length > 0
        ? Math.max(
            ...currentApproveList.map(
              (item: any) => parseInt(item.approve_seq, 10) || 0
            )
          )
        : 0) + 1;

    const approvePayload = {
      ExplaintApproveModel: {
        id: tempid,
        explain_id: explainRootId,
        approve_seq: approveSeq[0].lov3,
        complaint_status_id: tempComplaintStatus[4]?.id,
        approve_status: approveSelectionCode,
        approve_detail: qcapprove_detail || null,
        approve_note: qcapprove_note || null,
        approve_name: user[0]?.employee_username || "",
        approve_company_id: qcapprove_company_id?.company_id
          ? Number(qcapprove_company_id.company_id)
          : user[0]?.itasset_company_id || "",
        approve_department_id: qcapprove_department_id?.department_id
          ? Number(qcapprove_department_id.department_id)
          : user[0]?.itasset_department_id || "",
        approve_position: user[0]?.employee_position || "",
        approve_email: user[0]?.employee_email || "",
        approve_date: qcapprove_date
          ? qcapprove_date
              .hour(dayjs().hour())
              .minute(dayjs().minute())
              .second(dayjs().second())
              .format("YYYY-MM-DDTHH:mm:ss")
          : new Date().toISOString(),
        create_by: user[0]?.employee_username || "",
        domain_id: user[0]?.employee_domain || "",
        respondent_domain_id: approvalSource?.respondent_domain_id, // ✅ เพิ่ม field นี้
      },
      CurrentAccessModel: {
        user_id: user[0]?.employee_username || "",
      },
    };

    setIsLoadingScreen(true);

    try {
      // 🧩 บันทึกข้อมูล Approve
      const response = await _POST(
        approvePayload.ExplaintApproveModel,
        "/ExplaintApprove/ExplaintApproveAdd"
      );

      if (response && response.status === "success") {
        // ✅ หลังบันทึก Approve สำเร็จ → อัปเดตสถานะ Complaint
        const complaintEditPayload = {
          ComplaintModel: {
            id: currentExplainForApproval?.complaint_id,
            mode: "APPROVE_QC",
            complaint_status_id: tempComplaintStatus[4]?.id,
          },
          CurrentAccessModel: {
            user_id: user[0]?.employee_username || "",
          },
        };

        const complaintFormData = new FormData();
        complaintFormData.append(
          "complaintPayloadJson",
          JSON.stringify(complaintEditPayload)
        );

        const updateRes = await _POST_FORMDATA(
          complaintFormData,
          "/Complaint/ComplaintEdit"
        );

        if (updateRes && updateRes.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกการอนุมัติและอัปเดตสถานะสำเร็จ`,
            icon: "success",
          });
        } else {
          FullSweetalert({
            title: "Warning",
            text: `บันทึกการอนุมัติสำเร็จ แต่ไม่สามารถอัปเดตสถานะได้`,
            icon: "warning",
          });
        }
      } else {
        FullSweetalert({
          title: "Failed",
          text: `บันทึกการอนุมัติไม่สำเร็จ`,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Approve Upload failed:", error);
      FullSweetalert({
        title: "Error",
        text: `เกิดข้อผิดพลาดระหว่างการบันทึกการอนุมัติ`,
        icon: "error",
      });
    } finally {
      setIsLoadingScreen(false);
      handleClose();
      ComplaintGet();
    }
  };

  const handleOnclickMenuSync = () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickMenuSync"
      );

    // setOpenSync(true);
  };

  const handleOnclickComplaintAdd = () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickComplaintAdd"
      );

    resetForm();
    setdataelement(null);
    setOpenComplaintAdd(true);
  };

  const handleOnclickComplaintView = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  Explaint_Get"
      );

    //console.log("Read step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuView ");
    //console.log("Read step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    resetForm();
    Complaint_Get(data);
    setOpenComplaintView(true); // แล้วค่อยเปิด Dialog
  };

  const handleOnclickComplaintEdit = (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickComplaintEdit"
      );

    //console.log("Edit step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuEdit ");
    //console.log("Edit step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    resetForm();
    Complaint_Get(data);
    setOpenComplaintEdit(true);
  };

  const handleOnclickComplaintDelete = (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickComplaintDelete"
      );

    //console.log("Delete step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuDelete ");
    //console.log("Delete step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    resetForm();
    Complaint_Get(data);
    setOpenComplaintDelete(true);
  };

  // -------- Explain Dialog Handlers --------
  const handleOnclickExplain = (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickExplain"
      );

    resetForm();
    //console.log("checkkk",dataelement)
    setdataelement(data);
    setOpenExplain(true);
  };

  const handleOnclickCloseAddExplain = (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickCloseAddExplain"
      );

    //resetForm();
    setOpenExplainAdd(false);
    setdataelement(data);
    setOpenExplain(true);
  };

  const handleOnclickReadExplain = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickReadExplain"
      );
    // ดึง complaint ข้อมูลจริงจาก API
    // const complaintData = await Complaint_Get(data);

    // if (!complaintData) return;
    // setdataelement(complaintData);

    // // ดึง explain ของ complaint
    // await Explain_Get(complaintData.id);

    // setOpenApproveSC(true);

    // เซ็ต state ของ complaint
    //console.log("Read step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuView ");
    //console.log("Read step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    resetForm();
    setdataelement(data);
    setOpenReadExplain(true);
  };

  const handleOnclickApproveSC = async (data: any, name: string) => {
    setAction(name);
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickApproveSC"
      );

    resetForm();
    // ดึง complaint ข้อมูลจริงจาก API
    const complaintData = await Complaint_Get(data);

    if (!complaintData) return;

    // เซ็ต state ของ complaint
    setdataelement(complaintData);

    // ดึง explain ของ complaint
    await Explain_Get(complaintData.id);

    setOpenApproveSC(true);
  };

  // const handleOnclickExplainApproveSc = (data: any) => {
  //   if (isCallFuncLogOn)
  //     console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  handleOnclickExplainApproveSc");

  //   setCurrentExplainForApproval(data); // ✅ เก็บข้อมูล explain ที่จะอนุมัติไว้ใน state ใหม่
  //   resetForm();
  //   setapprove_date(dayjs());
  //   setOpenExplainApproveSc(true);
  // };

  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================

  const handleOnclickExplainApproveSc = (explainData: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑",
        dayjs().format("HH:mm:ss.SSS"),
        "[Calling Function] : handleOnclickExplainApproveSc"
      );
    const complaintData = dataelement;
    // เก็บ complaint หลัก
    setComplaintMainData(complaintData);

    // สร้าง object สำหรับ approve (เอา respondent_domain_id จาก complaint หลัก)
    const approvalData = {
      ...explainData,
      respondent_domain_id: complaintData?.respondent_domain_id,
    };

    setCurrentExplainForApproval(approvalData);

    // Reset form ก่อน
    resetForm();

    // ตั้งวันที่ approve
    setapprove_date(dayjs());

    // เซ็ตข้อมูลลง context สำหรับ modal
    setobservation_analysis(explainData.observation_analysis || "");
    setroot_cause(explainData.root_cause || "");
    setcorrective_action(explainData.corrective_action || "");
    setpreventive_action_plan(explainData.preventive_action_plan || "");

    if (explainData.responsible_date)
      setresponsible_date(dayjs(explainData.responsible_date));
    if (explainData.follow_up_date)
      setfollow_up_date(dayjs(explainData.follow_up_date));

    // เอา report_type มาด้วย
    const reportType =
      explainData.complaint?.report_type ||
      explainData.report_type ||
      complaintData?.report_type;

    if (reportType && dataset_reporttype) {
      const reportTypeObj = dataset_reporttype.find(
        (item: any) => item.id === reportType || item.lov_code === reportType
      );

      if (reportTypeObj) {
        setdataelement({
          ...explainData,
          report_type: reportTypeObj.lov_code,
          _forceVisibilityUpdate: Date.now(),
        });
      } else {
        setdataelement(explainData);
      }
    } else {
      setdataelement(explainData);
    }

    // เปิด modal
    setOpenExplainApproveSc(true);
  };

  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================

  // ------------------------------------------------------//
  const handleOnclickReadClose = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickReadClose"
      );

    //console.log("Read step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuView ");
    //console.log("Read step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    resetForm();

    // ดึง complaint ข้อมูลจริงจาก API
    const complaintData = await Complaint_Get(data);

    if (!complaintData) return;

    // เซ็ต state ของ complaint
    setdataelement(complaintData);

    // ดึง explain ของ complaint
    await Explain_Get(complaintData.id);

    setOpenReadClose(true); // แล้วค่อยเปิด Dialog
  };

  // --------------------- CLOSE ---------------------//
  const handleOnclickComplainClose = (data: any, name: string) => {
    //READ
    setAction(name);
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickComplainClose"
      );

    resetForm();
    Complaint_Get(data);
    setOpenComplainClose(true);
    setdataelement(data);
  };

  //   const handleOnclickComplainCloseAdd = (data: any) => {
  //     //ADD
  //     if (isCallFuncLogOn)
  //       console.log("🕑 ", dayjs().format("HH:mm:ss.SSS"), " [Calling Function]  :  handleOnclickComplainCloseAdd");
  //     console.log("🧩 Data received:", data);
  //     console.log("🧑‍💼 User profile:", user[0]);
  // }

  //   setCurrentExplainForApproval(data);
  //   resetForm();

  //   // 🧩 เซตค่าฟิลด์เริ่มต้นจากโปรไฟล์ user
  //   setclose_name(user[0]?.employee_username || "TEST USER");
  //   console.log("💾 close_name set to:", user[0]?.employee_username || "TEST USER");
  //   setclose_company_id({
  //     company_id: user[0]?.itasset_company_id || null,
  //     company_name: user[0]?.company_name || "",
  //   });

  //   setclose_department_id({
  //     department_id: user[0]?.itasset_department_id || null,
  //     department_name: user[0]?.department_name || "",
  //   });
  //   setclose_position(user[0]?.employee_position || "");
  //   setclose_email(user[0]?.employee_email || "");
  //   setclose_date(dayjs()); // วันที่ปิดรายการ = วันนี้

  //   Complaint_Get(data);
  //   setdataelement(data);
  //   setOpenComplainCloseAdd(true);
  // };

  const CloseAdd = async () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  CloseAdd"
      );

    // const complaintId =
    //   dataelement?.id ??
    //   currentExplainForApproval?.complaint_id ??
    //   currentExplainForApproval?.id;

    // 🧩 โหลดค่า Complaint Status ทั้งหมด โดยใช้โดเมนจาก ComplaintGet เป็นหลัก
    // const domainForLov = dataelement?.domain_id ?? respondent_domain_id?.domain_id ?? user[0]?.employee_domain;
    const tempComplaintStatus = await LovAll_Get(
      "complaint_status",
      user[0]?.employee_domain
    );
    // console.log("👽👽👽 Current tempComplaintStatus:", tempComplaintStatus);
    // console.log("👽👽👽 Current tempComplaintStatus[5].id:", tempComplaintStatus[5]?.id);
    // console.log("👽👽👽complaint_status domain:", user[0]?.employee_domain);
    // console.log("👽👽👽complaintId:", dataelement?.id);

    // 🧩 Helper: หา explain_id ที่แท้จริงจาก dataelement
    const resolveExplainId = () => {
      return currentExplainForApproval?.id;
    };

    const explainRootId = resolveExplainId();

    // 🧩 สร้าง payload สำหรับ Approve
    const closePayload = {
      ExplainModel: {
        id: explainRootId,
        close_name: user[0]?.employee_username || "",
        close_company_id: close_company_id?.company_id
          ? Number(close_company_id.company_id)
          : user[0]?.itasset_company_id || "",
        close_department_id: close_department_id?.department_id
          ? Number(close_department_id.department_id)
          : user[0]?.itasset_department_id || "",
        close_position: user[0]?.employee_position || "",
        close_email: user[0]?.employee_email || "",
        close_status: approveSelectionCode,
        close_detail: close_detail || null,
        close_note: close_note || null,
      },
      CurrentAccessModel: {
        user_id: user[0]?.employee_username || "",
      },
    };

    setIsLoadingScreen(true);

    try {
      // 🧩 บันทึกข้อมูล Approve
      const response = await _POST(closePayload, "/Explain/CloseAdd");

      if (response && response.status === "success") {
        const complaintId = currentExplainForApproval?.complaint_id;

        const complaintEditPayload = {
          complaintModel: {
            id: complaintId,
            mode: "CLOSE",
            complaint_status_id: tempComplaintStatus[5]?.id,
          },
          CurrentAccessModel: {
            user_id: user[0]?.employee_username || "",
          },
        };

        const complaintFormData = new FormData();
        complaintFormData.append(
          "complaintPayloadJson",
          JSON.stringify(complaintEditPayload)
        );

        const updateRes = await _POST_FORMDATA(
          complaintFormData,
          "/Complaint/ComplaintEdit"
        );

        if (updateRes && updateRes.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกการอนุมัติและอัปเดตสถานะสำเร็จ`,
            icon: "success",
          });
        } else {
          FullSweetalert({
            title: "Warning",
            text: `บันทึกการอนุมัติสำเร็จ แต่ไม่สามารถอัปเดตสถานะได้`,
            icon: "warning",
          });
        }
      } else {
        FullSweetalert({
          title: "Failed",
          text: `บันทึกการอนุมัติไม่สำเร็จ`,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Approve Upload failed:", error);
      FullSweetalert({
        title: "Error",
        text: `เกิดข้อผิดพลาดระหว่างการบันทึกการอนุมัติ`,
        icon: "error",
      });
    } finally {
      setIsLoadingScreen(false);
      handleClose();
      ComplaintGet();
    }
  };
  const handleOnclickCloseHistory = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickCloseHistory"
      );
    // ดึง complaint ข้อมูลจริงจาก API
    // const complaintData = await Complaint_Get(data);

    // if (!complaintData) return;
    // setdataelement(complaintData);

    // // ดึง explain ของ complaint
    // await Explain_Get(complaintData.id);

    // setOpenApproveSC(true);

    // เซ็ต state ของ complaint
    //console.log("Read step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuView ");
    //console.log("Read step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    resetForm();
    setdataelement(data);
    setOpenCloseHistory(true);
  };
  // ------------------------------------------------------//

  // -------------------------  QC  ---------------------------//
  const handleOnclickApproveQC = async (data: any, name: string) => {
    setAction(name);
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickApproveQC"
      );

    resetForm();
    Complaint_Get(data);
    setOpenApproveQC(true);
    setdataelement(data);
  };

  // ------------------------------------------------------//

  // const handleOnclickApproveQC = async (data: any, name: string) => {
  //   setAction(name);
  //   if (isCallFuncLogOn)
  //     console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  handleOnclickApproveQC");

  //   resetForm();
  //   setOpenApproveQC(true);
  //   setdataelement(data);
  // };

  // const handleOnclickApproveQC = async (data: any, name: string) => {
  //   setAction(name);
  //   if (isCallFuncLogOn)
  //     console.log(
  //       "🕑 ",
  //       dayjs().format("HH:mm:ss.SSS"),
  //       " [Calling Function]  :  handleOnclickApproveQC"
  //     );

  //   resetForm();
  //   // ดึง complaint ข้อมูลจริงจาก API
  //   const complaintData = await Complaint_Get(data);

  // //   if (!complaintData) return;

  // //   // เซ็ต state ของ complaint
  // //   setdataelement(complaintData);

  // //   // ดึง explain ของ complaint
  // //   await Explain_Get(complaintData.id);

  //   setOpenApproveQC(true);
  // };

  // -------- Approve Dialog Handlers --------

  useEffect(() => {
    console.log("action11", action);
  }, [action]);

  const handleOnclickReadApproveQC = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickReadApproveQC"
      );

    //console.log("Read step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuView ");
    //console.log("Read step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    resetForm();

    // ดึง complaint ข้อมูลจริงจาก API
    const complaintData = await Complaint_Get(data);

    if (!complaintData) return;

    // เซ็ต state ของ complaint
    setdataelement(complaintData);

    // ดึง explain ของ complaint
    await Explain_Get(complaintData.id);

    setOpenReadApproveQC(true); // แล้วค่อยเปิด Dialog
  };

  const handleOnclickExplainAdd = (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickExplainAdd"
      );

    resetForm();
    setroot_cause("");
    setobservation_analysis("");
    setcorrective_action("");
    setpreventive_action_plan("");
    setdataToolUse([]);
    setToolOther("");
    setresponsible_date(null);
    setfollow_up_date(null);

    setresponsible_date(dayjs()); // ตั้งค่าวันที่ชี้แจงเป็นวันปัจจุบัน
    setOpenExplainAdd(true);
    // ใช้ข้อมูลที่ส่งมาจากหน้า Explain รายละเอียด
    if (data) {
      setdataelement(data);
    } else {
      setdataelement(null);
    }
  };

  // const handleOnclickExplainView = (data: any, name: string) => {
  //   console.log("dataaaaaaaaaaaa", data);

  //   setAction(name);
  //   if (isCallFuncLogOn)
  //     console.log("🕑 ",dayjs().format("HH:mm:ss.SSS")," [Calling Function]  :  handleOnclickExplainView");

  //   // ตั้งค่า dataelement ก่อนเพื่อให้ useEffect ใน ExplaintBody ทำงานได้
  //   setdataelement(data);

  //   // ไม่ reset form ในโหมดดูข้อมูล เพื่อไม่ให้ dataReportTypeValue หาย
  //   setOpenExplainView(true);

  //   // ใช้ข้อมูลที่ส่งมาจากรายการ explain โดยตรง
  //   if (data) {
  //     //console.log("🔍 Setting explain data for View:", data);
  //     //console.log("🔍 Explain data complaintType:", data.complaintType);
  //     //console.log("🔍 Explain data complaintRs:", data.complaintRs);
  //     //console.log("🔍 Explain data other:", data.other);

  //     // Set ข้อมูล explain ลงใน context
  //     setobservation_analysis(data.observation_analysis || "");
  //     setroot_cause(data.root_cause || "");
  //     setcorrective_action(data.corrective_action || "");
  //     setpreventive_action_plan(data.preventive_action_plan || "");

  //     // 🔧 เพิ่ม: ตั้งค่าการแสดง/ซ่อน sections ตาม report_type สำหรับ View mode
  //     // ใช้ dataelement.report_type หรือ data.complaint.report_type ขึ้นกับโครงสร้างข้อมูล
  //     const reportType =
  //       data.complaint?.report_type ||
  //       data.report_type ||
  //       dataelement?.report_type;
  //     //console.log("🔍 ExplainView - Setting visibility for report type:", reportType);

  //     if (reportType && dataset_reporttype) {
  //       const reportTypeObj = dataset_reporttype.find(
  //         (item: any) => item.id === reportType || item.lov_code === reportType
  //       );

  //       if (reportTypeObj) {
  //         //console.log("🔍 ExplainView - Found report type object:", reportTypeObj);
  //         // บังคับส่งข้อมูลไปให้ ExplaintBody ผ่าน dataelement
  //         const updatedDataElement = {
  //           ...data,
  //           report_type: reportTypeObj.lov_code,
  //           _forceVisibilityUpdate: true, // flag เพื่อบังคับ update visibility
  //         };
  //         setdataelement(updatedDataElement);
  //       }
  //     }
  //   }
  //   // เปิด modal
  //   // setOpenExplainApproveSc(true);
  // };

  //############################################################
  // const handleOnclickExplainView = (data: any, name: string) => {
  //   console.log("dataaaaaaaaaaaa", data);

  //   setAction(name);
  //   if (isCallFuncLogOn)
  //     console.log(
  //       "🕑 ",
  //       dayjs().format("HH:mm:ss.SSS"),
  //       " [Calling Function]  :  handleOnclickExplainView"
  //     );

  //   //console.log("🔍 handleOnclickExplainView called with data:", data);
  //   // resetForm();
  //   // ตั้งค่า dataelement ก่อนเพื่อให้ useEffect ใน ExplaintBody ทำงานได้
  //   setdataelement(data);

  //   // ไม่ reset form ในโหมดดูข้อมูล เพื่อไม่ให้ dataReportTypeValue หาย
  //   // setOpenExplainView(true);

  //   // ใช้ข้อมูลที่ส่งมาจากรายการ explain โดยตรง
  //   if (data) {
  //     //console.log("🔍 Setting explain data for View:", data);
  //     //console.log("🔍 Explain data complaintType:", data.complaintType);
  //     //console.log("🔍 Explain data complaintRs:", data.complaintRs);
  //     //console.log("🔍 Explain data other:", data.other);

  //     // Set ข้อมูล explain ลงใน context
  //     setobservation_analysis(data.observation_analysis || "");
  //     setroot_cause(data.root_cause || "");
  //     setcorrective_action(data.corrective_action || "");
  //     setpreventive_action_plan(data.preventive_action_plan || "");

  //     // 🔧 เพิ่ม: ตั้งค่าการแสดง/ซ่อน sections ตาม report_type สำหรับ View mode
  //     // ใช้ dataelement.report_type หรือ data.complaint.report_type ขึ้นกับโครงสร้างข้อมูล
  //     const reportType =
  //       data.complaint?.report_type ||
  //       data.report_type ||
  //       dataelement?.report_type;
  //     //console.log("🔍 ExplainView - Setting visibility for report type:", reportType);

  //     if (reportType && dataset_reporttype) {
  //       const reportTypeObj = dataset_reporttype.find(
  //         (item: any) => item.id === reportType || item.lov_code === reportType
  //       );

  //       if (reportTypeObj) {
  //         //console.log("🔍 ExplainView - Found report type object:", reportTypeObj);
  //         // บังคับส่งข้อมูลไปให้ ExplaintBody ผ่าน dataelement
  //         const updatedDataElement = {
  //           ...data,
  //           report_type: reportTypeObj.lov_code,
  //           _forceVisibilityUpdate: true, // flag เพื่อบังคับ update visibility
  //         };
  //         setdataelement(updatedDataElement);
  //       }
  //     }
  //   }

  //   if (name === "ReadApproveSC") {
  //     // ถ้ามาโหมด ApproveSC → เปิด Dialog ที่ใช้สำหรับอนุมัติ
  //     setOpenExplainApproveSc(true);
  //   } else {
  //     // ถ้ามาโหมดดูข้อมูลทั่วไป → เปิด Dialog แสดงเฉย ๆ
  //     setOpenExplainView(true);
  //   }
  //   // เปิด modal
  //   // setOpenExplainApproveSc(true);
  // };

  const handleOnclickExplainView = async (explainData: any, name: string) => {
    console.log("handleOnclickExplainView", handleOnclickExplainView);

    console.log("dataaaaaaaaaaaa", data);
    console.log("dataaaaaaaaaaaa", explainData);

    setAction(name);
    console.log("nameeeeeee", name);

    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickExplainView"
      );

    const complaintData = dataelement;

    // เก็บ complaint หลัก
    setComplaintMainData(complaintData);

    // สร้าง object สำหรับ approve (เอา respondent_domain_id จาก complaint หลัก)
    const approvalData = {
      ...explainData,
      respondent_domain_id: complaintData?.respondent_domain_id,
    };

    setCurrentExplainForApproval(approvalData);

    // Reset form ก่อน
    // resetForm();

    // ตั้งวันที่ approve
    setapprove_date(dayjs());

    // เซ็ตข้อมูลลง context สำหรับ modal
    setobservation_analysis(explainData.observation_analysis || "");
    setroot_cause(explainData.root_cause || "");
    setcorrective_action(explainData.corrective_action || "");
    setpreventive_action_plan(explainData.preventive_action_plan || "");

    if (explainData.responsible_date)
      setresponsible_date(dayjs(explainData.responsible_date));
    if (explainData.follow_up_date)
      setfollow_up_date(dayjs(explainData.follow_up_date));

    // 🔹 ดึง approve ของ explain นี้และแมปลง fields (QC approve = approve_seq: 2)
    if (explainData.id) {
      const approveData = await ExplaintApprove_Get(explainData.id);

      if (approveData && approveData.length > 0) {
        // เตรียมตรวจสอบข้อมูลรายการอนุมัติ (เพื่อทำเงื่อนไข เปิด-ปิด กล่องแสดงผล)
        // approveData
        setisApproveQcBoxHidden(true);
        console.log(
          "🎶🎶😉😉🤞 isApproveQcBoxHidden 1: ",
          isApproveQcBoxHidden
        );

        // หา QC approve record (approve_seq === 2)
        const qcApprove =
          approveData.find((item: any) => item.approve_seq === 2) ||
          approveData[0];

        // Set QC approve name
        setqcapprove_name(qcApprove.approve_name || "");

        // Map company_id → object
        if (qcApprove.approve_company_id) {
          const qcCompany = dataset_company.find(
            (c: any) =>
              Number(c.company_id) === Number(qcApprove.approve_company_id)
          );
          if (qcCompany) {
            setqcapprove_company_id(qcCompany);
          }
        }

        // Map department_id → object
        if (qcApprove.approve_department_id) {
          const qcDepartment = dataset_department.find(
            (d: any) =>
              Number(d.department_id) ===
              Number(qcApprove.approve_department_id)
          );
          if (qcDepartment) {
            setqcapprove_department_id(qcDepartment);
          }
        }

        // Set other QC approve fields
        setqcapprove_position(qcApprove.approve_position || "");
        setqcapprove_email(qcApprove.approve_email || "");
        if (qcApprove.approve_date) {
          setqcapprove_date(dayjs(qcApprove.approve_date));
        }

        // Set QC approve detail and note
        if (qcApprove.approve_detail) {
          setqcapprove_detail(qcApprove.approve_detail);
        }
        if (qcApprove.approve_note) {
          setqcapprove_note(qcApprove.approve_note);
        }
        setdataQcapp(
          dataApprove_Combobox.find(
            (item: any) => item.lov_code === qcApprove.approve_status
          ) || null
        );
        // Note: QC approve radio (dataQcapp) will be set in ExplaintBody.tsx from dataelement

        console.log("📘 QC Approve data loaded:", qcApprove);
      } else {
        setisApproveQcBoxHidden(false);
        console.log(
          "🎶🎶😉😉🤞 isApproveQcBoxHidden 2 : ",
          isApproveQcBoxHidden
        );
      }
    }

    // เอา report_type มาด้วย
    const reportType =
      explainData.complaint?.report_type ||
      explainData.report_type ||
      complaintData?.report_type;

    if (reportType && dataset_reporttype) {
      const reportTypeObj = dataset_reporttype.find(
        (item: any) => item.id === reportType || item.lov_code === reportType
      );
      console.log("reportTypeObj line 5004", reportTypeObj);
      console.log("explainData line 5004", explainData);

      if (reportTypeObj) {
        setdataelement({
          ...explainData,
          report_type: reportTypeObj.lov_code,
          _forceVisibilityUpdate: Date.now(),
        });
      } else {
        console.log("call from line 5013", dataelement);
        setdataelement(explainData);
      }
    } else {
      console.log("call from line 5017", dataelement);
      setdataelement(explainData);
    }

    // เปิด Dialog
    if (name === "ApproveScRead") setOpenExplainView(true);
    else if (name === "ReadExplain") setOpenExplainView(true);
    else if (name === "ExplainRead") setOpenExplainView(true);
    else if (name === "ApproveQcRead") setOpenExplainView(true);
    else if (name === "ReadClose") setOpenExplainView(true);
    else if (name === "CloseHistory") setOpenExplainView(true);
    else setOpenExplainView(false);
  };

  const handleOnclickReadApproveSC = async (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickReadApproveSC"
      );

    //console.log("Read step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuView ");
    //console.log("Read step:3 ข้อมูลที่ได้จาก ListSearchGet ก่อนส่งเข้าฟังก์ชั่น Complaint_Get  ", data);
    resetForm();

    // ดึง complaint ข้อมูลจริงจาก API
    const complaintData = await Complaint_Get(data);

    if (!complaintData) return;

    // เซ็ต state ของ complaint
    setdataelement(complaintData);

    // ดึง explain ของ complaint
    await Explain_Get(complaintData.id);

    setOpenReadApproveSC(true); // แล้วค่อยเปิด Dialog
  };

  // const handleOnclickExplainApproveSc = (data: any) => {
  //   if (isCallFuncLogOn)
  //     console.log(
  //       "🕑 ",
  //       dayjs().format("HH:mm:ss.SSS"),
  //       " [Calling Function]  :  handleOnclickExplainApproveSc"
  //     );

  //   setCurrentExplainForApproval(data); // ✅ เก็บข้อมูล explain ที่จะอนุมัติไว้ใน state ใหม่
  //   resetForm();
  //   setapprove_date(dayjs());
  //   setOpenExplainApproveSc(true);
  // };

  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================

  const handleOnclickExplainApproveQc = async (explainData: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑",
        dayjs().format("HH:mm:ss.SSS"),
        "[Calling Function] : handleOnclickExplainApproveQc"
      );
    console.log("🧪 ExplaintBody loaded", {
      action,
      dataelement,
      observation_analysis,
      root_cause,
    });

    const complaintData = dataelement;

    // เก็บ complaint หลัก
    setComplaintMainData(complaintData);

    // สร้าง object สำหรับ approve (เอา respondent_domain_id จาก complaint หลัก)
    const approvalData = {
      ...explainData,
      respondent_domain_id: complaintData?.respondent_domain_id,
    };

    setCurrentExplainForApproval(approvalData);

    // Reset form ก่อน
    resetForm();

    // ตั้งวันที่ approve
    setapprove_date(dayjs());

    // เซ็ตข้อมูลลง context สำหรับ modal
    setobservation_analysis(explainData.observation_analysis || "");
    setroot_cause(explainData.root_cause || "");
    setcorrective_action(explainData.corrective_action || "");
    setpreventive_action_plan(explainData.preventive_action_plan || "");

    if (explainData.responsible_date)
      setresponsible_date(dayjs(explainData.responsible_date));
    if (explainData.follow_up_date)
      setfollow_up_date(dayjs(explainData.follow_up_date));

    // 🔹 ดึง approve ของ explain นี้และแมปลง fields
    if (explainData.id) {
      // console.log("📘 Fetching approve data for explain_id:", explainData.id);
      // console.log("📘 Fetching approve data for explain_id:", explainData.id.approve_name);
      const approveData = await ExplaintApprove_Get(explainData.id);

      if (approveData && approveData.length > 0) {
        const firstApprove = approveData[0]; // เลือก record แรก
        setqcapprove_name(
          firstApprove.qcapprove_name || user[0]?.employee_username
        );

        // map company_id → object
        const userCompanyId = String(user[0]?.itasset_company_id);
        setqcapprove_company_id(
          dataset_company.find((c: any) => c.company_id === userCompanyId) ||
            null
        );

        // map department_id → object
        const userDepartmentId = String(user[0]?.itasset_department_id);
        setqcapprove_department_id(
          dataset_department.find(
            (d: any) => d.department_id === userDepartmentId
          ) || null
        );
        setqcapprove_position(
          firstApprove.position || user[0]?.employee_position
        );
        setqcapprove_email(firstApprove.email || user[0]?.employee_email);
        if (firstApprove.approve_date)
          setqcapprove_date(dayjs(firstApprove.approve_date));
        // console.log("📘 Fetching approve data for explain_id:", approveData.approve_name);
        console.log(
          "📘 Fetching approve data for explain_id:",
          qcapprove_department_id
        );
        console.log("📘 dataset_department:", dataset_department);
        console.log("📘 dataset_company:", dataset_company);
      }
    }

    // เอา report_type มาด้วย
    const reportType =
      explainData.complaint?.report_type ||
      explainData.report_type ||
      complaintData?.report_type;

    if (reportType && dataset_reporttype) {
      const reportTypeObj = dataset_reporttype.find(
        (item: any) => item.id === reportType || item.lov_code === reportType
      );

      if (reportTypeObj) {
        setdataelement({
          ...explainData,
          report_type: reportTypeObj.lov_code,
          _forceVisibilityUpdate: Date.now(),
        });
      } else {
        setdataelement(explainData);
      }
    } else {
      setdataelement(explainData);
    }

    // เปิด modal
    setOpenExplainApproveQc(true);
  };

  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================

  const handleOnclickComplainCloseAdd = async (explainData: any) => {
    //ADD
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleOnclickComplainCloseAdd"
      );

    console.log("🧩 Data received:", data);
    console.log("🧑‍💼 User profile:", user[0]);
    console.log("🧪 ExplaintBody loaded", {
      action,
      dataelement,
      observation_analysis,
      root_cause,
    });

    const complaintData = dataelement;

    console.log(
      "😡😡😡😡😡😡😡😡 #1 dataelement",
      dataelement,
      "😡😡😡😡😡😡😡😡"
    );
    console.log(
      "🌐🌐🌐🌐🌐🌐🌐🌐 explainData",
      explainData,
      "🌐🌐🌐🌐🌐🌐🌐🌐"
    );

    // เก็บ complaint หลัก
    setComplaintMainData(complaintData);

    // สร้าง object สำหรับ approve (เอา respondent_domain_id จาก complaint หลัก)
    const approvalData = {
      ...explainData,
      respondent_domain_id: complaintData?.respondent_domain_id,
    };

    setCurrentExplainForApproval(approvalData);

    // ตั้งวันที่ approve
    setapprove_date(dayjs());

    // เซ็ตข้อมูลลง context สำหรับ modal
    setobservation_analysis(explainData.observation_analysis || "");
    setroot_cause(explainData.root_cause || "");
    setcorrective_action(explainData.corrective_action || "");
    setpreventive_action_plan(explainData.preventive_action_plan || "");

    if (explainData.responsible_date)
      setresponsible_date(dayjs(explainData.responsible_date));
    if (explainData.follow_up_date)
      setfollow_up_date(dayjs(explainData.follow_up_date));

    // 🔹 ดึง approve ของ explain นี้และแมปลง fields (QC approve = approve_seq: 2)
    if (explainData.id) {
      const approveData = await ExplaintApprove_Get(explainData.id);

      if (approveData && approveData.length > 0) {
        // หา QC approve record (approve_seq === 2)
        const qcApprove =
          approveData.find((item: any) => item.approve_seq === 2) ||
          approveData[0];

        // Set QC approve name
        setqcapprove_name(qcApprove.approve_name || "");

        // Map company_id → object
        if (qcApprove.approve_company_id) {
          const qcCompany = dataset_company.find(
            (c: any) =>
              Number(c.company_id) === Number(qcApprove.approve_company_id)
          );
          if (qcCompany) {
            setqcapprove_company_id(qcCompany);
          }
        }

        // Map department_id → object
        if (qcApprove.approve_department_id) {
          const qcDepartment = dataset_department.find(
            (d: any) =>
              Number(d.department_id) ===
              Number(qcApprove.approve_department_id)
          );
          if (qcDepartment) {
            setqcapprove_department_id(qcDepartment);
          }
        }

        // Set other QC approve fields
        setqcapprove_position(qcApprove.approve_position || "");
        setqcapprove_email(qcApprove.approve_email || "");
        if (qcApprove.approve_date) {
          setqcapprove_date(dayjs(qcApprove.approve_date));
        }

        // Set QC approve detail and note
        if (qcApprove.approve_detail) {
          setqcapprove_detail(qcApprove.approve_detail);
        }
        if (qcApprove.approve_note) {
          setqcapprove_note(qcApprove.approve_note);
        }
        setdataQcapp(
          dataApprove_Combobox.find(
            (item: any) => item.lov_code === qcApprove.approve_status
          ) || null
        );
        // Note: QC approve radio (dataQcapp) will be set in ExplaintBody.tsx from dataelement

        console.log("📘 QC Approve data loaded:", qcApprove);
      }
    }

    // เอา report_type มาด้วย
    const reportType =
      explainData.complaint?.report_type ||
      explainData.report_type ||
      complaintData?.report_type;

    if (reportType && dataset_reporttype) {
      const reportTypeObj = dataset_reporttype.find(
        (item: any) => item.id === reportType || item.lov_code === reportType
      );

      if (reportTypeObj) {
        setdataelement({
          ...explainData,
          report_type: reportTypeObj.lov_code,
          _forceVisibilityUpdate: Date.now(),
        });
      } else {
        setdataelement(explainData);
      }
    } else {
      setdataelement(explainData);
    }
    setOpenComplainCloseAdd(true);
    // Reset form ก่อน
    resetForm();
  };

  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================
  //======================================================================================================

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
  //       //console.log("Print clicked");
  //       break;
  //     default:
  //       console.warn("No handler for", func_name);
  //   }
  // };

  // Search Handlers
  const handleCloseSearch = () => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleCloseSearch"
      );

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
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  handleClose"
      );

    setOpenComplaintAdd(false);
    // setOpenSync(false);
    setOpenComplaintView(false);
    setOpenComplaintEdit(false);
    setOpenComplaintDelete(false);
    setOpenExplain(false);
    setOpenReadExplain(false);
    setOpenApproveSC(false);
    setOpenReadApproveSC(false);
    setOpenApproveQC(false);
    setOpenReadApproveQC(false);
    setOpenExplainAdd(false);
    setOpenExplainView(false);
    setOpenExplainApproveSc(false);
    setOpenExplainApproveQc(false);
    setOpenApproveQC(false);
    setOpenComplainClose(false);
    setOpenReadClose(false);
    setOpenComplainCloseAdd(false);
    setOpenCloseHistory(false);
    setOpenUpload(false);
    setApproveSelectionCode(null); // รีเซ็ตค่าเมื่อปิด Dialog
    //setdataFuapp(null); // รีเซ็ตค่า Approve ที่เลือกไว้
    // resetForm();
  };

  // Set Data Handler
  const setData = (data: any) => {
    if (isCallFuncLogOn)
      console.log(
        "🕑 ",
        dayjs().format("HH:mm:ss.SSS"),
        " [Calling Function]  :  setData"
      );

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
    // ListSearchGet();
    // ReportType_Get();
    // ComplaintType_Get();
    // ComplaintRs_Get();
    // photo_Get();
    // priority_Get();
    // DomainGet();
    // DepartmentDomainGet();
    // CompanyGet();
    // complaint_status_Get();
  }, []);

  const effectRan = React.useRef(false); // ป้องกัน run ซ้ำใน dev mode

  // Static useEffect
  React.useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const fetchData = async () => {
      try {
        //console.log("useEffect start");
        await LovAll_Get();
        await DomainRelateGet();
        // await DepartmentDomainGet();

        await mas_DomainGet(
          user[0]?.itasset_company_id,
          set_domain,
          user,
          isCallFuncLogOn
        );
        await mas_DepartmentGet_Complaint(
          {
            domain_id: dataelement?.respondent_domain_id ?? null,
            company_id: dataelement?.respondent_company_id,
          },
          setdataset_department,
          user,
          isCallFuncLogOn
        );

        // if (user?.[0]?.itasset_company_id) {

        // }

        //console.log("useEffect done");
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Dynamic useEffect
  React.useEffect(() => {
    if (dataset_activeCompany) {
      //console.log("🔁 activeCompany พร้อมแล้ว → เรียก CompanyGet()");
      CompanyGet();
    }

    if (dataset_complaintAction) {
      ComplaintGet();
    }
  }, [dataset_activeCompany, dataset_complaintAction]);

  // React.useEffect(() => {
  //   if (dataset_complaintAction) {
  //     ComplaintGet();
  //   }
  // }, [dataset_complaintAction]);

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

    //console.log("filtered", filtered);
    setFilteredComplaintType(filtered);
    //console.log("filteredRS", filteredRs);
    setFilteredComplaintRs(filteredRs);
    //console.log("filteredpriority", filteredpriority);
    setFilteredpriority(filteredpriority);
    //console.log("filteredphoto", filteredphoto);
    setFilteredphoto(filteredphoto);
  }, [
    dataComplaintType_Combobox,
    dataComplaintRs_Combobox,
    datapriority_Combobox,
    dataphoto_Combobox,
    dataelement,
  ]);

  React.useEffect(() => {
    if (!currentExplainForApproval || !dataApprove_Combobox?.length) return;
    const fetchSCApprove = async () => {
      const approveData = await ExplaintApprove_Get(
        currentExplainForApproval.id
      );
      if (approveData?.length > 0) {
        const firstApprove = approveData.find(
          (x: any) => x.explain_id === dataelement?.id && x.approve_seq === 1
        );
        setapprove_position(firstApprove?.approve_position || "");
        setapprove_email(firstApprove?.approve_email || "");
        setapprove_date(
          firstApprove?.approve_date
            ? dayjs(firstApprove?.approve_date)
            : dayjs()
        );
        setapprove_detail(firstApprove?.approve_detail || "");
        setapprove_note(firstApprove?.approve_note || "");
      }
    };
    fetchSCApprove();
  }, [currentExplainForApproval, dataApprove_Combobox]);

  // =====================================================================================================
  // RETURN SECTION - RENDER COMPONENT
  // =====================================================================================================

  // #F29739
  const statusOptions = (datastatus || []).map((item: any) => ({
    id: item.id,
    lov_code: item.lov_code,
    lov4: item.lov4,
    displayText: item.lov4 ? `${item.lov_code} (${item.lov4})` : item.lov_code,
  }));

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
                    String(item.company_id) ===
                    String(TextNameSearch.dataset_company)
                ) ||
                dataset_company?.find(
                  (item: any) =>
                    String(item.company_id) ===
                    String(user[0]?.itasset_company_id)
                ) ||
                null
              }
              labelName="บริษัท (Company)"
              options={dataset_company || []}
              column="company_name"
              setvalue={(val) => {
                handleCompanyChange(val);
                setTextNameSearch({
                  ...TextNameSearch,
                  dataset_company: val?.company_id || "", // เก็บแค่ id เป็น string
                });
              }}
              readonly
            />
          </Grid>
          <Grid size={4}>
            <AutocompleteComboBox
              value={
                dataset_domainrelate?.find(
                  (item: any) =>
                    item.domain_id === TextNameSearch.dataset_domainrelate
                ) || null
              }
              labelName="โดเมน (Domain)"
              options={dataset_domainrelate || []}
              column="domain_name"
              setvalue={(val) => {
                handleDomainChange(val);
                setTextNameSearch({
                  ...TextNameSearch,
                  dataset_domainrelate: val?.domain_id || "", // เก็บแค่ id เป็น string
                });
              }}
            />
          </Grid>
          <Grid size={4}>
            <AutocompleteComboBox
              value={
                dataset_department?.find(
                  (item: any) =>
                    item.department_id === TextNameSearch.dataset_department
                ) || null
              }
              labelName="แผนก (Department)"
              options={dataset_department || []}
              column="department_name"
              setvalue={(val) => {
                setTextNameSearch({
                  ...TextNameSearch,
                  dataset_department: val?.department_id || "", // เก็บแค่ id เป็น string
                });
              }}
              readonly={!TextNameSearch.dataset_domainrelate}
            />
          </Grid>

          <Grid size={4}>
            <AutocompleteComboBox
              value={
                dataset_reporttype?.find(
                  (item: any) => item.id === TextNameSearch.report_code
                ) || null
              }
              labelName="ประเภทเอกสาร (Report Type)"
              options={dataset_reporttype || []}
              column="lov_code"
              setvalue={(val) => {
                setTextNameSearch({
                  ...TextNameSearch,
                  report_code: val?.id || "", // เก็บแค่ id เป็น string
                });
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
            {/* <AutocompleteComboBox
              value={
                datastatus?.find(
                  (item: any) => item.id === TextNameSearch.datastatus
                ) || null
              }
              labelName="สถานะ (Status)"
              options={datastatus}
              column="lov_code" // หรือชื่อ field ที่คุณต้องการแสดง
              setvalue={(val) =>
                setTextNameSearch({
                  ...TextNameSearch,
                  datastatus: val?.id || "", // เก็บแค่ id เป็น string
                })
              }
            /> */}
            <AutocompleteComboBox
              value={
                statusOptions?.find(
                  (item: any) => item.id === TextNameSearch.datastatus
                ) || null
              }
              labelName="สถานะ (Status)"
              options={(datastatus || []).map((item: any) => ({
                id: item.id, // เก็บ id ไว้
                lov_code: item.lov_code,
                lov4: item.lov4,
                displayText: item.lov4
                  ? `${item.lov_code} (${item.lov4})`
                  : item.lov_code,
              }))}
              column="displayText" // ใช้ displayText แสดงใน dropdown
              setvalue={(val) =>
                setTextNameSearch({
                  ...TextNameSearch,
                  datastatus: val?.id || "", // ใช้ id จริง
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
              value={
                dataset_stepcomplaint?.find(
                  (item: any) =>
                    item.lov_code === TextNameSearch.dataset_stepcomplaint
                ) || null
              }
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
              labelName={"รีเซ็ต"}
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
              hidden={
                menuFuncData?.find(
                  (item: auth_role_menu_func) => item?.func_name === "Add"
                )
                  ? false
                  : true
              }
              color="success"
              onClick={() => {
                //DepartmentDomainGet("Add");
                handleOnclickComplaintAdd();
              }}
            >
              {menuFuncData?.find(
                (item: auth_role_menu_func) => item?.func_name === "Add"
              )
                ? "เพิ่มข้อมูล"
                : ""}
              <AddIcon sx={{}} />
            </Button>
          </div>
        }
      />

      {/* // ===================================================================================================== */}
      {/* // FUNC DIALOG (Complaint) */}
      {/* // ===================================================================================================== */}

      {/* ------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------- For All Status ------------------------------------- */}
      {/* ------------------------------------------------------------------------------------------ */}
      <FuncDialog
        open={openComplaintAdd}
        dialogWidth="xl"
        openBottonHidden={true}
        hideReject={true}
        hideSaveDraft={!dataReportTypeValue}
        hideSaveSubmit={!dataReportTypeValue}
        titlename={"[Complaint] เพิ่มข้อมูล"}
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
              Respondent_Department: respondentDepartmentError,
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
              setRespondentDepartmentError(false);
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
            onRespondentDepartmentChange={(val) => {
              setrespondent_domain_id(val);
              if (val && val.domain_id) {
                setRespondentDepartmentError(false);
              }
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

      {/* ------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------ For Status [NEW] ------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------ */}
      <FuncDialog
        open={openComplaintView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"[Complaint] ดูข้อมูล"}
        handleClose={handleClose}
        buttonColor="success"
        element={<ComplaintBody action="Read" />}
      />

      {/* For Status [NEW] */}
      <FuncDialog
        open={openComplaintEdit}
        dialogWidth="xl"
        openBottonHidden={true}
        hideReject={true}
        titlename={"[Complaint] แก้ไขข้อมูล"}
        buttonText={"Save & Submit"}
        handleClose={handleClose}
        // handlefunction={ComplaintEdit}
        handlefunction={() => ComplaintEdit("SUBMIT")}
        // handlesavedraft={ComplaintSavedraftEdit}
        handlesavedraft={() => ComplaintEdit("NEW")}
        hideSaveDraft={false}
        buttonColor="success"
        element={
          <ComplaintBody
            action="Edit"
            onBlocksChange={(data) => setComplaintBlocks(data)}
            validateDetailText={blockValidateErrors}
            handleOpenAdd={handleOpenAddList}
            validateText={{
              Product_Group: false,
              Report_Type: reportTypeError,
              Respondent_Department: respondentDepartmentError,
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
            }}
            onDateOfDetectionChange={(val) => {
              setdate_of_detection(val);
              setDateOfDetectionError(false);
            }}
            onRespondentDepartmentChange={(val) => {
              setrespondent_domain_id(val);
              if (val && val.domain_id) {
                setRespondentDepartmentError(false);
              }
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
        open={openComplaintDelete}
        dialogWidth="xl"
        hideSaveDraft={true}
        openBottonHidden={true}
        hideReject={true}
        titlename={"[Complaint] ลบข้อมูล"}
        buttonText={"Delete"}
        handleClose={handleClose}
        handlefunction={ComplaintDelete}
        buttonColor="error"
        element={<ComplaintBody action="Delete" />}
      />

      {/* // ===================================================================================================== */}
      {/* // FUNC DIALOG (Explain)(Complaint Modal / LAYER 1) */}
      {/* // ===================================================================================================== */}

      {/* ------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------ For Status [SUBMITED] ------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------ */}
      <FuncDialog
        open={openExplain}
        dialogWidth="xl"
        openBottonHidden={true}
        hideSaveDraft={true}
        hideSaveSubmit={true}
        hideReject={hideReject}
        titlename={"[Complaint] ข้อมูลและรายละเอียด"}
        handleClose={handleClose}
        handlereject={() => ComplaintReturn("EXPLAIN")}
        buttonColor="success"
        element={
          <ComplaintBody
            action="Explain"
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ExplainRead")
            }
            handleOnclickExplainApproveSc={handleOnclickExplainApproveSc}
          />
        }
      />

      <FuncDialog
        open={openReadExplain}
        dialogWidth="xl"
        openBottonHidden={true}
        hideSaveDraft={true}
        hideSaveSubmit={true}
        hideReject={true}
        titlename={"[Complaint] ข้อมูลและรายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ReadExplain"
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ReadExplain")
            }
            handleOnclickExplainApproveSc={handleOnclickExplainApproveSc}
          />
        }
      />

      {/* กดปุ่มจัดการ อนุมัติรายการ */}
      <FuncDialog
        open={openApproveSC}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"Explain (SC READ) // รายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ApproveSC"
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ApproveScRead")
            }
            handleOnclickExplainApproveSc={handleOnclickExplainApproveSc}
          />
        }
      />

      <FuncDialog
        open={openReadApproveSC}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"ApproveSC // ดูรายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ReadApproveSC"
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ApproveScRead")
            }
            handleOnclickExplainApproveSc={handleOnclickExplainApproveSc}
          />
        }
      />

      <FuncDialog
        open={openApproveQC}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"Explain (QC READ) // รายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ApproveQC"
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ApproveQcRead")
            }
            handleOnclickExplainApproveQc={handleOnclickExplainApproveQc}
          />
        }
      />

      <FuncDialog
        open={openReadApproveQC}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"ApproveQC // ดูรายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ReadApproveQC"
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ApproveQcRead")
            }
            handleOnclickExplainApproveQc={handleOnclickExplainApproveQc}
          />
        }
      />

      <FuncDialog
        open={openComplainClose}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"Close (CLOSE READ) // ปิดรายการ"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="Close"
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ReadClose")
            }
            handleOnclickComplainCloseAdd={handleOnclickComplainCloseAdd}
          />
        }
      />

      {/* กดปุ่มจัดการ ดูข้อมูล */}
      <FuncDialog
        open={openReadClose}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"ReadClose // ดูรายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ReadClose"
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ReadClose")
            }
            handleOnclickComplainCloseAdd={handleOnclickComplainCloseAdd}
          />
        }
      />

      <FuncDialog
        open={openCloseHistory}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"CloseHistory // ดูรายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="CloseHistory"
            handleOpenAdd={() => handleOnclickComplainCloseAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "CloseHistory")
            }
            // handleOnclickExplainApproveSc={handleOnclickExplainApproveSc}
          />
        }
      />

      {/* // ===================================================================================================== */}
      {/* // FUNC DIALOG (Explain)(Explain Modal / LAYER 2) */}
      {/* // ===================================================================================================== */}

      {/* ------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------ For Status [SUBMITED] ------------------------------- */}
      {/* ------------------------------------------------------------------------------------------ */}
      <FuncDialog
        open={openExplainAdd}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={"[Explain] เพิ่มข้อมูล"}
        buttonText={"Save & Submit"}
        handleClose={() => handleOnclickCloseAddExplain(dataelement)}
        handlefunction={ExplainAdd}
        hideSaveDraft={true}
        hideReject={true}
        buttonColor="success"
        element={<ExplaintBody action="ExplainAdd" />}
      />

      <FuncDialog
        open={openExplainView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"[Explain] ดูข้อมูล"}
        handleClose={handleClose}
<<<<<<< HEAD
=======
        // handleClose={() => handleOnclickCloseReadExplain(dataelement)}
>>>>>>> 93bdca6 (Edit:Merge)
        handlefunction={ExplainGet}
        buttonColor="success"
        element={
          <ExplaintBody
            complaint_status_lable={dataelement?.complaint_status_lable}
            currentExplainForApproval={currentExplainForApproval}
            action={
              action.includes("Read") ? action : action + "Read"

              // //ADD
              // action == "Explain" ? "ExplainRead" // ✅
              // : action == "ApproveSC" ? "ApproveScRead"
              // : action == "ApproveQC" ? "ApproveQcRead"
              // : action == "Close" ? "CloseRead"
              // : action === "CloseHistory" ? "CloseRead"
              // : "Action is Incorrect. (Please recheck in FuncDialog)"

              // //ADD
              // action == "Explain" ? "ExplainRead" // ✅
              // : action == "ApproveSC" ? "ApproveScRead"
              // : action == "ApproveQC" ? "ApproveQcRead"
              // : action == "Close" ? "CloseRead"
              // : action === "CloseHistory" ? "CloseRead"

              // //READ
              // : action == "ReadExplain" ? "ExplainRead"
              // : action == "ReadApproveSC" ? "ApproveScRead" // ✅
              // : action == "ReadApproveQC" ? "ApproveQcRead"
              // : action == "ReadClose" ? "CloseRead"
              // : "Action is Incorrect. (Please recheck in FuncDialog)"
            }
          />
        }
      />

      <FuncDialog
        open={openExplainApproveSc}
        dialogWidth="xl"
        openBottonHidden={true}
        hideSaveDraft
        hideReject={approveSelectionCode === "APPROVE" || !approveSelectionCode}
        hideSaveSubmit={
          approveSelectionCode === "ADD" ||
          approveSelectionCode === "REJECT" ||
          !approveSelectionCode
        }
        titlename={"Approve Section Head (SC ADD) // เพิ่มข้อมูล"}
        buttonText={"Approve"}
        handlefunction={ApproveScAdd}
        handlereject={() => ComplaintReturn("APPROVE_SC")}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ExplaintBody
            action="ApproveSCAdd"
            handleOpenAdd={() => handleOnclickExplainApproveSc(dataelement)}
            onApproveChange={(value) => {
              setApproveSelectionCode(value?.lov_code ?? null);
            }}
            validateText={{
              Follow_up_Date: followUpDateError,
              ObsAnaly: obsAnalyError,
              Tu: toolUseError,
              Tuother: toolUseOtherError,
              Rc: rootCauseError,
              Dd: ddError,
              Ddother: ddOtherError,
              Ca: correctiveActionError,
              Pap: preventiveActionPlanError,
              ScDetail: scDetailError,
              ScNote: scNoteError,
              QcDetail: qcDetailError,
              QcNote: qcNoteError,
              CloseDetail: closeDetailError,
              CloseNote: closeNoteError,
            }}
            onSCDetailChange={(val) => {
              setapprove_detail(val);
              setScDetailError(false);
            }}
            onSCNoteChange={(val) => {
              setapprove_note(val);
              setScNoteError(false);
            }}
          />
        }
      />

      {/* ------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------ */}

      {/* <FuncDialog
        open={openExplainApproveSc}
        dialogWidth="xl"
        openBottonHidden={true}
        hideSaveDraft
        hideReject={approveSelectionCode === "APPROVE" || !approveSelectionCode}
        hideSaveSubmit={
          approveSelectionCode === "ADD" ||
          approveSelectionCode === "REJECT" ||
          !approveSelectionCode
        }
        titlename={"Approve Section Head (SC ADD) // เพิ่มข้อมูล"}
        buttonText={"Approve"}
        handlefunction={ApproveScAdd}
        handlereject={() => ComplaintReturn("EXPLAIN")}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ExplaintBody
            action="ApproveSCAdd"
            handleOpenAdd={() => handleOnclickExplainApproveSc(dataelement)}
            onApproveChange={(value) => {
              setApproveSelectionCode(value?.lov_code ?? null);
            }}
          />
        }
      /> */}

      {/* QC ADD */}
      <FuncDialog
        open={openExplainApproveQc}
        dialogWidth="xl"
        openBottonHidden={true}
        hideSaveDraft
        hideReject={approveSelectionCode === "APPROVE" || !approveSelectionCode}
        hideSaveSubmit={
          approveSelectionCode === "ADD" ||
          approveSelectionCode === "REJECT" ||
          !approveSelectionCode
        }
        titlename={"Approve QC (QC ADD)// เพิ่มข้อมูล"}
        buttonText={"Approve"}
        handlefunction={ApproveQcAdd}
        handlereject={() => ComplaintReturn("APPROVE_QC")}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ExplaintBody
            action="ApproveQCAdd"
            handleOpenAdd={() => handleOnclickExplainApproveQc(dataelement)}
            onApproveChange={(value) => {
              setApproveSelectionCode(value?.lov_code ?? null);
            }}
            validateText={{
              Follow_up_Date: followUpDateError,
              ObsAnaly: obsAnalyError,
              Tu: toolUseError,
              Tuother: toolUseOtherError,
              Rc: rootCauseError,
              Dd: ddError,
              Ddother: ddOtherError,
              Ca: correctiveActionError,
              Pap: preventiveActionPlanError,
              ScDetail: scDetailError,
              ScNote: scNoteError,
              QcDetail: qcDetailError,
              QcNote: qcNoteError,
              CloseDetail: closeDetailError,
              CloseNote: closeNoteError,
            }}
            onQCDetailChange={(val) => {
              setqcapprove_detail(val);
              setQcDetailError(false);
            }}
            onQCNoteChange={(val) => {
              setqcapprove_note(val);
              setQcNoteError(false);
            }}
          />
        }
      />

      <FuncDialog
        open={openComplainCloseAdd}
        dialogWidth="xl"
        openBottonHidden={true}
        hideSaveDraft
        hideReject={approveSelectionCode === "APPROVE" || !approveSelectionCode}
        hideSaveSubmit={
          approveSelectionCode === "ADD" ||
          approveSelectionCode === "REJECT" ||
          !approveSelectionCode
        }
        titlename={"Close (CLOSE ADD) // ปิดรายการ"}
        buttonText={"CLOSE"}
        handlefunction={CloseAdd}
        handlereject={() => ComplaintReturn("CLOSE")}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ExplaintBody
            action="CloseAdd"
            handleOpenAdd={() => handleOnclickComplainCloseAdd(dataelement)}
            onApproveChange={(value) => {
              setApproveSelectionCode(value?.lov_code ?? null);
            }}
            validateText={{
              Follow_up_Date: followUpDateError,
              ObsAnaly: obsAnalyError,
              Tu: toolUseError,
              Tuother: toolUseOtherError,
              Rc: rootCauseError,
              Dd: ddError,
              Ddother: ddOtherError,
              Ca: correctiveActionError,
              Pap: preventiveActionPlanError,
              ScDetail: scDetailError,
              ScNote: scNoteError,
              QcDetail: qcDetailError,
              QcNote: qcNoteError,
              CloseDetail: closeDetailError,
              CloseNote: closeNoteError,
            }}
            onCloseDetailChange={(val) => {
              setclose_detail(val);
              setCloseDetailError(false);
            }}
            onCloseNoteChange={(val) => {
              setclose_note(val);
              setCloseNoteError(false);
            }}
          />
        }
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
