import React, { useState, useMemo, use, useEffect } from "react";
import { _GET, _POST, _POST_FORMDATA, _POST_SYS_API } from "../../service/mas";
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
import { Complaint_headCells, Department_Setting_headCells } from "../../../libs/columnname";
import DataTable from "../../components/MUI/DataTable";
// import ComplaintBody from "./components/ComplaintBody";
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
// import { useListComplaint } from "../Complaint/core/ListComplaintContext";
import { useListDepartmentSetting } from "./core/ListDepartmentSettingContext";
import DepartmentSettingBody from "./components/DepartmentSettingBody";
import { data } from "react-router-dom";
import { mas_CompanyGet, mas_DepartmentDomainGet, mas_DepartmentDomainGetAll, mas_DomainGet, mas_DomainGetAll, mas_UsernameGetAll } from "../../service/mas/lov";
// import ExplaintBody from "./components/ExplaintBody";

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

export default function DepartmentSetting() {

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
    dept_id,
    domain_dept_id,
    dept_email,
    approve_id,
    dept_setup_id,
    step,
    sectionApprove,
    qcApprove,

    // Setter Functions
    setdataelement,
    setdept_id,
    setdomain_dept_id,
    setdept_email,
    setapprove_id,
    setdept_setup_id,
    setstep,
    setsectionApprove,
    setqcApprove,
    setdept_company,
    setdept_domain,

    //----------dataset---------
    // company_search, set_company_search,
    department_search, set_department_search,
    // domain_search, set_domain_search,
    username_search, set_username_search,

    company, set_company,
    department, set_department,
    domain, set_domain,
    username, set_username,
    dataset_activeCompany, setdataset_activeCompany,
    dataset_roleAdmin, setdataset_roleAdmin,
    datastatus, setdatastatus,

    //====================================
    //--------GetMaster(All)-------
    master_domain, setmaster_domain,
    master_department, setmaster_department,
    master_user, setmaster_user
    //====================================


  } = useListDepartmentSetting();

  // =====================================================================================================
  // LOCAL STATE VARIABLES (from index.tsx)
  // =====================================================================================================

  // Variable for Data Table
  const [datalist, setdatalist] = React.useState<any>([]);

  // Variables for Dialogs and Modals
  const [openDepartmentSettingAdd, setOpenDepartmentSettingAdd] = React.useState(false);
  const [openDepartmentSettingView, setOpenDepartmentSettingView] = React.useState(false);
  const [openDepartmentSettingEdit, setOpenDepartmentSettingEdit] = React.useState(false);
  const [openDepartmentSettingDelete, setOpenDepartmentSettingDelete] = React.useState(false);
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
    username_search: "",
    company_search: "",
    domain_search: "",
    department_search: "",
    Email: "",
  });
  const [open, setOpen] = React.useState(false);
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
  const [domain_search, setdomain_search] = useState<any>(null);
  const [company_search, setcompany_search] = useState<any>(null);
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

  // Reset Form Function (from index.tsx)
  const resetSearchTable = () => {
    setdocumentDateSearch(null);
    setrespondWithinSearch(null);
    setEndDateSearch(null);

  };

  // Reset Form Function (from index.tsx)
  const resetForm = () => {
    setdept_company("");
    setdept_domain("");
    setdomain_dept_id("");
    setdept_email("");
    setsectionApprove("");
    setqcApprove("");
  };

  // Event Handlers =========================================================
  const handleCompanyChange = (value: any) => {
    //console.log('####### Onchange Company Value [event] : ', value);
    //console.log("@@@@@@@@@@@@First", domain);


    if (value != null) {
      mas_DomainGet(value.company_id, set_domain, user, isCallFuncLogOn);
    } else {
      set_domain([]);
      set_department([]);
      set_username([]);
      setdept_domain("");
      setdomain_dept_id(null);
      setsectionApprove(null);
      setqcApprove(null);
      setTextNameSearch({
        ...TextNameSearch,
        company_search: "",
        domain_search: "",
        department_search: "",
      });
    }
    //console.log("@@@@@@@@@@@@second", domain);
  };
  const handleDomainChange = (value: any) => {
    //console.log('####### Onchange Company Value [event] : ', value);
    //console.log('####### Onchange Domain Value [event] : ', value);

    if (value != null) {
      const dataset = {
        domain_id: domain_search?.domain_id || value.domain_id,
        company_id: company_search?.company_id || value.company_id,
      };

      mas_DepartmentDomainGet(value, set_department, isCallFuncLogOn);
      // mas_UsernameGetAll(setmaster_user, isCallFuncLogOn);
    } else {
      set_department([]);
      set_username([]);
      setdomain_dept_id(null);
      setTextNameSearch({
        ...TextNameSearch,
        domain_search: "",
        department_search: "",
      });
    }

  };
  // Handle Change Functions (from ComplaintRead.tsx)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (isCallFuncLogOn) //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleChange");

      setValue(newValue);
  };

  const splitByDot = (str: any) => {
    if (isCallFuncLogOn) //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  splitByDot");

      return str.split('.');
  };



  // =====================================================================================================
  // API FUNCTIONS - GET DATA MASTER
  // =====================================================================================================

  // Function - Get LOV Master Data
  const LovAll_Get = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  LovAll_Get");

    try {
      const dataset = {
        lov_group: user[0]?.itasset_company_id + ",VARIABLE_CONSTANT",
        lov_type:
          "active_company,role_admin,complaint_status",
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

        setdataset_activeCompany?.(grouped["active_company"] || []);
        setdataset_roleAdmin?.(grouped["role_admin"] || []);
        setdatastatus?.(grouped["complaint_status"] || []);



        //console.log('⚠️⚠️⚠️⚠️ [grouped["active_company"]] :', grouped["active_company"])
        //console.log('⚠️⚠️⚠️⚠️ [grouped["role_admin"]] :', grouped["role_admin"])
        //console.log('⚠️⚠️⚠️⚠️ [grouped["complaint_status"]] :', grouped["complaint_status"])



      }
    } catch (e) {
      //console.log("error:", e);
    }
  };

  // Function - Get Domain
  // const DomainGet = async () => {
  //   if (isCallFuncLogOn) //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DomainGet");

  //   try {
  //     const dataset = {
  //       company_id: user[0]?.itasset_company_id,
  //     };
  //     const response = await _POST(dataset, "/Complaint/CasDomainGet");
  //     if (response && response.status === "success") {
  //       //console.log("❇️ Call [Complaint/CasDomainGet] -> Domain_Get :", response.data);
  //       if (Array.isArray(response.data)) {
  //         // เอา filter ออก → ใช้ทุกตัว
  //         set_domain_search(response.data);
  //       }
  //     }
  //   } catch (e) {
  //     //console.log("error:", e);
  //   }
  // };

  // Function - Get Department Domain
  const DepartmentDomainGet = async (action?: string) => {
    if (isCallFuncLogOn) //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentDomainGet");

      try {
        const dataset = {
          domain_id: user[0]?.employee_domain,
          company_id: user[0]?.itasset_company_id,
        };
        const response = await _POST(
          dataset,
          "/Complaint/CasDepartmentDomainGet"
        );
        if (response && response.status === "success") {


          set_department_search(response.data);

          // if (action == "Add") {

          //   //================================================
          //   let department = response.data.filter(
          //     (item: any) => item.department_id != user[0]?.itasset_department_id
          //   );
          //   set_department_search(department);
          //   // if (department) {
          //   //   // set_domain_search(domain);
          //   //   set_department_search(department);
          //   // }
          //   //================================================
          // }

        }
      } catch (e) {
        //console.log("error:", e);
      }
  };

  // // Function - Get Company
  // const CompanyGet = async (action?: string) => {
  //   if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CompanyGet");

  //   try {
  //     const dataset = {
  //     };
  //     const response = await _POST(
  //       dataset,
  //       "/Complaint/CasCompanyGet"
  //     );
  //     if (response && response.status === "success") {
  //       console.log(
  //         "❇️ Call [Complaint/CasCompanyGet] -> Company_Get :",
  //         response.data
  //       );
  //       set_company_search(response.data);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };

  const CompanyGet = async (action?: string) => {
    if (isCallFuncLogOn)
      //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CompanyGet");

      try {
        const response = await _POST({}, "/Complaint/CasCompanyGet");

        if (response && response.status === "success") {
          //console.log("❇️ Call [Complaint/CasCompanyGet] -> Company_Get :", response.data);

          const activeCompany = dataset_activeCompany; // จาก LovAll_Get

          //console.log("🧩 activeCompany sample:", activeCompany?.[0]);
          //console.log("🧩 company sample:", response.data?.[0]);

          if (activeCompany?.length > 0) {
            const active = activeCompany[0]?.lov1 || "";

            const activeid = active.split(",").map((id: string) => id.trim());

            //console.log("✅ activeid:", activeid);

            // ✅ filter บริษัทตาม company_id
            const filteredCompany = response.data.filter((company: any) =>
              activeid.includes(company.company_id.toString())
            );

            //console.log("⚙️ [filteredCompany]:", filteredCompany);
            set_company(filteredCompany);
          } else {
            //console.log("⚠️ activeCompany ยังไม่มีค่า ใช้ company ทั้งหมดแทน");
            set_company(response.data);
          }
        }
      } catch (e) {
        //console.log("error:", e);
      }
  };



  // Function - Get Username Domain
  const UsernameGet = async (action?: string) => {
    if (isCallFuncLogOn) //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CasUsernameGet");

      try {
        const dataset = {
          domain_id: user[0]?.employee_domain,
          company_id: user[0]?.itasset_company_id,
          department_id: user[0]?.itasset_department_id,
        };
        const response = await _POST(
          dataset,
          "/Complaint/CasUsernameGet"
        );
        if (response && response.status === "success") {


          set_username_search(response.data);
        }
      } catch (e) {
        //console.log("error:", e);
      }
  };


  // =====================================================================================================
  // API FUNCTIONS - CRUD OPERATIONS
  // =====================================================================================================

  // Function - Get Complaints
  const Dept_setup_Get = async (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  Dept_setup_Get");

    setIsLoadingScreen(true)
    const dataset = {
      id: data.id,
    };

    try {
      let response = await _POST(dataset, "/DeptSetup/DeptSetupGet");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setdataelement(response.data[0])
      }
      else {
        setdataelement(null)
      }
    } catch (e) {
      console.error("error", e);
    }
  };

  // Function - Search Complaints
  const DeptSetupGet = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DeptSearchGet");

    setIsLoadingScreen(true);
    const dataset = {
      // user_id: user[0]?.employee_username,
      // domain_id: user[0]?.employee_domain,
      // department_id: user[0]?.itasset_department_id,
      // company_id: user[0]?.itasset_company_id,
      username_search: TextNameSearch.username_search ? TextNameSearch.username_search : null,
      company_search: TextNameSearch.company_search ? TextNameSearch.company_search : null,
      domain_search: TextNameSearch.domain_search ? TextNameSearch.domain_search : null,
      department_search: TextNameSearch.department_search ? TextNameSearch.department_search : null,
    }

    //console.log("step:2 dataset ก่อนส่ง API /DeptSearch/DeptSearchGet ", dataset);
    try {
      let response = await _POST(dataset, "/DeptSetup/DeptSetupGet");
      //console.log("step:2 ผลลัพธ์ที่ได้จาก API /DeptSetup/DeptSetupGet ", response);
      if (response && response.status === "success") {

        setIsLoadingScreen(false);
        const responseData: any = [];
        if (Array.isArray(response.data)) {
          response.data.forEach((el: any) => {
            const ACTION = (
              <ActionManageCell
                hadleOnclickMenu={(name: any) => {
                  //console.log("🎆 🎆 🎆 🎆 hadleOnclickMenu (name) :", name);
                  if (name === "View") {
                    // DepartmentDomainGet("Read");
                    //console.log("e😀l", el);

                    handleOnclickDepartmentSettingView(el);
                  } else if (name === "Edit") {
                    // DepartmentDomainGet("Edit");
                    handleOnclickDepartmentSettingEdit(el);
                  } else if (name === "Delete") {
                    // DepartmentDomainGet("Delete");
                    handleOnclickDepartmentSettingDelete(el);
                  } else if (name === "Explain") {
                    // DepartmentDomainGet("Explain");
                  }
                }}
              // hiddenEdit={el.complaint_status_label == 'SUBMIT'}

              //-----------------------------------------------------------------------
              //-----------------------------------------------------------------------

              // // For Status [NEW]
              // hiddenRead={
              //   (dataset_complaintActionNew &&
              //     !dataset_complaintActionNew.some((mode: any) =>
              //       mode.lov1.split(",").includes(String(el.complaint_status_label))
              //     )) ?? false
              // }
              // hiddenEdit={
              //   (dataset_complaintActionNew &&
              //     !dataset_complaintActionNew.some((mode: any) =>
              //       mode.lov1.split(",").includes(String(el.complaint_status_label))
              //     )) ?? false
              // }
              // hiddenDelete={
              //   (dataset_complaintActionNew &&
              //     !dataset_complaintActionNew.some((mode: any) =>
              //       mode.lov1.split(",").includes(String(el.complaint_status_label))
              //     )) ?? false
              // }

              // //-----------------------------------------------------------------------
              // //-----------------------------------------------------------------------

              // // For Status [SUBMIT, EXPLAIN, APPROVE]
              // hiddenExplain={
              //   (dataset_complaintActionExplain &&
              //     !dataset_complaintActionExplain.some((mode: any) =>
              //       mode.lov1.split(",").includes(String(el.complaint_status_label))
              //     )) ?? false
              // }

              // //-----------------------------------------------------------------------
              // //-----------------------------------------------------------------------

              // // For Status [CLOSE]
              // hiddenClose={
              //   (dataset_complaintActionClose &&
              //     !dataset_complaintActionClose.some((mode: any) =>
              //       mode.lov1.split(",").includes(String(el.complaint_status_label))
              //     )) ?? false
              // }

              />
            );
            el.ACTION = ACTION;
            //console.log("el.acknowledge_flag", el.acknowledge_flag)
            //console.log(el.step_label)
            el.complaint_status_label = (
              <BasicChips label={`${el.complaint_status_label}`} acknowledge={el.acknowledge_flag}></BasicChips>
            );
            el.step_label = (
              <BasicChips label={`${el.step_label}`} type="step"></BasicChips>
            );
            responseData.push(el);
          });
        }
        //console.log("step:2 ข้อมูลก่อนเข้า ตาราง ", responseData);
        setdatalist(responseData);
      } else if (response.status === "error") {
        setIsLoadingScreen(false);
        setdatalist([]);
      }
      else {
        setIsLoadingScreen(false);
        setdatalist([]);

      }
    } catch (e) {
      //console.log("error");

    }
  };

  //   // Function - Validate before Add Complaint
  //   const validateBeforeAdd = (): boolean => {
  //     if (isCallFuncLogOn) //console.log("🕑 ",dayjs().format('HH:mm:ss.SSS')," [Calling Function]  :  validateBeforeAdd");
  //     let valid = true;
  //     // Clear ALL validation errors before validation
  //     setReportTypeError(false);
  //     setRespondentDepartmentError(false);
  //     setDateOfDetectionError(false);
  //     setDepartmentAreaError(false);
  //     setProductNameError(false);
  //     setLotNoError(false);
  //     setEmailError(false);
  //     setComplaintTypeError(false);
  //     setOtherTypeError(false);
  //     setComplaintRsError(false);
  //     setOtherRsError(false);
  //     setClauseRsError(false);
  //     setDetailError(false);
  //     setPriorityError(false);

  //     // Validate Report Type - ตรวจสอบก่อนและถ้าไม่มีให้ return false ทันที
  //     if (!dataReportTypeValue || !dataReportTypeValue.id) {
  //       setReportTypeError(true);
  //       document.getElementById("reportTypeField")?.focus();
  //       return false; // หยุดการตรวจสอบส่วนอื่น
  //     }

  //     // Validate Date of Detection
  //     if (!date_of_detection) {
  //       setDateOfDetectionError(true);
  //       valid = false;
  //     }

  //     // Validate Department/Area of Detection
  //     if (!respondent_department_id || !respondent_department_id.department_id) {
  //       setDepartmentAreaError(true);
  //       valid = false;
  //     }

  //     // Validate Product Name
  //     if (!product_name || product_name.trim() === "") {
  //       setProductNameError(true);
  //       valid = false;
  //     }

  //     // Validate Lot no
  //     if (!lot_no || lot_no.trim() === "") {
  //       setLotNoError(true);
  //       valid = false;
  //     }

  //     // Validate Email
  //     if (!respondent_email || respondent_email.trim() === "") {
  //       setEmailError(true);
  //       valid = false;
  //     }

  //     // Validate Complaint Type
  //     if (!dataComplaintTypeValue_Combobox || dataComplaintTypeValue_Combobox.length === 0) {
  //       setComplaintTypeError(true);
  //       valid = false;
  //     } else {
  //     }

  //     // Validate Other Type (if complaint type has "Other" selected)
  //     if (dataComplaintTypeValue_Combobox && dataComplaintTypeValue_Combobox.some((item: any) => item.isOther === "Y")) {
  //       if (!compTypeOther || compTypeOther.trim() === "") {
  //         setOtherTypeError(true);
  //         valid = false;
  //       } else {
  //         ////console.log("✅ Other Type validation passed");
  //       }
  //     }


  //     // Validate Rs 
  //     const reportTypeCode = dataReportTypeValue?.lov_code;
  //     //console.log("🔍 Report Type Code:", reportTypeCode);

  //     // เฉพาะ NCR เท่านั้นที่ต้อง validate Complaint Rs
  //     if (reportTypeCode === "NCR") {
  //       if (!dataComplaintRsValue_Combobox || dataComplaintRsValue_Combobox.length === 0) {
  //         setComplaintRsError(true);
  //         valid = false;
  //       }
  //     }

  //     // Validate Other Rs 
  //     if (reportTypeCode === "NCR" && dataComplaintRsValue_Combobox && dataComplaintRsValue_Combobox.some((item: any) => item.isClause === "Other")) {
  //       if (!compRsOther || compRsOther.trim() === "") {
  //         setOtherRsError(true);
  //         valid = false;
  //       }
  //     }

  //     // Validate Clause Rs
  //     if (reportTypeCode === "NCR" && dataComplaintRsValue_Combobox && dataComplaintRsValue_Combobox.some((item: any) => item.isClause === "Clause")) {
  //       if (!clauseOther || clauseOther.trim() === "") {
  //         setClauseRsError(true);
  //         valid = false;
  //       }
  //     }

  //     // Validate Detail
  //     if (!detail || detail.trim() === "") {
  //       setDetailError(true);
  //       valid = false;
  //     }

  //     // Validate Priority
  //     if (!datapriorityValue_Combobox || datapriorityValue_Combobox.trim() === "") {
  //       setPriorityError(true);
  //       valid = false;
  //     } 

  //     return valid;
  //   }

  //   //validate Edit
  //   const validateBeforeEdit = (): boolean => {
  //     if (isCallFuncLogOn) //console.log("🕑 ",dayjs().format('HH:mm:ss.SSS')," [Calling Function]  :  validateBeforeEdit");
  //     let valid = true;
  //     setReportTypeError(false);
  //     setRespondentDepartmentError(false);
  //     setDateOfDetectionError(false);
  //     setDepartmentAreaError(false);
  //     setProductNameError(false);
  //     setLotNoError(false);
  //     setEmailError(false);
  //     setComplaintTypeError(false);
  //     setOtherTypeError(false);
  //     setComplaintRsError(false);
  //     setOtherRsError(false);
  //     setClauseRsError(false);
  //     setDetailError(false);
  //     setPriorityError(false);

  //     // Validate Report Type - ตรวจสอบก่อนและถ้าไม่มีให้ return false ทันที
  //     if (!dataReportTypeValue || !dataReportTypeValue.id) {
  //       //console.log("❌ Report Type validation failed");
  //       setReportTypeError(true);
  //       document.getElementById("reportTypeField")?.focus();
  //       return false; 
  //     }
  //     //console.log("✅ Report Type validation passed");

  //     // Validate Date of Detection
  //     if (!date_of_detection) {
  //       setDateOfDetectionError(true);
  //       valid = false;
  //     }

  //     // Validate Department/Area of Detection
  //     if (!respondent_department_id || !respondent_department_id.department_id) {
  //       setDepartmentAreaError(true);
  //       valid = false;
  //     }

  //     // Validate Product Name
  //     if (!product_name || product_name.trim() === "") {
  //       setProductNameError(true);
  //       valid = false;
  //     }

  //     // Validate Lot no
  //     if (!lot_no || lot_no.trim() === "") {
  //       setLotNoError(true);
  //       valid = false;
  //     }

  //     // Validate Email
  //     if (!respondent_email || respondent_email.trim() === "") {
  //       setEmailError(true);
  //       valid = false;
  //     }

  //     // Validate Complaint Type
  //     if (!dataComplaintTypeValue_Combobox || dataComplaintTypeValue_Combobox.length === 0) {
  //       //console.log("❌ Complaint Type validation failed");
  //       setComplaintTypeError(true);
  //       valid = false;
  //     } else {
  //       //console.log("✅ Complaint Type validation passed");
  //     }

  //     // Validate Other Type (if complaint type has "Other" selected)
  //     if (dataComplaintTypeValue_Combobox && dataComplaintTypeValue_Combobox.some((item: any) => item.isOther === "Y")) {
  //       if (!compTypeOther || compTypeOther.trim() === "") {
  //         //console.log("❌ Other Type validation failed");
  //         setOtherTypeError(true);
  //         valid = false;
  //       } else {
  //         //console.log("✅ Other Type validation passed");
  //       }
  //     }


  //     // Validate Rs 
  //     const reportTypeCode = dataReportTypeValue?.lov_code;
  //     //console.log("🔍 Report Type Code:", reportTypeCode);

  //     // เฉพาะ NCR เท่านั้นที่ต้อง validate Complaint Rs
  //     if (reportTypeCode === "NCR") {
  //       if (!dataComplaintRsValue_Combobox || dataComplaintRsValue_Combobox.length === 0) {
  //         //console.log("❌ Complaint Rs validation failed for NCR");
  //         setComplaintRsError(true);
  //         valid = false;
  //       } else {
  //         //console.log("✅ Complaint Rs validation passed for NCR");
  //       }
  //     } else {
  //       //console.log("✅ Complaint Rs validation skipped for", reportTypeCode);
  //     }

  //     // Validate Other Rs 
  //     if (reportTypeCode === "NCR" && dataComplaintRsValue_Combobox && dataComplaintRsValue_Combobox.some((item: any) => item.isClause === "Other")) {
  //       if (!compRsOther || compRsOther.trim() === "") {
  //         //console.log("❌ Other Rs validation failed for NCR");
  //         setOtherRsError(true);
  //         valid = false;
  //       } else {
  //         //console.log("✅ Other Rs validation passed for NCR");
  //       }
  //     }

  //     // Validate Clause Rs
  //     if (reportTypeCode === "NCR" && dataComplaintRsValue_Combobox && dataComplaintRsValue_Combobox.some((item: any) => item.isClause === "Clause")) {
  //       if (!clauseOther || clauseOther.trim() === "") {
  //         //console.log("❌ Clause Rs validation failed for NCR");
  //         setClauseRsError(true);
  //         valid = false;
  //       } else {
  //         //console.log("✅ Clause Rs validation passed for NCR");
  //       }
  //     }

  //     // Validate Detail
  //     if (!detail || detail.trim() === "") {
  //       setDetailError(true);
  //       valid = false;
  //     }

  



  // Function - Add DepartmentSetting
  const DepartmentSettingAdd = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentSettingAdd");

    // if (!validateBeforeAdd()) {
    //   return;
    // }

    const tempid = uuidv4();


    // เตรียม Models
    const DeptApproveSetup = [];

    if (sectionApprove?.employee_username) {
      DeptApproveSetup.push({
        step: "1",
        user_id: sectionApprove.employee_username,
      });
    }

    if (qcApprove?.employee_username) {
      DeptApproveSetup.push({
        step: "2",
        user_id: qcApprove.employee_username,
      });
    }

    // สร้าง JSON payload
    const DeptSetupPayload = {

      id: tempid,
      domain_dept_id: domain_dept_id?.domain_dept_id,
      dept_email: dept_email,
      create_by: user[0]?.employee_username || "",
      DeptApproveSetup: DeptApproveSetup,

    };
    ////console.log("📤 DeptSetupPayload:", DeptSetupPayload);
    setIsLoadingScreen(true);

    try {
      const response = await _POST(
        DeptSetupPayload,
        "/DeptSetup/DeptSetupAdd"
      );
      if (response && response.status === "success") {
        FullSweetalert({
          title: 'Success',
          text: `บันทึกข้อมูลสำเร็จ`,
          icon: 'success'
        });
        //console.log("✅ Complaint Add successfully:", response);
      } else {
        FullSweetalert({
          title: 'Failed',
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: 'error'
        });
        //console.log("⚠️ Add failed:", response);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoadingScreen(false);
      handleClose();

      // Complaint_Get();
      DeptSetupGet();
    }
  };

  // Function - Edit DepartmentSetting
  const DepartmentSettingEdit = async () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentSettingEdit");

    // if (!validateBeforeAdd()) {
    //   return;
    // }


    // เตรียม Models
    const DeptApproveSetup = [];

    if (sectionApprove?.employee_username) {
      DeptApproveSetup.push({
        step: "1",
        user_id: sectionApprove.employee_username, // ใช้ state ปัจจุบัน
      });
    }

    if (qcApprove?.employee_username) {
      DeptApproveSetup.push({
        step: "2",
        user_id: qcApprove.employee_username, // ใช้ state ปัจจุบัน
      });
    }

    const DeptSetupPayload = {
      id: dataelement?.id,
      // company : dataelement?.company ,
      domain_dept_id: dataelement?.domain_dept_id,
      dept_email: dataelement?.dept_email,
      update_by: user[0]?.employee_username,
      DeptApproveSetup: DeptApproveSetup,
    };
    setIsLoadingScreen(true);

    try {
      const response = await _POST(
        DeptSetupPayload,
        "/DeptSetup/DeptSetupEdit"
      );
      if (response && response.status === "success") {
        FullSweetalert({
          title: 'Success',
          text: `บันทึกข้อมูลสำเร็จ`,
          icon: 'success'
        });
      } else {
        FullSweetalert({
          title: 'Failed',
          text: `บันทึกไม่ข้อมูลสำเร็จ`,
          icon: 'error'
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoadingScreen(false);
      handleClose();

      // Complaint_Get();
      DeptSetupGet();
    }
  };

  // Function - Delete DepartmentSetting
  // const DepartmentSettingDelete = async () => {
  //   if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  ComplaintDelete");

  //   // สร้าง JSON payload
  //   const DeptSetupPayload = {

  //     id: dataelement?.id,
  //     update_by: user[0]?.employee_username || '',


  //   };

  //   //console.log("📤 DeptSetupPayload:", DeptSetupPayload);
  //   setIsLoadingScreen(true);

  //   try {
  //     let response = await _POST(DeptSetupPayload, "/DeptSetup/DeptSetupDelete");
  //     if (response && response.status === "success") {
  //       FullSweetalert({
  //         title: 'Success',
  //         text: `บันทึกข้อมูลสำเร็จ`,
  //         icon: 'success'
  //       });
  //       //console.log("✅ Complaint Delete successfully:", response);
  //     } else {
  //       FullSweetalert({
  //         title: 'Failed',
  //         text: `บันทึกไม่ข้อมูลสำเร็จ`,
  //         icon: 'error'
  //       });
  //       //console.log("⚠️ Delete failed:", response);
  //     }
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //   } finally {
  //     setIsLoadingScreen(false);
  //     handleClose();
  //     FullSweetalert({
  //       title: 'Success',
  //       text: `ลบข้อมูลสำเร็จ`,
  //       icon: 'success'
  //     });
  //     // Complaint_Get();
  //     DeptSetupGet();
  //   }
  // };
  // // Function - Delete Complaint
  // const ComplaintDelete = async () => {
  //   if (isCallFuncLogOn) console.log("🕑 ",dayjs().format('HH:mm:ss.SSS')," [Calling Function]  :  ComplaintDelete");

  //   // สร้าง JSON payload
  //   const complaintPayload = {
  //     ComplaintModel: {
  //       id: dataelement?.id,
  //     },
  //     CurrentAccessModel: {
  //       user_id: user[0]?.employee_username || '',
  //     }
  //   };

  //   console.log("📤 complaintPayload:", complaintPayload);
  //   setIsLoadingScreen(true);

  //   try {
  //     let response = await _POST(complaintPayload, "/Complaint/ComplaintDelete");
  //     if (response && response.status === "success") {
  //       FullSweetalert({
  //         title: 'Success',
  //         text: `บันทึกข้อมูลสำเร็จ`,
  //         icon: 'success'
  //       });
  //       console.log("✅ Complaint edittt successfully:", response);
  //     } else {
  //       FullSweetalert({
  //         title: 'Failed',
  //         text: `บันทึกไม่ข้อมูลสำเร็จ`,
  //         icon: 'error'
  //       });
  //       console.log("⚠️ Edit failed:", response);
  //     }
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //   } finally {
  //     setIsLoadingScreen(false);
  //     handleClose();
  //     FullSweetalert({
  //       title: 'Success',
  //       text: `ลบข้อมูลสำเร็จ`,
  //       icon: 'success'
  //     });
  //     // Complaint_Get();
  //     DeptSearchGet();
  //   }
  // };

  // =====================================================================================================
  // EVENT HANDLERS (from index.tsx)
  // =====================================================================================================

  // Dialog Handlers

  // const handleOnclickMenuSync = () => {
  //   if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickMenuSync");

  //   // setOpenSync(true);
  // };

  const handleOnclickDepartmentSettingAdd = () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickDepartmentSettingAdd");
    console.log("⭐step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickDepartmentSettingAdd ", data);
    resetForm();
    setdataelement(null);
    setOpenDepartmentSettingAdd(true);
  };

  const handleOnclickDepartmentSettingView = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickDepartmentSettingView");
    console.log("⭐step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickMenuView ", data);
    resetForm();
    Dept_setup_Get(data);
    setOpenDepartmentSettingView(true); // แล้วค่อยเปิด Dialog
  };

  const handleOnclickDepartmentSettingEdit = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickDepartmentSettingEdit");
    console.log("⭐step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickDepartmentSettingEdit ", data);
    resetForm();
    Dept_setup_Get(data);
    setOpenDepartmentSettingEdit(true);
  };

  const handleOnclickDepartmentSettingDelete = (data: any) => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickDepartmentSettingDelete");
      console.log("⭐step:3 เรียกฟังก์ชั่น ดูข้อมูล handleOnclickDepartmentSettingDelete ", data);

    resetForm();
    Dept_setup_Get(data);
    setOpenDepartmentSettingDelete(true);
  };


  // Search Handlers
  // const handleCloseSearch = () => {
  //   if (isCallFuncLogOn) //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleCloseSearch");
  //   setTextNameSearch({
  //     username_search: "",
  //     company_search: "",
  //     department_search: "",
  //     domain_search: "",
  //     Email: "",
  //   });
  //   // Complaint_Get()
  //   // DeptSearchGet();
  // };

  // Close Dialog Handler
  const handleClose = () => {
    if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleClose");

    setOpenDepartmentSettingAdd(false);
    // setOpenSync(false);
    setOpenDepartmentSettingView(false);
    setOpenDepartmentSettingEdit(false);
    setOpenDepartmentSettingDelete(false);
    setOpenUpload(false);
    resetForm();
  };



  // =====================================================================================================
  // USEEFFECT - INITIALIZATION (from index.tsx and ComplaintRead.tsx)
  // =====================================================================================================

  //   // Initialize data on component mount
  //   useEffect(() => {
  //   const fetchData = async () => {
  //     //console.log("useEffect start");

  //     await LovAll_Get();
  //     resetSearchTable();
  //     await DeptSetupGet();
  //     await UsernameGet();
  //     await mas_DomainGetAll(setmaster_domain, isCallFuncLogOn);
  //     await mas_DepartmentDomainGetAll(setmaster_department, isCallFuncLogOn);
  //     await mas_UsernameGetAll(setmaster_user, isCallFuncLogOn);

  //     //console.log("#################### master_domain", master_domain);
  //     //console.log("#################### master_department", master_department);
  //     //console.log("#################### master_user", master_user);

  //     Checkdata(); // ตอนนี้ state ถูกอัปเดตแล้ว
  //     //console.log("Checkdata done");
  //   };

  //   fetchData();
  // }, []);

  // Initialize data on component mount
  const effectRan = React.useRef(false); // ป้องกัน run ซ้ำใน dev mode

  React.useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const fetchData = async () => {
      try {
        console.log("⭐Step [0] useEffect start");
        await LovAll_Get();                     // ไม่มี signal
        await resetSearchTable();
        await DeptSetupGet();
        await UsernameGet();
        await mas_DomainGetAll(setmaster_domain, isCallFuncLogOn);
        await mas_DepartmentDomainGetAll(setmaster_department, isCallFuncLogOn);
        await mas_UsernameGetAll(setmaster_user, isCallFuncLogOn);
        //console.log("useEffect done");
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  //ใช้สำหรับตอน Add
  React.useEffect(() => {
    if (dataset_activeCompany) {
      console.log("⭐Step [1] ใช้สำหรับตอน Add 🔁 ActiveCompany พร้อมแล้ว → เรียก CompanyGet()");
      CompanyGet();
    }
  }, [dataset_activeCompany]);
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
        <Grid container spacing={2} my={3}>
          <Grid size={3}>
            <AutocompleteComboBox
              value={username_search?.find(
                (item: any) => item.employee_username === TextNameSearch.username_search
              ) || null}
              labelName="ชื่อ (Username)"
              options={username_search || []}
              column="employee_username"
              setvalue={(val) => {
                setTextNameSearch({
                  ...TextNameSearch,
                  username_search: val?.employee_username || "", // เก็บแค่ id เป็น string
                })
              }}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteComboBox
              value={company?.find(
                (item: any) => item.company_id === TextNameSearch.company_search
              ) || null}
              labelName="บริษัท (Company)"
              options={company || []}
              column="company_name"
              setvalue={(val) => {
                handleCompanyChange(val);
                setTextNameSearch({

                  ...TextNameSearch,
                  company_search: val?.company_id || "", // เก็บแค่ id เป็น string
                })
              }}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteComboBox
              value={domain?.find(
                (item: any) => item.domain_id === TextNameSearch.domain_search
              ) || null}
              labelName="โดเมน (Domain)"
              options={domain || []}
              column="domain_name"
              setvalue={(val) => {
                handleDomainChange(val);
                setTextNameSearch({
                  ...TextNameSearch,
                  domain_search: val?.domain_id || "", // เก็บแค่ id เป็น string
                })
              }}
              readonly={!TextNameSearch.company_search}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteComboBox
              value={department?.find(
                (item: any) => item.domain_dept_id === TextNameSearch.department_search
              ) || null}
              labelName="แผนก (Department)"
              options={department}
              column="department_name"
              setvalue={(val) => {
                setTextNameSearch({
                  ...TextNameSearch,
                  department_search: val?.domain_dept_id || "", // เก็บแค่ id เป็น string
                })
              }}
              readonly={!TextNameSearch.domain_search}
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
              handleonClick={DeptSetupGet}
              variant_text="contained"
              colorname={"primary"}
            />
          </Grid>
          {/* <Grid>
            <FullWidthButton
              labelName={"รีเซท"}
              handleonClick={handleCloseSearch}
              variant_text="outlined"
              colorname={"inherit"}
            />
          </Grid> */}
        </Grid>
      </Box>


      {/* Data Table Section */}
      {//console.log('dddddddddddddddd', datalist)
      }
      <DataTable
        colum={Department_Setting_headCells}
        rows={datalist}
        titlename={"ข้อมูล Department"}
        buttonElement={
          <div className="flex gap-x-4">
            <Button
              variant="contained"
              hidden={menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? false : true}
              color="success"
              onClick={() => {
                // DepartmentDomainGet("Add");
                handleOnclickDepartmentSettingAdd();
              }}
            >
              {menuFuncData?.find((item: auth_role_menu_func) => item?.func_name === "Add") ? "เพิ่มข้อมูล" : ""}
              <AddIcon sx={{}} />
            </Button>
          </div>
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* --------------------- DepartmentSetting FuncDialog ------------------- */}
      {/* ---------------------------------------------------------------------- */}
      <FuncDialog
        open={openDepartmentSettingView}
        dialogWidth="xl"
        openBottonHidden={false}
        titlename={"Department // ดูข้อมูล"}
        handleClose={handleClose}
        buttonColor="success"
        element={<DepartmentSettingBody
          action="Read"
        />}
      />
      <FuncDialog
        open={openDepartmentSettingAdd}
        dialogWidth="xl"
        openBottonHidden={true}
        hideReject={true}
        hideSaveDraft={true}
        titlename={"เพิ่มข้อมูลแผนก"}
        buttonText={"Save & Submit"}
        handleClose={handleClose}
        handlefunction={DepartmentSettingAdd}
        buttonColor="success"
        element={
          <DepartmentSettingBody
            action="Add"
          //   // onBlocksChange={(data) => setComplaintBlocks(data)}
          //   validateDetailText={blockValidateErrors}
          //   handleOpenAdd={handleOpenAddList}
          //   validateText={{
          //     Product_Group: false,
          //     Report_Type: reportTypeError,
          //     Respondent_Department: false,
          //     Date_of_Detection: dateOfDetectionError,
          //     Department_Area: departmentAreaError,
          //     Product_Name: productNameError,
          //     Lot_No: lotNoError,
          //     Email: emailError,
          //     Complaint_Type: complaintTypeError,
          //     Other_Type: otherTypeError,
          //     Complaint_Rs: complaintRsError,
          //     Other_Rs: otherRsError,
          //     Clause_Rs: clauseRsError,
          //     Detail: detailError,
          //     Priority: priorityError,
          //   }}
          //   onReportTypeChange={(val) => {
          //     setdataReportTypeValue(val);
          //     setReportTypeError(false);
          //     // Clear all validation errors when report type changes
          //     setDateOfDetectionError(false);
          //     setDepartmentAreaError(false);
          //     setProductNameError(false);
          //     setLotNoError(false);
          //     setEmailError(false);
          //     setComplaintTypeError(false);
          //     setOtherTypeError(false);
          //     setComplaintRsError(false);
          //     setOtherRsError(false);
          //     setClauseRsError(false);
          //     setDetailError(false);
          //     setPriorityError(false);
          //   }}
          //   onDateOfDetectionChange={(val) => {
          //     setdate_of_detection(val);
          //     setDateOfDetectionError(false);
          //   }}
          //   onDepartmentAreaChange={(val) => {
          //     setrespondent_department_id(val);
          //     setDepartmentAreaError(false);
          //   }}
          //   onProductNameChange={(val) => {
          //     setproduct_name(val);
          //     setProductNameError(false);
          //   }}
          //   onLotNoChange={(val) => {
          //     setlot_no(val);
          //     setLotNoError(false);
          //   }}

          //   onEmailChange={(val) => {
          //     setrespondent_email(val);
          //     setEmailError(false);
          //   }}
          //   onComplaintTypeChange={(val) => {
          //     setComplaintTypeError(false);
          //     setOtherTypeError(false);
          //   }}
          //   onOtherTypeChange={(val) => {
          //     setOtherTypeError(false);
          //   }}
          //   onComplaintRsChange={(val) => {
          //     setComplaintRsError(false);
          //     setOtherRsError(false);
          //     setClauseRsError(false);
          //   }}
          //   onOtherRsChange={(val) => {
          //     setOtherRsError(false);
          //   }}
          //   onClauseChange={(val) => {
          //     setClauseRsError(false);
          //   }}
          //   onDetailChange={(val) => {
          //     setDetailError(false);
          //   }}
          //   onPriorityChange={(val) => {
          //     setPriorityError(false);
          //   }}
          />


        }
      />

      <FuncDialog
        open={openDepartmentSettingEdit}
        dialogWidth="xl"
        openBottonHidden={true}
        hideReject={true}
        titlename={'DepartmentSetting // แก้ไขข้อมูล'}
        buttonText={"Save & Submit"}
        handleClose={handleClose}
        handlefunction={DepartmentSettingEdit}
        hideSaveDraft={true}
        buttonColor="success"
        element={<DepartmentSettingBody
          action="Edit"
        // onBlocksChange={(data) => setComplaintBlocks(data)}
        //   validateDetailText={blockValidateErrors}
        //   handleOpenAdd={handleOpenAddList}
        //   validateText={{
        //     Product_Group: false,
        //     Report_Type: reportTypeError,
        //     Respondent_Department: false,
        //     Date_of_Detection: dateOfDetectionError,
        //     Department_Area: departmentAreaError,
        //     Product_Name: productNameError,
        //     Lot_No: lotNoError,
        //     Email: emailError,
        //     Complaint_Type: complaintTypeError,
        //     Other_Type: otherTypeError,
        //     Complaint_Rs: complaintRsError,
        //     Other_Rs: otherRsError,
        //     Clause_Rs: clauseRsError,
        //     Detail: detailError,
        //     Priority: priorityError,
        //   }}
        //   onReportTypeChange={(val) => {
        //     setdataReportTypeValue(val);
        //     setReportTypeError(false);
        //     setDateOfDetectionError(false);
        //     setDepartmentAreaError(false);
        //     setProductNameError(false);
        //     setLotNoError(false);
        //     setEmailError(false);
        //     setComplaintTypeError(false);
        //     setOtherTypeError(false);
        //     setComplaintRsError(false);
        //     setOtherRsError(false);
        //     setClauseRsError(false);
        //     setDetailError(false);
        //     setPriorityError(false);
        //   }}
        //   onDateOfDetectionChange={(val) => {
        //     setdate_of_detection(val);
        //     setDateOfDetectionError(false);
        //   }}
        //   onDepartmentAreaChange={(val) => {
        //     setrespondent_department_id(val);
        //     setDepartmentAreaError(false);
        //   }}
        //   onProductNameChange={(val) => {
        //     setproduct_name(val);
        //     setProductNameError(false);
        //   }}
        //   onLotNoChange={(val) => {
        //     setlot_no(val);
        //     setLotNoError(false);
        //   }}

        //   onEmailChange={(val) => {
        //     setrespondent_email(val);
        //     setEmailError(false);
        //   }}
        //   onComplaintTypeChange={(val) => {
        //     setComplaintTypeError(false);
        //     setOtherTypeError(false);
        //   }}
        //   onOtherTypeChange={(val) => {
        //     setOtherTypeError(false);
        //   }}
        //   onComplaintRsChange={(val) => {
        //     setComplaintRsError(false);
        //     setOtherRsError(false);
        //     setClauseRsError(false);
        //   }}
        //   onOtherRsChange={(val) => {
        //     setOtherRsError(false);
        //   }}
        //   onClauseChange={(val) => {
        //     setClauseRsError(false);
        //   }}
        //   onDetailChange={(val) => {
        //     setDetailError(false);
        //   }}
        //   onPriorityChange={(val) => {
        //     setPriorityError(false);
        //   }}
        />}
      />

      {/* <FuncDialog
        open={openDepartmentSettingDelete}
        dialogWidth="xl"
        hideSaveDraft={true}
        openBottonHidden={true}
        hideReject={true}
        titlename={'DepartmentSetting // ลบข้อมูล'}
        buttonText={"Delete"}
        handleClose={handleClose}
        handlefunction={DepartmentSettingDelete}
        buttonColor="error"
        element={<DepartmentSettingBody
          action="Delete"
        />}
      /> */}

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

