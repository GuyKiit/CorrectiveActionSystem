import React, { useState, useEffect } from "react";
import { _GET, _POST, _POST_FORMDATA, _POST_SYS_API } from "../../service/mas";
import { _formatNumber } from "../../../libs/datacontrol";
import { Box, Button, Divider, Typography, Card, CardContent, IconButton, Grow } from "@mui/material";
import { useAuth } from "../../auth/core/AuthContext";
import { useLayout } from "../../layout/core/LayoutProvider";
import { auth_role_menu_func } from "../../types/users";
import { useData } from "../../auth/core/DataContext";
import { Department_Setting_headCells } from "../../../libs/columnname";
import { v4 as uuidv4 } from "uuid";
import {cleanAccessData,getCurrentAccessObject,updateSessionStorageCurrentAccess,} from "../../service/initmain/initmain";
import { useListDepartmentSetting } from "./core/ListDepartmentSettingContext";
import { mas_DepartmentDomainGet, mas_DepartmentDomainGetAll, mas_DomainGet, mas_DomainGetAll } from "../../service/mas/lov";
import ActionManageCell from "../../components/MUI/ActionManageCell";
import dayjs from "dayjs";
import FuncDialog from "../../components/MUI/FullDialog";
import DataTable from "../../components/MUI/DataTable";
import AddIcon from "@mui/icons-material/Add";
import FullSweetalert from "../../components/MUI/Sweetalert";
import AutocompleteComboBox from "../../components/MUI/AutocompleteComboBox";
import FullWidthButton from "../../components/MUI/FullWidthButton";
import Grid from "@mui/material/Grid2";
import DepartmentSettingBody from "./components/DepartmentSettingBody";
// =====================================================================================================
// TYPE DEFINITIONS
// =====================================================================================================

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

export default function DepartmentSetting() {

  // =====================================================================================================
  // AUTHENTICATION & USER DATA
  // =====================================================================================================
  const user = cleanAccessData("userSession");
  const screenName = "DepartmentSettingPage";

  const employeeUsername = user?.[0]?.employee_username || "";
  const employeeDomain = user?.[0]?.employee_domain || "";

  const { setIsLoadingScreen } = useLayout();
  const { menuFuncData } = useAuth();

  // =====================================================================================================
  // CONTEXT VARIABLES
  // =====================================================================================================
  const {
    // Main Complaint Fields
    dataelement,
    domain_dept_id,
    dept_email,
    dept_company,
    dept_domain,

    setdataelement,
    setdomain_dept_id,
    setdept_email,
    setdept_company,
    setdept_domain,

    company, set_company,
    department, set_department,
    domain, set_domain,
    username, set_username,
    dataset_activeCompany, setdataset_activeCompany,
    dataset_roleProfile, setdataset_roleProfile,
    datastatus, setdatastatus,

    //====================================
    //--------GetMaster(All)-------
    master_domain, setmaster_domain,
    master_department, setmaster_department,
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
  const [openAddlist, setOpenAddlist] = React.useState(false);
  const handleOpenAddList = () => setOpenAddlist(true);
  const handleCloseAddlist = () => setOpenAddlist(false);
  
  const [TextNameSearch, setTextNameSearch] = React.useState({
    id: "",
    company_search: "",
    domain_search: "",
    department_search: ""
  });
  // =====================================================================================================
  // UTILITY FUNCTIONS (from index.tsx and ComplaintRead.tsx)
  // =====================================================================================================

  const [companyAreaError, setCompanyAreaError] = useState(false);
  const [domainAreaError, setDomainAreaError] = useState(false);
  const [departmentAreaError, setDepartmentAreaError] = useState(false);
  const [emailAreaError, setEmailAreaError] = useState(false);
  const [usernameAreaError, setUsernameAreaError] = useState(false);
  const [stepAreaError, setStepAreaError] = useState(false);

  // For On-Off Calling Function Log
  const [isCallFuncLogOn] = useState(true);
  const [searchTrigger, setSearchTrigger] = useState(false);

  const tempRoleUser = dataset_roleProfile?.filter(
    (item: any) => item.lov1 === String(user[0]?.role_id)
  );
  const isItAdmin = tempRoleUser?.[0]?.lov_code === "it_admin";


  // Function - Validate before Add Complaint
  const validateBeforeAdd = (): boolean => {
    // if (isCallFuncLogOn)
    //   console.log(
    //     "🕑 ",
    //     dayjs().format("HH:mm:ss.SSS"),
    //     " [Calling Function]  :  validateBeforeAdd"
    //   );
    let valid = true;
    // Clear ALL validation errors before validation
    setCompanyAreaError(false);
    setDomainAreaError(false);
    setDepartmentAreaError(false);
    setEmailAreaError(false);
    setStepAreaError(false);


    // Validate 
    if (!dept_company || !dept_company.company_id) {
      setCompanyAreaError(true);
      valid = false;
    }

    if (!dept_domain || !dept_domain.domain_id) {
      setDomainAreaError(true);
      valid = false;
    }

    if (!domain_dept_id || !domain_dept_id.department_id) {
      setDepartmentAreaError(true);
      valid = false;
    }

    if (!dept_email || dept_email.trim() === "") {
      setEmailAreaError(true);
      valid = false;
    }

    return valid;
  };

  // Reset Form Function (from index.tsx)
  const resetForm = () => {
    setdept_company("");
    setdept_domain("");
    setdomain_dept_id("");
    setdept_email("");
    setCompanyAreaError(false);
    setDomainAreaError(false);
    setDepartmentAreaError(false);
    setEmailAreaError(false);
  };

  // Event Handlers =========================================================
  const handleCompanyChange = (value: any) => {

    if (value != null) {
      mas_DomainGet(value.company_id, set_domain, user, isCallFuncLogOn);
    } else {
      set_domain([]);
      set_department([]);
      set_username([]);
      setdept_domain("");
      setdomain_dept_id(null);
      setTextNameSearch({
        ...TextNameSearch,
        company_search: "",
        domain_search: "",
        department_search: "",
      });
    }
  };

  const handleDomainChange = (value: any) => {

    if (value != null) {
      const dataset = {
        domain_id: value.domain_id,
        company_id: Number(TextNameSearch.company_search),
      };
      mas_DepartmentDomainGet(dataset, set_department, isCallFuncLogOn);
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

  // =====================================================================================================
  // API FUNCTIONS - GET DATA MASTER
  // =====================================================================================================

  // Function - Get LOV Master Data
  const LovAll_Get = async () => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  LovAll_Get");

    try {
      const dataset = {
        lov_group: user[0]?.itasset_company_id + ",VARIABLE_CONSTANT",
        lov_type:
          "active_company,role_profile,complaint_status",
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

        setdataset_activeCompany?.(grouped["active_company"] || []);
        setdataset_roleProfile?.(grouped["role_profile"] || []);
        setdatastatus?.(grouped["complaint_status"] || []);
      }
    } catch (e) {
      //console.log("error:", e);
    }
  };


  const CompanyGet = async (action?: string) => {
    if (isCallFuncLogOn)
      //console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  CompanyGet");

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
            set_company(filteredCompany);
          } else {
            set_company(response.data);
          }
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
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  Dept_setup_Get");

    updateSessionStorageCurrentAccess("event_name", "DepartmentSettingGet");

    setIsLoadingScreen(true)
    const dataset = {
      id: data.id,
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
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
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DeptSetupGet");
    updateSessionStorageCurrentAccess("event_name", "DepartmentSettingGet");

    setIsLoadingScreen(true);
    const dataset = {
      company_search: TextNameSearch.company_search ? TextNameSearch.company_search : null,
      domain_search: TextNameSearch.domain_search ? TextNameSearch.domain_search : null,
      department_search: TextNameSearch.department_search ? TextNameSearch.department_search : null,
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
    }

    try {
      let response = await _POST(dataset, "/DeptSetup/DeptSetupGet");
      if (response && response.status === "success") {

        setIsLoadingScreen(false);
        const responseData: any = [];
        if (Array.isArray(response.data)) {
          response.data.forEach((el: any) => {
            const ACTION = (
              <ActionManageCell
                hadleOnclickMenu={(name: any) => {
                  if (name === "DepartmentView") {
                    handleOnclickDepartmentSettingView(el);
                  } else if (name === "DepartmentEdit") {
                    handleOnclickDepartmentSettingEdit(el);
                  } else if (name === "DepartmentDelete") {
                    handleOnclickDepartmentSettingDelete(el);
                  }
                }}

                // For show menu function from [DepartmentSetting] menu 
                hiddenDepartmentAdd={true}
                hiddenDepartmentView={false}
                hiddenDepartmentEdit={false}
                hiddenDepartmentDelete={false}
                // For hidden menu function from [Complaint] menu
                hiddenRead={true}
                hiddenEdit={true}
                hiddenDelete={true}
                hiddenExplain={true}
                hiddenClose={true}
                // For hidden menu function READ from [Complaint Read] menu
                hiddenReadExplain={true}
                hiddenReadApproveSC={true}
                hiddenReadApproveQC={true}
                hiddenReadClose={true}
                hiddenCloseHistory={true}
                hiddenPrint={true}
              />
            );
            el.ACTION = ACTION;
            el.menu_name = "DepartmentSetting";
            responseData.push(el);
          });
        }
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

  useEffect(() => {
    if (searchTrigger) {
      DeptSetupGet();
      setSearchTrigger(false); // reset trigger เพื่อให้พร้อมใช้ครั้งถัดไป
    }
  }, [searchTrigger, TextNameSearch]);

  // Function - Add DepartmentSetting
  const DepartmentSettingAdd = async () => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentSettingAdd");

    updateSessionStorageCurrentAccess("event_name", "DepartmentSettingAdd");

    if (!validateBeforeAdd()) {
      return;
    }
    const tempid = uuidv4();

    // สร้าง JSON payload
    const DeptSetupPayload = {
      id: tempid,
      domain_dept_id: domain_dept_id?.domain_dept_id,
      dept_email: dept_email,
      create_by: user[0]?.employee_username || "",
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
    };

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
      DeptSetupGet();
    }
  };

  // Function - Edit DepartmentSetting
  const DepartmentSettingEdit = async () => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  DepartmentSettingEdit");

    updateSessionStorageCurrentAccess("event_name", "DepartmentSettingEdit");
    // if (!validateBeforeAdd()) {
    //   return;
    // }

    const DeptSetupPayload = {
      id: dataelement?.id,
      domain_dept_id: domain_dept_id.domain_dept_id, 
      dept_email: dept_email,
      update_by: user[0]?.employee_username,
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
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
      DeptSetupGet();
    }
  };

  // Function - Delete DepartmentSetting
  const DepartmentSettingDelete = async () => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  ComplaintDelete");
    updateSessionStorageCurrentAccess("event_name", "DepartmentSettingDelete");

    // สร้าง JSON payload
    const DeptSetupPayload = {
      id: dataelement?.id,
      update_by: user[0]?.employee_username || '',
      CurrentAccessModel: getCurrentAccessObject(
        employeeUsername,
        employeeDomain,
        screenName
      ),
    };

    setIsLoadingScreen(true);

    try {
      let response = await _POST(DeptSetupPayload, "/DeptSetup/DeptSetupDelete");
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
      FullSweetalert({
        title: 'Success',
        text: `ลบข้อมูลสำเร็จ`,
        icon: 'success'
      });
      DeptSetupGet();
    }
  };

  const handleOnclickDepartmentSettingAdd = () => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickDepartmentSettingAdd");
    resetForm();
    setdataelement(null);
    setOpenDepartmentSettingAdd(true);
  };

  const handleOnclickDepartmentSettingView = (data: any) => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickDepartmentSettingView");
    resetForm();
    Dept_setup_Get(data);
    setOpenDepartmentSettingView(true); // แล้วค่อยเปิด Dialog
  };

  const handleOnclickDepartmentSettingEdit = (data: any) => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickDepartmentSettingEdit");
    resetForm();
    Dept_setup_Get(data);
    setOpenDepartmentSettingEdit(true);
  };

  const handleOnclickDepartmentSettingDelete = (data: any) => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleOnclickDepartmentSettingDelete");
    resetForm();
    Dept_setup_Get(data);
    setOpenDepartmentSettingDelete(true);
  };

  // Search Handlers
  const handleCloseSearch = () => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleCloseSearch");
      setTextNameSearch({
        id: "",
        department_search: "",
        domain_search: "",
        company_search: "",
      });

    setSearchTrigger(true);
  };

  // Close Dialog Handler
  const handleClose = () => {
    // if (isCallFuncLogOn) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  handleClose");

    setOpenDepartmentSettingAdd(false);
    // setOpenSync(false);
    setOpenDepartmentSettingView(false);
    setOpenDepartmentSettingEdit(false);
    setOpenDepartmentSettingDelete(false);
    resetForm();
  };

  // =====================================================================================================
  // USEEFFECT - INITIALIZATION (from index.tsx and ComplaintRead.tsx)
  // =====================================================================================================

  // Initialize data on component mount
  const effectRan = React.useRef(false); // ป้องกัน run ซ้ำใน dev mode

  React.useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const fetchData = async () => {
      try {
        await LovAll_Get();       
        await DeptSetupGet();
        await mas_DomainGetAll(setmaster_domain, isCallFuncLogOn);
        await mas_DepartmentDomainGetAll(setmaster_department, isCallFuncLogOn);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  //ใช้สำหรับตอน Add
  React.useEffect(() => {
    if (dataset_activeCompany) {
      CompanyGet();
    }
  }, [dataset_activeCompany]);

  React.useEffect(() => {
    if (!TextNameSearch.company_search && user[0]?.itasset_company_id) {
      setTextNameSearch(prev => ({
        ...prev,
        company_search: String(user[0].itasset_company_id),
      }));

      set_domain([]); // ⭐ กัน domain เก่าค้าง
    }
  }, [user]);

  React.useEffect(() => {
    if (!TextNameSearch.company_search) return;

    mas_DomainGet(
      TextNameSearch.company_search,
      set_domain,
      user,
      isCallFuncLogOn
    );
  }, [TextNameSearch.company_search]);

  React.useEffect(() => {
    if (!Array.isArray(domain) || domain.length === 0) return;
  }, [domain]);

  React.useEffect(() => {
    if (
      !TextNameSearch.domain_search &&
      Array.isArray(domain) &&
      domain.length > 0 &&
      user[0]?.domain_name
    ) {
      const autoDomain = domain.find(
        (item: any) =>
          String(item.domain_name) === String(user[0].domain_name)
      );
      if (autoDomain) {
        setTextNameSearch(prev => ({
          ...prev,
          domain_search: autoDomain.domain_id
        }));

        handleDomainChange(autoDomain);
      }
    }
  }, [domain, user]);

  React.useEffect(() => {
    if (!TextNameSearch.domain_search || !TextNameSearch.company_search) return;

    mas_DepartmentDomainGet(
      {
        domain_id: TextNameSearch.domain_search,
        company_id: TextNameSearch.company_search,
      },
      set_department,
      isCallFuncLogOn,
    );
  }, [TextNameSearch.domain_search, TextNameSearch.company_search]);
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
          <Grid size={4}>
            <AutocompleteComboBox
              value={
                company?.find(
                  (item: any) =>
                    String(item.company_id) === String(TextNameSearch.company_search)
                ) ||
                company?.find(
                  (item: any) =>
                    String(item.company_id) === String(user[0]?.itasset_company_id)
                ) ||
                null
              }
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
              readonly={!isItAdmin}
            />
          </Grid>

          <Grid size={4}>
            <AutocompleteComboBox
              value={
                domain?.find(
                  (item: any) =>
                    item.domain_id === TextNameSearch.domain_search
                ) ||
                domain?.find(
                  (item: any) =>
                    String(item.domain_id) === String(user[0]?.domain_name)
                ) ||
                null
              }
              labelName="โรงงาน (Factory)"
              options={domain || []}
              column="domain_name"
              setvalue={(val) => {
                handleDomainChange(val);
                setTextNameSearch({
                  ...TextNameSearch,
                  domain_search: val?.domain_id || "", // เก็บแค่ id เป็น string
                })
              }}
              readonly={!isItAdmin}
            />
          </Grid>
          <Grid size={4}>
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
          isItAdmin={isItAdmin}
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
        buttonText={"บันทึก"}
        handleClose={handleClose}
        handlefunction={DepartmentSettingAdd}
        buttonColor="success"
        element={
          <DepartmentSettingBody
            isItAdmin={isItAdmin}
            action="Add"
            handleOpenAdd={handleOpenAddList}
            validateText={{
              Company_Area: companyAreaError,
              Domain_Area: domainAreaError,
              Department_Area: departmentAreaError,
              Email_Area: emailAreaError,
              Username_Area: usernameAreaError,
            }}
            onCompanyAreaChange={(val) => {
              setdept_company(val);
              setCompanyAreaError(false);
            }}
            onDomainAreaChange={(val) => {
              setdept_domain(val);
              setDomainAreaError(false);
            }}
            onDepartmentAreaChange={(val) => {
              setdomain_dept_id(val);
              setDepartmentAreaError(false);
            }}
            onEmailAreaChange={(val) => {
              setdept_email(val);
              setEmailAreaError(false);
            }}
            existingData={datalist}
          />


        }
      />

      <FuncDialog
        open={openDepartmentSettingEdit}
        dialogWidth="xl"
        openBottonHidden={true}
        hideReject={true}
        titlename={'DepartmentSetting // แก้ไขข้อมูล'}
        buttonText={"บันทึก"}
        handleClose={handleClose}
        handlefunction={DepartmentSettingEdit}
        hideSaveDraft={true}
        buttonColor="success"
        element={<DepartmentSettingBody
          isItAdmin={isItAdmin}
          action="Edit"
          handleOpenAdd={handleOpenAddList}
          validateText={{
            Company_Area: companyAreaError,
            Domain_Area: domainAreaError,
            Department_Area: departmentAreaError,
            Email_Area: emailAreaError,
            Username_Area: usernameAreaError,

          }}
          onCompanyAreaChange={(val) => {
            setdept_company(val);
            setCompanyAreaError(false);
          }}
          onDomainAreaChange={(val) => {
            setdept_domain(val);
            setDomainAreaError(false);
          }}
          onDepartmentAreaChange={(val) => {
            setdomain_dept_id(val);
            setDepartmentAreaError(false);
          }}
          onEmailAreaChange={(val) => {
            setdept_email(val);
            setEmailAreaError(false);
          }}
          existingData={datalist}
        />}
      />

      <FuncDialog
        open={openDepartmentSettingDelete}
        dialogWidth="xl"
        hideSaveDraft={true}
        openBottonHidden={true}
        hideReject={true}
        titlename={'DepartmentSetting // ลบข้อมูล'}
        buttonText={"ลบข้อมูล"}
        handleClose={handleClose}
        handlefunction={DepartmentSettingDelete}
        buttonColor="error"
        element={<DepartmentSettingBody
          isItAdmin={isItAdmin}
          action="Delete"
        />}
      />
    </>
  );
}

