// Consolidated Complaint Management System
// This file combines state management, variables, functions, and CRUD operations
// from index.tsx and ComplaintRead.tsx for better organization

import React, { useState, useMemo } from "react";
import {
  _GET,
  _POST,
  _POST_FORMDATA,
  _POST_SYNC,
  _POST_SYS_API,
} from "../../service/mas";
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
// import CompalintView from "./components/ComplaintRead";
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
// import moments from "moment";

// =====================================================================================================
// TYPE DEFINITIONS (from index.tsx and ComplaintRead.tsx)
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
interface ComplaintCarData {
  point_name: string;
  value: number;
}
interface ComplaintServiceData {
  service_name_TH: string;
  amount: string;
  contractor_name: number;
}

interface ComplaintImgData {
  id: string;
  file_name: string;
  path: number;
  location: string;
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

// =====================================================================================================
// MAIN COMPLAINT COMPONENT
// =====================================================================================================
export default function Complaint() {
  // =====================================================================================================
  // AUTHENTICATION & USER DATA (from index.tsx)
  // =====================================================================================================
  const user = cleanAccessData("userSession");
  const { setIsLoadingScreen } = useLayout();
  const { menuFuncData, userData } = useAuth();
  const { Customer, ProductGroup, CustomerAddress } = useData();

  // =====================================================================================================
  // CONTEXT VARIABLES (from useListComplaint hook)
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
    dataComplaintTypeValue_Combobox,
    dataComplaintType_Combobox, dataComplaintRsValue_Combobox, dataComplaintRs_Combobox,
    dataphotoValue_Combobox, dataphoto_Combobox, datapriorityValue_Combobox, datastatus,
    datapriority_Combobox, datapriority, PriorityLevel, clauseOther, phoTypeOther,
    complaintFiles, RunningModel, explain_id, approve_step, otherText,

    // Dataset Variables
    dataset_reporttype,
    dataset_department,
    dataset_company,
    dataset_domain,

    //Explaint
    dataTooluse,
    dataDecision,
    dataDecision_Combobox,
    dataApprove_Combobox,


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
    setPriorityLevel, setclauseOther, setphoTypeOther, setdataset_reporttype,
    setdataset_department, setdataset_company, setdataset_domain, setcomplaintFiles, setotherText,


    //set Explaint
    setdataToolUse,
    setdataToolUse_Combobox,
    setdataDecision_Combobox,
    setdataApprove_Combobox,
    setdataDecision


  } = useListComplaint();

  // =====================================================================================================
  // LOCAL STATE VARIABLES (from index.tsx)
  // =====================================================================================================
  const [selectDataTable, setSelectDataTable] = React.useState<any>([]);
  const [datalist, setdatalist] = React.useState<any>([]);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [statusMode, setstatusMode] = React.useState([]);
  const [openSync, setOpenSync] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openUpLoad, setOpenUpload] = React.useState(false);
  const [ComplaintBlocks, setComplaintBlocks] = useState<Block[]>([]);
  const [blockValidateErrors, setBlockValidateErrors] = useState<{ [index: number]: data_detail }>({});
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error">("success");
  const [successCardOpen, setSuccessCardOpen] = React.useState(false);
  const [successCardMessage, setSuccessCardMessage] = React.useState("");
  const [openAddlist, setOpenAddlist] = React.useState(false);

  const handleOpenAddList = () => setOpenAddlist(true);
  const handleCloseAddlist = () => setOpenAddlist(false);

  const [attach_type, setattach_type] = React.useState<any>([]);
  const [complaint_status, setcomplaint_status] = React.useState<any>([]);
  const [complaint_type, setcomplaint_type] = React.useState<any>([]);
  const [reference_standard, setreference_standard] = React.useState<any>([]);
  const [tool_use, settool_use] = React.useState<any>([]);
  const [decision_disposition, setdecision_disposition] = React.useState<any>([]);
  // Date Search Variables (from index.tsx)
  const [respondWithinSearch, setrespondWithinSearch] = React.useState<
    dayjs.Dayjs | undefined | null
  >(dayjs().subtract(1, "month"));
  const [documentDateSearch, setdocumentDateSearch] = React.useState<
    dayjs.Dayjs | undefined | null
  >(dayjs().subtract(1, "month"));
  const [endDateSearch, setEndDateSearch] = React.useState<
    dayjs.Dayjs | undefined | null
  >(dayjs().add(3, "month"));

  // Search Variables (from index.tsx)
  const [TextNameSearch, setTextNameSearch] = React.useState({
    report_code: "",
    cas_number: "",
    product_name: "",
    lot_no: "",
    datastatus: "",
  });

  // Additional State Variables (from ComplaintRead.tsx)
  const [ComplaintCarData, setComplaintCarData] = useState<
    ComplaintCarData[] | null
  >(null);
  const [ComplaintServiceData, setComplaintServiceData] = useState<
    ComplaintServiceData[] | null
  >(null);
  const [ComplaintImgData, setComplaintImgData] = useState<
    ComplaintImgData[] | null
  >(null);
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [startDueDate, setStartDueDate] = React.useState<
    dayjs.Dayjs | undefined | null
  >();
  const [endDueDate, setEndDueDate] = React.useState<
    dayjs.Dayjs | undefined | null
  >();
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
  const [lotNoError,setLotNoError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [complaintTypeError, setComplaintTypeError] = useState(false);
  const [otherTypeError, setOtherTypeError] = useState(false);
  const [complaintRsError, setComplaintRsError] = useState(false);
  const [otherRsError, setOtherRsError] = useState(false);
  const [clauseRsError, setClauseRsError] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [priorityError, setPriorityError] = useState(false);


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
    setValue(newValue);
  };

  const splitByDot = (str: any) => {
    return str.split('.');
  };

  // Update Complaint ID Functions (from index.tsx)
  function compTypeUpdateCompId(
    dataComplaintTypeValue_Combobox: any,
    complaintid: string,
    compTypeOther: string
  ) {
    const updatedData = dataComplaintTypeValue_Combobox.map((item: any) => {
      console.log("🧡🧡item", item)
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
    const updatedData = dataComplaintRsValue_Combobox.map((item: any) => {
      console.log("💚💚item", item)
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
    const paddingYear = String(new Date().getFullYear() % 100).padStart(2, '0');

    return paddingYear;
  }

  // Update Complaint ID Functions (from index.tsx)
  function expToolUpdateCompId(
    dataTooluseValue: any,
    explain_id: string,
    ToolOther: string
  ) {
    const updatedData = dataTooluseValue.map((item: any) => {
      console.log("🧡🧡item", item)
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
    ToolOther: string
  ) {
    const updatedData = dataDecisionValue.map((item: any) => {
      console.log("🧡🧡item", item)
      return {
        ...item,
        explain_id: explain_id,
        other: item.isOther === "Y" ? (ToolOther?.trim() || null) : null

      };
    });
    return updatedData;
  }


  // =====================================================================================================
  // API FUNCTIONS - DATA RETRIEVAL (from index.tsx)
  // =====================================================================================================

  // Get Report Types
  // const ReportType_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_group: "TRR.TRRGROUP.COM",
  //       lov_type: "report_type",
  //     };
  //     const response = await _POST(dataset, "/Lov/LovGet");
  //     if (response && response.status === "success") {
  //       console.log("❇️ Call [Lov/LovGet] -> report_type :", response.data);
  //       setdataset_reporttype(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };

  // Get Complaint Types
  // const ComplaintType_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_group: "TRR.TRRGROUP.COM",
  //       lov_type: "complaint_type",
  //     };
  //     const response = await _POST(dataset, "/Lov/LovGet");
  //     if (response && response.status === "success") {
  //       console.log("❇️ Call [Lov/LovGet] -> complaint_type :", response.data);
  //       setdataComplaintType_Combobox &&
  //         setdataComplaintType_Combobox(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };

  // Get lovGet
  const LovAll_Get = async () => {
    console.log(
      "🕒 Call Function : [LovAll_Get] at",
      // moments().format("YYYY-MM-DD HH:mm:ss")
    );

    try {
      const dataset = {
        lov_group: "TRR.TRRGROUP.COM",
        lov_type:
          "report_type,complaint_type,reference_standard,attach_type,complaint_status,tool_use,decision_disposition,approve_select",
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

        console.log("📌 Raw Data:", lovData);
        console.log("📂 Grouped by lov_type:", grouped);
        console.log("📂 datastatus:", (grouped["complaint_status"]));

        // ตัวอย่างการ set state
        setdataset_reporttype?.(grouped["report_type"] || []);
        setdataComplaintType_Combobox?.(grouped["complaint_type"] || []);
        setdataComplaintRs_Combobox?.(grouped["reference_standard"] || []);
        setdataphoto_Combobox?.(grouped["attach_type"] || []);
        setdatastatus?.(grouped["complaint_status"] || []);
        setdataToolUse_Combobox?.(grouped["tool_use"] || []);
        setdataDecision_Combobox?.(grouped["decision_disposition"] || []);
        setdataApprove_Combobox?.(grouped["approve_select"] || []);
      }
    } catch (e) {
      console.log("error:", e);
    }
  };
  // Get Complaint Reference Standards
  // const ComplaintRs_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_group: "TRR.TRRGROUP.COM",
  //       lov_type: "reference_standard",
  //     };
  //     const response = await _POST(dataset, "/Lov/LovGet");
  //     if (response && response.status === "success") {
  //       console.log(
  //         "❇️ Call [Lov/LovGet] -> reference_standard :",
  //         response.data
  //       );
  //       setdataComplaintRs_Combobox &&
  //         setdataComplaintRs_Combobox(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };

  // Get Photo Attachment Types
  // const photo_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_group: "TRR.TRRGROUP.COM",
  //       lov_type: "attach_type",
  //     };
  //     const response = await _POST(dataset, "/Lov/LovGet");
  //     if (response && response.status === "success") {
  //       console.log("❇️ Call [Lov/LovGet] -> attach_type :", response.data);
  //       setdataphoto_Combobox && setdataphoto_Combobox(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };

  // Get Priority Levels
  const priority_Get = async () => {
    try {
      const dataset = {
        lov_group: "SYSTEM",
        lov_type: "priority_level",
      };
      const response = await _POST(dataset, "/Lov/LovGet");
      if (response && response.status === "success") {
        console.log("❇️ Call [Lov/LovGet] -> priority_level :", response.data);
        setdatapriority_Combobox && setdatapriority_Combobox(response.data);
      }
    } catch (e) {
      console.log("error:", e);
    }
  };

  // Get Domain Data
  const CasDomainGet = async () => {
    try {
      const dataset = {};
      const response = await _POST(dataset, "/Complaint/CasDomainGet");
      if (response && response.status === "success") {
        console.log(
          "❇️ Call [Complaint/CasDomainGet] -> Domain_Get :",
          response.data
        );
        if (Array.isArray(response.data)) {
          let domain = response.data.filter(
            (item: any) => item.domain_id === "TRRGROUP.COM"
          );
          if (domain) {
            setdataset_domain(domain);
            setdataset_company(domain);
          }
        }
      }
    } catch (e) {
      console.log("error:", e);
    }
  };

  // Get Department Domain Data
  const CasDepartmentDomainGet = async () => {
    try {
      const dataset = {
        domain_id: "TRRGROUP.COM",
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
      }
    } catch (e) {
      console.log("error:", e);
    }
  };
  // Get Complaint Status Data
  // const complaint_status_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_group: "TRR.TRRGROUP.COM",
  //       lov_type: "complaint_status",
  //     };
  //     const response = await _POST(dataset, "/Lov/LovGet");
  //     if (response && response.status === "success") {
  //       console.log(
  //         "❇️ Call [Lov/LovGet] -> complaint_status_Get :",
  //         response.data
  //       );
  //       setdatastatus && setdatastatus(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };

  // Get Tool Use
  // const ToolUse_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_group: "TRR.TRRGROUP.COM",
  //       lov_type: "tool_use",
  //     };
  //     const response = await _POST(dataset, "/Lov/LovGet");
  //     if (response && response.status === "success") {
  //       console.log("❇️ Call [Lov/LovGet] -> tool_use :", response.data);
  //       setdataToolUse &&
  //         setdataToolUse(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };

  // Get decision_disposition
  // const Decision_Get = async () => {
  //   try {
  //     const dataset = {
  //       lov_group: "TRR.TRRGROUP.COM",
  //       lov_type: "decision_disposition",
  //     };
  //     const response = await _POST(dataset, "/Lov/LovGet");
  //     if (response && response.status === "success") {
  //       console.log("❇️ Call [Lov/LovGet] -> decision_disposition :", response.data);
  //       setdataDecision &&
  //         setdataDecision(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };



  // =====================================================================================================
  // API FUNCTIONS - CRUD OPERATIONS (from index.tsx)
  // =====================================================================================================

  // READ - Get Complaints
  const Complaint_Get = async () => {

    setIsLoadingScreen(true)
    const dataset = {
      user_id: user[0]?.employee_username,
      domain_id: user[0]?.employee_domain,
      department_id: user[0]?.itasset_department_id,
      company_id: user[0]?.itasset_company_id,
      // cas_number: TextNameSearch.cas_number,
      // product_name: TextNameSearch.product_name,
      // lot_no: TextNameSearch.lot_no,
    };

    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      console.log(response, "response_Get");
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
                    handleOnclickMenuView(el);
                  } 
                  else if (name === "Edit") {
                    handleOnclickMenuEdit(el);
                  }
                   else if (name === "Delete") {
                    handleOnclickMenuDelete(el);
                  }
                }}
              />
            );
            el.ACTION = ACTION;
            console.log("el.acknowledge_flag", el.acknowledge_flag)
            el.complaint_status_label = (
              <BasicChips label={`${el.complaint_status_label}`} acknowledge={el.acknowledge_flag}></BasicChips>
            );
            responseData.push(el);
          });
        }
        console.log(
          "⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️",
          responseData,
          "⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️"
        );
        setdatalist(responseData);
      }
    } catch (e) {
      console.log("error");
    }
  };

  // READ - Search Complaints
  const ListSearchGet = async () => {
    setIsLoadingScreen(true);
    const dataset = {
      report_code: TextNameSearch.report_code || null,
      cas_number: TextNameSearch.cas_number ? TextNameSearch.cas_number : null,
      product_name: TextNameSearch.product_name ? TextNameSearch.product_name : null,
      lot_no: TextNameSearch.lot_no ? TextNameSearch.lot_no : null,
      status: TextNameSearch.datastatus || null,
      respond_date_within: respondWithinSearch || null, // รีเซ็ตเป็น null ถ้าไม่ได้เลือก
      doc_date: documentDateSearch || null,
    }
    console.log("😍😍Search payload:", dataset);
    console.log("😍😍TextNameSearch:", TextNameSearch);
    console.log("😍😍TextNameSearch.report_code:", TextNameSearch.report_code)
    console.log("😍😍TextNameSearch.datastatus:", TextNameSearch.datastatus)
    console.log("😍😍respondWithinSearch", respondWithinSearch)
    try {
      let response = await _POST(dataset, "/ListSearch/ListSearchGet");
      console.log(response, "response_Get");
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
                    handleOnclickMenuView(el);
                  } else if (name === "Edit") {
                    handleOnclickMenuEdit(el);
                  } else if (name === "Delete") {
                    handleOnclickMenuDelete(el);
                  }
                }}
              />
            );
            el.ACTION = ACTION;
            console.log("el.acknowledge_flag", el.acknowledge_flag)
            el.complaint_status_label = (
              <BasicChips label={`${el.complaint_status_label}`} acknowledge={el.acknowledge_flag}></BasicChips>
            );
            responseData.push(el);
          });
        }
        setdatalist(responseData);
        console.log("raw response.data:", response.data); // เช็คว่ามีกี่แถวจริง ๆ\
        console.log("mapped responseData:", responseData); // เช็คว่ามีกี่แถวหลัง map
      }
    } catch (e) {
      console.log("error");

    }
  };

  //validate
  const validateBeforeAdd = () : boolean => {
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
      console.log("❌ Report Type validation failed");
      setReportTypeError(true);
      document.getElementById("reportTypeField")?.focus();
      return false; // หยุดการตรวจสอบส่วนอื่น
    }
    console.log("✅ Report Type validation passed");

    // Validate Date of Detection
    if (!date_of_detection) {
      setDateOfDetectionError(true);
      valid = false;
    }

    // Validate Department/Area of Detection
    if (!respondent_department_id || !respondent_department_id.itasset_department_id) {
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


    // Validate Complaint Rs - ตรวจสอบตาม Report Type
    const reportTypeCode = dataReportTypeValue?.lov_code;
    console.log("🔍 Report Type Code:", reportTypeCode);
    
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

    // Validate Other Rs (if complaint rs has "Other" selected) - เฉพาะ NCR เท่านั้น
    if (reportTypeCode === "NCR" && dataComplaintRsValue_Combobox && dataComplaintRsValue_Combobox.some((item: any) => item.isClause === "Other")) {
      if (!compRsOther || compRsOther.trim() === "") {
        console.log("❌ Other Rs validation failed for NCR");
        setOtherRsError(true);
        valid = false;
      } else {
        console.log("✅ Other Rs validation passed for NCR");
      }
    }

    // Validate Clause Rs (if complaint rs has "Clause" selected) - เฉพาะ NCR เท่านั้น
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

    // Validate Priority
    console.log("🔍 Priority validation - datapriorityValue_Combobox:", datapriorityValue_Combobox);
    if (!datapriorityValue_Combobox || datapriorityValue_Combobox.trim() === "") {
      console.log("❌ Priority validation failed");
      setPriorityError(true);
      valid = false;
    } else {
      console.log("✅ Priority validation passed");
    }

    console.log("🔍 Final validation result:", valid);
    return valid;
  }


  // CREATE -SaveDraft Add Complaint
  const ComplaintSavedraftAdd = async () => {
    console.log("Departtttt", request_department_id?.itasset_department_id);
    console.log("Departtttt", request_department_id?.itasset_department_id);
    console.log("🤍🤍dataComplaintTypeValue_Combobox", dataComplaintTypeValue_Combobox);

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
        request_company_id: request_company_id?.itasset_company_id
          ? Number(request_company_id.itasset_company_id)
          : undefined,
        request_domain_id: user[0]?.employee_domain,
        request_department_id: user[0]?.itasset_company_id || "",
        request_position: user[0]?.employee_position || "",
        request_email: user[0]?.employee_email || "",
        request_phone: user[0]?.employee_tel || "",
        request_date: new Date().toISOString(),
        respondent_company_id: respondent_company_id?.itasset_company_id
          ? Number(respondent_company_id.itasset_company_id)
          : undefined,
        respondent_domain_id: respondent_domain_id?.domain_id,
        respondent_department_id:
          respondent_department_id?.itasset_department_id
            ? Number(respondent_department_id.itasset_department_id)
            : undefined,
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

      Complaint_Get();
    }
  };

  // CREATE - Add Complaint
  const ComplaintAdd = async () => {
    console.log("Departtttt", request_department_id?.itasset_department_id);
    console.log("Departtttt", request_department_id?.itasset_department_id);
    console.log("🤍🤍dataComplaintTypeValue_Combobox", dataComplaintTypeValue_Combobox);

    if(!validateBeforeAdd()){
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
        date_of_detection: date_of_detection
          ? date_of_detection
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second())
            .format("YYYY-MM-DDTHH:mm:ss")
          : null,
        request_name: user[0]?.employee_username || "",
        request_company_id: request_company_id?.itasset_company_id
          ? Number(request_company_id.itasset_company_id)
          : undefined,
        request_domain_id: user[0]?.employee_domain,
        request_department_id: user[0]?.itasset_company_id || "",
        request_position: user[0]?.employee_position || "",
        request_email: user[0]?.employee_email || "",
        request_phone: user[0]?.employee_tel || "",
        request_date: new Date().toISOString(),
        respondent_company_id: respondent_company_id?.itasset_company_id
          ? Number(respondent_company_id.itasset_company_id)
          : undefined,
        respondent_domain_id: respondent_domain_id?.domain_id,
        respondent_department_id:
          respondent_department_id?.itasset_department_id
            ? Number(respondent_department_id.itasset_department_id)
            : undefined,
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

      Complaint_Get();
    }
  };


  // CREATE - Edit Complaint
  const ComplaintEdit = async () => {
    // console.log("Departtttt", dataelement?.request_domain_id);
    // console.log("Departtttt", request_department_id?.itasset_department_id);
    // console.log("Departtttt", request_department_id?.itasset_department_id);
    // console.log("🤍🤍dataComplaintTypeValue_Combobox", dataComplaintTypeValue_Combobox);
    console.log("ฟหกฟหกฟหกcomplaintFiles", complaintFiles);
    const tempid = uuidv4();
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
        respondent_department_id: respondent_department_id?.itasset_department_id
          ? Number(respondent_department_id.itasset_department_id)
          : undefined,
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
        complaint_status_id: "TRR_CS_SUBMIT",
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
              //complaint_id: tempid,
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
      Complaint_Get();
    }
  };

  // CREATE - Delete Complaint
  const ComplaintDelete = async () => {
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
      Complaint_Get();
    }
  };


  // READ - Preview Complaint (from ComplaintRead.tsx)
  const previewComplaint = async () => {
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

    const tempid = uuidv4();
    // เตรียม Models
    const complainttypeModel = dataComplaintTypeValue_Combobox
      ? expToolUpdateCompId(
        dataComplaintTypeValue_Combobox,
        tempid,
        compTypeOther
      )
      : null;

    const complaintRsModel = dataComplaintRsValue_Combobox
      ? expDecisionUpdateCompId(
        dataComplaintRsValue_Combobox,
        tempid,
        compRsOther,
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
        request_company_id: request_company_id?.itasset_company_id
          ? Number(request_company_id.itasset_company_id)
          : undefined,
        request_domain_id: request_domain_id?.domain_id,
        request_department_id: user[0]?.itasset_company_id || "",
        request_position: user[0]?.employee_position || "",
        request_email: user[0]?.employee_email || "",
        request_phone: user[0]?.employee_tel || "",
        request_date: new Date().toISOString(),
        respondent_company_id: respondent_company_id?.itasset_company_id
          ? Number(respondent_company_id.itasset_company_id)
          : undefined,
        respondent_domain_id: respondent_domain_id?.domain_id,
        respondent_department_id:
          respondent_department_id?.itasset_department_id
            ? Number(respondent_department_id.itasset_department_id)
            : undefined,
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
        complaint_status_id: "TRR_CS_SUBMIT",
        create_by: user[0]?.employee_username || "",
        action_type: null,
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

      Complaint_Get();
    }
  };

  // =====================================================================================================
  // EVENT HANDLERS (from index.tsx)
  // =====================================================================================================

  // Dialog Handlers
  const handleOnclickMenuSync = () => {
    setOpenSync(true);
  };

  const handleOnclickMenuAdd = () => {
    resetForm();
    setOpenAdd(true);
  };

  const handleOnclickMenuView = (data: any) => {
    resetForm();
    setdataelement(data); // ตั้งค่า dataelement ก่อน
    setOpenView(true); // แล้วค่อยเปิด Dialog
  };

  const handleOnclickMenuEdit = (data: any) => {
    resetForm();
    setOpenEdit(true);
    setdataelement(data);
  };

  const handleOnclickMenuDelete = (data: any) => {
    resetForm();
    setOpenDelete(true);
    setdataelement(data);
  };

  const handleOnclickMenuUpload = () => {
    setOpenUpload(true);
  };

  const handleTableButtonClick = (func_name: string) => {
    switch (func_name) {
      case "Add":
        handleOnclickMenuAdd();
        break;
      case "Upload":
        handleOnclickMenuUpload();
        break;
      case "Print":
        console.log("Print clicked");
        break;
      default:
        console.warn("No handler for", func_name);
    }
  };

  // Search Handlers
  const handleCloseSearch = () => {
    setdataReportTypeValue(null);
    setdataComplaintTypeValue_Combobox("");
    setdataComplaintRsValue_Combobox("");
    setdataphotoValue_Combobox("");
    setrespondWithinSearch(null);
    setdocumentDateSearch(null);
    setTextNameSearch({
      report_code: "",
      cas_number: "",
      product_name: "",
      lot_no: "",
      datastatus: "",
    });
    Complaint_Get()
  };

  // Close Dialog Handler
  const handleClose = () => {
    setOpenAdd(false);
    setOpenSync(false);
    setOpenView(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setOpenUpload(false);
    resetForm();
  };

  // Set Data Handler
  const setData = (data: any) => {
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
    Complaint_Get();
    LovAll_Get();
    // ReportType_Get();
    // ComplaintType_Get();
    // ComplaintRs_Get();
    // photo_Get();
    priority_Get();
    CasDomainGet();
    CasDepartmentDomainGet();
    // complaint_status_Get();
    // ToolUse_Get();
    // Decision_Get();
  }, []);


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
  // RENDER COMPONENT (from index.tsx)
  // =====================================================================================================
  return (
    <>
      {/* Search Section */}
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
          <label className="sarabun-regular-datatable">ค้นหา</label>
        </div>
        <Divider sx={{ my: 0.1, borderColor: "#F29739" }} />
        <Grid container spacing={2} mt={2}>
          <Grid size={4}>
            <AutocompleteComboBox
              value={dataset_reporttype?.find(
                (item: any) => item.id === TextNameSearch.report_code
              ) || null}
              labelName="ประเภทเอกสาร (Report Type)"
              options={dataset_reporttype || []}
              column="lov_code" // หรือชื่อ field ที่คุณต้องการแสดง
              // setvalue={(val) =>
              //   setTextNameSearch({
              //     ...TextNameSearch,
              //     report_code: val?.id || "", // เก็บแค่ id เป็น string
              //   })
              // }
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
          {/* <Grid size={4}>
            <AutocompleteComboBox
              value={datastatus}
              labelName={"สถานะ (Status)"}
              options={datastatus}
              column="lov_code"
              setvalue={(val) => setdatastatus(val)}
            />
          </Grid> */}
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
              labelName={"ตอบกลับภายในวันที่ (Respond Within)"}
              value={respondWithinSearch}
              handleChange={setrespondWithinSearch}
            />
          </Grid>
          <Grid size={4}>
            <DesktopDatePickers
              labelName={"วันที่ออกเอกสาร (Document Issuance Date)"}
              value={documentDateSearch}
              handleChange={setdocumentDateSearch}
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
              handleonClick={ListSearchGet}
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
              onClick={handleOnclickMenuAdd}
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
        open={openAdd}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={"Complaint // เพิ่มข้อมูล"}
        handleClose={handleClose}
        handlefunction={ComplaintAdd}
        handlesavedraft={ComplaintSavedraftAdd}
        colorBotton="success"
        element={
          <ComplaintBody
            action="Add"
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
              Other_Type:  otherTypeError,
              Complaint_Rs: complaintRsError,
              Other_Rs: otherRsError,
              Clause_Rs : clauseRsError,
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
        open={openView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"Complaint // ดูข้อมูล"}
        handleClose={handleClose}
        colorBotton="success"
        element={<ComplaintBody
          action="Read"
        />}
      />


      <FuncDialog
        open={openEdit}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={'Complaint // แก้ไขข้อมูล'}
        handleClose={handleClose}
        handlefunction={ComplaintEdit}
        colorBotton="success"
        element={<ComplaintBody
          action="Edit"
        />}
      />

      <FuncDialog
        open={openDelete}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={'Complaint // ลบข้อมูล'}
        handleClose={handleClose}
        handlefunction={ComplaintDelete}
        colorBotton="success"
        element={<ComplaintBody
          action="Delete"
        />}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* ------------------------ Explain FuncDialog ------------------------ */}
      {/* ---------------------------------------------------------------------- */}

      {/* {/* <FuncDialog
        open={openView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"ดูข้อมูล"}
        handleClose={handleClose}
        colorBotton="success"
        element={<ExplainBody
          action="Read"
        />}
      />


      <FuncDialog
        open={openEdit}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={'แก้ไขข้อมูล'}
        handleClose={handleClose}
        handlefunction={ComplaintEdit}
        colorBotton="success"
        element={<ComplaintBody
          action="Edit"
        />}
      />

      <FuncDialog
        open={openDelete}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={'ลบข้อมูล'}
        handleClose={handleClose}
        handlefunction={ComplaintDelete}
        colorBotton="success"
        element={<ComplaintBody
          action="Delete"
        />}
      />

      {/* Dialog Sections */}
      
      <FuncDialog
        open={openAddlist}
        dialogWidth="xl"
        openBottonHidden={true}
        titlename={"เพิ่มข้อมูล"}
        handleClose={handleCloseAddlist}
        handlefunction={ExplainAdd}
        colorBotton="success"
        element={
          <ExplaintBody
            action="Add"
            onBlocksChange={(data) => setComplaintBlocks(data)}
            validateDetailText={blockValidateErrors}
            
          />
        }
      />

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
function moment() {
  throw new Error("Function not implemented.");
}

