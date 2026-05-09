//ทำobj เป็น array
import React, { useState, useRef, use, useEffect } from "react";
import { setValueMas } from "../../../../libs/setvaluecallback";
import { _POST } from "../../../service/mas";
import {_formatNumber,_formatNumberNotdecimal,} from "../../../../libs/datacontrol";
import dayjs from "dayjs";
import {Box,Paper, Typography} from "@mui/material";
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import Grid from "@mui/material/Grid2";
import { useData } from "../../../auth/core/DataContext";
import { useLayout } from "../../../layout/core/LayoutProvider";
import { cleanAccessData } from "../../../service/initmain/initmain";
import { useListDepartmentSetting } from "../core/ListDepartmentSettingContext";
import { mas_DepartmentDomainGet, mas_DomainGet , mas_UsernameGet} from "../../../service/mas/lov";
import CustomMultiSelect from "../../../components/MUI/CustomMultiSelect";


type Validate = {
    Company_Area: boolean;
    Domain_Area: boolean;
    Department_Area: boolean;
    Email_Area: boolean;
    Username_Area: boolean;
    [step: string]: boolean;
};

type detail = {
    qty?: false;
};


interface DepartmentSettingBody {
    action: string;
    isItAdmin: boolean;
    disableTextField?: boolean;
    readonlyTextField?: boolean;
    bgcolorTextField?: boolean;
    disableComBoBox?: boolean;
    dataelement?: any;
    validateText?: Validate;
    validateDetailText?: { [index: number]: detail };
    validateStep?: { [step: string]: boolean };
    handleOpenAdd?: () => void;
    onCompanyAreaChange?: (val: any) => void;
    onDomainAreaChange?: (val: any) => void;
    onDepartmentAreaChange?: (val: any) => void;
    onEmailAreaChange?: (val: any) => void;
    onSectionAreaChange?: (val: any) => void;
    onQcAreaChange?: (val: any) => void;
    existingData?: any[];
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


export default function DepartmentSettingBody({
    action,
    isItAdmin,
    validateText,
    handleOpenAdd,
    onCompanyAreaChange,
    onDomainAreaChange,
    onDepartmentAreaChange,
    onEmailAreaChange,
    existingData,
}: DepartmentSettingBody) {
    const isActionRead = action === "Read" || action === "ExplainRead";
    const isActionAdd = action === "Add";
    const isActionEdit = action === "Edit";
    const isActionDelete = action === "Delete";


    const user = cleanAccessData("userSession");
    const {
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

        //---------dataset-------------
        username, set_username,
        company, set_company,
        department, set_department,
        domain, set_domain,
        datastatus, setdatastatus,
        //====================================
        //--------GetMaster(All)-------
        master_domain, setmaster_domain,
        master_department, setmaster_department,
        //====================================

    } = useListDepartmentSetting();

    // Utility Variables ======================================================
    const { Customer } = useData();
    const { setIsLoadingScreen } = useLayout();

    // For On-Off Calling Function Log
    const [isCallFuncLogOn] = useState(true);
    const [usernameOptions, setUsernameOptions] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

    // Event Handlers =========================================================
    const handleCompanyChange = (value: any) => {
        if (value != null) {
            mas_DomainGet(value.company_id, set_domain, user, isCallFuncLogOn);
        } else {
            set_domain([]);
            set_department([]);
            set_username([]);
            setdept_domain(null);
            setdomain_dept_id(null);
        }
    };
    //==============================================================================
    const handleDomainChange = (value: any) => {
         setdept_domain(value);
         setdomain_dept_id(null);
         set_department([])

        if (value) {
            const dataset = {
                domain_id: value.domain_id,
                company_id: dept_company?.company_id ?? user[0]?.itasset_company_id, 
            };
            mas_DepartmentDomainGet(dataset, set_department, isCallFuncLogOn);
        } 
    };

    const handleDepartmentChange = (val: any) => {

        if (val != null) {
            setdomain_dept_id(val);
            setSelectedUsers([]);
            const dataset = {
                domain_id: dept_domain?.domain_id || val.domain_id,
                company_id: dept_company?.company_id || val.company_id,
                department_id: val.department_id, 
            };
            mas_UsernameGet(dataset, setUsernameOptions, isCallFuncLogOn);
        } else {
            setUsernameOptions([]);
        }
    };

    //========================================================================================

    // ============================
    // 1️⃣ UseEffect สำหรับ Map ค่าเริ่มต้น
    // ============================
    
    React.useEffect(() => {
        const mapInitialValues = async () => {
            try {
                if (!dataelement) return;

                // 🏢 Map Company
                if (Array.isArray(company) && dataelement?.company_id) {
                    const mappedCompany = await setValueMas(company, dataelement.company_id, "company_id");
                    if (mappedCompany) setdept_company(mappedCompany);
                    mas_DomainGet(dataelement?.company_id, set_domain, user, isCallFuncLogOn);
                }

                // 🌐 Map Domain
                if (Array.isArray(master_domain) && dataelement?.domain_id) {
                    const mappedDomain = await setValueMas(master_domain, dataelement.domain_id, "domain_id");
                    if (mappedDomain) setdept_domain(mappedDomain);

                    const values = {
                        domain_id: dataelement?.domain_id,
                        company_id: Number(dataelement?.company_id) || 0,
                    };
                    mas_DepartmentDomainGet(values, set_department, isCallFuncLogOn);
                }

                // 🏬 Map Department
                if (Array.isArray(master_department) && dataelement?.domain_dept_id) {
                    const mappedDept = await setValueMas(master_department, dataelement.domain_dept_id, "domain_dept_id");
                    if (mappedDept) setdomain_dept_id(mappedDept);
                }

            } catch (err) {
                console.error("mapInitialValues error:", err);
            }
        };

        if (!isActionAdd && dataelement) mapInitialValues();
    }, [dataelement, company, master_domain, master_department]);


    React.useEffect(() => {
        // Only run on mount for Add action
        if (!isActionAdd) return;

        const InitialValuesCompanyandDomain = async () => {
            try {
                if (Array.isArray(company)) {
                    // 1. Find and set initial company
                    const mappedCompany = await setValueMas(
                        company,
                        user[0]?.itasset_company_id,
                        "company_id"
                    );
                    if (mappedCompany) {
                        setdept_company(mappedCompany); // Set initial company

                        // 2. Fetch domain list for this company and set as options
                        const tempDomain = await new Promise<any[]>((resolve) => {
                            mas_DomainGet(
                                mappedCompany.company_id,
                                (domains: any[]) => {
                                    set_domain(domains);
                                    resolve(domains);
                                },
                                user,
                                isCallFuncLogOn
                            );
                        });

                        // 3. Find and set initial domain from the fetched list
                        if (Array.isArray(tempDomain)) {
                            const mappedDomain = await setValueMas(
                                tempDomain,
                                user[0]?.employee_domain,
                                "domain_id"
                            );
                            if (mappedDomain) {

                                const dataset = {
                                  domain_id: user[0]?.employee_domain,
                                  company_id: user[0]?.itasset_company_id,
                                };

                                setdept_domain(mappedDomain); // Set initial domain
                                mas_DepartmentDomainGet(dataset, set_department, isCallFuncLogOn);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("setCompanyValues error:", err);
            }
        };

        InitialValuesCompanyandDomain();
    }, []);

    ////////////////////// DepartmentSetting Read //////////////////////////

    React.useEffect(() => {
        if (dataelement && action != "Add") {
            setdept_email(dataelement?.dept_email ? dataelement?.dept_email : "");
        }
    }, [dataelement]);

    // ============================ Set Email จาก selectedUsers ==================================

    React.useEffect(() => {
    if (!isActionAdd && !isActionEdit) return;
      if (!selectedUsers || selectedUsers.length === 0) {
        setdept_email("");
        return;
      }
    
      const emails = selectedUsers
        .map(u => u.employee_email)
        .filter(Boolean); // กัน null / undefined
    
      setdept_email(emails.join(","));
    }, [selectedUsers]);

    //=========================================================================================

    return (
        <Box
            sx={{
                p: 2,
                mb: 2,
                border: "2px solid #39a2f2",
                borderRadius: 2,
                backgroundColor: "#ffffff",
                // boxShadow: '0 0 10px 2px rgba(0, 98, 233, 0.5)',
                // transition: 'box-shadow 0.3s ease',
                // '&:hover': {
                //   boxShadow: '0 0 20px 4px rgba(0, 98, 233, 0.8)',
                // },
            }}
        >
            {/* ====== Dynamic ฟอร์ม สำหรับเลือกประเภทเอกสาร ====== */}

            <Grid container spacing={2}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mt: 3,
                        width: "100%",
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #e3f2fd  0%, #ffffff  100%)",
                        border: "1px solid #90caf9",
                        boxShadow: "0 4px 12px rgba(33, 150, 243, 0.1)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 3,
                            pb: 2,
                            borderBottom: "2px solid #2196f3",
                        }}
                    >
                        <Box
                            sx={{
                                width: 6,
                                height: 24,
                                backgroundColor: "#39a2f2",
                                borderRadius: 1,
                                mr: 2,
                            }}
                        />
                        <label
                            className="sarabun-regular-datatable"
                            style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1565c0",
                                margin: 0,
                            }}
                        >
                            รายละเอียดแผนก
                        </label>
                    </Box>
                    <Grid container spacing={3} >
                        <Grid size={4}>
                            <AutocompleteComboBox
                                required="required"
                                value={dept_company}
                                labelName={
                                    "บริษัท (Company)"
                                }
                                options={company}
                                column="company_name"
                                setvalue={(val) => {
                                    setdept_company(val);
                                    handleCompanyChange(val);
                                    onCompanyAreaChange?.(val);
                                }}
                                readonly={isActionRead || isActionDelete || !isItAdmin}
                                Validate={validateText?.Company_Area || false}
                                validateTextLable={validateText?.Company_Area? "กรุณาเลือกบริษัท (Company)": ""}
                            />
                        </Grid>
                        <Grid size={4}>
                            <AutocompleteComboBox
                                required="required"
                                value={dept_domain}
                                labelName={
                                    "โรงงาน (Factory)"
                                }
                                options={domain}
                                column="domain_name"
                                setvalue={(val) => {
                                    setdept_domain(val);
                                    handleDomainChange(val);
                                    if (onDomainAreaChange) {
                                        onDomainAreaChange(val);
                                    }
                                }}
                                bgcolorTextField={
                                    isActionAdd ? false : isActionEdit ? false : true
                                }
                                readonly={isActionRead || isActionDelete || !dept_company || !isItAdmin}
                                Validate={validateText?.Domain_Area || false}
                                validateTextLable={
                                    validateText?.Domain_Area
                                        ? "กรุณาเลือกโรงงาน (Factory)"
                                        : ""
                                }
                            />
                        </Grid>
                        <Grid size={4}>
                            <AutocompleteComboBox
                                required="required"
                                value={domain_dept_id}
                                labelName={
                                    "แผนก (Department)"
                                }
                                options={department}
                                column="department_name"
                                setvalue={(val) => {
                                    handleDepartmentChange(val);
                                    setdomain_dept_id(val);
                                    if (onDepartmentAreaChange) {
                                        onDepartmentAreaChange(val);
                                    }
                                }}
                                bgcolorTextField={
                                    isActionAdd ? false : isActionEdit ? false : true
                                }
                                readonly={isActionRead || isActionDelete || !dept_domain}
                                Validate={validateText?.Department_Area || false}
                                validateTextLable={
                                    validateText?.Department_Area
                                        ? "กรุณาเลือกแผนก (Department)"
                                        : ""
                                }
                                getOptionDisabled={(option: any) => {
                                    if (!existingData || !dept_company || !dept_domain) return false;
                                    
                                    // Check if this option matches any existing entry
                                    const isDuplicate = existingData.some((item: any) => {
                                        // Skip checking against itself if editing
                                        if (isActionEdit && dataelement && item.id === dataelement.id) {
                                            return false;
                                        }

                                        return (
                                            String(item.company_id) === String(dept_company.company_id) &&
                                            String(item.domain_id) === String(dept_domain.domain_id) &&
                                            String(item.domain_dept_id) === String(option.domain_dept_id)
                                        );
                                    });
                                    
                                    return isDuplicate;
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FullWidthTextField
                                required="required"
                                value={dept_email}
                                labelName="อีเมล (Email)"
                                placeholderlabel="กรุณากรอกอีเมล"
                                onchange={(e) => {
                                    setdept_email(e)
                                    if (onEmailAreaChange) {
                                        onEmailAreaChange(e);
                                    }
                                }}
                                readonly={isActionRead || isActionDelete}
                                Validate={validateText?.Email_Area || false}
                                validateTextLable={
                                validateText?.Email_Area
                                        ? "กรุณากรอกรายละเอียด (Email)"
                                        : ""
                                }
                            />
                            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                                กรุณากรอกอีเมลที่ต้องการให้มีการส่งอีเมลแจ้งเตือน ยกตัวอย่างเช่น test1@your-company.com (ในกรณีที่มีหลายอีเมล กรุณาใช้ , ในการแบ่งอีเมล เช่น test1@your-company.com,test2@your-company.com,test3@your-company.com)
                            </Typography>
                           
                        </Grid>
                        <Grid size={12}>
                                 <div>
                                <CustomMultiSelect
                                  label="เลือกพนักงาน"
                                  options={usernameOptions}
                                  selected={selectedUsers}
                                  validate={validateText && validateText.employees}
                                  required
                                  onChange={(v) => {
                                    setSelectedUsers(v)
                                  }
                                  }
                                  disabledPositions={[
                                    "นักศึกษาฝึกงาน",
                                    "Outsource SSEC",
                                  ]}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Box >
    );
}
