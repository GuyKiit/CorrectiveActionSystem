import React, { useState, useMemo, useEffect } from "react";
import { _GET, _POST, _POST_FORMDATA, _POST_SYS_API } from "../../service/mas";
import { _formatNumber } from "../../../libs/datacontrol";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import {
  Box,
  Button,
  Divider,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grow,
  Autocomplete,
  TextField,
  Chip,
  Checkbox,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import ActionManageCell from "../../components/MUI/ActionManageCell";
import { useAuth } from "../../auth/core/AuthContext";
import Grid from "@mui/material/Grid2";
import { useLayout } from "../../layout/core/LayoutProvider";
import { auth_role_menu_func } from "../../types/users";
import AddIcon from "@mui/icons-material/Add";
import { Complaint_headCells } from "../../../libs/columnname";
import DataTable from "../../components/MUI/DataTable";
import ComplaintBody from "./components/ComplaintBody";
import { useListComplaint } from "./core/ListComplaintContext";
import { v4 as uuidv4 } from "uuid";
import {
  cleanAccessData,
  getCurrentAccessObject,
  updateSessionStorageCurrentAccess,
} from "../../service/initmain/initmain";
import FuncDialog from "../../components/MUI/FullDialog";
import FullSweetalert from "../../components/MUI/Sweetalert";
import AutocompleteComboBox from "../../components/MUI/AutocompleteComboBox";
import FullWidthTextField from "../../components/MUI/FullWidthTextField";
import DesktopDatePickers from "../../components/MUI/DesktopDatePicker";
import BasicChips from "../../components/MUI/BasicChips";
import FullWidthButton from "../../components/MUI/FullWidthButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/CheckCircle";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ExplaintBody from "./components/ExplaintBody";
import {
  mas_DepartmentDomainGet,
  mas_DepartmentGet_Complaint,
  mas_DomainGet,
  mas_DomainRelateGet,
} from "../../service/mas/lov";
import ReportBodyProps from "../Report/reportbody";

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
  const app = getCurrentAccessObject(
    user?.[0]?.employee_username || "",
    user?.[0]?.employee_domain || "",
    "Complaint List"
  );
  const { setIsLoadingScreen } = useLayout();
  const { menuFuncData, userData } = useAuth();
  const employeeUsername = user?.[0]?.employee_username || "";
  const employeeDomain = user?.[0]?.employee_domain || "";

  const screenName = "ComplaintPage";

  cleanAccessData("current_access");
  updateSessionStorageCurrentAccess("screen_name", screenName);

  // =====================================================================================================
  // CONTEXT VARIABLES
  // =====================================================================================================
  const {
    // Main Complaint Fields
    dataelement,
    setdataelement,
    cas_number,
    date_of_detection,
    request_company_id,
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
    respond_date_within,
    lot_no,
    dataReportTypeValue,
    dataComplaintTypeValue_Combobox,
    dataComplaintType_Combobox,
    dataComplaintRsValue_Combobox,
    dataComplaintRs_Combobox,
    dataphoto_Combobox,
    datapriorityValue_Combobox,
    datastatus,
    datastatusCrossDomain,
    datapriority_Combobox,
    datapriority,
    clauseOther,
    complaintFiles,
    explainFiles,
    closeFiles,
    domainrelate,

    // Dataset Variables
    dataset_reporttype,
    dataset_reporttype_inactive,
    dataset_department,
    dataset_department_request,
    dataset_department_respondent,
    dataset_company,
    dataset_stepcomplaint,
    dataset_complaintAction,
    dataset_complaintActionNew,
    dataset_complaintActionExplain,
    dataset_complaintActionClose,
    dataset_activeCompany,
    dataset_roleProfile,
    dataset_configfile,
    dataset_complaintActionApproveSC,
    dataset_complaintActionApproveQC,

    //Explaint
    dataTooluseValue,
    dataToolUse_Combobox,
    ToolOther,
    dataDecisionValue,
    dataDecision_Combobox,
    DecisionOther,
    dataApprove_Combobox,
    observation_analysis,
    root_cause,
    corrective_action,
    preventive_action_plan,
    follow_up_date,
    responsible_company_id,
    responsible_department_id,
    responsible_date,
    close_company_id,
    close_department_id,
    close_detail,
    close_note,
    return_company_id,
    return_department_id,
    approve_detail,
    approve_note,
    approve_company_id,
    approve_department_id,
    approve_date,
    qcapprove_company_id,
    qcapprove_department_id,
    qcapprove_date,
    qcapprove_detail,
    qcapprove_note,
    dataset_crosscompany,

    // Setter Functions
    setcas_number,
    setdate_of_detection,
    setrequest_name,
    setrequest_company_id,
    setrequest_domain_id,
    setrequest_department_id,
    setrequest_position,
    setrequest_email,
    setrequest_phone,
    setrespondent_company_id,
    setrespondent_domain_id,
    setrespondent_department_id,
    setrespondent_email,
    setproduct_name,
    setdetail,
    setlot_no,
    setcompTypeOther,
    setcompRsOther,
    setcomplaint_status_id,
    setdataReportTypeValue,
    setdataComplaintType_Combobox,
    setdataComplaintTypeValue_Combobox,
    setdataComplaintRs_Combobox,
    setdatastatus,
    setdatastatusCrossDomain,
    setdataComplaintRsValue_Combobox,
    setdataphoto_Combobox,
    setdataphotoValue_Combobox,
    setdatapriority_Combobox,
    setdatapriority,
    setclauseOther,
    setdataset_reporttype,
    setdataset_reporttype_inactive,
    setdataset_activeCompany,
    setdataset_roleProfile,
    setdataset_configfile,
    setdataset_department,
    setdataset_department_request,
    setdataset_department_respondent,
    setdataset_company,
    set_domain,
    setdataset_domainrelate,
    setcomplaintFiles,
    set_domainrelate,
    setdataset_complaintActionApproveSC,
    setdataset_complaintActionApproveQC,

    //set Explaint
    setExplainList,
    setApproveList,
    setdataToolUse,
    setdataToolUse_Combobox,
    setToolOther,
    setdataSectionapp,
    setdataQcapp,
    setfollowup_approve,//มันคือ Radio Close 
    setdataDecision_Combobox,
    setdataApprove_Combobox,
    setdataDecision,
    setDecisionOther,
    setresponsible_date,
    setdataToolUseValue,
    setfollow_up_date,
    setdataDecisionValue,
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
    setclose_detail,
    setclose_note,
    setisApproveQcBoxHidden,

    // File states for clearing
    setexplainFiles,
    setcloseFiles,
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
  const [openReadApproveQC, setOpenReadApproveQC] = React.useState(false);
  const [openReadClose, setOpenReadClose] = React.useState(false);
  const [openCloseHistory, setOpenCloseHistory] = React.useState(false);
  const [openPrint, setOpenPrint] = React.useState(false);
  // Close Dialog Handler

  const [openExplainApproveSc, setOpenExplainApproveSc] = React.useState(false);
  const [openExplainApproveQc, setOpenExplainApproveQc] = React.useState(false);

  const [openComplainClose, setOpenComplainClose] = React.useState(false);
  const [openComplainCloseAdd, setOpenComplainCloseAdd] = React.useState(false);

  const [openApproveQC, setOpenApproveQC] = React.useState(false);

  const [openUpLoad, setOpenUpload] = React.useState(false);

  const [isAcknowledgeUpdated, setIsAcknowledgeUpdated] = React.useState(false);

  const [ComplaintBlocks, setComplaintBlocks] = useState<Block[]>([]);
  const [blockValidateErrors, setBlockValidateErrors] = useState<{ [index: number]: data_detail; }>({});
  const [successCardOpen, setSuccessCardOpen] = React.useState(false);
  const [successCardMessage, setSuccessCardMessage] = React.useState("");
  const [openAddlist, setOpenAddlist] = React.useState(false);
  const [submitCount, setSubmitCount] = React.useState(0);

  const [currentExplainForApproval, setCurrentExplainForApproval] = useState<any>(null);
  const [complaintMainData, setComplaintMainData] = useState<any>(null);
  const [approveSelectionCode, setApproveSelectionCode] = useState<string | null>(null);
  const [action, setAction] = React.useState("");
  const [prevExplainFiles, setPrevExplainFiles] = React.useState<any[]>([]);

  // Date Search Variables (from index.tsx)
  const [documentDateSearch, setdocumentDateSearch] = React.useState<dayjs.Dayjs | null>(null);

  // Search Variables (from index.tsx)
  const [TextNameSearch, setTextNameSearch] = React.useState({
    dataset_company: "",
    dataset_domain: "",
    dataset_department: "",
    report_code: "",
    cas_number: "",
    product_name: "",
    lot_no: "",
    complaint_status_label: "",
    dataset_stepcomplaint: "",
  });

  // Additional State Variables (from ComplaintRead.tsx)
  const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>([]);
  const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
  const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
  const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);

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
  const [preventiveActionPlanError, setPreventiveActionPlanError] = useState(false);

  const [qcDetailError, setQcDetailError] = useState(false);
  const [qcNoteError, setQcNoteError] = useState(false);
  const [closeDetailError, setCloseDetailError] = useState(false);
  const [closeNoteError, setCloseNoteError] = useState(false);

  // For On-Off Calling Function Log
  const [isCallFuncLogOn] = useState(true);

  const [searchTrigger, setSearchTrigger] = useState(false);
  const handleOpenAddList = () => setOpenAddlist(true);
  const grouped = { config_file: dataset_configfile || [], };

  const tempRoleUser = dataset_roleProfile?.filter(
    (item: any) => item.lov1 === String(user[0]?.role_id)
  );
  const isItAdmin = tempRoleUser?.[0]?.lov_code === "it_admin";

  // =====================================================================================================
  // EVENT HANDLERS (On Change Functions)
  // =====================================================================================================

  const handleCompanyChange = async (value: any) => {
    if (value) {
      mas_DomainRelateGet(
        value?.company_id,
        set_domainrelate,
        user,
        isCallFuncLogOn
      );
    }

    // clear ค่า domain กับ department
    setrespondent_domain_id(null);
    setdataset_department([]);
  };

  const handleDomainChange = (value: any) => {
    // reset แผนกก่อนโหลดใหม่
    setTextNameSearch((prev) => ({
      ...prev,
      dataset_department: "", // เคลียร์ค่าเดิม
    }));
    if (value != null) {
      mas_DepartmentGet_Complaint(
        value,
        setdataset_department,
        setdataset_department_respondent,
        isCallFuncLogOn,
        user,
        action
      );
    } else {
      setdataset_department([]);
      setrespondent_department_id(null);
    }
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
    setfollowup_approve(null);
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
    setFollowUpDateError(false);
    setToolUseError(false);
    setToolUseOtherError(false);
    setDdError(false);
    setDdOtherError(false);
    setRootCauseError(false);
    setObsAnalyError(false);
    setCorrectiveActionError(false);
    setPreventiveActionPlanError(false);
  };

  // Update Complaint ID Functions (from index.tsx)
  function compTypeUpdateCompId(
    dataComplaintTypeValue_Combobox: any,
    complaintid: string,
    compTypeOther: string
  ) {
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

  function getPaddingYear() {
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
  const LovAll_Get = async (
    mode?: any,
    respondent_domain_id?: any,
    isItAdmin?: boolean,
    complaint_status_id?: string,
    lov_approve_step_id?: string
  ) => {
    if (mode == "get_role") {
      try {
        const dataset = {
          lov_type: "role_profile",
        };
        const response = await _POST(dataset, "/Lov/LovGet");

        if (response && response.status === "success") {
          const lovData = response.data || [];
          setdataset_roleProfile?.(lovData);

          const tempRoleUser = lovData?.filter(
            (item: any) => item.lov1 === String(user[0]?.role_id)
          );
          const tempCheckItAdmin = tempRoleUser?.[0]?.lov_code === "it_admin";
          return tempCheckItAdmin;
        }
      } catch {

      }
    }

    if (mode == "get_inactive") {
      try {
        const dataset = isItAdmin
          ? {
            lov_type:
              "report_type",
            lov_active_flag: 'N',
          }
          : {
            lov_group:
              user[0]?.itasset_company_id + ",VARIABLE_CONSTANT" + ",SYSTEM",
            lov_type:
              "report_type",
            lov_active_flag: 'N',
          };
        const response = await _POST(dataset, "/Lov/LovGet");

        if (response && response.status === "success") {
          const lovData = response.data || [];
          setdataset_reporttype_inactive?.(lovData);
        }
      } catch {
      }
    }

    if (mode == "get_complaint_status") {
      try {
        const dataset = {
          lov_group: String(user[0]?.itasset_company_id),
          lov_type: "complaint_status",
        };

        const response = await _POST(dataset, "/Lov/LovGet");

        if (response && response.status === "success") {
          const lovData = response.data || [];

          // ✅ จัดกลุ่มตาม lov_type
          const grouped = lovData.reduce((acc: any, item: any) => {
            if (!acc[item.lov_type]) acc[item.lov_type] = [];
            acc[item.lov_type].push(item);
            return acc;
          }, {});
          return isItAdmin
            ? grouped["complaint_status"] // 🔥 admin เห็นทุก domain
            : grouped["complaint_status"].filter(
              (item: any) =>
                item.lov7 ===
                (typeof respondent_domain_id === "object"
                  ? respondent_domain_id?.domain_id
                  : respondent_domain_id)
            );
        }
      } catch {
      }
    }
    if (mode == "get_complaint_status_by_id") {
      try {
        const dataset = {
          id: complaint_status_id,
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
          // ✅ จัดกลุ่มตาม lov_type
          const grouped = lovData.reduce((acc: any, item: any) => {
            if (!acc[item.lov_type]) acc[item.lov_type] = [];
            acc[item.lov_type].push(item);
            return acc;
          }, {});
          return isItAdmin
            ? grouped["complaint_status"] // 🔥 admin เห็นทุก domain
            : grouped["complaint_status"].filter(
              (item: any) =>
                item.lov7 ===
                (typeof respondent_domain_id === "object"
                  ? respondent_domain_id?.domain_id
                  : respondent_domain_id)
            );
        }
      } catch {
      }
    }
    if (mode == "Lead") {
      try {
        const dataset = {
          lov_group: String(user[0]?.itasset_company_id),
          lov_type: "complaint_status",
          lov7: respondent_domain_id?.domain_id,
          lov_approve_step: lov_approve_step_id
        };
        const response = await _POST(dataset, "/Lov/LovGet");

        if (response && response.status === "success") {
          const tempComplaintStatus = response.data?.filter((item: any) => item.id === complaint_status_id);
          return tempComplaintStatus[0];
        }
      } catch {
      }
    } else {
      try {
        const dataset = isItAdmin
          ? {
            lov_type:
              "report_type,complaint_type,reference_standard,priority_level,attach_type,complaint_status,tool_use,decision_disposition,approve_select,complaint_step,complaint_action,active_company,role_profile,config_file",
          }
          : {
            lov_group:
              user[0]?.itasset_company_id + ",VARIABLE_CONSTANT" + ",SYSTEM",
            lov_type:
              "report_type,complaint_type,reference_standard,priority_level,attach_type,complaint_status,tool_use,decision_disposition,approve_select,complaint_step,complaint_action,active_company,role_profile,config_file",
          };

        const response = await _POST(dataset, "/Lov/LovGet");

        if (response && response.status === "success") {
          const lovData = response.data || [];

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
          setdatapriority_Combobox?.(grouped["priority_level"] || []);
          setdataphoto_Combobox?.(grouped["attach_type"] || []);
          setdataToolUse_Combobox?.(grouped["tool_use"] || []);
          setdataDecision_Combobox?.(grouped["decision_disposition"] || []);
          setdataApprove_Combobox?.(grouped["approve_select"] || []);
          setdataset_stepcomplaint?.(grouped["complaint_step"] || []);
          setdataset_complaintAction?.(grouped["complaint_action"] || []);
          setdataset_activeCompany?.(grouped["active_company"] || []);
          setdataset_roleProfile?.(grouped["role_profile"] || []);
          setdataset_configfile?.(grouped["config_file"] || []);
          setdatastatusCrossDomain?.(grouped["complaint_status"] || []);
          setdatastatus?.(
            isItAdmin
              ? grouped["complaint_status"]
              : grouped["complaint_status"].filter(
                (item: any) => item.lov7 === user[0].employee_domain
              )
          );

          const filterAction = (code: string) => {
            return grouped["complaint_action"].filter(
              (item: any) => item.lov_code === code
            );
          };

          setdataset_complaintActionNew(
            isItAdmin
              ? filterAction("ACTION_NEW")
              : grouped["complaint_action"].filter(
                (item: any) =>
                  item.lov_code === "ACTION_NEW" &&
                  item.lov_group == user[0].itasset_company_id
              )
          );
          setdataset_complaintActionExplain(
            isItAdmin
              ? filterAction("ACTION_EXPLAIN")
              : grouped["complaint_action"].filter(
                (item: any) =>
                  item.lov_code === "ACTION_EXPLAIN" &&
                  item.lov_group == user[0].itasset_company_id
              )
          );
          setdataset_complaintActionApproveSC(
            isItAdmin
              ? filterAction("ACTION_APPROVE_SC")
              : grouped["complaint_action"].filter(
                (item: any) =>
                  item.lov_code === "ACTION_APPROVE_SC" &&
                  item.lov_group == user[0].itasset_company_id
              )
          );
          setdataset_complaintActionApproveQC(
            isItAdmin
              ? filterAction("ACTION_APPROVE_QC")
              : grouped["complaint_action"].filter(
                (item: any) =>
                  item.lov_code === "ACTION_APPROVE_QC" &&
                  item.lov_group == user[0].itasset_company_id
              )
          );
          setdataset_complaintActionClose(
            isItAdmin
              ? filterAction("ACTION_CLOSE")
              : grouped["complaint_action"].filter(
                (item: any) =>
                  item.lov_code === "ACTION_CLOSE" &&
                  item.lov_group == user[0].itasset_company_id
              )
          );
        }
      } catch {
      }
    }
  };

  // Function - Get Company
  const CompanyGet = async (action?: string) => {
    if (isCallFuncLogOn)
      try {
        const response = await _POST({}, "/Complaint/CasCompanyGet");

        if (response && response.status === "success") {
          const activeCompany = dataset_activeCompany; // จาก LovAll_Get

          if (activeCompany?.length > 0) {
            const active = activeCompany[0]?.lov1 || "";

            const activeid = active.split(",").map((id: string) => id.trim());

            // ✅ filter บริษัทตาม company_id
            const filteredCompany = response.data.filter((company: any) =>
              activeid.includes(company.company_id.toString())
            );

            setdataset_company(filteredCompany);
          } else {
            setdataset_company(response.data);
          }
        }
      } catch {
      }
  };

  // Function - Get DomainRelate
  const DomainRelateGet = async () => {
    try {
      const dataset = {
        domain: user[0]?.employee_domain,
        company_id: user[0]?.itasset_company_id,
      };
      const response = await _POST(dataset, "/Complaint/CasDomainRelateGet");
      if (response && response.status === "success") {
        if (Array.isArray(response.data)) {
          setdataset_domainrelate(response.data);
        }
      }
    } catch {
    }
  };

  const isMinLevel = (allowedLevelsArray: any, currentLevel: any) => {
    // 1. ดัก Error เผื่อค่าว่าง
    if (!allowedLevelsArray || allowedLevelsArray.length === 0 || !currentLevel) {
      return false;
    }

    // 2. แปลงทุกตัวใน Array ให้เป็น Number แน่ๆ แล้วหาค่าสูงสุด
    // เช่น ['1', '2'] -> จะถูกแปลงและหาค่า max ได้เป็น 2
    const minLevel = Math.min(...allowedLevelsArray.map(Number));

    // 3. แปลงค่าที่รับมาเป็น Number แล้วจับมาเทียบกัน (คืนค่าเป็น true/false)
    return Number(currentLevel) === minLevel;
  };

  const isMaxLevel = (allowedLevelsArray: any, currentLevel: any) => {
    // 1. ดัก Error เผื่อค่าว่าง
    if (!allowedLevelsArray || allowedLevelsArray.length === 0 || !currentLevel) {
      return false;
    }

    // 2. แปลงทุกตัวใน Array ให้เป็น Number แน่ๆ แล้วหาค่าสูงสุด
    // เช่น ['1', '2'] -> จะถูกแปลงและหาค่า max ได้เป็น 2
    const maxLevel = Math.max(...allowedLevelsArray.map(Number));

    // 3. แปลงค่าที่รับมาเป็น Number แล้วจับมาเทียบกัน (คืนค่าเป็น true/false)
    return Number(currentLevel) === maxLevel;
  };

  // ฟังก์ชันนี้รับพารามิเตอร์ 2 ตัว: Master Data ทั้งหมด และค่า lov5 ของแต่ละ Record
  const getFilteredComplaintStatus = (allStatuses: any, allowedLov5: any) => {
    // 1. ถ้าไม่มีค่า lov5 ส่งมา ป้องกัน Error ให้ Return ตัวเต็มกลับไปก่อน
    if (!allowedLov5) return allStatuses;

    // 2. แปลง "1,2" ให้เป็น Array ['1', '2'] เพื่อให้ค้นหาง่ายขึ้น
    const allowedLevels = String(allowedLov5).split(',');

    // 3. กรองข้อมูล
    return allStatuses.filter((status: any) => {
      // ดึงค่า lov3 ออกมาเช็ค (เผื่อกรณีมันมาเป็น string 'NULL' หรือค่า null ว่างๆ)
      const currentLov3 = status.lov3;

      // เงื่อนไข A: ถ้า lov3 เป็น null หรือ 'NULL' (เช่น NEW, SUBMITTED, CLOSED) ให้ปล่อยผ่านเสมอ
      if (!currentLov3 || currentLov3 === 'NULL') {
        return true;
      }

      // เงื่อนไข B: ถ้า lov3 มีตัวเลข (เช่น 1 หรือ 2) ให้เช็คว่าตัวเลขนั้นอยู่ใน Array allowedLevels หรือไม่
      return allowedLevels.includes(String(currentLov3));
    });
  };

  // =====================================================================================================
  // API FUNCTIONS - CRUD OPERATIONS
  // =====================================================================================================
  // Function - Get Complaints single list
  const Complaint_Get = async (data: any) => {
    updateSessionStorageCurrentAccess("event_name", "Complaint_Get");

    setIsLoadingScreen(true);
    const dataset = {
      id: data.id,
      user_id: user[0]?.employee_username,
      domain_id: user[0]?.employee_domain,
      department_id: user[0]?.itasset_department_id,
      company_id: user[0]?.itasset_company_id,
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
    };

    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setdataelement(response.data[0]);
        setcomplaint_status_id(response.data[0]?.complaint_status_id);
        return response.data[0];
      }
    } catch {
    }
  };

  const ExplainGet = async () => {
    updateSessionStorageCurrentAccess("event_name", "ExplainGet");
    if (!dataelement?.id) {
      return;
    }

    setIsLoadingScreen(true);
    const dataset = {
      complaint_id: dataelement?.id,
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
    };

    try {
      let response = await _POST(dataset, "/Explain/ExplainGet");

      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setExplainList(response.data || []);

        // Debug each explain record
        if (Array.isArray(response.data)) {
          response.data.forEach((explain: any, index: number) => {
          });
        }
      }
    } catch (e) {
      setIsLoadingScreen(false);
    }
  };

  const Explain_Get = async (complaint_id: string) => {
    updateSessionStorageCurrentAccess("event_name", "Explain_Get");
    if (!complaint_id) return;

    setIsLoadingScreen(true);
    try {
      const response = await _POST({ complaint_id }, "/Explain/ExplainGet");

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
    updateSessionStorageCurrentAccess("event_name", "ExplaintApprove_Get");

    if (!explain_id) return [];

    setIsLoadingScreen(true);
    const dataset = {
      explain_id,
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
    };

    try {
      const response = await _POST(
        dataset,
        "/ExplaintApprove/ExplaintApproveGet"
      );

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

  // Function - Search Complaints Data List
  const ComplaintGet = async () => {
    updateSessionStorageCurrentAccess("event_name", "ComplaintGet");

    setIsLoadingScreen(false);

    const dataset = {
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
      // Required Parameter
      user_id: user[0]?.employee_username,
      domain_id: user[0]?.employee_domain,
      department_id: user[0]?.itasset_department_id,
      company_id: user[0]?.itasset_company_id,
      //=======================================================
      company: TextNameSearch.dataset_company &&
        dataset_company?.some((item: any) => String(item.company_id) === String(TextNameSearch.dataset_company))
        ? String(TextNameSearch.dataset_company)
        : null,
      domain: TextNameSearch.dataset_domain
        ? TextNameSearch.dataset_domain
        : null,
      department: TextNameSearch.dataset_department
        ? TextNameSearch.dataset_department
        : null,
      report_code: (() => {
        if (!TextNameSearch.report_code) return null;

        // Extract selected lov_codes
        const selectedIds = TextNameSearch.report_code.split(',');
        const selectedCodes = new Set(
          selectedIds.map(id => dataset_reporttype.find((rt: any) => String(rt.id) === id)?.lov_code)
            .filter(Boolean)
        );

        if (selectedCodes.size === 0) return TextNameSearch.report_code;

        // Re-resolve IDs constrained by the CURRENT selected company
        const isCompanyValid = dataset_company?.some(
          (c: any) => String(c.company_id) === String(TextNameSearch.dataset_company)
        );

        const newIds = dataset_reporttype
          .filter((item: any) =>
            selectedCodes.has(item.lov_code) &&
            (!isCompanyValid || String(item.lov_group) === String(TextNameSearch.dataset_company))
          )
          .map((item: any) => item.id);

        return newIds.length > 0 ? newIds.join(',') : TextNameSearch.report_code;
      })(),
      cas_number: TextNameSearch.cas_number ? TextNameSearch.cas_number : null,
      product_name: TextNameSearch.product_name
        ? TextNameSearch.product_name
        : null,
      lot_no: TextNameSearch.lot_no ? TextNameSearch.lot_no : null,
      complaint_status_label: (() => {
        if (!TextNameSearch.complaint_status_label) return null;

        // Extract selected lov_codes and their optional lov3 variants
        const selectedIds = TextNameSearch.complaint_status_label.split(',');
        const selectedConfigs = new Set(
          selectedIds.map(id => {
            const found = datastatus.find((ds: any) => String(ds.id) === id);
            return found ? `${found.lov_code}||${found.lov3 || ''}` : null;
          }).filter(Boolean)
        );

        if (selectedConfigs.size === 0) return TextNameSearch.complaint_status_label;

        // Re-resolve IDs constrained by the CURRENT selected company and domain
        const isCompanyValid = dataset_company?.some(
          (c: any) => String(c.company_id) === String(TextNameSearch.dataset_company)
        );
        const isDomainValid = domainrelate?.some(
          (d: any) => String(d.domain_id) === String(TextNameSearch.dataset_domain)
        );

        const newIds = datastatus
          .filter((item: any) => {
            const key = `${item.lov_code}||${item.lov3 || ''}`;
            return selectedConfigs.has(key) &&
              (!isCompanyValid || String(item.lov_group) === String(TextNameSearch.dataset_company)) &&
              (!isDomainValid || String(item.lov7) === String(TextNameSearch.dataset_domain));
          })
          .map((item: any) => item.id);

        return newIds.length > 0 ? newIds.join(',') : TextNameSearch.complaint_status_label;
      })(),
      doc_date: documentDateSearch
        ? documentDateSearch.format("DD-MM-YYYY")
        : null,
      step_label: TextNameSearch.dataset_stepcomplaint
        ? TextNameSearch.dataset_stepcomplaint
        : null,
    };
    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      if (response && response.status === "success") {

        setIsLoadingScreen(false);
        const responseData: any = [];

        if (Array.isArray(response.data)) {
          // 🔹 กรองข้อมูลก่อน
          const filteredData = response.data.filter(
            (item: any) =>
              // กรณีที่เป็นของตัวเอง => เห็นทั้งหมด
              item.request_name === user[0].employee_username ||
              // กรณีที่เป็นของคนอื่น => เห็นได้ถ้าไม่ใช่สถานะ NEW
              (item.request_name !== user[0].employee_username &&
                item.complaint_status_label !== "NEW")
          );

          filteredData.forEach(async (el: any) => {

            // [MASTER] Complaint Status (By Domain)
            const tempDataStatus1 = (datastatusCrossDomain || []).filter(
              (val: any) => val["lov7"] == el.respondent_domain_id
            );

            // --------------------------------------------------------------------------

            // [SELECT] Report Type (From Report Type / INACTIVE)
            const tempApproveStep = (dataset_reporttype_inactive || []).filter(
              (val: any) => val["id"] === el.report_type
            );

            // --------------------------------------------------------------------------

            // [MASTER] Complaint Status (By Report Type Approve Step)
            const filteredComplaintStatus = getFilteredComplaintStatus(tempDataStatus1, tempApproveStep[0]?.lov5);

            // --------------------------------------------------------------------------

            // [MASTER]
            const temp = (filteredComplaintStatus || []).filter(
              (val: any) =>
                val["id"] == el.complaint_status_id && val["lov3"] !== null
            );

            let tempApproveSeq = [];
            let isApproveStepMin = false;
            let isApproveStepMax = false;
            let isAllowedTypeSingle = true;

            if (temp.length > 0) {

              tempApproveSeq.push(temp[0]["lov3"]);

              const allowedApproveStep = String(tempApproveStep[0]?.lov5).split(',');

              if (allowedApproveStep.length > 1) {
                isApproveStepMin = isMinLevel(allowedApproveStep, temp[0]?.lov3);
                isApproveStepMax = isMaxLevel(allowedApproveStep, temp[0]?.lov3);
                isAllowedTypeSingle = false;
              }
            }

            //==========================================================================

            const tempRolename = tempRoleUser[0].lov_code;

            const ACTION = (
              <ActionManageCell
                role_id={user[0]?.role_id}
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
                    handleOnclickReadClose(el);

                    // -------- For Status [CLOSED] --------------
                  } else if (name === "CloseHistory") {
                    handleOnclickCloseHistory(el);
                  } else if (name === "Print") {
                    handleOnclickPrint(el, name);
                  }
                }}
                //-----------------------------------------------------------------------
                hiddenDepartmentAdd={true}
                hiddenDepartmentView={true}
                hiddenDepartmentEdit={true}
                hiddenDepartmentDelete={true}

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

                // For Status [SUBMITED]
                hiddenExplain={
                  (dataset_complaintActionExplain &&
                    !dataset_complaintActionExplain.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        el.step_label == "EXPLAIN"
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

                // For Status [EXPLAINED]
                hiddenApproveSC={
                  (dataset_complaintActionApproveSC &&
                    !dataset_complaintActionApproveSC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        el.step_label == "EXPLAIN"
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
                    )) ??
                  false
                }
                // -----------------------------------------------------------------------

                // For Status [APPROVED][SC]
                hiddenApproveQC={
                  (dataset_complaintActionApproveQC &&
                    !dataset_complaintActionApproveQC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        tempRolename === "qc" &&
                        !isAllowedTypeSingle &&
                        isApproveStepMin
                    ))
                  ?? false
                }
                hiddenReadApproveQC={
                  (dataset_complaintActionApproveQC &&
                    !dataset_complaintActionApproveQC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        tempApproveSeq[0] == "1"
                    )) ??
                  false
                }
                //-----------------------------------------------------------------------

                // For Status [APPROVED][QC]
                hiddenClose={
                  (dataset_complaintActionApproveQC &&
                    !dataset_complaintActionApproveQC.some(
                      (mode: any) =>
                        mode.lov1
                          .split(",")
                          .includes(String(el.complaint_status_label)) &&
                        el.step_label === "COMPLAINT" &&
                        (tempRolename === "user" || tempRolename === "user_admin") &&
                        (isApproveStepMax || isAllowedTypeSingle) &&
                        el.request_department_id == user[0]?.itasset_department_id
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
                        tempApproveSeq[0] == "2"
                    )) ??
                  false
                }
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
                hiddenPrint={
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
            // For Display Status on Datatable [NEW, SUBMITED, EXPLAINED, APPROVED, CLOSED]
            el.complaint_status_label = (
              <BasicChips
                label={`${el.complaint_status_label}`}
                acknowledge={el.acknowledge_flag}
                step={`${el.step_label}`}
                role={tempRolename}
                approveseq={tempApproveSeq[0]}
                userdept={user[0]?.itasset_department_id}
                requestdept={el.request_department_id}
                isApproveStepMax={isApproveStepMax}
                isAllowedTypeSingle={isAllowedTypeSingle}
              ></BasicChips>
            );

            // For Display Step on Datatable [COMPLAINT, EXPLAIN]
            el.step_label = (
              <BasicChips label={`${el.step_label}`} type="step"></BasicChips>
            );
            responseData.push(el);
          });
        }
        setdatalist(responseData);
      }
    } catch {
    }
  };

  useEffect(() => {
    if (searchTrigger) {
      ComplaintGet();
      setSearchTrigger(false); // reset trigger เพื่อให้พร้อมใช้ครั้งถัดไป
    }
  }, [searchTrigger, TextNameSearch]);

  const splitNextStepName = (str: string) => {
    const parts = str.split("_");
    return parts.length >= 3 ? parts.slice(2).join("_") : str;
  };

  // Function - Validate before Add Complaint
  const validateBeforeAdd = (): boolean => {
    setSubmitCount((prev) => prev + 1);
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

    if (!date_of_detection || !date_of_detection.isValid()) {
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
      }
    }

    const reportTypeCode = dataReportTypeValue?.lov_code;
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
    let valid = true;

    setRespondentDepartmentError(false);
    setDateOfDetectionError(false);
    setDepartmentAreaError(false);

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

  const validateExplainAdd = (): boolean => {
    setSubmitCount((prev) => prev + 1);
    let valid = true;
    // Clear all validation errors
    setFollowUpDateError(false);
    setObsAnalyError(false);
    setToolUseError(false);
    setToolUseOtherError(false);
    setRootCauseError(false);
    setDdError(false);
    setDdOtherError(false);
    setCorrectiveActionError(false);
    setPreventiveActionPlanError(false);

    // Get report type code
    const reportTypeCode =
      dataReportTypeValue?.lov_code || dataelement?.report_type;

    // Common validation: Follow-up Date (required for all types)
    if (!follow_up_date) {
      setFollowUpDateError(true);
      valid = false;
    }

    // Type-specific validation
    if (reportTypeCode === "OBS") {
      if (!observation_analysis || observation_analysis.trim() === "") {
        setObsAnalyError(true);
        valid = false;
      }
    } else if (reportTypeCode === "NCR") {

      // Validate Tools Used
      if (!dataTooluseValue || dataTooluseValue.length === 0) {
        setToolUseError(true);
        valid = false;
      }

      if (
        dataTooluseValue &&
        dataTooluseValue.some((item: any) => item.isOther === "Y")
      ) {
        if (!ToolOther || ToolOther.trim() === "") {
          setToolUseOtherError(true);
          valid = false;
        }
      }

      // Validate Root Cause
      if (!root_cause || root_cause.trim() === "") {
        setRootCauseError(true);
        valid = false;
      }

      // Validate Decision/Disposition
      if (!dataDecisionValue || dataDecisionValue.length === 0) {
        setDdError(true);
        valid = false;
      }

      if (
        dataDecisionValue &&
        dataDecisionValue.some((item: any) => item.isOther === "Y")
      ) {
        if (!DecisionOther || DecisionOther.trim() === "") {
          setDdOtherError(true);
          valid = false;
        }
      }
    } else if (reportTypeCode === "CAR") {

      // Validate Tools Used
      if (!dataTooluseValue || dataTooluseValue.length === 0) {
        setToolUseError(true);
        valid = false;
      }

      if (
        dataTooluseValue &&
        dataTooluseValue.some((item: any) => item.isOther === "Y")
      ) {
        if (!ToolOther || ToolOther.trim() === "") {
          setToolUseOtherError(true);
          valid = false;
        }
      }

      // Validate Root Cause
      if (!root_cause || root_cause.trim() === "") {
        setRootCauseError(true);
        valid = false;
      }

      // Validate Corrective Action
      if (!corrective_action || corrective_action.trim() === "") {
        setCorrectiveActionError(true);
        valid = false;
      }

      // Validate Preventive Action Plan
      if (!preventive_action_plan || preventive_action_plan.trim() === "") {
        setPreventiveActionPlanError(true);
        valid = false;
      }
    } else if (reportTypeCode === "CPAR") {

      // Validate Tools Used
      if (!dataTooluseValue || dataTooluseValue.length === 0) {
        setToolUseError(true);
        valid = false;
      }

      if (
        dataTooluseValue &&
        dataTooluseValue.some((item: any) => item.isOther === "Y")
      ) {
        if (!ToolOther || ToolOther.trim() === "") {
          setToolUseOtherError(true);
          valid = false;
        }
      }

      // Validate Root Cause
      if (!root_cause || root_cause.trim() === "") {
        setRootCauseError(true);
        valid = false;
      }

      // Validate Corrective Action
      if (!corrective_action || corrective_action.trim() === "") {
        setCorrectiveActionError(true);
        valid = false;
      }

      // Validate Preventive Action Plan
      if (!preventive_action_plan || preventive_action_plan.trim() === "") {
        setPreventiveActionPlanError(true);
        valid = false;
      }
    }
    return valid;
  };

  const validateSCApprove = (): boolean => {
    setSubmitCount((prev) => prev + 1);
    let valid = true;

    // Clear ALL validation errors before validation
    setScDetailError(false);
    setScNoteError(false);

    if (!approve_detail || approve_detail.trim() === "") {
      setScDetailError(true);
      valid = false;
    }

    // Only validate approve_note when status is APPROVE
    if (approveSelectionCode === "APPROVE") {
      if (!approve_note || approve_note.trim() === "") {
        setScNoteError(true);
        valid = false;
      }
    }
    return valid;
  };

  const validateQCApprove = (): boolean => {
    setSubmitCount((prev) => prev + 1);
    let valid = true;
    // Clear ALL validation errors before validation
    setQcDetailError(false);
    setQcNoteError(false);

    if (!qcapprove_detail || qcapprove_detail.trim() === "") {
      setQcDetailError(true);
      valid = false;
    }

    if (approveSelectionCode === "APPROVE") {
      if (!qcapprove_note || qcapprove_note.trim() === "") {
        setQcNoteError(true);
        valid = false;
      }
    }
    return valid;
  };

  const validateClose = (): boolean => {
    setSubmitCount((prev) => prev + 1);
    let valid = true;

    // Clear ALL validation errors before validation
    setCloseDetailError(false);
    setCloseNoteError(false);

    if (!close_detail || close_detail.trim() === "") {
      setCloseDetailError(true);
      valid = false;
    }

    if (approveSelectionCode === "APPROVE") {
      if (!close_note || close_note.trim() === "") {
        setCloseNoteError(true);
        valid = false;
      }
    }
    return valid;
  };

  // CREATE -SaveDraft Add Complaint
  const ComplaintSavedraftAdd = async () => {
    updateSessionStorageCurrentAccess("event_name", "ComplaintSavedraft");

    if (!validateSaveDraft()) {
      return;
    }

    const tempid = uuidv4();
    const tempComplaintStatus = await LovAll_Get(
      "get_complaint_status",
      respondent_domain_id
    );

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
        product_name: product_name || null,
        detail: detail || null,
        priority_level: datapriorityValue_Combobox,
        respond_date_within: respond_date_within
          ? respond_date_within
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        lot_no: lot_no || null,
        complaint_status_id: tempComplaintStatus[0]?.id,
        create_by: user[0]?.employee_username || "",
        save_type: "save_draft",
        complaintType: complainttypeModel,
        complaintRs: complaintRsModel,
        // เพิ่ม complaintFile
        complaintFile:
          complaintFiles?.map((item: any, index: number) => {
            const isOther =
              dataphoto_Combobox?.find(
                (opt: any) => opt.id === item.attachmentType
              )?.lov2 === "Y";

            return {
              cf_type: "Complaint",
              complaint_id: tempid,
              complaint_at_id: item.attachmentType,
              other: isOther ? item.otherText?.trim() || null : null,
              cf_file_seq: (index + 1).toString(),
              user_file_name: item.file.name,
              file_name: item.file.name,
              file_type: item.file.type.split("/")[1] || "",
              file_size: item.file.size.toString(),
              record_status: true,
              create_by: user[0]?.employee_username || "",
              create_datetime: new Date().toISOString(),
              remark: isOther ? item.otherText?.trim() || null : null,
            };
          }) || [],
      },
      RunningModel: {
        code_group: dataReportTypeValue.lov_code,
        code_type: dataReportTypeValue.lov1 + "-" + getPaddingYear(),
        code_num: 1,
      },
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
      complaintstatusLog: {
        id: uuidv4(),
        complaint_id: tempid,
        complaint_status_id: tempComplaintStatus[0]?.id,
        user_name: user[0]?.employee_username,
        user_company_id: user[0]?.itasset_company_id,
        user_department_id: user[0]?.itasset_department_id,
        user_position: user[0]?.employee_position,
        user_email: user[0]?.employee_email,
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
      } else {
        FullSweetalert({
          title: "Failed",
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      handleClose();
      ComplaintGet();
      setIsLoadingScreen(false);
    }
  };

  // Function - Add Complaint
  const ComplaintAdd = async () => {
    updateSessionStorageCurrentAccess("event_name", "ComplaintAdd");

    if (!validateBeforeAdd()) {
      return;
    }

    const tempComplaintStatus = await LovAll_Get(
      "get_complaint_status",
      respondent_domain_id
    );

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
        respondent_email: respondent_email ? respondent_email : null,
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
            const isOther =
              dataphoto_Combobox?.find(
                (opt: any) => opt.id === item.attachmentType
              )?.lov2 === "Y";

            return {
              cf_type: "Complaint",
              complaint_id: tempid,
              complaint_at_id: item.attachmentType,
              other: isOther ? item.otherText?.trim() || null : null,
              cf_file_seq: (index + 1).toString(),
              user_file_name: item.file.name,
              file_name: item.file.name,
              file_type: item.file.type.split("/")[1] || "",
              file_size: item.file.size.toString(),
              record_status: true,
              create_by: user[0]?.employee_username || "",
              create_datetime: new Date().toISOString(),
              remark: isOther ? item.otherText?.trim() || null : null,
            };
          }) || [],
      },
      RunningModel: {
        code_group: dataReportTypeValue.lov_code,
        code_type: dataReportTypeValue.lov1 + "-" + getPaddingYear(),
        code_num: 1,
      },
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
      complaintstatusLog: {
        id: uuidv4(),
        complaint_id: tempid,
        complaint_status_id: tempComplaintStatus[1]?.id,
        user_name: user[0]?.employee_username,
        user_company_id: user[0]?.itasset_company_id,
        user_department_id: user[0]?.itasset_department_id,
        user_position: user[0]?.employee_position,
        user_email: user[0]?.employee_email,
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

    const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        เรียน เจ้าหน้าที่ฝ่าย${respondent_department_id?.department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        แจ้งเตือนปัญหาข้อร้องเรียนของรายการ CAS Number : CAS_NUMBER มีรายละเอียดดังต่อไปนี้
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          แผนกผู้ถูกร้องเรียน (Respondent Department)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ประเภทรายงาน (Report Type)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${dataReportTypeValue?.lov4 || "-"
      }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">CAS Number</td>
            <td style="padding: 8px; border: 1px solid #ddd;">CAS_NUMBER</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ระดับความสำคัญ (Priority)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${datapriority?.lov2 || "-"
      }</td>
          </tr>      
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตอบกลับภายในวันที่ (Response Date)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${respond_date_within
        ? respond_date_within.format("DD/MM/YYYY")
        : "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">Lot No./Bag No</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${lot_no || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">วันที่พบปัญหา (Date of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${date_of_detection ? date_of_detection.format("DD/MM/YYYY") : "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนกที่พบปัญหา (Department / Area of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${respondent_department_id?.department_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อสินค้า (Product Name)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${product_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">รายละเอียด (Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${detail || "-"
      }</td>
          </tr>
        </table>
        <h2 style="color: #2196f3; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">
          ผู้ทำการออกเอกสาร (Issuer)
        </h2>
         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อผู้ออกเอกสาร (Reported by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
        ? user[0]?.employee_fname_th +
        " " +
        (user[0]?.employee_lname_th || "")
        : (user[0]?.employee_fname_en || "") +
        " " +
        (user[0]?.employee_lname_en || "")
      } </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"
      }</td>
          </tr>

        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;

    const emailBodyHtmlEmergency = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>

        <div style="text-align: center; background-color: #d32f2f; color: #ffffff; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;"> เร่งด่วนฉุกเฉิน (EMERGENCY) </h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: bold;">
                รายการข้อร้องเรียนเร่งด่วนฉุกเฉิน : กรุณาตรวจสอบและดำเนินการแก้ไขทันที
        </p>
        </div>

        เรียน เจ้าหน้าที่ฝ่าย${respondent_department_id?.department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        แจ้งเตือนปัญหาข้อร้องเรียนของรายการ CAS Number : CAS_NUMBER มีรายละเอียดดังต่อไปนี้
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          แผนกผู้ถูกร้องเรียน (Respondent Department)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ประเภทรายงาน (Report Type)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${dataReportTypeValue?.lov4 || "-"
      }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">CAS Number</td>
            <td style="padding: 8px; border: 1px solid #ddd;">CAS_NUMBER</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #d32f2f; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ระดับความสำคัญ (Priority)</td>
            <td style="padding: 8px; font-weight: bold; color: #d32f2f; border: 1px solid #ddd;">${datapriority?.lov2 || "-"
      }</td>
          </tr>      
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #d32f2f; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตอบกลับภายในวันที่ (Response Date)</td>
            <td style="padding: 8px; font-weight: bold; color: #d32f2f; border: 1px solid #ddd;">${respond_date_within
        ? respond_date_within.format("DD/MM/YYYY")
        : "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">Lot No./Bag No</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${lot_no || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">วันที่พบปัญหา (Date of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${date_of_detection ? date_of_detection.format("DD/MM/YYYY") : "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนกที่พบปัญหา (Department / Area of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${respondent_department_id?.department_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อสินค้า (Product Name)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${product_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">รายละเอียด (Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${detail || "-"
      }</td>
          </tr>
        </table>
        <h2 style="color: #2196f3; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">
          ผู้ทำการออกเอกสาร (Issuer)
        </h2>
         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อผู้ออกเอกสาร (Reported by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
        ? user[0]?.employee_fname_th +
        " " +
        (user[0]?.employee_lname_th || "")
        : (user[0]?.employee_fname_en || "") +
        " " +
        (user[0]?.employee_lname_en || "")
      } </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"
      }</td>
          </tr>

        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;

    const findprioritylevel = datapriority_Combobox?.find((item: any) => item.id === datapriorityValue_Combobox);

    if (findprioritylevel?.id === "PRIORITY_E") {
      formData.append("emailBody", emailBodyHtmlEmergency);
    } else {
      formData.append("emailBody", emailBodyHtml);
    }

    setIsLoadingScreen(true);

    let response;

    try {
      response = await _POST_FORMDATA(formData, "/Complaint/ComplaintAdd");
    } catch (error) {
      console.error("Upload failed:", error);
      response = { status: "failed" };
    }
    setIsLoadingScreen(false);
    if (response?.status === "success") {
      FullSweetalert({
        title: "Success",
        text: `บันทึกข้อมูลสำเร็จ`,
        icon: "success",
      });
    } else {
      FullSweetalert({
        title: "Failed",
        text: `บันทึกไม่ข้อมูลสำเร็จ`,
        icon: "error",
      });
    }
    handleClose();
    ComplaintGet();
  };

  // Function - Edit Complaint
  const ComplaintEdit = async (mode: string) => {
    const tempApproveStep = (dataset_reporttype_inactive || []).filter(
      (val: any) => val["id"] === dataelement.report_type
    );

    const tempComplaintStatusList = await LovAll_Get(
      "Lead",
      respondent_domain_id,
      false,
      dataelement?.complaint_status_id,
      tempApproveStep[0]?.lov5
    );

    const tempComplaintStatus = tempComplaintStatusList;

    const formData = new FormData();
    if (mode == "SUBMIT") {
      updateSessionStorageCurrentAccess("event_name", "ComplaintEdit (Submit)");
      const tempid = uuidv4();
      if (!validateBeforeAdd()) {
        return;
      }

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
          cas_number: dataelement?.cas_number,
          mode: mode,
          save_type: "save_submit",
          date_of_detection: date_of_detection
            ? date_of_detection
              .hour(dayjs().hour())
              .minute(dayjs().minute())
              .second(dayjs().second())
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          respondent_domain_id: respondent_domain_id?.domain_id,
          respondent_department_id: respondent_department_id?.department_id,
          product_name: product_name,
          lot_no: lot_no || "",
          respondent_email: respondent_email,
          detail: detail,
          priority_level:
            datapriorityValue_Combobox || dataelement?.priority_level,
          respond_date_within: respond_date_within
            ? respond_date_within
              .hour(dayjs().hour())
              .minute(dayjs().minute())
              .second(dayjs().second())
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          complaint_status_id: tempComplaintStatus.lov1,
          complaintType: complainttypeModel,
          complaintRs: complaintRsModel,
          complaintFile:
            complaintFiles?.map((item: any, index: number) => {
              const isOther =
                dataphoto_Combobox?.find(
                  (opt: any) => opt.id === item.attachmentType
                )?.lov2 === "Y";
              return {
                id: item.id || undefined,
                cf_type: "Complaint",
                complaint_id: dataelement?.id,
                complaint_at_id: item.attachmentType,
                other: isOther ? item.otherText?.trim() || null : null,
                cf_file_seq: (index + 1).toString(),
                user_file_name: item.file.name,
                file_name: item.file.name,
                file_type: item.file.type,
                file_size: item.file.size.toString(),
                record_status: true,
                create_by: user[0]?.employee_username || "",
                create_datetime: new Date().toISOString(),
                remark: isOther ? item.otherText?.trim() || null : null,
              };
            }) || [],
        },
        CurrentAccessModel: getCurrentAccessObject(
          employeeUsername,
          employeeDomain,
          screenName
        ),
        complaintstatusLog: {
          id: uuidv4(),
          complaint_id: dataelement?.id,
          complaint_status_id: tempComplaintStatus.lov1,
          user_name: user[0]?.employee_username,
          user_company_id: user[0]?.itasset_company_id,
          user_department_id: user[0]?.itasset_department_id,
          user_position: user[0]?.employee_position,
          user_email: user[0]?.employee_email,
        },
      };

      formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

      // แนบไฟล์จริง
      if (complaintFiles && complaintFiles.length > 0) {
        complaintFiles.forEach((fileItem: any) => {
          formData.append("complaintFiles", fileItem.file);
        });
      }
      const email_casNumber = dataelement?.cas_number || "-";

      const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        เรียน เจ้าหน้าที่ฝ่าย${respondent_department_id?.department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        แจ้งเตือนปัญหาข้อร้องเรียนของรายการ CAS Number : ${email_casNumber} มีรายละเอียดดังต่อไปนี้
      </p>
        <br />
        <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          แผนกผู้ถูกร้องเรียน (Respondent Department)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ประเภทรายงาน (Report Type)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${dataReportTypeValue?.lov4 || "-"
        }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">CAS Number</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${cas_number || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ระดับความสำคัญ (Priority)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${datapriority?.lov2 || "-"
        }</td>
          </tr>      
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตอบกลับภายในวันที่ (Response Date)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${respond_date_within
          ? respond_date_within.format("DD/MM/YYYY")
          : "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">Lot No./Bag No</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${lot_no || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">วันที่พบปัญหา (Date of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${date_of_detection ? date_of_detection.format("DD/MM/YYYY") : "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนกที่พบปัญหา (Department / Area of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${respondent_department_id?.department_name || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อสินค้า (Product Name)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${product_name || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">รายละเอียด (Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${detail || "-"
        }</td>
          </tr>
        </table>
        <h2 style="color: #2196f3; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">
          ผู้ทำการออกเอกสาร (Issuer)
        </h2>
         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อผู้ออกเอกสาร (Reported by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
          ? user[0]?.employee_fname_th +
          " " +
          (user[0]?.employee_lname_th || "")
          : (user[0]?.employee_fname_en || "") +
          " " +
          (user[0]?.employee_lname_en || "")
        } </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"
        }</td>
          </tr>

        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;

      const emailBodyHtmlEmergency = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>

        <div style="text-align: center; background-color: #d32f2f; color: #ffffff; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;"> เร่งด่วนฉุกเฉิน (EMERGENCY) </h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: bold;">
                รายการข้อร้องเรียนเร่งด่วนฉุกเฉิน : กรุณาตรวจสอบและดำเนินการแก้ไขทันที
        </p>
        </div>

        เรียน เจ้าหน้าที่ฝ่าย${respondent_department_id?.department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        แจ้งเตือนปัญหาข้อร้องเรียนของรายการ CAS Number : CAS_NUMBER มีรายละเอียดดังต่อไปนี้
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          แผนกผู้ถูกร้องเรียน (Respondent Department)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ประเภทรายงาน (Report Type)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${dataReportTypeValue?.lov4 || "-"
        }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">CAS Number</td>
            <td style="padding: 8px; border: 1px solid #ddd;">CAS_NUMBER</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #d32f2f; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ระดับความสำคัญ (Priority)</td>
            <td style="padding: 8px; font-weight: bold; color: #d32f2f; border: 1px solid #ddd;">${datapriority?.lov2 || "-"
        }</td>
          </tr>      
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #d32f2f; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตอบกลับภายในวันที่ (Response Date)</td>
            <td style="padding: 8px; font-weight: bold; color: #d32f2f; border: 1px solid #ddd;">${respond_date_within
          ? respond_date_within.format("DD/MM/YYYY")
          : "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">Lot No./Bag No</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${lot_no || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">วันที่พบปัญหา (Date of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${date_of_detection ? date_of_detection.format("DD/MM/YYYY") : "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนกที่พบปัญหา (Department / Area of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${respondent_department_id?.department_name || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อสินค้า (Product Name)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${product_name || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">รายละเอียด (Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${detail || "-"
        }</td>
          </tr>
        </table>
        <h2 style="color: #2196f3; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">
          ผู้ทำการออกเอกสาร (Issuer)
        </h2>
         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อผู้ออกเอกสาร (Reported by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
          ? user[0]?.employee_fname_th +
          " " +
          (user[0]?.employee_lname_th || "")
          : (user[0]?.employee_fname_en || "") +
          " " +
          (user[0]?.employee_lname_en || "")
        } </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"
        }</td>
          </tr>

        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;

      const findprioritylevel = datapriority_Combobox?.find((item: any) => item.id === datapriorityValue_Combobox);

      if (findprioritylevel?.id === "PRIORITY_E") {
        formData.append("emailBody", emailBodyHtmlEmergency);
      } else {
        formData.append("emailBody", emailBodyHtml);
      }

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
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกไม่ข้อมูลสำเร็จ`,
            icon: "error",
          });
        }
      } catch {
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    }
    else if (mode == "NEW") {
      updateSessionStorageCurrentAccess("event_name", "ComplaintEdit (New)");
      if (!validateSaveDraft()) {
        return;
      }

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
          cas_number: dataelement?.cas_number,
          mode: mode,
          save_type: "save_draft",
          date_of_detection: date_of_detection
            ? date_of_detection
              .hour(dayjs().hour())
              .minute(dayjs().minute())
              .second(dayjs().second())
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
              .hour(dayjs().hour())
              .minute(dayjs().minute())
              .second(dayjs().second())
              .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          complaint_status_id: tempComplaintStatus.id,
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
                  dataphoto_Combobox?.find(
                    (opt: any) => opt.id === item.attachmentType
                  )?.lov2 === "Y"
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
                  dataphoto_Combobox?.find(
                    (opt: any) => opt.id === item.attachmentType
                  )?.lov2 === "Y"
                    ? item.otherText?.trim() || null
                    : null,
              };
            }) || [],
        },
        CurrentAccessModel: getCurrentAccessObject(
          employeeUsername,
          employeeDomain,
          screenName
        ),
        complaintstatusLog: {
          id: uuidv4(),
          complaint_id: dataelement?.id,
          complaint_status_id: tempComplaintStatus.id,
          user_name: user[0]?.employee_username,
          user_company_id: user[0]?.itasset_company_id,
          user_department_id: user[0]?.itasset_department_id,
          user_position: user[0]?.employee_position,
          user_email: user[0]?.employee_email,
        },
      };

      formData.append("complaintPayloadJson", JSON.stringify(complaintPayload));

      // แนบไฟล์จริง
      if (complaintFiles && complaintFiles.length > 0) {
        complaintFiles.forEach((fileItem: any) => {
          formData.append("complaintFiles", fileItem.file);
        });
      }

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
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกข้อมูลไม่สำเร็จ`,
            icon: "error",
          });
        }
      } catch {
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    }
  };

  // Function - Delete Complaint
  const ComplaintDelete = async () => {
    updateSessionStorageCurrentAccess("event_name", "ComplaintDelete");

    const result = await FullSweetalert({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบข้อมูลนี้หรือไม่<style>.swal2-confirm, .swal2-cancel { width: 100px !important; }</style>",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#AAAAAA",
      confirmButtonColor: "#FF4B6E",
    });

    if (!result.isConfirmed)
      return;

    const complaintPayload = {
      ComplaintModel: {
        id: dataelement?.id,
      },
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
    };

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
      } else {
        FullSweetalert({
          title: "Failed",
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: "error",
        });
      }
    } catch {
    } finally {
      setIsLoadingScreen(false);
      handleClose();
      FullSweetalert({
        title: "Success",
        text: `ลบข้อมูลสำเร็จ`,
        icon: "success",
      });
      ComplaintGet();
    }
  };

  const ComplaintReturn = async (mode: string) => {
    const tempComplaintStatus = await LovAll_Get(
      "get_complaint_status_by_id",
      user[0]?.employee_domain,
      false,
      dataelement?.complaint_status_id,
    );

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
    const formData = new FormData();
    if (mode === "EXPLAIN") {
      FullSweetalert({
        title: "ยืนยันการปฏิเสธ?",
        text: "คุณต้องการ ปฏิเสธ หรือไม่",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#FF0000",
      }).then((result) => {
        if (result.isConfirmed) {
          ComplaintReturn("EXPLAIN_CONFIRM");
        }
      });
      return;
    }

    if (mode === "EXPLAIN_CONFIRM") {
      setIsLoadingScreen(true);
      updateSessionStorageCurrentAccess("event_name", "ExplainReject");

      const email_casNumber = dataelement?.cas_number || "-";
      const email_requrst_department_name =
        dataelement?.request_department_name ||
        dataset_department?.find(
          (x: any) => x.department_id == dataelement?.request_department_id
        )?.department_name ||
        dataelement?.request_department_id ||
        "-";

      const emailSubject = `[CAS] แจ้งเตือนการ ตอบรับ / รับทราบ รายละเอียดข้อร้องเรียน CAS No.${email_casNumber || "-"}`;
      const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        เรียน เจ้าหน้าที่ฝ่าย${email_requrst_department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        เรียนมาเพื่อทราบ เพื่อพิจารณายกเลิก หรือ แก้ไข
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #2196f3; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">
          ผู้ทำการส่งกลับ (Return by)
        </h2>
         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อผู้ส่งกลับ (Return by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
          ? user[0]?.employee_fname_th +
          " " +
          (user[0]?.employee_lname_th || "")
          : (user[0]?.employee_fname_en || "") +
          " " +
          (user[0]?.employee_lname_en || "")
        } </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"
        }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"
        }</td>
          </tr>

        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;

      const complaintReturnPayload = {
        complaintReturnModel: {
          id: dataelement?.id,
          return_from_status_id: tempComplaintStatus[0]?.id,
          complaint_status_id: tempComplaintStatus[0]?.lov2,
          request_department_id: dataelement?.request_department_id,
          request_company_id: Number(dataelement?.request_company_id),
          request_domain_id: dataelement?.request_domain_id,
          mode: "EXPLAIN",

          respondent_company_id: Number(dataelement?.respondent_company_id),
          respondent_domain_id: dataelement?.respondent_domain_id,
          respondent_department_id: Number(dataelement?.respondent_department_id),
        },
        CurrentAccessModel: getCurrentAccessObject(
          employeeUsername,
          employeeDomain,
          screenName
        ),
        complaintstatusLog: {
          id: uuidv4(),
          complaint_id: complaintRootId,
          complaint_status_id: tempComplaintStatus[0]?.lov2,
          user_name: user[0]?.employee_username,
          user_company_id: user[0]?.itasset_company_id,
          user_department_id: user[0]?.itasset_department_id,
          user_position: user[0]?.employee_position,
          user_email: user[0]?.employee_email,
        },
        emailBody: emailBodyHtml,
        emailSubject: emailSubject,
      };

      formData.append("emailBody", emailBodyHtml);
      try {
        const complaintFormData = new FormData();
        complaintFormData.append(
          "complaintReturnJson",
          JSON.stringify(complaintReturnPayload)
        );
        closeFiles?.forEach((f: any) => {
          if (f.file instanceof File) {
            complaintFormData.append("closeFiles", f.file);
          }
        });
        const response = await _POST_FORMDATA(complaintFormData, "/Complaint/ComplaintReturn");
        if (response && response.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกข้อมูลสำเร็จ`,
            icon: "success",
          });
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกไม่ข้อมูลสำเร็จ`,
            icon: "error",
          });
        }
      } catch {
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    } else if (mode == "APPROVE_SC") {
      updateSessionStorageCurrentAccess("event_name", "ApproveScReject");
      if (!validateSCApprove()) {
        return;
      }
      const tempid = uuidv4();
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

      const tempExplainStatus = await LovAll_Get(
        "get_complaint_status_by_id",
        user[0]?.employee_domain,
        false,
        complaintMainData?.complaint_status_id
      );

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

      const selectedApproveItem = (dataApprove_Combobox || []).find(
        (item: any) => item.lov_code === approveSelectionCode
      );
      const approveDisplayText =
        selectedApproveItem?.lov1 || approveSelectionCode || "-";

      const email_respondent_department_name =
        dataelement?.respondent_department_name ||
        complaintMainData?.respondent_department_name ||
        dataset_department?.find(
          (x: any) =>
            x.department_id == dataelement?.respondent_department_id ||
            x.department_id == complaintMainData?.respondent_department_id
        )?.department_name ||
        dataset_department_respondent?.find(
          (x: any) =>
            x.department_id == dataelement?.respondent_department_id ||
            x.department_id == complaintMainData?.respondent_department_id
        )?.department_name ||
        dataelement?.respondent_department_id ||
        complaintMainData?.respondent_department_id ||
        "-";

      const email_casNumber = dataelement?.cas_number || complaintMainData?.cas_number || "-";
      const emailSubject = `[CAS] แจ้งเตือนการ ตอบรับ / รับทราบ รายละเอียดข้อร้องเรียน CAS No.${email_casNumber || "-"
        }`;

      const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        เรียน เจ้าหน้าที่ฝ่าย${email_respondent_department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        เรียนมาเพื่อทราบ เพื่อพิจารณายกเลิก หรือ แก้ไข
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
         <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          รายละเอียดการปฏิเสธ (Rejection Details)
        </h2>
         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">อนุมัติหัวหน้าส่วน (Section Approve)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${approveDisplayText || "-"}</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">หมายเหตุการปฏิเสธ (Rejection Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${approve_detail || "-"}</td>
          </tr>
        </table> 
        <h2 style="color: #64c768ff; border-bottom: 2px solid #64c768ff; padding-bottom: 10px;">
          ข้อมูลผู้รับรอง (Section Head)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ชื่อผู้อนุมัติ (Approved by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
          ? user[0]?.employee_fname_th +
          " " +
          (user[0]?.employee_lname_th || "")
          : (user[0]?.employee_fname_en || "") +
          " " +
          (user[0]?.employee_lname_en || "")
        }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"}</td>
          </tr>
        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;
      const approvePayload = {
        ExplaintApproveModel: {
          id: tempid,
          explain_id: explainRootId,
          approve_seq: approveSeq[0].lov3,
          complaint_status_id: tempExplainStatus[0]?.lov1,
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

          respondent_company_id: dataelement?.respondent_company_id,
          respondent_domain_id: dataelement?.respondent_domain_id,
          respondent_department_id: dataelement?.respondent_department_id,
        },
        CurrentAccessModel: getCurrentAccessObject(
          employeeUsername,
          employeeDomain,
          screenName
        ),
        sendEmail: approveSelectionCode === "APPROVE",
        emailBody: emailBodyHtml,
        emailSubject: emailSubject,
      };

      setIsLoadingScreen(true);

      try {
        const response = await _POST(
          approvePayload,
          "/ExplaintApprove/ExplaintApproveAdd"
        );
        if (response && response.status === "success") {
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
              return_from_status_id: tempExplainStatus[0]?.id,
              complaint_status_id: tempExplainStatus[0]?.lov2,
              mode: mode,

              request_company_id: dataelement?.respondent_company_id?.company_id
                ? Number(dataelement.respondent_company_id.company_id)
                : complaintMainData?.respondent_company_id
                  ? Number(complaintMainData.respondent_company_id)
                  : null,
              request_domain_id: dataelement?.respondent_domain_id || complaintMainData?.respondent_domain_id,
              request_department_id: dataelement?.respondent_department_id?.department_id
                ? Number(dataelement.respondent_department_id.department_id)
                : complaintMainData?.respondent_department_id
                  ? Number(complaintMainData.respondent_department_id)
                  : null,
            },
            CurrentAccessModel: getCurrentAccessObject(
              employeeUsername,
              employeeDomain,
              screenName
            ),
            sendEmail: approveSelectionCode === "APPROVE",
            emailBody: emailBodyHtml,
            emailSubject: emailSubject,
            complaintstatusLog: {
              id: uuidv4(),
              complaint_id: complaintRootId,
              complaint_status_id: tempExplainStatus[0]?.lov2,
              user_name: user[0]?.employee_username,
              user_company_id: user[0]?.itasset_company_id,
              user_department_id: user[0]?.itasset_department_id,
              user_position: user[0]?.employee_position,
              user_email: user[0]?.employee_email,
            },
          };

          const complaintFormData = new FormData();
          complaintFormData.append(
            "complaintReturnJson",
            JSON.stringify(complaintReturnPayload)
          );
          closeFiles?.forEach((f: any) => {
            if (f.file instanceof File) {
              complaintFormData.append("closeFiles", f.file);
            }
          });

          const response = await _POST_FORMDATA(complaintFormData, "/Complaint/ComplaintReturn");
          FullSweetalert({
            title: "Success",
            text: `บันทึกการอนุมัติและอัปเดตสถานะสำเร็จ`,
            icon: "success",
          });
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
      updateSessionStorageCurrentAccess("event_name", "QMReject");

      if (!validateQCApprove()) {
        return;
      }

      const tempid = uuidv4();
      const tempExplainStatus = await LovAll_Get(
        "get_complaint_status_by_id",
        user[0]?.employee_domain,
        false,
        complaintMainData?.complaint_status_id
      );

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

      const selectedApproveItem = (dataApprove_Combobox || []).find(
        (item: any) => item.lov_code === approveSelectionCode
      );
      const approveDisplayText =
        selectedApproveItem?.lov1 || approveSelectionCode || "-";

      const email_respondent_department_name =
        dataelement?.respondent_department_name ||
        complaintMainData?.respondent_department_name ||
        dataset_department?.find(
          (x: any) =>
            x.department_id == dataelement?.respondent_department_id ||
            x.department_id == complaintMainData?.respondent_department_id
        )?.department_name ||
        dataset_department_respondent?.find(
          (x: any) =>
            x.department_id == dataelement?.respondent_department_id ||
            x.department_id == complaintMainData?.respondent_department_id
        )?.department_name ||
        dataelement?.respondent_department_id ||
        complaintMainData?.respondent_department_id ||
        "-";

      const email_casNumber =
        dataelement?.cas_number || complaintMainData?.cas_number || "-";
      const emailSubject = `[CAS] แจ้งเตือนการ ตอบรับ / รับทราบ รายละเอียดข้อร้องเรียน CAS No.${email_casNumber || "-"}`;

      const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        เรียน เจ้าหน้าที่ฝ่าย${email_respondent_department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        เรียนมาเพื่อทราบ เพื่อพิจารณายกเลิก หรือ แก้ไข
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          รายละเอียดการปฏิเสธ (Rejection Details)
        </h2>
         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">อนุมัติผู้จัดการโรงงาน (QMR)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${approveDisplayText || "-"}</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">หมายเหตุการปฏิเสธ (Rejection Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${qcapprove_detail || "-"}</td>
          </tr>
        </table> 
        <h2 style="color: #64c768ff; border-bottom: 2px solid #64c768ff; padding-bottom: 10px;">
          ข้อมูลผู้รับรอง (QMR)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ชื่อผู้อนุมัติ (Approved by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
          ? user[0]?.employee_fname_th +
          " " +
          (user[0]?.employee_lname_th || "")
          : (user[0]?.employee_fname_en || "") +
          " " +
          (user[0]?.employee_lname_en || "")
        }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"}</td>
          </tr>
        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;

      const approvePayload = {
        ExplaintApproveModel: {
          id: tempid,
          explain_id: explainRootId,
          approve_seq: approveSeq[0].lov3,
          complaint_status_id: tempExplainStatus[0]?.lov1,
          approve_status: approveSelectionCode,
          approve_detail: qcapprove_detail || null,
          approve_note: qcapprove_note || null,
          approve_name: user[0]?.employee_username || "",
          approve_company_id: approve_company_id?.company_id
            ? Number(approve_company_id.company_id)
            : user[0]?.itasset_company_id || "",
          approve_department_id: qcapprove_department_id?.department_id
            ? Number(qcapprove_department_id.department_id)
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

          respondent_company_id: dataelement?.respondent_company_id,
          respondent_domain_id: dataelement?.respondent_domain_id,
          respondent_department_id: dataelement?.respondent_department_id,
        },
        CurrentAccessModel: getCurrentAccessObject(
          employeeUsername,
          employeeDomain,
          screenName
        ),
        sendEmail: approveSelectionCode === "APPROVE",
        emailBody: emailBodyHtml,
        emailSubject: emailSubject,
      };

      setIsLoadingScreen(true);

      try {
        const response = await _POST(
          approvePayload,
          "/ExplaintApprove/ExplaintApproveAdd"
        );

        if (response && response.status === "success") {
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
              return_from_status_id: tempExplainStatus[0]?.id,
              complaint_status_id: tempExplainStatus[0]?.lov2,
              mode: mode,
              request_company_id: dataelement?.respondent_company_id?.company_id
                ? Number(dataelement.respondent_company_id.company_id)
                : complaintMainData?.respondent_company_id
                  ? Number(complaintMainData.respondent_company_id)
                  : null,
              request_domain_id: dataelement?.respondent_domain_id || complaintMainData?.respondent_domain_id,
              request_department_id: dataelement?.respondent_department_id?.department_id
                ? Number(dataelement.respondent_department_id.department_id)
                : complaintMainData?.respondent_department_id
                  ? Number(complaintMainData.respondent_department_id)
                  : null,
            },
            emailBody: emailBodyHtml,
            emailSubject: emailSubject,
            CurrentAccessModel: {
              user_id: user[0]?.employee_username || "",
            },
            complaintstatusLog: {
              id: uuidv4(),
              complaint_id: complaintRootId,
              complaint_status_id: tempExplainStatus[0]?.lov2,
              user_name: user[0]?.employee_username,
              user_company_id: user[0]?.itasset_company_id,
              user_department_id: user[0]?.itasset_department_id,
              user_position: user[0]?.employee_position,
              user_email: user[0]?.employee_email,
            },
          };

          const complaintFormData = new FormData();
          complaintFormData.append(
            "complaintReturnJson",
            JSON.stringify(complaintReturnPayload)
          );
          closeFiles?.forEach((f: any) => {
            complaintFormData.append("closeFiles", f.file);
          });

          const response = await _POST_FORMDATA(complaintFormData, "/Complaint/ComplaintReturn");

          FullSweetalert({
            title: "Success",
            text: `บันทึกการอนุมัติและอัปเดตสถานะสำเร็จ`,
            icon: "success",
          });
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
      updateSessionStorageCurrentAccess("event_name", "CloseAdd");
      if (!validateClose()) {
        return;
      }
      const tempExplainStatus = await LovAll_Get(
        "get_complaint_status_by_id",
        user[0]?.employee_domain,
        false,
        complaintMainData?.complaint_status_id
      );
      const resolveExplainId = () => {
        return currentExplainForApproval?.id;
      };

      const explainRootId = resolveExplainId();

      setIsLoadingScreen(true);

      const complaintId =
        currentExplainForApproval?.complaint_id ?? dataelement?.id;

      const selectedApproveItem = (dataApprove_Combobox || []).find(
        (item: any) => item.lov_code === approveSelectionCode
      );
      const approveDisplayText =
        selectedApproveItem?.lov1 || approveSelectionCode || "-";

      const email_respondent_department_name =
        dataelement?.respondent_department_name ||
        complaintMainData?.respondent_department_name ||
        dataset_department?.find(
          (x: any) =>
            x.department_id == dataelement?.respondent_department_id ||
            x.department_id == complaintMainData?.respondent_department_id
        )?.department_name ||
        dataset_department_respondent?.find(
          (x: any) =>
            x.department_id == dataelement?.respondent_department_id ||
            x.department_id == complaintMainData?.respondent_department_id
        )?.department_name ||
        dataelement?.respondent_department_id ||
        complaintMainData?.respondent_department_id ||
        "-";

      const email_casNumber =
        dataelement?.cas_number || complaintMainData?.cas_number || "-";
      const emailSubject = `[CAS] แจ้งเตือนการ ตอบรับ / รับทราบ รายละเอียดข้อร้องเรียน CAS No.${email_casNumber || "-"}`;

      const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
         เรียน เจ้าหน้าที่ฝ่าย${email_respondent_department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        แจ้งเตือนปัญหาข้อร้องเรียนของรายการ CAS Number : ${email_casNumber} มีรายละเอียดดังต่อไปนี้
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          รายละเอียดการปฏิเสธ (Rejection Details)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">อนุมัติหัวหน้าส่วน (Section Approve)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${approveDisplayText || "-"}</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">หมายเหตุการปฏิเสธ (Rejection Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${close_detail || "-"}</td>
          </tr>
        </table> 
        <h2 style="color: #64c768ff; border-bottom: 2px solid #64c768ff; padding-bottom: 10px;">
          ข้อมูลผู้รับรอง
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ชื่อผู้อนุมัติ (Approved by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
          ? user[0]?.employee_fname_th +
          " " +
          (user[0]?.employee_lname_th || "")
          : (user[0]?.employee_fname_en || "") +
          " " +
          (user[0]?.employee_lname_en || "")
        }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"}</td>
          </tr>
        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;
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
          return_from_status_id: tempExplainStatus[0]?.id,
          complaint_status_id: tempExplainStatus[0]?.lov2,
          close_status: approveSelectionCode,
          mode: mode,

          request_company_id: dataelement?.respondent_company_id?.company_id
            ? Number(dataelement.respondent_company_id.company_id)
            : complaintMainData?.respondent_company_id
              ? Number(complaintMainData.respondent_company_id)
              : null,
          request_domain_id: dataelement?.respondent_domain_id || complaintMainData?.respondent_domain_id,
          request_department_id: dataelement?.respondent_department_id?.department_id
            ? Number(dataelement.respondent_department_id.department_id)
            : complaintMainData?.respondent_department_id
              ? Number(complaintMainData.respondent_department_id)
              : null,
          ComplaintFile:
            closeFiles?.filter((item: any) => item.file instanceof File)
              .map((item: any, index: number) => ({
                cf_type: "Close",
                complaint_id: complaintRootId,
                complaint_at_id: item.attachmentType,
                other:
                  dataphoto_Combobox?.find(
                    (opt: any) => opt.id === item.attachmentType
                  )?.lov2 === "Y"
                    ? item.otherText?.trim() || null
                    : null,
                explain_id: explainRootId,
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
        CurrentAccessModel: getCurrentAccessObject(
          employeeUsername,
          employeeDomain,
          screenName
        ),
        complaintstatusLog: {
          id: uuidv4(),
          complaint_id: complaintRootId,
          complaint_status_id: tempExplainStatus[0]?.lov2,
          user_name: user[0]?.employee_username,
          user_company_id: user[0]?.itasset_company_id,
          user_department_id: user[0]?.itasset_department_id,
          user_position: user[0]?.employee_position,
          user_email: user[0]?.employee_email,
        },
        emailBody: emailBodyHtml,
        emailSubject: emailSubject,
      };

      try {
        const complaintFormData = new FormData();
        complaintFormData.append(
          "complaintReturnJson",
          JSON.stringify(complaintReturnPayload)
        );
        closeFiles?.forEach((f: any) => {
          if (f.file instanceof File) {
            complaintFormData.append("closeFiles", f.file);
          }
        });

        const response = await _POST_FORMDATA(complaintFormData, "/Complaint/ComplaintReturn");
        if (response && response.status === "success") {
          FullSweetalert({
            title: "Success",
            text: `บันทึกข้อมูลสำเร็จ`,
            icon: "success",
          });
        } else {
          FullSweetalert({
            title: "Failed",
            text: `บันทึกไม่ข้อมูลสำเร็จ`,
            icon: "error",
          });
        }
      } catch {
      } finally {
        setIsLoadingScreen(false);
        handleClose();
        ComplaintGet();
      }
    }
  };

  // CREATE - Add Complaint
  const ExplainAdd = async () => {

    updateSessionStorageCurrentAccess('event_name', 'ExplainAdd');

    setSubmitCount((prev) => prev + 1);
    if (!validateExplainAdd()) {
      return;
    }

    const tempid = uuidv4();
    const tempApproveStep = (dataset_reporttype_inactive || []).filter(
      (val: any) => val["id"] === dataelement.report_type
    );
    const tempComplaintStatusList = await LovAll_Get(
      "Lead",
      respondent_domain_id,
      false,
      dataelement?.complaint_status_id,
      tempApproveStep[0]?.lov5
    );
    const tempComplaintStatus = tempComplaintStatusList;
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
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
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
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss.SSS")
          : null,
        cf_type: "Explain",
        create_by: user[0]?.employee_username || "",
        domain_id: user[0]?.employee_domain || "",
        ExplainTu: ExplainTuModel,
        ExplainDd: ExplainDdModel,
        ComplaintFile:
          explainFiles?.map((item: any, index: number) => ({
            cf_type: "Explain",
            complaint_id: complaintRootId,
            complaint_at_id: item.attachmentType,
            other:
              dataphoto_Combobox?.find(
                (opt: any) => opt.id === item.attachmentType
              )?.lov2 === "Y"
                ? item.otherText?.trim() || null
                : null,
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
      complaintstatusLog: {
        id: uuidv4(),
        complaint_id: complaintRootId,
        complaint_status_id: tempComplaintStatus.lov1,
        user_name: user[0]?.employee_username,
        user_company_id: user[0]?.itasset_company_id,
        user_department_id: user[0]?.itasset_department_id,
        user_position: user[0]?.employee_position,
        user_email: user[0]?.employee_email,
      },
      CurrentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
    };

    const formData = new FormData();
    formData.append("explainPayloadJson", JSON.stringify(explainPayload));

    if (explainFiles && explainFiles.length > 0) {
      explainFiles.forEach((fileItem: any) => {
        formData.append("explainFiles", fileItem.file);
      });
    }

    const email_casNumber = dataelement?.cas_number || complaintMainData?.cas_number || "-";
    const email_respondent_department_name =
      dataset_department?.find(
        (x: any) => x.department_id == dataelement?.respondent_department_id
      )?.department_name ||
      dataelement?.respondent_department_name ||
      "-";
    const email_toolsUsed =
      dataTooluseValue
        ?.map((item: any) => {
          const label = item.label || item.lov1 || item.name || "-";
          const otherText =
            item.isOther === "Y" && ToolOther ? " " + ToolOther : "";
          return "- " + label + otherText;
        })
        .join("<br/>") || "-";

    const email_decision =
      dataDecisionValue
        ?.map((item: any) => {
          const label = item.label || item.lov1 || item.name || "-";
          const otherText =
            item.isOther === "Y" && DecisionOther ? " " + DecisionOther : "";
          return "- " + label + otherText;
        })
        .join("<br/>") || "-";

    const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        เรียน หัวหน้าฝ่าย${email_respondent_department_name}
      </p>
      <p style="margin-top: 5px;">
        แจ้งเตือนปัญหาข้อร้องเรียนของรายการ CAS Number : ${email_casNumber} มีรายละเอียดดังต่อไปนี้
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #ff9800; border-bottom: 2px solid #ff9800; padding-bottom: 10px;">
          รายละเอียดคำชี้แจง (Explain Details)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">วันที่ชี้แจง (Date)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${responsible_date ? responsible_date.format("DD/MM/YYYY") : "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">กำหนดวันตรวจติดตามผลวันที่ (Follow-up Date)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${follow_up_date ? follow_up_date.format("DD/MM/YYYY") : "-"
      }</td>
          </tr>
          ${observation_analysis
        ? `<tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">การวิเคราะห์เบื้องต้นของข้อสังเกต (ObAnalysis)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${observation_analysis}</td>
          </tr>`
        : ""
      }
          ${email_toolsUsed && email_toolsUsed !== "-"
        ? `<tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">เครื่องมือที่ใช้ (Tools Used)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_toolsUsed}</td>
          </tr>`
        : ""
      }
          ${root_cause
        ? `<tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">คำอธิบายการวิเคราะห์ (Root Cause)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${root_cause}</td>
          </tr>`
        : ""
      }
          ${email_decision && email_decision !== "-"
        ? `<tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">การตัดสินใจเกี่ยวกับแนวทางการจัดการ (ของเสีย / สินค้าที่ไม่ผ่านเกณฑ์)  (Decision on Disposition)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_decision}</td>
          </tr>`
        : ""
      }
          ${corrective_action
        ? `<tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">การดำเนินการแก้ไข (Corrective Action)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${corrective_action}</td>
          </tr>`
        : ""
      }
          ${preventive_action_plan
        ? `<tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">แผนการป้องกันไม่ให้ปัญหาเกิดขึ้นซ้ำ (Preventive Action Plan)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${preventive_action_plan}</td>
          </tr>`
        : ""
      }
        </table>
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          ผู้ทำการชี้แจง (Respondent)
        </h2>
         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อผู้ชี้แจง (Explain by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
        ? user[0]?.employee_fname_th +
        " " +
        (user[0]?.employee_lname_th || "")
        : (user[0]?.employee_fname_en || "") +
        " " +
        (user[0]?.employee_lname_en || "")
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"
      }</td>
          </tr>

        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;

    formData.append("emailBody", emailBodyHtml);


    setIsLoadingScreen(true);
    try {
      const response = await _POST_FORMDATA(formData, "/Explain/ExplainAdd");

      if (response && response.status === "success") {
        // ✅ สร้าง payload สำหรับอัปเดตสถานะ Complaint
        const complaintEditPayload = {
          complaintModel: {
            id: complaintRootId,
            mode: "EXPLAIN",
            complaint_status_id: tempComplaintStatus.lov1,
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
    } catch {
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

  const ApproveScAdd = async () => {
    setSubmitCount((prev) => prev + 1);
    updateSessionStorageCurrentAccess("event_name", "ApproveScAdd");
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
    const tempApproveStep = (dataset_reporttype_inactive || []).filter(
      (val: any) => val["id"] === complaintMainData.report_type
    );

    const tempComplaintStatusList = await LovAll_Get(
      "Lead",
      respondent_domain_id,
      false,
      complaintMainData?.complaint_status_id,
      tempApproveStep[0]?.lov5
    );

    const tempComplaintStatus = tempComplaintStatusList;

    //ขั้นตอนการเตรียมลำดับการอนุมัติ (Approve Seq)
    const approveInfo = (datastatus || []).filter(
      (val: any) => val["lov_code"] === "APPROVED"
    );
    const approveSeq = approveInfo.filter(
      (val: any) => val["lov5"] == user[0].role_id
    );

    // หา explain_id และ nextSeq
    const explainRootId = approvalSource.id;

    // หา display text สำหรับ email
    const selectedApproveItem = (dataApprove_Combobox || []).find(
      (item: any) => item.lov_code === approveSelectionCode
    );
    const approveDisplayText =
      selectedApproveItem?.lov1 || approveSelectionCode || "-";

    const email_casNumber =
      dataelement?.cas_number || complaintMainData?.cas_number || "-";
    const emailSubject = `[CAS] แจ้งเตือนการ ตอบรับ / รับทราบ รายละเอียดข้อร้องเรียน CAS No.${email_casNumber || "-"
      }`;

    const isSkipqmr = tempApproveStep[0]?.lov5 && !tempApproveStep[0]?.lov5?.includes("2");

    const email_request_department_name =
      dataelement?.request_department_name ||
      complaintMainData?.request_department_name ||
      dataset_department?.find(
        (x: any) =>
          x.department_id == dataelement?.request_department_id ||
          x.department_id == complaintMainData?.request_department_id
      )?.department_name ||
      dataset_department_request?.find(
        (x: any) =>
          x.department_id == dataelement?.request_department_id ||
          x.department_id == complaintMainData?.request_department_id
      )?.department_name ||
      dataelement?.request_department_id ||
      complaintMainData?.request_department_id ||
      "-";

    const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        ${isSkipqmr ? `เรียน เจ้าหน้าที่ฝ่าย${email_request_department_name}`
        : `เรียน ผู้จัดการโรงงาน (QMR)`
      }
      </p>
      <p style="margin-top: 5px;">
        แจ้งเตือนปัญหาข้อร้องเรียนของรายการ CAS Number : ${email_casNumber} มีรายละเอียดดังต่อไปนี้
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #2196f3; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">
          รายละเอียดการอนุมัติ (Approval Details)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">อนุมัติหัวหน้าส่วน (Section Approve)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${approveDisplayText || "-"
      }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">หมายเหตุการอนุมัติ (Approve Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${approve_detail || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">หมายเหตุเพิ่มเติม (Approve Note)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${approve_note || "-"
      }</td>
          </tr>
        </table> 
        <h2 style="color: #64c768ff; border-bottom: 2px solid #64c768ff; padding-bottom: 10px;">
          ข้อมูลผู้รับรอง (Section Head)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ชื่อผู้อนุมัติ (Approved by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
        ? user[0]?.employee_fname_th +
        " " +
        (user[0]?.employee_lname_th || "")
        : (user[0]?.employee_fname_en || "") +
        " " +
        (user[0]?.employee_lname_en || "")
      }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"
      }</td>
          </tr>
        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;
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

    const approvePayload = {
      ExplaintApproveModel: {
        id: tempid,
        explain_id: explainRootId,
        approve_seq: approveSeq[0].lov3,
        complaint_status_id: tempComplaintStatus.lov1,
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
        respondent_domain_id: approvalSource?.respondent_domain_id,

        request_company_id: dataelement?.request_company_id?.company_id
          ? Number(dataelement.request_company_id.company_id)
          : complaintMainData?.request_company_id
            ? Number(complaintMainData.request_company_id)
            : null,
        request_domain_id: dataelement?.request_domain_id || complaintMainData?.request_domain_id,
        request_department_id: dataelement?.request_department_id?.department_id
          ? Number(dataelement.request_department_id.department_id)
          : complaintMainData?.request_department_id
            ? Number(complaintMainData.request_department_id)
            : null,
      },
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
      complaintstatusLog: {
        id: uuidv4(),
        complaint_id: complaintRootId,
        complaint_status_id: tempComplaintStatus.lov1,
        user_name: user[0]?.employee_username,
        user_company_id: user[0]?.itasset_company_id,
        user_department_id: user[0]?.itasset_department_id,
        user_position: user[0]?.employee_position,
        user_email: user[0]?.employee_email,
      },
      sendEmail: approveSelectionCode === "APPROVE",
      emailBody: emailBodyHtml,
      emailSubject: emailSubject,
      report_type: complaintMainData.report_type,
    };

    setIsLoadingScreen(true);

    try {
      // 🧩 บันทึกข้อมูล Approve
      const response = await _POST(
        approvePayload,
        "/ExplaintApprove/ExplaintApproveAdd"
      );

      if (response && response.status === "success") {

        const complaintEditPayload = {
          ComplaintModel: {
            id: currentExplainForApproval?.complaint_id,
            mode: "APPROVE_SC",
            complaint_status_id: tempComplaintStatus.lov1,
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
    setSubmitCount((prev) => prev + 1);
    updateSessionStorageCurrentAccess("event_name", "ApproveQcAdd");
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

    const tempApproveStep = (dataset_reporttype_inactive || []).filter(
      (val: any) => val["id"] === complaintMainData.report_type
    );

    const tempComplaintStatusList = await LovAll_Get(
      "Lead",
      respondent_domain_id,
      false,
      complaintMainData?.complaint_status_id,
      tempApproveStep[0]?.lov5
    );

    const tempComplaintStatus = tempComplaintStatusList;

    const approveInfo = (datastatus || []).filter(
      (val: any) => val["lov_code"] === "APPROVED"
    );
    const approveSeq = approveInfo.filter(
      (val: any) => val["lov5"] == user[0].role_id
    );
    // หา explain_id และ nextSeq
    const explainRootId = approvalSource.id;

    const selectedApproveItem = (dataApprove_Combobox || []).find(
      (item: any) => item.lov_code === approveSelectionCode
    );
    const approveDisplayText =
      selectedApproveItem?.lov1 || approveSelectionCode || "-";

    const email_casNumber =
      dataelement?.cas_number || complaintMainData?.cas_number || "-";
    const emailSubject = `[CAS] แจ้งเตือนการ ตอบรับ / รับทราบ รายละเอียดข้อร้องเรียน CAS No.${email_casNumber || "-"
      }`;

    const email_request_department_name =
      dataelement?.request_department_name ||
      complaintMainData?.request_department_name ||
      dataset_department?.find(
        (x: any) =>
          x.department_id == dataelement?.request_department_id ||
          x.department_id == complaintMainData?.request_department_id
      )?.department_name ||
      dataset_department_request?.find(
        (x: any) =>
          x.department_id == dataelement?.request_department_id ||
          x.department_id == complaintMainData?.request_department_id
      )?.department_name ||
      dataelement?.request_department_id ||
      complaintMainData?.request_department_id ||
      "-";

    const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        เรียน เจ้าหน้าที่ฝ่าย${email_request_department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        แจ้งเตือนปัญหาข้อร้องเรียนของรายการ CAS Number : ${email_casNumber} มีรายละเอียดดังต่อไปนี้
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #2196f3; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">
          รายละเอียดการอนุมัติ (Approval Details)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">อนุมัติผู้จัดการโรงงาน (QMR)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${approveDisplayText || "-"
      }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">หมายเหตุการอนุมัติ (Approve Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${qcapprove_detail || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">หมายเหตุเพิ่มเติม (Approve Note)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${qcapprove_note || "-"
      }</td>
          </tr>
        </table> 
        <h2 style="color: #64c768ff; border-bottom: 2px solid #64c768ff; padding-bottom: 10px;">
          ข้อมูลผู้รับรอง (Section Head)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ชื่อผู้อนุมัติ (Approved by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
        ? user[0]?.employee_fname_th +
        " " +
        (user[0]?.employee_lname_th || "")
        : (user[0]?.employee_fname_en || "") +
        " " +
        (user[0]?.employee_lname_en || "")
      }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"
      }</td>
          </tr>
        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;

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

    const approvePayload = {
      ExplaintApproveModel: {
        id: tempid,
        explain_id: explainRootId,
        approve_seq: approveSeq[0].lov3,
        complaint_status_id: tempComplaintStatus.lov1,
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
        respondent_domain_id: approvalSource?.respondent_domain_id,

        request_company_id: dataelement?.request_company_id?.company_id
          ? Number(dataelement.request_company_id.company_id)
          : complaintMainData?.request_company_id
            ? Number(complaintMainData.request_company_id)
            : null,
        request_domain_id: dataelement?.request_domain_id || complaintMainData?.request_domain_id,
        request_department_id: dataelement?.request_department_id?.department_id
          ? Number(dataelement.request_department_id.department_id)
          : complaintMainData?.request_department_id
            ? Number(complaintMainData.request_department_id)
            : null,
      },
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
      complaintstatusLog: {
        id: uuidv4(),
        complaint_id: complaintRootId,
        complaint_status_id: tempComplaintStatus.lov1,
        user_name: user[0]?.employee_username,
        user_company_id: user[0]?.itasset_company_id,
        user_department_id: user[0]?.itasset_department_id,
        user_position: user[0]?.employee_position,
        user_email: user[0]?.employee_email,
      },
      sendEmail: false,
      emailBody: emailBodyHtml,
      emailSubject: emailSubject,
    };

    setIsLoadingScreen(true);

    try {
      // 🧩 บันทึกข้อมูล Approve
      const response = await _POST(
        approvePayload,
        "/ExplaintApprove/ExplaintApproveAdd"
      );

      if (response && response.status === "success") {
        // ✅ หลังบันทึก Approve สำเร็จ → อัปเดตสถานะ Complaint
        const complaintEditPayload = {
          ComplaintModel: {
            id: currentExplainForApproval?.complaint_id,
            mode: "APPROVE_QC",
            complaint_status_id: tempComplaintStatus.lov1,
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

  const CloseAdd = async () => {
    setSubmitCount((prev) => prev + 1);
    updateSessionStorageCurrentAccess("event_name", "CloseAdd");
    const tempid = uuidv4();

    if (
      follow_up_date &&
      dayjs().startOf("day").isBefore(dayjs(follow_up_date).startOf("day"))
    ) {
      FullSweetalert({
        title: "แจ้งเตือน",
        text: "ยังไม่ถึงวันที่ตรวจติดตามผล ไม่สามารถปิดรายการได้",
        icon: "warning",
      });
      return;
    }

    const tempApproveStep = (dataset_reporttype_inactive || []).filter(
      (val: any) => val["id"] === complaintMainData.report_type
    );

    const tempComplaintStatusList = await LovAll_Get(
      "Lead",
      respondent_domain_id,
      false,
      complaintMainData?.complaint_status_id,
      tempApproveStep[0]?.lov5
    );

    const tempComplaintStatus = tempComplaintStatusList;
    // 🧩 Helper: หา explain_id ที่แท้จริงจาก dataelement
    const resolveExplainId = () => {
      return currentExplainForApproval?.id;
    };

    const email_respondent_department_name =
      dataelement?.respondent_department_name ||
      complaintMainData?.respondent_department_name ||
      dataset_department?.find(
        (x: any) =>
          x.department_id == dataelement?.respondent_department_id ||
          x.department_id == complaintMainData?.respondent_department_id
      )?.department_name ||
      dataset_department_respondent?.find(
        (x: any) =>
          x.department_id == dataelement?.respondent_department_id ||
          x.department_id == complaintMainData?.respondent_department_id
      )?.department_name ||
      dataelement?.respondent_department_id ||
      complaintMainData?.respondent_department_id ||
      "-";

    // หา display text สำหรับ email
    const selectedApproveItem = (dataApprove_Combobox || []).find(
      (item: any) => item.lov_code === approveSelectionCode
    );
    const approveDisplayText =
      selectedApproveItem?.lov1 || approveSelectionCode || "-";

    const email_casNumber =
      dataelement?.cas_number || complaintMainData?.cas_number || "-";
    const emailSubject = `[CAS] แจ้งเตือนการ ตอบรับ / รับทราบ รายละเอียดข้อร้องเรียน CAS No.${email_casNumber || "-"
      }`;

    const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        เรียน เจ้าหน้าที่ฝ่าย${email_respondent_department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        แจ้งเตือนการปิดปัญหาข้อร้องเรียน มีรายละเอียดดังต่อไปนี้
      </p>
      <b style="margin-top: 5px;">
        ** หากต้องการติดตามรายการข้อร้องเรียน สามารถติดตามได้ผ่านระบบ <a href="http://intranet.trrgroup.com/cas"style="color:#0b5ed7; text-decoration:underline;">[CAS] Corrective Action System </a>** 
      </b>
        <br />
        <h2 style="color: #5a5a5aff; border-bottom: 2px solid #5a5a5aff; padding-bottom: 10px;">
          รายละเอียดการปิดรายการ (Close Details)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ผลการตรวจติดตาม (Follow up)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${approveDisplayText || "-"
      }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">หมายเหตุการปิดรายการ (Close Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${close_detail || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">หมายเหตุเพิ่มเติม (Close Note)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${close_note || "-"
      }</td>
          </tr>
        </table> 
        <h2 style="color: #64c768ff; border-bottom: 2px solid #64c768ff; padding-bottom: 10px;">
          ข้อมูลผู้ปิดรายการ
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ชื่อผู้ปิดรายการ (Closed by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th
        ? user[0]?.employee_fname_th +
        " " +
        (user[0]?.employee_lname_th || "")
        : (user[0]?.employee_fname_en || "") +
        " " +
        (user[0]?.employee_lname_en || "")
      }</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตำแหน่ง (Position)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_position || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนก (Department)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_department_name || "-"
      }</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">โรงงาน (Factory)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.domain_name || "-"
      }</td>
          </tr>
        </table> 
        <p style="margin-top: 20px; font-size: 14px; color: #000000;">
        ขอแสดงความนับถือ,<br />
          CAS - Corrective Action System<br />
          Thai Roong Ruang Sugar Group
          <br /><br /><br />
          ****************************************************************************************<br />
          อีเมลฉบับนี้ เป็นการจัดส่งผ่านระบบอัติโนมัติ โดยท่านไม่สามารถตอบกลับผ่านเมลนี้ได้
      </p>
      </div>
    `;

    const explainRootId = resolveExplainId();
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
        cf_type: "Close",
        update_by: user[0]?.employee_username || "",
        domain_id: user[0]?.employee_domain || "",
        respondent_company_id:
          dataelement?.respondent_company_id
            ? Number(dataelement.respondent_company_id)
            : Number(complaintMainData?.respondent_company_id),
        respondent_domain_id:
          dataelement?.respondent_domain_id ||
          complaintMainData?.respondent_domain_id,
        respondent_department_id:
          dataelement?.respondent_department_id
            ? Number(dataelement.respondent_department_id)
            : Number(complaintMainData?.respondent_department_id),
        ComplaintFile:
          closeFiles?.filter((item: any) => item.file instanceof File)
            .map((item: any, index: number) => ({
              cf_type: "Close",
              complaint_id: complaintRootId,
              complaint_at_id: item.attachmentType,
              other:
                dataphoto_Combobox?.find(
                  (opt: any) => opt.id === item.attachmentType
                )?.lov2 === "Y"
                  ? item.otherText?.trim() || null
                  : null,
              explain_id: explainRootId,
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
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
      complaintstatusLog: {
        id: uuidv4(),
        complaint_id: complaintRootId,
        complaint_status_id: tempComplaintStatus.lov1,
        user_name: user[0]?.employee_username,
        user_company_id: user[0]?.itasset_company_id,
        user_department_id: user[0]?.itasset_department_id,
        user_position: user[0]?.employee_position,
        user_email: user[0]?.employee_email,
      },
      sendEmail: approveSelectionCode === "APPROVE",
      emailBody: emailBodyHtml,
      emailSubject: emailSubject,
    };
    const formData = new FormData();
    formData.append("closePayloadJson", JSON.stringify(closePayload));

    if (closeFiles && closeFiles.length > 0) {
      closeFiles.forEach((fileItem: any) => {
        formData.append("closeFiles", fileItem.file);
      });
    }

    setIsLoadingScreen(true);
    try {
      // 🧩 บันทึกข้อมูล Approve
      const response = await _POST_FORMDATA(formData, "/Explain/CloseAdd");
      if (response && response.status === "success") {
        const complaintId = currentExplainForApproval?.complaint_id;

        const complaintEditPayload = {
          complaintModel: {
            id: complaintId,
            mode: "CLOSE",
            complaint_status_id: tempComplaintStatus.lov1,
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
    } catch {
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

  const handleOnclickComplaintAdd = () => {
    resetForm();
    setdataelement(null);
    setOpenComplaintAdd(true);
  };

  const handleOnclickComplaintView = async (data: any) => {
    resetForm();
    Complaint_Get(data);
    setOpenComplaintView(true); // แล้วค่อยเปิด Dialog
  };

  const handleOnclickComplaintEdit = (data: any) => {
    resetForm();
    Complaint_Get(data);
    setOpenComplaintEdit(true);
  };

  const handleOnclickComplaintDelete = (data: any) => {
    resetForm();
    Complaint_Get(data);
    setOpenComplaintDelete(true);
  };

  // -------- Explain Dialog Handlers --------
  const handleOnclickExplain = (data: any) => {
    resetForm();
    setdataelement(data);
    setOpenExplain(true);
  };

  const handleOnclickReadExplain = async (data: any) => {
    resetForm();
    setdataelement(data);
    setOpenReadExplain(true);
  };

  const handleOnclickApproveSC = async (data: any, name: string) => {
    setAction(name);
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

  const handleOnclickExplainApproveSc = (explainData: any) => {
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

    //---------------------------------------------------------------------------------------
    // เอา report_type มาด้วย
    const reportType = complaintData?.report_type;

    if (reportType && dataset_reporttype_inactive) {
      const reportTypeObj = dataset_reporttype_inactive.find(
        (item: any) => item.id === reportType);

      if (reportTypeObj) {
        setdataelement({
          ...explainData,
          report_type: reportTypeObj.lov_code,
        });
      } else {
        setdataelement(explainData);
      }
    } else {
      setdataelement(explainData);
    }
    setOpenExplainApproveSc(true);
  };

  const handleOnclickReadClose = async (data: any) => {
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
  const handleOnclickComplainClose = async (data: any, name: string) => {
    //READ
    setAction(name);
    resetForm();
    setdataelement(data);
    const fullData = await Complaint_Get(data);
    if (fullData) {
      setComplaintMainData(fullData);
      setdataelement(fullData);
    }
    setOpenComplainClose(true);
  };

  const handleOnclickCloseHistory = async (data: any) => {
    resetForm();
    setdataelement(data);
    setOpenCloseHistory(true);
  };

  const handleOnclickPrint = async (data: any, name: string) => {
    resetForm();
    setdataelement(data);
    setOpenPrint(true);
  };

  // -------------------------  QC  ---------------------------//
  const handleOnclickApproveQC = async (data: any, name: string) => {
    setAction(name);
    resetForm();
    Complaint_Get(data);
    setOpenApproveQC(true);
    setdataelement(data);
  };

  useEffect(() => { }, [action]);

  const handleOnclickReadApproveQC = async (data: any) => {
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

  const handleOnclickExplainAdd = async (data: any) => {
    resetForm();
    setroot_cause("");
    setobservation_analysis("");
    setcorrective_action("");
    setpreventive_action_plan("");
    setdataToolUse([]);
    setToolOther("");
    setresponsible_date(null);
    setfollow_up_date(null);
    setPrevExplainFiles([]);

    // Clear file states to prevent old files from persisting
    setexplainFiles([]);
    // setcloseFiles([]);
    setcomplaintFiles([]);

    // ตั้งค่าวันที่ชี้แจงเป็นวันปัจจุบัน
    setresponsible_date(dayjs());

    // ✅ Save current complaint data before opening Explain Add
    if (dataelement) {
      setComplaintMainData(dataelement);
    }

    let latestExplainData: any = {};

    // ถ้ามี data ส่งมา ให้ใช้ data.id ในการดึงข้อมูล explain เก่า
    if (data && data.id) {
      try {
        const dataset = {
          complaint_id: data.id,
          CurrentAccessModel: getCurrentAccessObject(
            employeeUsername,
            employeeDomain,
            screenName
          ),
        };
        // เรียก API เพื่อดึง explain list ของ complaint นี้
        let response = await _POST(dataset, "/Explain/ExplainGet");

        if (response && response.status === "success" && Array.isArray(response.data)) {
          // หา explain ล่าสุด (เรียงตาม explain_seq หรือ timestamp ถ้ามี)
          // สมมติว่า response.data เรียงมาแล้ว หรือเราหาตัวที่มี seq มากสุด
          const explains = response.data;

          if (explains.length > 0) {
            // หา max seq
            const latestExplain = explains.reduce((prev: any, current: any) => {
              return (Number(prev.explain_seq) > Number(current.explain_seq)) ? prev : current
            });

            // Pre-populate ข้อมูลจาก latestExplain
            if (latestExplain) {
              latestExplainData = latestExplain;

              setroot_cause(latestExplain.root_cause || "");
              setobservation_analysis(latestExplain.observation_analysis || "");
              setcorrective_action(latestExplain.corrective_action || "");
              setpreventive_action_plan(latestExplain.preventive_action_plan || "");

              if (latestExplain.follow_up_date) {
                setfollow_up_date(dayjs(latestExplain.follow_up_date));
              }

              // ---------------- Map Tools Used ----------------
              if (latestExplain.explainTu && Array.isArray(latestExplain.explainTu)) {
                const matchedTools: any[] = [];
                let otherTextValue = "";

                latestExplain.explainTu.forEach((item: any) => {
                  const itemId = item.explain_tu_id || item.tool_id || item.lov_id || item.id;

                  const found = dataToolUse_Combobox?.find((opt: any) =>
                    String(opt.id) === String(itemId) ||
                    String(opt.lov_code) === String(itemId) ||
                    (item.tool_code && String(opt.lov_code) === String(item.tool_code))
                  );

                  if (found) {
                    // Avoid duplicates
                    if (!matchedTools.some(t => t.id === found.id)) {
                      matchedTools.push(found);
                    }
                    // Check Other
                    if (found.lov2 === "Y" && item.other) {
                      otherTextValue = item.other;
                    }
                  }
                });

                if (matchedTools.length > 0) {
                  setdataToolUse(matchedTools);

                  // ✅ Also populate dataToolUseValue for validation
                  const reducedArray = matchedTools.map((t) => ({
                    explain_tu_id: t.id,
                    label: t.lov1,
                    isOther: t.lov2,
                  }));
                  setdataToolUseValue(reducedArray);
                }
                if (otherTextValue) {
                  setToolOther(otherTextValue);
                }
              }

              // ---------------- Map Decision on Disposition ----------------
              if (latestExplain.explainDd && Array.isArray(latestExplain.explainDd)) {
                const matchedDecisions: any[] = [];
                let decisionOtherText = "";

                latestExplain.explainDd.forEach((item: any) => {
                  // Match by ID
                  const itemId = item.explain_dd_id || item.decision_id || item.lov_id || item.id;

                  const found = dataDecision_Combobox?.find((opt: any) =>
                    String(opt.id) === String(itemId) ||
                    String(opt.lov_code) === String(itemId) ||
                    (item.decision_code && String(opt.lov_code) === String(item.decision_code))
                  );

                  if (found) {
                    if (!matchedDecisions.some(d => d.id === found.id)) {
                      matchedDecisions.push(found);
                    }
                    // Check Other
                    if (found.lov2 === "Y" && item.other) {
                      decisionOtherText = item.other;
                    }
                  }
                });

                if (matchedDecisions.length > 0) {
                  setdataDecision(matchedDecisions);

                  // ✅ Also populate dataDecisionValue for validation
                  const reducedArray = matchedDecisions.map((dd) => ({
                    explain_dd_id: dd.id,
                    label: dd.lov1,
                    isOther: dd.lov2,
                  }));
                  setdataDecisionValue(reducedArray);
                }
                if (decisionOtherText) {
                  setDecisionOther(decisionOtherText);
                }
              }

              // ---------------- Map Files (Fetch from API & Merge to Editable List) ----------------
              if (latestExplain.id) {
                try {
                  const fileResponse = await _POST({
                    explain_id: latestExplain.id,
                    complaint_id: latestExplain.complaint_id || data.id,
                    cf_type: "Explain"
                  }, "/ComplaintFile/ComplaintFileGet");

                  if (fileResponse && fileResponse.status === "success" && Array.isArray(fileResponse.data)) {
                    // Map to ComplaintFile structure with real File object (fetch blob)
                    const mappedFiles = await Promise.all(fileResponse.data.map(async (file: any) => {
                      let fileObj: File;
                      try {
                        // Try to fetch the file content
                        const fetchUrl = file.full_path || file.img_url;
                        if (fetchUrl) {
                          const res = await fetch(fetchUrl);
                          const blob = await res.blob();
                          fileObj = new File([blob], file.user_file_name || "unknown", { type: file.file_type || blob.type });
                        } else {
                          throw new Error("No URL found");
                        }
                      } catch (err) {
                        console.error("Error fetching file content for previous explain:", err);
                        // Fallback to mock object (will not upload content but prevents crash)
                        fileObj = {
                          name: file.user_file_name || "unknown",
                          size: Number(file.file_size) || 0,
                          type: file.file_type || "",
                        } as File;
                      }

                      return {
                        file: fileObj,
                        attachmentType: file.complaint_at_id,
                        otherText: file.other,
                        original_file_name: file.user_file_name,
                        img_url: file.img_url,
                        full_path: file.full_path,
                        id: file.id
                      };
                    }));

                    setPrevExplainFiles(mappedFiles);
                  } else {
                    setPrevExplainFiles([]);
                  }
                } catch {
                  setPrevExplainFiles([]);
                }
              }
            }
          }
        }
      } catch {
      }
    }

    setOpenExplainAdd(true);
    // ใช้ข้อมูลที่ส่งมาจากหน้า Explain รายละเอียด
    if (data) {
      // ✅ Merge data but ensure Complaint ID (id) is preserved and not overwritten by explain data
      setdataelement({
        ...data,
        ...latestExplainData,
        id: data.id,
        complaint_id: data.id
      });
    } else {
      setdataelement(null);
    }
  };
  const handleOnclickExplainView = async (explainData: any, name: string) => {
    setAction(name);
    const complaintData = dataelement;

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
        // เตรียมตรวจสอบข้อมูลรายการอนุมัติ (เพื่อทำเงื่อนไข เปิด-ปิด กล่องแสดงผล)
        // approveData
        setisApproveQcBoxHidden(true);

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
        setqcapprove_detail(qcApprove?.approve_detail || "");
        setqcapprove_note(qcApprove?.approve_note || "");
        setdataQcapp(
          dataApprove_Combobox.find(
            (item: any) => item.lov_code === qcApprove.approve_status
          ) || null
        );
        // Note: QC approve radio (dataQcapp) will be set in ExplaintBody.tsx from dataelement
      } else {
        setisApproveQcBoxHidden(false);
      }
    }

    // เอา report_type มาด้วย
    const reportType = complaintData?.report_type;
    if (reportType && dataset_reporttype_inactive) {
      const reportTypeObj = dataset_reporttype_inactive.find(
        (item: any) => item.id === reportType
      );

      if (reportTypeObj) {
        setdataelement({
          ...explainData,
          report_type: reportTypeObj.lov_code,
        });
      } else {
        setdataelement(explainData);
      }
    } else {
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

  const handleOnclickExplainApproveQc = async (explainData: any) => {
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
      }
    }

    // เอา report_type มาด้วย
    const reportType = complaintData?.report_type;

    if (reportType && dataset_reporttype_inactive) {
      const reportTypeObj = dataset_reporttype_inactive.find(
        (item: any) => item.id === reportType);

      if (reportTypeObj) {
        setdataelement({
          ...explainData,
          report_type: reportTypeObj.lov_code,
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

  const handleOnclickComplainCloseAdd = async (explainData: any) => {
    resetForm();
    const complaintData = dataelement;
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
      }
    }

    // เอา report_type มาด้วย
    const reportType = complaintData?.report_type;

    if (reportType && dataset_reporttype_inactive) {
      const reportTypeObj = dataset_reporttype_inactive.find(
        (item: any) => item.id === reportType);

      if (reportTypeObj) {
        setdataelement({
          ...explainData,
          report_type: reportTypeObj.lov_code,
        });
      } else {
        setdataelement(explainData);
      }
    } else {
      setdataelement(explainData);
    }

    setOpenComplainCloseAdd(true);
    resetForm();
  };

  // Search Handlers
  const handleCloseSearch = () => {
    setdataReportTypeValue(null);
    setdataComplaintTypeValue_Combobox([]);
    setdataComplaintRsValue_Combobox([]);
    setdataphotoValue_Combobox([]);
    setdocumentDateSearch(null);
    setTextNameSearch({
      dataset_company: "",
      dataset_domain: "",
      dataset_department: "",
      report_code: "",
      cas_number: "",
      product_name: "",
      lot_no: "",
      complaint_status_label: "",
      dataset_stepcomplaint: "",
    });
    setSearchTrigger(true);
  };

  const handleCloseExplainView = () => {
    useEffect;
    if (complaintMainData) {
      setdataelement(complaintMainData);
    }
    setOpenExplainView(false);
  };

  const handleCloseExplainAdd = () => {
    if (complaintMainData) {
      // Force a new object reference to trigger useEffect in ComplaintBody
      setdataelement({ ...complaintMainData, _forceUpdate: Date.now() });
    }
    setOpenExplainAdd(false);
  };

  const handleCloseApproveScAdd = () => {
    if (complaintMainData) {
      // Force a new object reference to trigger useEffect in ComplaintBody
      setdataelement({ ...complaintMainData, _forceUpdate: Date.now() });
    }
    setOpenExplainApproveSc(false);
    setApproveSelectionCode(null);
  };

  const handleCloseApproveQcAdd = () => {
    if (complaintMainData) {
      // Force a new object reference to trigger useEffect in ComplaintBody
      setdataelement({ ...complaintMainData, _forceUpdate: Date.now() });
    }
    setOpenExplainApproveQc(false);
    setApproveSelectionCode(null);
  };

  const handleCloseAdd = () => {
    if (complaintMainData) {
      // Force a new object reference to trigger useEffect in ComplaintBody
      setdataelement({ ...complaintMainData, _forceUpdate: Date.now() });
    }
    setOpenComplainCloseAdd(false);
    setApproveSelectionCode(null);
    setCloseDetailError(false);
    setCloseNoteError(false);
  };

  // Close Dialog Handler
  const handleClose = () => {
    setOpenComplaintAdd(false);
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
    setOpenPrint(false);
    setApproveSelectionCode(null); // รีเซ็ตค่าเมื่อปิด Dialog

    if (isAcknowledgeUpdated) {
      ComplaintGet()
      setIsAcknowledgeUpdated(false);
    }
  };

  // =====================================================================================================
  // USEEFFECT - INITIALIZATION (from index.tsx and ComplaintRead.tsx)
  // =====================================================================================================

  const effectRan = React.useRef(false); // ป้องกัน run ซ้ำใน dev mode

  // Static useEffect
  React.useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const fetchData = async () => {
      try {
        const tempCheckItAdmin = await LovAll_Get("get_role");
        await LovAll_Get(null, null, tempCheckItAdmin);
        await LovAll_Get('get_inactive', null, tempCheckItAdmin);
        await DomainRelateGet();
        await mas_DomainGet(
          user[0]?.itasset_company_id,
          set_domain,
          user,
          isCallFuncLogOn
        );

        // ✅ Load Request Departments
        const reqDomain =
          dataelement?.request_domain_id || user[0]?.employee_domain;
        if (reqDomain) {
          await mas_DepartmentDomainGet(
            {
              domain_id: reqDomain,
              company_id:
                dataelement?.request_company_id || user[0]?.itasset_company_id,
            },
            setdataset_department_request,
            isCallFuncLogOn
          );
        }

        if (dataelement?.respondent_domain_id) {
          await mas_DepartmentGet_Complaint(
            {
              domain_id: dataelement.respondent_domain_id,
              company_id: dataelement.respondent_company_id,
            },
            setdataset_department,
            setdataset_department_respondent,
            user,
            isCallFuncLogOn,
            action
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const prepareComplaintStatus = async () => {

      // Get Report Type
      const tempReportType = await LovAll_Get("get_inactive");
    }
    prepareComplaintStatus();
  }, []);

  // Dynamic useEffect
  React.useEffect(() => {
    if (dataset_activeCompany) {
      CompanyGet();
    }

    if (dataset_complaintAction) {
      ComplaintGet();
    }
  }, [dataset_activeCompany, dataset_complaintAction]);

  // Filter complaint types based on selected report type (from ComplaintRead.tsx)
  React.useEffect(() => {
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

    setFilteredComplaintType(filtered);
    setFilteredComplaintRs(filteredRs);
    setFilteredpriority(filteredpriority);
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
      }
    };
    fetchSCApprove();
  }, [currentExplainForApproval, dataApprove_Combobox]);

  React.useEffect(() => {
    if (!TextNameSearch.dataset_company && user[0]?.itasset_company_id) {
      setTextNameSearch((prev) => ({
        ...prev,
        dataset_company: user[0].itasset_company_id,
        dataset_domain: "", // ⭐ สำคัญมาก
      }));

      set_domainrelate([]); // ⭐ กัน domain เก่าค้าง
    }
  }, [user]);

  React.useEffect(() => {
    if (!TextNameSearch.dataset_company) return;

    mas_DomainRelateGet(
      TextNameSearch.dataset_company,
      set_domainrelate,
      user,
      isCallFuncLogOn
    );
  }, [TextNameSearch.dataset_company]);
  React.useEffect(() => {
    if (!Array.isArray(domainrelate) || domainrelate.length === 0) return;
  }, [domainrelate]);

  React.useEffect(() => {
    if (
      !TextNameSearch.dataset_domain &&
      Array.isArray(domainrelate) &&
      domainrelate.length > 0 &&
      user[0]?.domain_name
    ) {
      const autoDomain = domainrelate.find(
        (item: any) => String(item.domain_name) === String(user[0].domain_name)
      );
      if (autoDomain) {
        setTextNameSearch((prev) => ({
          ...prev,
          dataset_domain: autoDomain.domain_id,
        }));

        handleDomainChange(autoDomain);
      }
    }
  }, [domainrelate, user]);

  React.useEffect(() => {
    if (!TextNameSearch.dataset_domain) return;

    mas_DepartmentGet_Complaint(
      {
        domain_id: TextNameSearch.dataset_domain,
        company_id: TextNameSearch.dataset_company,
      },
      setdataset_department,
      setdataset_department_respondent,
      isCallFuncLogOn,
      user,
      "Search"
    );
  }, [TextNameSearch.dataset_domain]);

  const search_report_code = dataset_reporttype?.filter(
    (item: any, index: number, self: any) =>
      index === self.findIndex((t: any) => t.lov_code === item.lov_code)
  ) || [];

  const search_step_code = dataset_stepcomplaint?.filter(
    (item: any, index: number, self: any) =>
      index === self.findIndex((t: any) => t.lov_code === item.lov_code)
  ) || [];

  const search_status_code = datastatus?.filter(
    (item: any, index: number, self: any) =>
      index === self.findIndex((t: any) => t.lov_code === item.lov_code && t.lov3 === item.lov3)
  ) || [];

  const statusOptions = React.useMemo(() => {
    return (search_status_code || []).map((item: any) => ({
      id: item.id,
      lov_code: item.lov_code,
      lov3: item.lov3,
      lov4: item.lov4,
      displayText: item.lov4
        ? `${item.lov_code} (${item.lov4})`
        : item.lov_code,
    }));
  }, [search_status_code]);

  const reportTypeOptions = React.useMemo(() => {
    return (search_report_code || []).map((item: any) => ({
      id: item.id,
      lov_code: item.lov_code,
      displayText: item.lov_code,
    }));
  }, [search_report_code]);


  // =====================================================================================================
  // RETURN SECTION - RENDER COMPONENT
  // =====================================================================================================
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
                handleCompanyChange(val); // ⭐ เรียกใหม่ตามรูปแบบเดียวกับที่แก้
                setTextNameSearch((prev) => ({
                  ...prev,
                  dataset_company: val?.company_id || "",
                  dataset_domain: "", // clear child
                  dataset_department: "" // clear child
                }));
              }}
              readonly={!isItAdmin}
            />
          </Grid>
          <Grid size={4}>
            <AutocompleteComboBox
              value={
                domainrelate?.find(
                  (item: any) =>
                    item.domain_id === TextNameSearch.dataset_domain
                ) ||
                domainrelate?.find(
                  (item: any) =>
                    String(item.domain_id) === String(user[0]?.domain_name)
                ) ||
                null
              }
              labelName="โรงงาน (Factory)"
              options={domainrelate || []}
              column="domain_name"
              setvalue={(val) => {
                handleDomainChange(val);
                setTextNameSearch((prev) => ({
                  ...prev,
                  dataset_domain: val?.domain_id || "", // เก็บแค่ id เป็น string
                  dataset_department: "" // clear child
                }));
              }}
              readonly={!isItAdmin || !TextNameSearch.dataset_company}
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
                setTextNameSearch((prev) => ({
                  ...prev,
                  dataset_department: val?.department_id || "", // เก็บแค่ id เป็น string
                }));
              }}
              readonly={!TextNameSearch.dataset_domain}
            />
          </Grid>

          <Grid size={4}>
            <label htmlFor="" className={`fs-5 py-2 sarabun-regular`}>
              ประเภทเอกสาร (Report Type)
            </label>
            <Autocomplete
              multiple
              sx={{
                bgcolor: grey[50],
                width: "100%",
              }}
              disablePortal
              value={(() => {
                const selectedIds = TextNameSearch.report_code
                  ? TextNameSearch.report_code.split(',') : [];
                if (selectedIds.length === 0) return [];

                const matchedCodes = new Set<string>();
                const result: any[] = [];

                selectedIds.forEach((id: string) => {
                  const found = dataset_reporttype.find((ds: any) => String(ds.id) === id);
                  if (found) {
                    const key = found.lov_code;
                    if (!matchedCodes.has(key)) {
                      matchedCodes.add(key);
                      const opt = reportTypeOptions.find(
                        (o: any) => o.lov_code === found.lov_code
                      );
                      if (opt) result.push(opt);
                    }
                  }
                });
                return result;
              })()}
              options={reportTypeOptions}
              disableCloseOnSelect
              getOptionLabel={(option: any) => option.displayText || ''}
              isOptionEqualToValue={(option: any, value: any) =>
                option.lov_code === value.lov_code
              }
              renderOption={(props, option: any, { selected }) => (
                <li {...props} key={option.lov_code}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.displayText || ''}
                </li>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option: any, index: number) => (
                  <Chip
                    label={option.displayText}
                    {...getTagProps({ index })}
                    key={`${option.lov_code}-${index}`}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={TextNameSearch.report_code ? '' : 'เลือกประเภทเอกสาร'}
                  size="small"
                />
              )}
              onChange={(_event, newValue: any[]) => {
                if (!newValue || newValue.length === 0) {
                  setTextNameSearch((prev: any) => ({
                    ...prev,
                    report_code: '',
                  }));
                  setdataReportTypeValue(null);
                  setReportTypeError(false);
                  return;
                }
                // เช็คว่า company ที่เลือกมีอยู่ใน dropdown จริงๆ (ไม่ใช่ค่า auto-init 63)
                const isCompanyValid = dataset_company?.some(
                  (c: any) => String(c.company_id) === String(TextNameSearch.dataset_company)
                );
                const allIds = newValue.flatMap((selected: any) =>
                  dataset_reporttype
                    .filter(
                      (item: any) =>
                        item.lov_code === selected.lov_code &&
                        (!isCompanyValid || String(item.lov_group) === String(TextNameSearch.dataset_company))
                    )
                    .map((item: any) => item.id)
                );
                setTextNameSearch((prev: any) => ({
                  ...prev,
                  report_code: allIds.join(','),
                }));
                setdataReportTypeValue(newValue);
                setReportTypeError(false);
              }}
            />
          </Grid>

          <Grid size={4}>
            <FullWidthTextField
              value={TextNameSearch.cas_number}
              labelName={"CAS Number"}
              placeholderlabel="กรุณากรอกหมายเลข CAS Number"
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
              placeholderlabel="กรุณากรอกชื่อสินค้า"
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
              placeholderlabel="กรุณากรอกหมายเลข Lot No./Bag No"
              onchange={(value) =>
                setTextNameSearch({ ...TextNameSearch, ...{ lot_no: value } })
              }
            />
          </Grid>

          <Grid size={4}>
            <AutocompleteComboBox
              value={
                search_step_code.find(
                  (item: any) => item.lov_code === TextNameSearch.dataset_stepcomplaint
                ) || null
              }
              labelName="ขั้นตอน (Action Step)"
              options={search_step_code}
              column="lov_code" // หรือชื่อ field ที่คุณต้องการแสดง
              setvalue={(val) => {
                setTextNameSearch({
                  ...TextNameSearch,
                  dataset_stepcomplaint: val?.lov_code || "",
                });
              }}
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
            <label htmlFor="" className={`fs-5 py-2 sarabun-regular`}>
              สถานะ (Status)
            </label>
            <Autocomplete
              multiple
              sx={{
                bgcolor: grey[50],
                width: "100%",
              }}
              disablePortal
              value={(() => {
                const selectedIds = TextNameSearch.complaint_status_label
                  ? TextNameSearch.complaint_status_label.split(',') : [];
                if (selectedIds.length === 0)
                  return [];

                const matchedCodes = new Set<string>();
                const result: any[] = [];

                selectedIds.forEach((id: string) => {
                  const found = datastatus.find((ds: any) => String(ds.id) === id);
                  if (found) {
                    const key = `${found.lov_code}||${found.lov3 || ''}`;
                    if (!matchedCodes.has(key)) {
                      matchedCodes.add(key);
                      const opt = statusOptions.find(
                        (o: any) => o.lov_code === found.lov_code && o.lov3 === found.lov3
                      );
                      if (opt) result.push(opt);
                    }
                  }
                });
                return result;
              })()
              }
              options={statusOptions}
              disableCloseOnSelect
              getOptionLabel={(option: any) => option.displayText || ''}
              isOptionEqualToValue={(option: any, value: any) =>
                option.lov_code === value.lov_code && option.lov3 === value.lov3
              }
              renderOption={(props, option: any, { selected }) => (
                <li {...props} key={`${option.lov_code}-${option.lov3 || ''}`}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.displayText || ''}
                </li>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option: any, index: number) => (
                  <Chip
                    label={option.displayText}
                    {...getTagProps({ index })}
                    key={`${option.lov_code}-${option.lov3 || index}`}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={TextNameSearch.complaint_status_label ? '' : 'เลือกสถานะ'}
                  size="small"
                />
              )
              }

              onChange={(_event, newValue: any[]) => {
                if (!newValue || newValue.length === 0) {
                  setTextNameSearch((prev: any) => ({
                    ...prev,
                    complaint_status_label: '',
                  }));
                  return;
                }
                // เช็คว่า company ที่เลือกมีอยู่ใน dropdown จริงๆ (ไม่ใช่ค่า auto-init 63)
                const isCompanyValid = dataset_company?.some(
                  (c: any) => String(c.company_id) === String(TextNameSearch.dataset_company)
                );
                // เช็คว่า domain ที่เลือกมีอยู่ใน dropdown จริงๆ
                const isDomainValid = domainrelate?.some(
                  (d: any) => String(d.domain_id) === String(TextNameSearch.dataset_domain)
                );
                const allIds = newValue.flatMap((selected: any) =>
                  datastatus
                    .filter(
                      (item: any) =>
                        item.lov_code === selected.lov_code &&
                        item.lov3 === selected.lov3 &&
                        (!isCompanyValid || String(item.lov_group) === String(TextNameSearch.dataset_company)) &&
                        (!isDomainValid || String(item.lov7) === String(TextNameSearch.dataset_domain))
                    )
                    .map((item: any) => item.id)
                );
                setTextNameSearch((prev: any) => ({
                  ...prev,
                  complaint_status_label: allIds.join(','),
                }));
              }}
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
        titlename={"สร้างรายการข้อร้องเรียน"}
        buttonText={"บันทึกและส่ง"}
        handleClose={handleClose}
        handlefunction={ComplaintAdd}
        handlesavedraft={ComplaintSavedraftAdd}
        buttonColor="success"
        element={
          <ComplaintBody
            action="Add"
            isItAdmin={isItAdmin}
            submitCount={submitCount}
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
        titlename={"รายการข้อร้องเรียน"}
        handleClose={handleClose}
        buttonColor="success"
        element={<ComplaintBody action="Read" isItAdmin={isItAdmin} />}
      />

      {/* For Status [NEW] */}
      <FuncDialog
        open={openComplaintEdit}
        dialogWidth="xl"
        openBottonHidden={true}
        hideReject={true}
        titlename={"แก้ไขข้อมูลรายการข้อร้องเรียน"}
        buttonText={"บันทึกและส่ง"}
        handleClose={handleClose}
        handlefunction={() => ComplaintEdit("SUBMIT")}
        handlesavedraft={() => ComplaintEdit("NEW")}
        hideSaveDraft={false}
        buttonColor="success"
        element={
          <ComplaintBody
            action="Edit"
            isItAdmin={isItAdmin}
            submitCount={submitCount}
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
        titlename={"ลบรายการข้อร้องเรียน"}
        buttonText={"ลบข้อมูล"}
        handleClose={handleClose}
        handlefunction={ComplaintDelete}
        buttonColor="error"
        element={<ComplaintBody action="Delete" isItAdmin={isItAdmin} />}
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
        titlename={"รายละเอียดข้อร้องเรียน"}
        handleClose={handleClose}
        handlereject={() => ComplaintReturn("EXPLAIN")}
        buttonColor="success"
        element={
          <ComplaintBody
            action="Explain"
            isItAdmin={isItAdmin}
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ExplainRead")
            }
            handleOnclickExplainApproveSc={handleOnclickExplainApproveSc}
            onAcknowledgeUpdate={() => setIsAcknowledgeUpdated(true)}
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
        titlename={"ข้อมูลและรายละเอียด"}
        handleClose={handleClose}
        cancelText="ปิด"
        buttonColor="success"
        element={
          <ComplaintBody
            action="ReadExplain"
            isItAdmin={isItAdmin}
            handleOpenAdd={() => handleOnclickExplainAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "ReadExplain")
            }
            handleOnclickExplainApproveSc={handleOnclickExplainApproveSc}
            onAcknowledgeUpdate={() => setIsAcknowledgeUpdated(true)}
          />
        }
      />

      {/* กดปุ่มจัดการ อนุมัติรายการ */}
      <FuncDialog
        open={openApproveSC}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"รายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ApproveSC"
            isItAdmin={isItAdmin}
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
        titlename={"ดูรายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ReadApproveSC"
            isItAdmin={isItAdmin}
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
        titlename={"รายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ApproveQC"
            isItAdmin={isItAdmin}
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
        titlename={"ดูรายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ReadApproveQC"
            isItAdmin={isItAdmin}
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
        titlename={"ปิดรายการข้อร้องเรียน"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="Close"
            isItAdmin={isItAdmin}
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
        titlename={"ดูรายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="ReadClose"
            isItAdmin={isItAdmin}
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
        titlename={"ดูรายละเอียด"}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ComplaintBody
            action="CloseHistory"
            isItAdmin={isItAdmin}
            handleOpenAdd={() => handleOnclickComplainCloseAdd(dataelement)}
            handleOnclickExplainView={(item) =>
              handleOnclickExplainView(item, "CloseHistory")
            }
          />
        }
      />

      <FuncDialog
        open={openPrint}
        dialogWidth="xl"
        modalHeight="100px"
        modalWidth="500px"
        openBottonHidden={false}
        handleClose={handleClose}
        buttonColor="success"
        element={
          <ReportBodyProps
            mode="complaint_report"
            open={openPrint}
            onClose={handleClose}
            tempReportParam={dataelement}
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
        titlename={"เพิ่มข้อมูลชี้แจง"}
        buttonText={"บันทึกและส่ง"}
        handleClose={handleCloseExplainAdd}
        handlefunction={ExplainAdd}
        hideSaveDraft={true}
        hideReject={true}
        buttonColor="success"
        element={
          <ExplaintBody
            isItAdmin={isItAdmin}
            action="ExplainAdd"
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
            onFollowUpDateChange={(val) => {
              setfollow_up_date(val);
              setFollowUpDateError(false);
            }}
            onObsAnalyChange={(val) => {
              setobservation_analysis(val);
              setObsAnalyError(false);
            }}
            onRootCauseChange={(val) => {
              setroot_cause(val);
              setRootCauseError(false);
            }}
            onToolUseChange={(val) => {
              setToolUseError(false);
              setToolUseOtherError(false);
            }}
            onToolOtherChange={(val) => {
              setToolUseOtherError(false);
            }}
            onDdChange={(val) => {
              setDdError(false);
              setDdOtherError(false);
            }}
            onDecisionOtherChange={(val) => {
              setDecisionOther(val);
              setDdOtherError(false);
            }}

            onCorrectiveActionChange={(val) => {
              setcorrective_action(val);
              setCorrectiveActionError(false);
            }}
            prevFiles={prevExplainFiles}
            onPreventiveActionPlanChange={(val) => {
              setpreventive_action_plan(val);
              setPreventiveActionPlanError(false);
            }}
            submitCount={submitCount}
          />
        }
      />

      <FuncDialog
        open={openExplainView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"ดูข้อมูล"}
        handleClose={handleCloseExplainView}
        handlefunction={ExplainGet}
        buttonColor="success"
        element={
          <ExplaintBody
            isItAdmin={isItAdmin}
            complaint_status_lable={dataelement?.complaint_status_lable}
            currentExplainForApproval={currentExplainForApproval}
            action={
              action.includes("Read") ? action : action + "Read"
            }
          />
        }
      />

      <FuncDialog
        open={openExplainApproveSc}
        dialogWidth="xl"
        openBottonHidden={true}
        hideSaveDraft
        hideReject={false}
        hideSaveSubmit={false}
        disableReject={
          !approveSelectionCode ||
          (approveSelectionCode !== "ADD" && approveSelectionCode !== "REJECT")
        }
        disableSaveSubmit={
          !approveSelectionCode || approveSelectionCode !== "APPROVE"
        }
        titlename={"อนุมัติรายการหัวหน้าแผนก"}
        buttonText={"อนุมัติ"}
        handlefunction={ApproveScAdd}
        handlereject={() => ComplaintReturn("APPROVE_SC")}
        handleClose={handleCloseApproveScAdd}
        buttonColor="success"
        element={
          <ExplaintBody
            isItAdmin={isItAdmin}
            action="ApproveSCAdd"
            handleOpenAdd={() => handleOnclickExplainApproveSc(dataelement)}
            onApproveChange={(value) => {
              setApproveSelectionCode(value?.lov_code ?? null);
              setScDetailError(false);
              setScNoteError(false);
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
            submitCount={submitCount}
          />
        }
      />

      {/* ------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------ */}

      {/* QC ADD */}
      <FuncDialog
        open={openExplainApproveQc}
        dialogWidth="xl"
        openBottonHidden={true}
        hideSaveDraft
        hideReject={false}
        hideSaveSubmit={false}
        disableReject={
          !approveSelectionCode ||
          (approveSelectionCode !== "ADD" && approveSelectionCode !== "REJECT")
        }
        disableSaveSubmit={
          !approveSelectionCode || approveSelectionCode !== "APPROVE"
        }
        titlename={"อนุมัติรายการผู้จัดการโรงงาน"}
        buttonText={"อนุมัติ"}
        handlefunction={ApproveQcAdd}
        handlereject={() => ComplaintReturn("APPROVE_QC")}
        handleClose={handleCloseApproveQcAdd}
        buttonColor="success"
        element={
          <ExplaintBody
            isItAdmin={isItAdmin}
            action="ApproveQCAdd"
            handleOpenAdd={() => handleOnclickExplainApproveQc(dataelement)}
            onApproveChange={(value) => {
              setApproveSelectionCode(value?.lov_code ?? null);
              setQcDetailError(false);
              setQcNoteError(false);
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
            submitCount={submitCount}
          />
        }
      />

      <FuncDialog
        open={openComplainCloseAdd}
        dialogWidth="xl"
        openBottonHidden={true}
        hideSaveDraft
        hideReject={false}
        hideSaveSubmit={false}
        disableReject={
          !approveSelectionCode ||
          (approveSelectionCode !== "ADD" && approveSelectionCode !== "REJECT")
        }
        disableSaveSubmit={
          !approveSelectionCode || approveSelectionCode !== "APPROVE"
        }
        titlename={"ปิดรายการคำชี้แจง"}
        buttonText={"ปิดรายการ"}
        handlefunction={CloseAdd}
        handlereject={() => ComplaintReturn("CLOSE")}
        handleClose={handleCloseAdd}
        buttonColor="success"
        element={
          <ExplaintBody
            isItAdmin={isItAdmin}
            action="CloseAdd"
            handleOpenAdd={() => handleOnclickComplainCloseAdd(dataelement)}
            onApproveChange={(value) => {
              setApproveSelectionCode(value?.lov_code ?? null);
              setCloseDetailError(false);
              setCloseNoteError(false);
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
            submitCount={submitCount}
          />
        }
      />
    </>
  );
}