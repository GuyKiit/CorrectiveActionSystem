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
    Stack, AccordionDetails, Accordion, AccordionSummary, Typography,
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
import { log } from "node:console";
import { cleanAccessData } from "../../../service/initmain/initmain";
// import { useListComplaint } from "../core/ListComplaintContext";
import { data } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useListDepartmentSetting } from "../core/ListDepartmentSettingContext";
import { mas_DepartmentDomainGet, mas_DomainGet } from "../../../service/mas/lov";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

interface DepartmentSettingBody {
    action: string;
    disableTextField?: boolean;
    readonlyTextField?: boolean;
    bgcolorTextField?: boolean;
    disableComBoBox?: boolean;
    dataelement?: any;
    validateText?: Validate;
    validateDetailText?: { [index: number]: detail };
    validateStep?: { [step: string]: boolean };
    onBlocksChange?: (blocks: Block[]) => void;
    handleOpenAdd?: () => void;
    onCompanyAreaChange?: (val: any) => void;
    onDomainAreaChange?: (val: any) => void;
    onDepartmentAreaChange?: (val: any) => void;
    onEmailAreaChange?: (val: any) => void;
    onSectionAreaChange?: (val: any) => void;
    onQcAreaChange?: (val: any) => void;
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

export default function DepartmentSettingBody({
    action,
    readonlyTextField,
    bgcolorTextField,
    validateText,
    validateStep,
    onBlocksChange,
    validateDetailText,
    handleOpenAdd,
    onCompanyAreaChange,
    onDomainAreaChange,
    onDepartmentAreaChange,
    onEmailAreaChange,
    onSectionAreaChange,
    onQcAreaChange,
}: DepartmentSettingBody) {
    const isActionRead = action === "Read" || action === "ExplainRead";
    const isActionAdd = action === "Add";
    const isActionEdit = action === "Edit";
    const isActionDelete = action === "Delete";
    const isActionExplain = action === "Explain";
    const isActionExplainAdd = action === "ExplainAdd";


    const user = cleanAccessData("userSession");

    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [approveState, setApproveState] = useState<Record<string, any>>({});
    const [validateStepState, setValidateStepState] = useState<{ [step: string]: boolean }>({});
    const stepValidation = validateStep || validateStepState;
    const {
        dataelement,
        dept_id,
        domain_dept_id,
        dept_email,
        approve_id,
        step,
        sectionApprove,
        qcApprove,
        dept_company,
        dept_domain,

        setdataelement,
        setdept_id,
        setdomain_dept_id,
        setdept_email,
        setapprove_id,
        setstep,
        setsectionApprove,
        setqcApprove,

        setdept_company,
        setdept_domain,

        //---------dataset-------------
        username, set_username,
        company, set_company,
        department, set_department,
        domain, set_domain,
        datastatus, setdatastatus,
        datastatusconfig, setdatastatusconfig,
        approveCard, setapproveCard,
        //====================================
        //--------GetMaster(All)-------
        master_domain, setmaster_domain,
        master_department, setmaster_department,
        master_user, setmaster_user
        //====================================

    } = useListDepartmentSetting();

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
    const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>([]);
    const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
    const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
    const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);
    const [filteredTooluse, setFilteredToolUse] = useState<LovType[]>([]);
    const [filteredDecision, setFilteredDecision] = useState<LovType[]>([]);
    const [filteredSecApprove, setFilteredSecApprove] = useState<LovType[]>([]);
    const [filteredQcApprove, setFilteredQcApprove] = useState<LovType[]>([]);
    // Value Variables ======================================================
    const [dataComplaintType, setdataComplaintType] = useState<LovType[]>([]);
    const [dataComplaintRs, setdataComplaintRs] = useState<LovType[]>([]);
    const [dataphoto, setdataphoto] = useState<LovType[]>([]);
    const [datapriority, setdatapriority] = useState<LovType | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [fileAttachmentTypes, setFileAttachmentTypes] = useState<{ [fileIndex: number]: string; }>({});
    const [fileOtherTexts, setFileOtherTexts] = useState<{ [fileIndex: number]: string; }>({});
    const [fileList, setFileList] = useState<FileData[]>([]);
    const [request_department_id, setrequest_department_id] = React.useState<{ itasset_department_id: number; itasset_department_name: string; } | null>(null);
    const [dataDecision, setdataDecision] = useState<LovType[]>([]);
    const [approveStates, setApproveStates] = useState<Record<string, any>>({});
    // const [dept_domain, setdept_domain] = useState<any>(null);
    // const [sectionApprove, setsectionApprove] = useState<any>(null);
    // const [qcApprove, setqcApprove] = useState<any>(null);

    // Event Handlers =========================================================
    const handleCompanyChange = (value: any) => {
        // console.log('####### Onchange Company Value [event] : ', value);
        // console.log("@@@@@@@@@@@@First", domain);


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
        }
        // console.log("@@@@@@@@@@@@second", domain);
    };

    //==============================================================================

    const handleDomainChange = (value: any) => {
        console.log("####### Onchange Domain Value [event] :", value);

        if (value && value.domain_id && value.company_id) {
            const dataset = {
                domain_id: value.domain_id,
                company_id: value.company_id,
            };

            mas_DepartmentDomainGet(value, set_department, isCallFuncLogOn);

            const approveRows = datastatus.filter(
                (val: any) => val.lov_code === "APPROVE"
            );

            const FilterUser = master_user.filter((val: any) => {
                const domainMatch = String(val.domain_id || "") === String(value.domain_id || "");
                const companyMatch = Number(val.itasset_company_id || 0) === Number(value.company_id || 0);
                return domainMatch && companyMatch;
            });

            // ✅ สร้าง approveStates object ตาม approveRows
            const newApproveStates: Record<string, any> = {};

            approveRows.forEach((row: any) => {
                const stepKey = row.lov3;
                const usersInDomain = FilterUser.filter(
                    (u: any) => u.domain_id === value.domain_id
                );
                newApproveStates[stepKey] = usersInDomain[0] || null;
            });

            set_username(FilterUser);
            setApproveStates(newApproveStates);

        } else {
            set_department([]);
            set_username([]);
            setApproveStates({});
        }
    };



    const handleDepartmentChange = (val: any) => {
        console.log('####### Onchange Department Value [event] : ', val);

        if (val != null) {
            const dataset = {
                domain_id: dept_domain?.domain_id || val.domain_id,
                company_id: dept_company?.company_id || val.company_id,
                department_id: val.department_id, // ✅ ต้องมีอันนี้ด้วย
            };

            console.log("😋 ส่งค่าไป UsernameGet :", dataset);

        } else {
            set_username([]);
            setsectionApprove(null);
            setqcApprove(null);
        }
    };

    const handleApproveCard = (val: any) => {


    };

    //========================================================================================

    // Functions (Initial, Calculation or ETC.) =================================================
    const resetForm = () => {
        if (true) console.log("🕑 ", dayjs().format('HH:mm:ss.SSS'), " [Calling Function]  :  resetForm");

        // setdataReportTypeValue("");
        // setcas_number("");
        // setproduct_name("");
        // setlot_no("");
        // setrequest_name("");
        // setrequest_company_id(null);
        // setrequest_domain_id("");
        // setrequest_department_id(null);
        // setrequest_position("");
        // setrequest_email("");
        // setrequest_phone("");
        // setrespondent_company_id(null);
        // setrespondent_domain_id("");
        // setrespondent_department_id(null);
        // setrespondent_email("");

        // setdoc_date(dayjs(null));
        // setrespond_date_within(dayjs(null));
        // setdetail("");
        // setcompTypeOther("");
        // setotherText("");
        // setcompRsOther("");

    };

    // ============================
    // 1️⃣ UseEffect สำหรับ Map ค่าเริ่มต้น
    // ============================
    React.useEffect(() => {
        const mapInitialValues = async () => {
            try {
                console.log("⭐ step:4.1 Map ค่าเริ่มต้นจาก Datatable");
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


    // ============================
    // 2️⃣ UseEffect สำหรับ Filter และ Map user หลังจาก state พร้อม
    // ============================
    React.useEffect(() => {
        const processUserMapping = async () => {
            try {
                console.log("⭐ step:4.2 Filter + Map user");

                if (!dataelement || !Array.isArray(master_user)) return;

                // ✅ Filter เฉพาะ user ที่ตรงกับ domain & company
                const FilterUser = master_user.filter((val: any) => {
                    const domainMatch = String(val.domain_id || '') === String(dataelement.domain_id || '');
                    const companyMatch = Number(val.itasset_company_id || 0) === Number(dataelement.company_id || 0);
                    return domainMatch && companyMatch;
                });

                // ✅ Map id จาก deptApproveSetup
                const MappedUserWithSetupId = FilterUser.map((val: any) => {
                    const matched = dataelement?.deptApproveSetup?.find(
                        (setup: any) => setup.user_id === val.employee_username
                    );
                    return {
                        ...val,
                        deptApproveSetup_id: matched?.id || null,
                    };
                });

                set_username(FilterUser);

                // ==========================
                // Mapping Approve Steps
                // ==========================
                if (Array.isArray(dataelement?.deptApproveSetup)) {
                    const approveRows = datastatus.filter((val: any) => val['lov_code'] === 'APPROVED');

                    const stepMap: Record<string, any[]> = {};
                    dataelement.deptApproveSetup.forEach((d: any) => {
                        if (!stepMap[d.step]) stepMap[d.step] = [];
                        stepMap[d.step].push(d);
                    });

                    const mappedStates: Record<string, any[]> = {};
                    for (const row of approveRows) {
                        const stepKey = row.lov3;
                        const stepData = stepMap[stepKey] || [];
                        if (stepData.length > 0) {
                            const userIds = stepData.map((s: any) => s.user_id);
                            const mapped = await setValueMas(master_user, userIds, "employee_username");
                            mappedStates[stepKey] = mapped;
                        } else {
                            mappedStates[stepKey] = [];
                        }
                    }

                    const setValueMap: Record<string, Function> = {
                        "1": setsectionApprove,
                        "2": setqcApprove,
                    };

                    for (const [stepKey, users] of Object.entries(mappedStates)) {
                        const u = Array.isArray(users) ? users[0] : users;
                        if (u) {
                            const formattedUser = {
                                ...u,
                                display_name: u.employee_username
                                    ? `${u.fullname_th || u.fullname_en || ""} (${u.employee_username})`
                                    : `${u.fullname_th || u.fullname_en || ""}`,
                            };
                            setValueMap[stepKey]?.(formattedUser);
                        } else {
                            setValueMap[stepKey]?.(null);
                        }
                    }
                }

            } catch (err) {
                console.error("processUserMapping error:", err);
            }
        };

        if (!isActionAdd && dataelement) processUserMapping();
    }, [dataelement, master_user, datastatus]);


    ////////////////////// DepartmentSetting Read //////////////////////////
    React.useEffect(() => {
        console.log("⭐step: 5 เก็บข้อมูลเข้า ฺsetdataelement ใหม่ ")

        if (dataelement && action != "Add") {

            setdept_email(dataelement?.dept_email ? dataelement?.dept_email : "");
        }
    }, [dataelement]);


    // let FilteredData = datastatusconfig.filter((val: any) => val['lov_code'] == 'APPROVE');
    // console.log("FilteredData:", FilteredData);
    // console.log("datastatus:", datastatus);

    // const approveRows = datastatus.filter((val: any) => val['lov_code'] == 'APPROVE');

    // React.useEffect(() => {

    // setapproveCard(datastatusconfig.filter((val: any) => val['lov_code'] == 'APPROVE'));

    // } , [datastatusconfig]);

    // ============================ Approve Rows Filter ==================================
    const approveRows = React.useMemo(() => {
        if (!Array.isArray(datastatus)) return [];
        return datastatus.filter(
            (item: any) =>
                item.lov_code === "APPROVED" &&
                item.lov7 === dept_domain?.domain_id
        );
    }, [datastatus, dept_domain]);

    console.log("🚀 validateText.Company_Area (Body) =", validateText?.Company_Area);


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
                    <Grid container spacing={3}>
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
                                    console.log("เลือกบริษัท:", val);
                                    console.log("🚀 validateText.Company_Area (Body) =", validateText?.Company_Area);
                                    setdept_company(val);
                                    handleCompanyChange(val);
                                    onCompanyAreaChange?.(val);
                                }}
                                readonly={isActionRead || isActionDelete}
                                Validate={validateText?.Company_Area || false}
                                validateTextLable={validateText?.Company_Area ? "กรุณาเลือกบริษัท (Company)" : ""}

                            />
                        </Grid>
                        <Grid size={4}>
                            <AutocompleteComboBox
                                required="required"
                                value={dept_domain}
                                labelName={
                                    "โดเมน (Domain)"
                                }
                                options={domain}
                                column="domain_name"
                                setvalue={(val) => {
                                    console.log("Domain selected:", val?.domain_name);
                                    setdept_domain(val);
                                    handleDomainChange(val);
                                    if (onDomainAreaChange) {
                                        onDomainAreaChange(val);
                                    }
                                }}

                                bgcolorTextField={
                                    isActionAdd ? false : isActionEdit ? false : true
                                }
                                readonly={isActionRead || isActionDelete || !dept_company}
                                Validate={validateText?.Domain_Area || false}
                                validateTextLable={
                                    validateText?.Domain_Area
                                        ? "กรุณาเลือกโดเมน (Domain)"
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
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            {/* รายละเอียด ผู้อนุมัติ */}
            <Grid container spacing={2}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mt: 3,
                        width: "100%",
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #e8f5e9   0%, #ffffff  100%)",
                        border: "1px solid #90caf9",
                        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.1)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 3,
                            pb: 2,
                            borderBottom: "2px solid #4caf50",
                        }}
                    >
                        <Box
                            sx={{
                                width: 6,
                                height: 24,
                                backgroundColor: "#43a047",
                                borderRadius: 1,
                                mr: 2,
                            }}
                        />
                        <label
                            className="sarabun-regular-datatable"
                            style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#2e7d32",
                                margin: 0,
                            }}
                        >
                            รายละเอียดผู้อนุมัติ
                        </label>
                    </Box>

                    {/* ============================ Approve List ================================== */}
                    {/* Move console logs into an IIFE that returns null so JSX doesn't receive void */}
                    {(() => {
                        console.log("sectionApprove", sectionApprove);
                        console.log("qcApprove", qcApprove);
                        console.log("📏 approveRows:", approveRows);
                        console.log("📏 approveRows.length:", approveRows?.length);
                        console.log("👀 username:", username);
                        return null;
                    })()}

                    {approveRows && approveRows.length > 0 ? (
                        approveRows.map((row: any) => {
                            const stepKey = row["lov3"]; // lov3 คือ step
                            // Map step → state dynamically
                            const valueMap: Record<string, any> = {
                                "1": sectionApprove,
                                "2": qcApprove,
                                // ถ้ามี step เพิ่มเติม ให้เพิ่มที่นี่
                            };
                            const setValueMap: Record<string, Function> = {
                                "1": setsectionApprove,
                                "2": setqcApprove,
                                // เพิ่ม step ใหม่ตามต้องการ
                            };

                            return (
                                <Grid container spacing={3} paddingTop={3} key={uuidv4()}>
                                    <Grid size={2}>
                                        <FullWidthTextField
                                            required="required"
                                            value={row["lov3"]}
                                            labelName="ลำดับ (No.)"
                                            readonly
                                            textAlignTextField="center"
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <FullWidthTextField
                                            required="required"
                                            value={row["lov6"]}
                                            labelName="ตำแหน่ง (Role)"
                                            readonly
                                            textAlignTextField="center"
                                        />
                                    </Grid>
                                    <Grid size={7}>
                                        <AutocompleteComboBox
                                            required="required"
                                            value={valueMap[stepKey] || null}
                                            labelName="ชื่อ (Username)"
                                            options={
                                                Array.isArray(username)
                                                    ? username.map((u) => ({
                                                        ...u,
                                                        display_name: u.employee_username
                                                            ? `${u.fullname_th || u.fullname_en || ""} (${u.employee_username})`
                                                            : `${u.fullname_th || u.fullname_en || ""}`,
                                                    }))
                                                    : []
                                            }
                                            column="display_name"
                                            setvalue={(val) => {
                                                if (!val) return;

                                                // 1️⃣ หา record ใน deptApproveSetup
                                                const matched = dataelement?.deptApproveSetup?.find(
                                                    (item: any) => item.user_id === val.employee_username && item.step === stepKey
                                                );

                                                // 2️⃣ ถ้าไม่เจอ username เดิม ให้ fallback ใช้ id ของ step เดิม
                                                const stepId =
                                                    matched?.id ||
                                                    dataelement?.deptApproveSetup?.find((i: any) => i.step === stepKey)?.id;

                                                const newVal = { ...val, deptApproveSetup_id: stepId || null };

                                                setApproveState(prev => ({ ...prev, [stepKey]: newVal }));

                                                // Clear validation
                                                setValidateStepState(prev => ({ ...prev, [stepKey]: false }));
                                                console.log(`🎯 step ${stepKey} → deptApproveSetup_id:`, stepId);

                                                setValueMap[stepKey]?.(newVal);
                                            }}
                                            bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                                            readonly={isActionRead || isActionDelete || !dept_domain}
                                            Validate={validateStep?.[stepKey] || false}
                                            validateTextLable={
                                                validateStep?.[stepKey]
                                                    ? "กรุณาเลือกชื่อผู้อนุมัติ"
                                                    : ""
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            );
                        })
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
                            <Typography sx={{ fontSize: "16px", color: "#999" }}>
                                ไม่พบลำดับผู้อนุมัติ
                            </Typography>
                        </Paper>
                    )}

                    {/* ============================ Approve List ================================== */}

                </Paper>
            </Grid>
        </Box >
    );
}
