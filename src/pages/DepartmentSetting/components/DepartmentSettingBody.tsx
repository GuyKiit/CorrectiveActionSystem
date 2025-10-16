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
import {  mas_DomainGet } from "../../../service/mas/lov";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Validate = {
    Product_Group: boolean;
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
    onBlocksChange?: (blocks: Block[]) => void;
    handleOpenAdd?: () => void;
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
    onBlocksChange,
    validateDetailText,
    handleOpenAdd,
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
        dataset_username, setdataset_username,
        dataset_company, setdataset_company,
        dataset_department, setdataset_department,
        dataset_domain, setdataset_domain

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

    // Event Handlers =========================================================
    const handleCompanyChange = (value: any) => {
      console.log('####### Onchange Company Value [event] : ', value);

      if (value != null) {
        mas_DomainGet(value.company_id, setdataset_domain, user, isCallFuncLogOn);
      }

    };
    //  const handleDomainChange = (value: any) => {
    //   console.log('####### Onchange Company Value [event] : ', value);

    //   if (value != null) {
    //     mas_DepartmentDomainGet(value.domain_dept_id, setdataset_department, user, isCallFuncLogOn);
    //   }

    // };

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

    // ลบไฟล์


    React.useEffect(() => {
        const updateData = async () => {
            try {
                console.log("👀 dataset_username:", dataset_username);
                console.log("👀 dataelement.sectionApprove:", dataelement?.sectionApprove);

                // ================================
                // 1) Map ค่า default ของ department
                // ================================
                if (Array.isArray(dataset_department) && dataelement?.domain_dept_id) {
                    console.log("👀👀 : ", dataelement);
                    console.log("🗺️ Looking for department with ID:", dataelement.domain_dept_id);
                    console.log("🗺️ Available departments:", dataset_department);

                    const mappedDept = await setValueMas(
                        dataset_department,
                        dataelement.domain_dept_id,
                        "domain_dept_id"
                    );

                    console.log("🗺️ Mapped department result:", mappedDept);
                    if (mappedDept) {
                        setdomain_dept_id(mappedDept); // ค่า default ของ Combobox
                    } else {
                        console.warn("⚠️ No department found for ID:", dataelement.domain_dept_id);
                    }
                }
                // ================================
                // 2) Map ค่า default ของ sectionApprove
                // ================================

                if (Array.isArray(dataset_username) && Array.isArray(dataelement?.deptApproveSetup)) {
                    // -------------------------------
                    // Step 1 → sectionApprove
                    // -------------------------------
                    const step1UserId = dataelement.deptApproveSetup.find(
                        (x: any) => String(x.step) === "1"
                    )?.user_id;

                    const mappedSectionApprove = dataset_username.find(
                        (el: any) => String(el.employee_username) === String(step1UserId)
                    );

                    console.log("🗺️ Step 1 mapped sectionApprove:", mappedSectionApprove);
                    if (mappedSectionApprove) setsectionApprove(mappedSectionApprove);

                    // ------------------------------- 
                    // Step 2 → qcApprove
                    // -------------------------------
                    const step2UserId = dataelement.deptApproveSetup.find(
                        (x: any) => String(x.step) === "2"
                    )?.user_id;

                    const mappedQcApprove = dataset_username.find(
                        (el: any) => String(el.employee_username) === String(step2UserId)
                    );

                    console.log("🗺️ Step 2 mapped qcApprove:", mappedQcApprove);
                    if (mappedQcApprove) setqcApprove(mappedQcApprove);
                }


                // ================================
                // 4) Map ค่า default ของ domain
                // ================================
                if (Array.isArray(dataset_domain) && dataelement?.dept_domain) {
                    console.log("😼 Looking for department with ID:", dataelement.dept_domain);
                    console.log("😼 Available departments:", dataset_domain);

                    const mappedDept = await setValueMas(
                        dataset_domain,
                        dataelement.dept_domain,
                        "domain_id"
                    );
                    console.log("😼 Mapped department result:", mappedDept);
                    if (mappedDept) {
                        setdept_domain(mappedDept); // ค่า default ของ Combobox
                    } else {
                        console.warn("⚠️😼 No department found for ID:", dataelement.dept_domain);
                    }
                }
                // ================================
                // 3) Map ค่า default ของ company
                // ================================
                if (Array.isArray(dataset_company) && dataelement?.dept_company) {
                    const mappedDept = await setValueMas(
                        dataset_company,
                        dataelement.dept_company,
                        "company_id"
                    );

                    if (mappedDept) {
                        setdept_company(mappedDept); // ค่า default ของ Combobox
                    }
                }
            } catch (err) {
                console.error("updateData error:", err);
            }
        };
        console.log("dataset_company", dataset_company);
        console.log("dataset_domain", dataset_domain);
        console.log("dataset_department", dataset_department);
        updateData();
    }, [

        action,
        dataelement,
        dataset_username,
        dataset_department,
        dataset_company,
        dataset_domain

    ]);

    ////////////////////// Complaint Read //////////////////////////
    React.useEffect(() => {
        console.log("step: 5 เก็บข้อมูลเข้า ฺsetdataelement ใหม่ ", dataelement)

        if (dataelement && action != "Add") {
            // department mapping จะทำใน useEffect แรกแล้ว (บรรทัด 255-268)
            setdept_company(dataelement?.dept_company ? dataelement?.dept_company : "");
            setdept_email(dataelement?.dept_email ? dataelement?.dept_email : "");
            setstep(dataelement?.step ? dataelement?.step : "");
            // setsectionApprove(dataelement?.sectionApprove ? dataelement?.sectionApprove : "");
            setqcApprove(dataelement?.qcApprove ? dataelement?.qcApprove : "");
        }
    }, [dataelement, dataset_department, dataset_username, dataset_company]);

    React.useEffect(() => {
        console.log("🧩 useEffect triggered: dataset_company or dataelement changed");
        console.log("🧩🧩🧩 dataset_company:", dataset_company, "🧩🧩🧩");
        console.log("🧩🧩🧩dept_company:", dataset_username);
        console.log("dataelement:", dataelement);
    }, [dataset_company, dataelement]);

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
                                options={dataset_company}
                                column="company_name"
                                setvalue={(val) => {
                                    console.log("Company selected:", val?.company_name);
                                    handleCompanyChange(val);
                                    setdept_company(val);
                                }}
                                readonly={isActionRead || isActionDelete || isActionExplain}
                            />
                        </Grid>
                        <Grid size={4}>
                            <AutocompleteComboBox
                                required="required"
                                value={dept_domain}
                                labelName={
                                    "โดเมน (Domain)"
                                }
                                options={dataset_domain}
                                column="domain_name"
                                setvalue={(val) => {
                                    console.log("Domain selected:", val?.domain_name);
                                    setdept_domain(val);
                                }}
                                bgcolorTextField={
                                    action === "Add" ? false : isActionEdit ? false : true
                                }
                                readonly={isActionRead || isActionDelete}
                            />
                        </Grid>

                        <Grid size={4}>
                            <AutocompleteComboBox
                                required="required"
                                value={domain_dept_id}
                                labelName={
                                    "แผนก (Department)"
                                }
                                options={dataset_department}
                                column="department_name"
                                setvalue={(val) => {
                                    console.log("Department selected:", val?.department_name);
                                    console.log("Department selected:", val?.department_id);
                                    console.log("Department selected:", val?.domain_dept_id);
                                    setdomain_dept_id(val);
                                }}
                                bgcolorTextField={
                                    action === "Add" ? false : isActionEdit ? false : true
                                }
                                readonly={isActionRead || isActionDelete}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FullWidthTextField
                                required="required"
                                value={dept_email}
                                labelName="อีเมล (Email)"
                                onchange={(e) => {
                                    console.log("Email changed:", e?.dept_email)
                                    setdept_email(e)
                                }}
                                readonly={isActionRead || isActionDelete}
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
                    <Grid container spacing={3}>
                        <Grid size={3}>
                            <FullWidthTextField
                                required="required"
                                value={1}
                                labelName="ลำดับ (No.)"
                                onchange={(e) => setstep(e)}
                                readonly
                                textAlignTextField="center"
                            />
                        </Grid>
                        <Grid size={9}>
                            <AutocompleteComboBox
                                required="required"
                                value={sectionApprove}
                                labelName={
                                    "ชื่อ (Username)"
                                }
                                options={dataset_username}
                                column="employee_username"
                                setvalue={(val) => {
                                    console.log("Username selected:", val?.employee_username);
                                    setsectionApprove(val);
                                }}
                                bgcolorTextField={
                                    action === "Add" ? false : isActionEdit ? false : true
                                }
                                readonly={isActionRead || isActionDelete}
                            />
                        </Grid>
                        <Grid size={3}>
                            <FullWidthTextField
                                required="required"
                                value={2}
                                labelName="ลำดับ (No.)"
                                onchange={(e) => setstep(e)}
                                readonly
                                textAlignTextField="center"
                            />
                        </Grid>
                        <Grid size={9}>
                            <AutocompleteComboBox
                                required="required"
                                value={qcApprove}
                                labelName={
                                    "ชื่อ (Username)"
                                }
                                options={dataset_username}
                                column="employee_username"
                                setvalue={(val) => {
                                    console.log("Username selected:", val?.employee_username);
                                    setqcApprove(val);
                                }}
                                bgcolorTextField={
                                    action === "Add" ? false : isActionEdit ? false : true
                                }
                                readonly={isActionRead || isActionDelete}
                            />
                        </Grid>

                    </Grid>
                </Paper>
            </Grid>
        </Box >
    );
}
