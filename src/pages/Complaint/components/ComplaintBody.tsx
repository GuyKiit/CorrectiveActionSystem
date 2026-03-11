import React, { useState, useRef, useEffect } from "react";
import { setValueMas } from "../../../../libs/setvaluecallback";
import DeleteIcon from "@mui/icons-material/Delete";
import { _POST } from "../../../service/mas";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Button,
} from "@mui/material";
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import DesktopDatePickers from "../../../components/MUI/DesktopDatePicker";
import FullWidthTextArea from "../../../components/MUI/FullWidthTextFieldArea";
import FullWidthCheckbox from "../../../components/MUI/FullWidthCheckbox";
import Grid from "@mui/material/Grid2";
import { useData } from "../../../auth/core/DataContext";
import { useLayout } from "../../../layout/core/LayoutProvider";
import BrowseFileUpload from "./BrowseFileUpload";
import { cleanAccessData } from "../../../service/initmain/initmain";
import { useListComplaint } from "../core/ListComplaintContext";
import { ComplaintFile } from "./BrowseFileUpload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  mas_DepartmentGet_Complaint,
  mas_DomainRelateGet,
} from "../../../service/mas/lov";

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
  isItAdmin: boolean;
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
  handleOnclickPrint?: (item: any, name: string) => void;
  submitCount?: number;
  onAcknowledgeUpdate?: () => void;
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
  lov7: string;
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
  isItAdmin,
  validateText,

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
  onAcknowledgeUpdate,
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

  const {
    dataelement,
    setdataelement,
    cas_number,
    doc_date,
    date_of_detection,
    request_domain_id,
    respondent_company_id,
    respondent_domain_id,
    respondent_department_id,
    respondent_email,
    product_name,
    detail,
    respond_date_within,
    lot_no,
    compTypeOther,
    compRsOther,
    clauseOther,
    complaint_status_id,
    dataReportTypeValue,
    dataComplaintType_Combobox,
    dataComplaintRs_Combobox,
    datapriority,
    dataphoto_Combobox,
    datapriority_Combobox,
    dataApprove_Combobox,
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
    dataset_reporttype_inactive,
    dataset_company,
    dataset_department,
    dataset_department_respondent,
    dataset_domain,
    dataset_domainrelate,
    complaintFiles,
    followup_approve,
    domainrelate,
    explainList,
    dataset_configfile,
    closeFiles,

    setcas_number,
    setdoc_date,
    setdate_of_detection,
    setrequest_name,
    setrequest_company_id,
    setrequest_domain_id,
    setrequest_position,
    setrequest_email,
    setrequest_phone,
    setrespondent_company_id,
    setrespondent_domain_id,
    setrespondent_department_id,
    setrespondent_email,
    setproduct_name,
    setdetail,
    setpriority_level,
    setrespond_date_within,
    setlot_no,
    setcompTypeOther,
    setotherText,
    setcompRsOther,
    setclauseOther,
    setphoTypeOther,
    setcomplaint_status_id,
    setcomplaint_status_label,
    setdataReportTypeValue,
    setdataComplaintTypeValue_Combobox,
    setdataComplaintRsValue_Combobox,
    setdataphotoValue_Combobox,
    setdatapriority,
    setdatapriorityValue_Combobox,
    setclose_name,
    setclose_company_id,
    setclose_department_id,
    setclose_position,
    setclose_email,
    setclose_date,
    setclose_detail,
    setclose_note,

    // Dataset
    setdataset_department,
    setdataset_department_respondent,
    setcomplaintFiles,
    setfollowup_approve, //มันคือ Radio Close 
    set_domainrelate,
    setExplainList,
    setcloseFiles,
  } = useListComplaint();

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
  const { setIsLoadingScreen } = useLayout();

  // For On-Off Calling Function Log
  const [isCallFuncLogOn] = useState(true);

  // Get Master Variables ======================================================
  const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>([]);
  const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
  const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
  const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);
  const [filteredFuApprove, setFilteredFuApprove] = useState<LovType[]>([]);
  // Value Variables ======================================================
  const [dataComplaintType, setdataComplaintType] = useState<LovType[]>([]);
  const [dataComplaintRs, setdataComplaintRs] = useState<LovType[]>([]);
  const [dataphoto, setdataphoto] = useState<LovType[]>([]);
  const [fileList, setFileList] = useState<FileData[]>([]);

  const [request_department_id, setrequest_department_id] = React.useState<{
    itasset_department_id: number;
    itasset_department_name: string;
  } | null>(null);

  // Hidden Variables ======================================================
  const [isFormHidden, setisFormHidden] = useState(true);
  const [isCTHidden, setisCTHidden] = useState(true);
  const [isRSHidden, setIsRSHidden] = useState(true);

  const lastFetchedDepartment = React.useRef<{
    company: any;
    domain: any;
  } | null>(null);

  //=========================================================
  //              สร้าง state สำหรับควบคุม Accordion
  //====================== ผู้ออกร้องเรียน ========================//
  const defaultOpen = isActionAdd || isActionEdit;

  const [isMinimizecomplaintOpen, setisMinimizeComplaintOpen] = useState(defaultOpen);
  const [isMinimizetypeOpen, setisMinimizeTypeOpen] = useState(defaultOpen);
  const [isMinimizersOpen, setisMinimizeRsOpen] = useState(defaultOpen);
  const [isMinimizedetailOpen, setisMinimizeDetailOpen] = useState(defaultOpen);
  const [isMinimizepriorityOpen, setisMinimizePriorityOpen] = useState(defaultOpen);
  const [isMinimizefileOpen, setisMinimizeFileOpen] = useState(defaultOpen);
  const [isMinimizerespondOpen, setisMinimizeRespondOpen] = useState(defaultOpen);

  //====================== ส่วนกล่องชี้แจง ========================//
  const [isMinimizeexlistOpen, setisMinimizeExlistOpen] = useState(!(isActionAdd || isActionExplain || isActionExplainApproveSc || isActionExplainApproveQc || isActionClose) ? false : true);

  //====================== ส่วนกล่องปิดรายการ ========================//
  const [isMinimizecloseOpen, setisMinimizeCloseOpen] = useState(defaultOpen);
  const [isMinimizefuappOpen, setisMinimizeFuappOpen] = useState(true);
  const [isMinimizedeapp2Open, setisMinimizeDeapp2Open] = useState(true);
  const [isMinimizeotapp2Open, setisMinimizeOtapp2Open] = useState(true);
  const [isMinimizeclosedfileOpen, setisMinimizeClosedFileOpen] = useState(true);

  const isCrossCompany = dataset_crosscompany?.[0]?.lov_code == "1";
  const grouped = {
    config_file: dataset_configfile || [],
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
      setdataset_department_respondent,
      isCallFuncLogOn,
      user,
      action
    );
  };

  const handleReportTypeChange = async (val: LovType | null) => {
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
    if (Array.isArray(domainrelate)) {
      const mappedCompany = await setValueMas(
        domainrelate,
        user[0]?.employee_domain,
        "domain_id"
      );

      if (mappedCompany) {
        setrequest_domain_id(mappedCompany); // ค่า default ของ Combobox
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
    setrequest_email("");
    setrequest_phone("");
    setFileList([]);
    setcomplaintFiles([]);
  };

  const handleCheckboxChangeCT = (item: LovType) => {
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

      setdataComplaintTypeValue_Combobox(reducedArray);

      // Clear validation error when user selects/deselects complaint type
      if (onComplaintTypeChange) {
        onComplaintTypeChange(newData);
      }
      return newData;
    });
  };

  const handleCheckboxChangeRS = (item: LovType) => {
    setdataComplaintRs((prev: LovType[] = []) => {
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
      setdataComplaintRsValue_Combobox(reducedArray);

      if (onComplaintRsChange) {
        onComplaintRsChange(newData);
      }
      return newData;
    });
  };

  // รับ ComplaintFile[] จาก BrowseFileUpload
  const handleFileChange = (fileArray: ComplaintFile[], cf_type: "Complaint" | "Close") => {
    if (!fileArray || fileArray.length === 0) return;
    if (cf_type === "Complaint") {
      setFileList((prev: any) => [...prev, ...fileArray]);
    } else {
      setcloseFiles((prev: any) => [...prev, ...fileArray]);
    }
  };

  const priorityCalculateRespondDate = (
    days: number,
    checked: boolean = true
  ) => {

    if (!checked) {
      setrespond_date_within(null);
      return;
    }

    // ✅ ใช้วันปัจจุบันเสมอ (Add + Edit)
    const baseDate = dayjs();
    const newDate = baseDate.add(days, "day");

    setrespond_date_within(newDate);
  };

  React.useEffect(() => {
    if (!isActionEdit) return;
    if (!datapriority) return;

    const days = Number(datapriority.lov3 ?? 0);

    const today = dayjs().startOf("day");
    const expectedDate = today.add(days, "day");

    // ❗ ยังไม่เคยมีวัน
    if (!respond_date_within) {
      setrespond_date_within(expectedDate);
      return;
    }

    const current = dayjs(respond_date_within).startOf("day");

    // ✅ ถ้าวันไม่ตรง → recal ใหม่
    if (!current.isSame(expectedDate, "day")) {
      setrespond_date_within(expectedDate);
    }

  }, [
    isActionEdit,
    datapriority?.id,
    respond_date_within
  ]);

  const handleRemoveFile = async (
    index: number,
    cf_type: "Complaint" | "Close"
  ) => {
    const targetList =
      cf_type === "Complaint" ? fileList : closeFiles;

    const fileToRemove = targetList[index];

    if (fileToRemove?.id) {
      await _POST(
        {
          id: fileToRemove.id,
          update_by: user[0]?.employee_username || "",
        },
        "/ComplaintFile/ComplaintFileEdit"
      );
    }

    if (cf_type === "Complaint") {
      setFileList((prev) => prev.filter((_, i) => i !== index));
    } else {
      setcloseFiles((prev: any) => prev.filter((_: any, i: any) => i !== index));
    }
  };

  const Acknowledge_Update = async (data: any) => {
    const safeFormatDate = (val: any) => {
      if (!val) return "-";
      let d = dayjs(val);
      if (!d.isValid()) {
        d = dayjs(val, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]);
      }
      return d.isValid() ? d.format("DD/MM/YYYY") : "-";
    };
    const email_reportType = dataset_reporttype?.find((x: any) => x.id == dataelement?.report_type)?.lov4 || "-";
    const email_casNumber = dataelement?.cas_number || "-";
    const email_priority_id = datapriority_Combobox?.find((x: any) => x.id == dataelement?.priority_level)?.lov2 || "-";
    const email_responseDate = safeFormatDate(dataelement?.respond_date_within);
    const email_lotNo = dataelement?.lot_no || "-";
    const email_detectionDate = safeFormatDate(dataelement?.date_of_detection);
    const email_deptName = dataset_department?.find((x: any) => x.department_id == dataelement?.respondent_department_id)?.department_name || dataelement?.respondent_department_name || "-";
    const email_productName = dataelement?.product_name || "-";
    const email_detail = dataelement?.detail || "-";
    const email_requrst_department_name = dataelement?.request_department_name || dataset_department?.find((x: any) => x.department_id == dataelement?.request_department_id)?.department_name || dataelement?.request_department_id || "-";

    const emailSubject = `[CAS] แจ้งเตือนการ ตอบรับ / รับทราบ รายละเอียดข้อร้องเรียน CAS No.${email_casNumber || "-"}`;
    const emailBodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>
        เรียน เจ้าหน้าที่ฝ่าย${email_requrst_department_name || "-"}
      </p>
      <p style="margin-top: 5px;">
        เรียนมาเพื่อทราบว่า คุณ ${user[0]?.employee_fname_th ? (user[0]?.employee_fname_th + " " + (user[0]?.employee_lname_th || "")) : ((user[0]?.employee_fname_en || "") + " " + (user[0]?.employee_lname_en || ""))} (${user[0]?.employee_username}) ได้ตอบรับและยืนยันการรับทราบรายละเอียดข้อร้องเรียนของรายการ CAS No : ${email_casNumber || "-"} เรียบร้อยแล้ว
      </p>
        <br />
        <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
          แผนกผู้ถูกร้องเรียน (Respondent Department)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">ประเภทรายงาน (Report Type)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_reportType || "-"}</td>
          </tr>
           <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">CAS Number</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_casNumber || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ระดับความสำคัญ (Priority)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_priority_id || "-"}</td>
          </tr>      
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ตอบกลับภายในวันที่ (Response Date)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_responseDate || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">Lot No./Bag No</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_lotNo || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">วันที่พบปัญหา (Date of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_detectionDate || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">แผนกที่พบปัญหา (Department / Area of Detection)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_deptName || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อสินค้า (Product Name)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_productName || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f9f9f9; vertical-align: top; border: 1px solid #ddd;">รายละเอียด (Detail)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email_detail || "-"}</td>
          </tr>
        </table>
        <h2 style="color: #2196f3; border-bottom: 2px solid #2196f3; padding-bottom: 10px;">
          ผู้ตอบรับและยืนยันการรับทราบ (Acknowledged by)
        </h2>
         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%; background-color: #f9f9f9; border: 1px solid #ddd;">ชื่อผู้ออกเอกสาร (Reported by)</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.employee_fname_th ? (user[0]?.employee_fname_th + " " + (user[0]?.employee_lname_th || "")) : ((user[0]?.employee_fname_en || "") + " " + (user[0]?.employee_lname_en || ""))} </td>
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
            <td style="padding: 8px; border: 1px solid #ddd;">${user[0]?.itasset_company_name || "-"}</td>
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

    const dataset = {
      AcknowledgeModel: {
        id: data.id,
        acknowledge_flag: data.acknowledge_flag,
        acknowledge_name: user[0]?.employee_username,
        acknowledge_company_id: user[0]?.itasset_company_id,
        acknowledge_department_id: user[0]?.itasset_department_id,
        acknowledge_position: user[0]?.employee_position,
        acknowledge_email: user[0]?.employee_email,
        update_by: user[0]?.employee_username,
        request_company_id: data.request_company_id,
        request_domain_id: data.request_domain_id,
        request_department_id: data.request_department_id,
      },
      emailBody: emailBodyHtml,
      emailSubject: emailSubject
    };

    try {
      let response = await _POST(dataset, "/Acknowledge/AcknowledgeEdit");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setdataelement(response.data[0]);
      }
    } catch (e) { }
  };


  useEffect(() => {
    setcomplaintFiles(fileList);
  }, [fileList]);

  const Dept_setup_By_Domain_dept_id_Get = async (data: any) => {
    if (!data?.domain_dept_id) {
      return null;
    }

    setIsLoadingScreen(false);
    const dataset = { domain_dept_id: data.domain_dept_id };

    try {
      const response = await _POST(
        dataset,
        "/DeptSetup/DeptSetupByDomaindeptidGet"
      );

      return response || null;
    } catch (e) {
      return null;
    } finally {
      setIsLoadingScreen(false);
    }
  };

  const Complaint_Get = async (data: any) => {
    const dataset = {
      id: data.id,
      user_id: user[0]?.employee_username,
      domain_id: user[0]?.employee_domain,
      department_id: user[0]?.itasset_department_id,
      company_id: user[0]?.itasset_company_id,
    };

    try {
      let response = await _POST(dataset, "/Complaint/ComplaintGet");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setdataelement(response.data[0]);
      }
    } catch {

    }
  };

  const ExplainGet = async () => {
    if (isCallFuncLogOn)
      if (!dataelement?.id) {
        return;
      }

    setIsLoadingScreen(true);
    const dataset = {
      complaint_id: dataelement?.id,
    };

    try {
      let response = await _POST(dataset, "/Explain/ExplainGet");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        setExplainList(response.data || []);
        setcomplaint_status_id(dataelement?.complaint_status_id);
      }
    } catch (e) {
      setIsLoadingScreen(false);
    }
  };

  useEffect(() => { }), [complaint_status_id];

  const ComplaintFile_Get = async (cf_type: "Complaint" | "Close") => {
    if (true)
      if (!dataelement?.id) {
        if (cf_type === "Complaint") {
          setFileList([]);
        } else {
          setcloseFiles([]);
        }
        return;
      }

    // สำหรับ Close files ต้องหา explain ที่มี explain_seq สูงสุด (ล่าสุด)
    let latestExplainId = dataelement.explain_id;
    if (cf_type === "Close" && Array.isArray(explainList) && explainList.length > 0) {
      const latestExplain = explainList.reduce((prev: any, current: any) => {
        const prevSeq = Number(prev.explain_seq) || 0;
        const currSeq = Number(current.explain_seq) || 0;
        return currSeq > prevSeq ? current : prev;
      }, explainList[0]);
      if (latestExplain?.id) {
        latestExplainId = latestExplain.id;
      }
    }

    // ✅ หา complaint_id ที่ถูกต้อง (dataelement อาจเป็น Complaint หรือ Explain)
    const actualComplaintId = dataelement.complaint_id || dataelement.id;

    const dataset =
      cf_type === "Complaint"
        ? {
          complaint_id: actualComplaintId,
          explain_id: null,
          cf_type: "Complaint",
        }
        : {
          complaint_id: actualComplaintId,
          explain_id: latestExplainId,
          cf_type: "Close",
        };

    try {
      let response = await _POST(dataset, "/ComplaintFile/ComplaintFileGet");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        const responseData: any = [];

        if (Array.isArray(response.data) && response.data.length > 0) {
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
              id: file.id,
            })
          );

          if (cf_type === "Complaint") {
            setFileList(mappedFiles);
            setcomplaintFiles(mappedFiles);
          } else {
            setcloseFiles(mappedFiles);
          }
        } else {
          if (cf_type === "Complaint") {
            setFileList([]);
            setcomplaintFiles([]);
          } else {
            setcloseFiles([]);
          }
        }
      } else {
        if (cf_type === "Complaint") {
          setFileList([]);
          setcomplaintFiles([]);
        } else {
          setcloseFiles([]);
        }
      }
    } catch (e) {
      setFileList([]);
      setcomplaintFiles([]);
    } finally {
      setIsLoadingScreen(false);
    }
  };


  // const effectRan = React.useRef(false); // ป้องกัน run ซ้ำใน dev mode
  const lastDataElement = React.useRef<any>(null); // Track last processed data
  const hasMappedDepartment = React.useRef(false); // Track if department has been mapped
  React.useEffect(() => {
    if (respondent_company_id?.company_id) {
      mas_DomainRelateGet(
        respondent_company_id.company_id,
        set_domainrelate,
        user,
        isCallFuncLogOn
      );
    }
  }, [respondent_company_id]);

  React.useEffect(() => {
    if (
      !respondent_domain_id &&
      Array.isArray(domainrelate) &&
      domainrelate.length > 0 &&
      user?.[0]?.employee_domain
    ) {
      const autoDomain = domainrelate.find(
        (item: any) =>
          String(item.domain_id) === String(user[0].employee_domain)
      );

      if (autoDomain) {
        setrespondent_domain_id(autoDomain);
        handleDomainChange(autoDomain);
        onRespondentDepartmentChange?.(autoDomain);
      }
    }
  }, [domainrelate, respondent_domain_id, user]);

  React.useEffect(() => {
    if (!respondent_domain_id) return;

    mas_DepartmentGet_Complaint(
      {
        domain_id: respondent_domain_id.domain_id,
        company_id: respondent_company_id?.company_id,
      },
      setdataset_department,
      setdataset_department_respondent,
      isCallFuncLogOn,
      user,
      action
    );
  }, [respondent_domain_id]);

  // 🧩 1️⃣ โหลดข้อมูลหลัก (ReportType, Company, Domain, Department)
  React.useEffect(() => {
    if (!dataelement || action === "Add") return; // 👈 ป้องกันตอน New

    // ✅ ป้องกันการทำงานเมื่อเป็น Explain Data (มี complaint_id)
    if (dataelement?.complaint_id) {
      return;
    }

    if (lastDataElement.current === dataelement) return;
    lastDataElement.current = dataelement;
    hasMappedDepartment.current = false;

    const loadInitialData = async () => {

      try {
        //==================================
        // 1) Report Type
        //==================================
        if (isItAdmin) {

          if (dataelement.report_type) {

            const defaultVal =
              (await setValueMas(
                dataset_reporttype_inactive,
                dataelement.report_type,
                "id"
              )) ||
              dataset_reporttype_inactive.find(
                (item: LovType) =>
                  item.lov_code === dataelement.report_type ||
                  item.id === dataelement.report_type
              );
            if (defaultVal) {
              setdataReportTypeValue({
                ...defaultVal,
                displayText: defaultVal.lov3
                  ? `${defaultVal.lov_code} (${defaultVal.lov3})`
                  : defaultVal.lov_code,
              });
            }
          }
        }
        else {
          if (Array.isArray(dataset_reporttype_inactive) && dataelement?.report_type) {
            const defaultVal =
              (await setValueMas(
                dataset_reporttype_inactive,
                dataelement.report_type,
                "id"
              )) ||
              dataset_reporttype_inactive.find(
                (item: LovType) =>
                  item.lov_code === dataelement.report_type ||
                  item.id === dataelement.report_type
              );
            if (defaultVal) {
              setdataReportTypeValue({
                ...defaultVal,
                displayText: defaultVal.lov3
                  ? `${defaultVal.lov_code} (${defaultVal.lov3})`
                  : defaultVal.lov_code,
              });
            }
          }
        }
        //==================================
        // 2) Company
        //==================================
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
        //==================================
        // 3) Domain relate
        //==================================
        await mas_DomainRelateGet(
          dataelement.respondent_company_id?.company_id ?? dataelement.respondent_company_id,
          set_domainrelate,
          user,
          isCallFuncLogOn
        );
        //==================================
        // // 4) Domain default
        //==================================
        if (Array.isArray(domainrelate) && dataelement?.request_domain_id) {
          const mappedDomain = await setValueMas(
            domainrelate,
            dataelement.request_domain_id,
            "domain_id"
          );
          if (mappedDomain) setrequest_domain_id(mappedDomain);
        }
        //==================================
        // 5) โหลด Department
        //==================================
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
              setdataset_department_respondent,
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
      } catch {

      }
    };

    loadInitialData();
  }, [dataelement]);

  React.useEffect(() => {
    if (Array.isArray(domainrelate) && domainrelate.length > 0) {
      const run = async () => {

        // แมป respondent_domain_id
        if (dataelement?.respondent_domain_id) {
          const mappedRespondent = await setValueMas(
            domainrelate,
            dataelement.respondent_domain_id,
            "domain_id"
          );

          if (mappedRespondent) {
            setrespondent_domain_id(mappedRespondent);
          }
        }

        // แมป request_domain_id
        if (dataelement?.request_domain_id) {
          const mappedRequest = await setValueMas(
            domainrelate,
            dataelement.request_domain_id,
            "domain_id"
          );

          if (mappedRequest) {
            setrequest_domain_id(mappedRequest);
          }
        }
      };

      run();
    }
  }, [domainrelate, dataelement?.respondent_domain_id, dataelement?.request_domain_id]);

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
        const mappedDept = await setValueMas(
          dataset_department,
          dataelement.respondent_department_id,
          "department_id"
        );

        if (mappedDept) {
          setrespondent_department_id(mappedDept);
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
    const newFilteredPriority =
      isItAdmin ?
        datapriority_Combobox.filter(
          (item: LovType) => item.lov_type === "priority_level" && item.lov7 == dataelement?.request_domain_id
        )
        :
        datapriority_Combobox.filter(
          (item: LovType) => item.lov_type === "priority_level"
        )

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
    const newFilteredFuApprove =
      isItAdmin ?
        (dataApprove_Combobox || []).filter(
          (item: LovType) => item.lov_type === "approve_select" && item.lov7 == dataelement?.request_domain_id
        )
        :
        (dataApprove_Combobox || []).filter(
          (item: LovType) => item.lov_type === "approve_select"
        )

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


  //////////////////////// Complaint Read //////////////////////////
  React.useEffect(() => {
    if (dataelement && action != "Add") {
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

      setproduct_name(
        dataelement?.product_name ? dataelement?.product_name : ""
      );
      setlot_no(dataelement?.lot_no ? dataelement?.lot_no : "");
      setrespondent_email(
        dataelement?.respondent_email ? dataelement?.respondent_email : ""
      );
      setdataComplaintType(setComplaintType(dataelement?.complaintType));
      setdataComplaintRs(setComplaintRs(dataelement?.complaintRs));
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
      setcomplaint_status_label(dataelement?.complaint_status_label);


      const ct = setComplaintType(dataelement?.complaintType);
      setdataComplaintType(ct);

      const ctReducedArray = ct.map((c: any) => ({
        complaint_type_id: c.id,
        label: c.lov1,
        isOther: c.lov2,
      }));
      setdataComplaintTypeValue_Combobox(ctReducedArray);

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
    if (explainList?.length > 0 && action != "Add") {

      const close = explainList?.[0];
      if (!close) return;

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
      setfollowup_approve(
        dataApprove_Combobox.find(
          (item: any) => item.lov_code === close.close_status
        ) || null
      );
      setclose_detail(close?.close_detail ? close?.close_detail : "");
      setclose_note(close?.close_note ? close?.close_note : "");
    }
  }, [explainList, dataset_department, dataset_company, dataApprove_Combobox]);


  // ✅ ใช้ ref เพื่อเก็บ complaint ID และ action ก่อนหน้า
  const prevComplaintIdRef = React.useRef<string | null>(null);
  const prevActionRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const currentId = dataelement?.id;


    // ⚠️ ป้องกันการ fetch ซ้ำเมื่อ ID และ action เหมือนเดิม
    // เมื่อปิด ExplainView → setdataelement(complaintMainData) → dataelement object เปลี่ยนแต่ ID เหมือนเดิม
    // แต่ถ้า action เปลี่ยน ต้อง fetch ใหม่
    if (prevComplaintIdRef.current === currentId && prevActionRef.current === action && currentId) {
      return;
    }

    // ✅ Clear close files เมื่อเปลี่ยน complaint เพื่อไม่ให้แสดงไฟล์เก่า
    if (prevComplaintIdRef.current !== currentId) {
      // setcloseFiles([]);
    }

    if (!isActionAdd && currentId) {

      // Fetch Complaint files immediately (ไม่ต้องรอ explainList)
      if (isActionCloseHistory) {
        ComplaintFile_Get("Complaint");
      } else if (!dataelement?.complaint_id) {
        ComplaintFile_Get("Complaint");
      }

      // Fetch explainList first, then Close files will be fetched in separate useEffect
      ExplainGet();
      prevComplaintIdRef.current = currentId;
      prevActionRef.current = action;
    } else if (!currentId) {
      prevComplaintIdRef.current = null;
      prevActionRef.current = null;
    }
  }, [action, dataelement, dataelement?.id]); // ใช้ dataelement ทั้งหมดเป็น dependency

  // ✅ useEffect สำหรับ fetch Close files หลังจาก explainList พร้อม
  const prevCloseFilesFetchedForIdRef = React.useRef<string | null>(null);
  const prevActionForCloseRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const currentComplaintId = dataelement?.complaint_id || dataelement?.id;

    // Reset ref เมื่อ action เปลี่ยน (เช่น กลับจาก ExplainBody)
    if (prevActionForCloseRef.current !== action) {
      prevCloseFilesFetchedForIdRef.current = null;
      prevActionForCloseRef.current = action;
    }

    // Reset ref เมื่อ explainList ถูก clear (reload)
    if (!explainList || explainList.length === 0) {
      prevCloseFilesFetchedForIdRef.current = null;
    }

    // ตรวจสอบว่า explainList เป็นของ complaint ปัจจุบันหรือไม่
    const explainMatchesComplaint =
      Array.isArray(explainList) &&
      explainList.length > 0 &&
      explainList[0]?.complaint_id === currentComplaintId;

    // Trigger เมื่อ explainList พร้อมและตรงกับ complaint ปัจจุบัน
    if (
      explainMatchesComplaint &&
      currentComplaintId &&
      prevCloseFilesFetchedForIdRef.current !== currentComplaintId &&
      (isActionCloseHistory || dataelement?.complaint_id)
    ) {
      ComplaintFile_Get("Close");
      prevCloseFilesFetchedForIdRef.current = currentComplaintId;
    }

    if (!currentComplaintId) {
      prevCloseFilesFetchedForIdRef.current = null;
    }
  }, [explainList, isActionCloseHistory, dataelement?.complaint_id, dataelement?.id, action]);


  // ✅ useRef เพื่อให้ Acknowledge_Update รันเพียงครั้งเดียวต่อ dataelement.id
  const acknowledgeProcessedId = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (isItAdmin) return;
    if (!dataelement?.id) return;

    // ✅ ถ้า id เดียวกันกับที่เคยรันไปแล้ว ให้ skip
    if (acknowledgeProcessedId.current === dataelement.id) return;

    // ✅ Lock ทันทีเพื่อป้องกัน Race Condition (รันซ้ำระหว่างรอ await)
    acknowledgeProcessedId.current = dataelement.id;

    const fetchAcknowlege = async () => {
      if (
        (isActionExplain ||
          (isActionReadExplain &&
            dataelement?.request_name != user[0].employee_username))
      ) {
        if (dataelement?.acknowledge_flag == 0) {
          await Acknowledge_Update(dataelement);
          if (onAcknowledgeUpdate) {
            onAcknowledgeUpdate();
          }
        }
        await Complaint_Get(dataelement);
      }
    };
    fetchAcknowlege();
  }, [action, dataelement?.id, isItAdmin]);

  const setComplaintType = (data: any) => {
    const newData: any[] = [];

    if (!Array.isArray(data)) {
      return newData;
    }

    data.forEach((el, index) => {

      // Try to find the complaint_type_id from the element
      const typeId = el.complaint_type_id;

      if (!typeId) {
        return;
      }

      const filter = dataComplaintType_Combobox.find(
        (item: any) => item.id === typeId
      );

      if (filter) {
        newData.push({
          ...filter,
          other: el.other || "",
        });
      }
    });
    return newData;
  };

  const setComplaintRs = (data: any) => {
    const newData: any[] = [];

    if (!Array.isArray(data)) {
      return newData;
    }

    data.forEach((el, index) => {

      // Try to find the complaint_type_id from the element
      const typeId = el.complaint_type_id;

      if (!typeId) {
        return;
      }

      const filter = dataComplaintRs_Combobox.find(
        (item: any) => item.id === typeId
      );

      if (filter) {
        newData.push({
          ...filter,
          other: el.other || "",
          clause: el.clause || "",
        });
      }
    });
    return newData;
  };
  const setPriorityLevel = (value: any) => {
    if (!value) return null;

    // หา object ที่ id ตรงกับค่าที่ DB ส่งมา
    const selected =
      datapriority_Combobox.find((item: any) => item.id === value) || null;
    return selected;
  };

  const getCloseDetailLabel = (approveData: any) => {
    if (!approveData) return "หมายเหตุการปิด";

    // Check lov2 for REJECT status as per user request
    if (approveData.lov2 === "REJECT") {
      return "หมายเหตุการปฏิเสธ";
    }
    else if (approveData.lov2 === "APPROVE") {
      return "หมายเหตุการปิดรายการ";
    }
  };
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
            options={
              isActionAdd ?
                (dataset_reporttype || []).map((item: any) => ({
                  ...item, // ✅ เก็บค่าทุกอย่างของ item เดิมไว้ (รวมถึง lov4)
                  displayText: item.lov3
                    ? `${item.lov_code} (${item.lov3})`
                    : item.lov_code,
                }))
                :
                (dataset_reporttype_inactive || []).map((item: any) => ({
                  ...item, // ✅ เก็บค่าทุกอย่างของ item เดิมไว้ (รวมถึง lov4)
                  displayText: item.lov3
                    ? `${item.lov_code} (${item.lov3})`
                    : item.lov_code,
                }))
            }

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
          <Box>
            <label
              className="sarabun-regular-datatable"
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
                margin: 0,
              }}
            >
              {dataReportTypeValue?.lov4}
            </label>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
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
            <Grid size={3} mt={2}>
              <AutocompleteComboBox
                value={respondent_company_id}
                labelName={"บริษัท (Company)"}
                options={dataset_company}
                column="company_name"
                // setvalue={(v) => setrespondent_company_id(v)}
                setvalue={(val) => {
                  //console.log("Company selected:", val?.company_name);
                  handleCompanyChange(val);

                  setrespondent_company_id(val);
                  //console.log("cccccc", val);
                }}
                bgcolorTextField={true}
                readonly={!isActionAdd || !isCrossCompany}
              />
            </Grid>
            <Grid size={3} mt={2}>
              <AutocompleteComboBox
                value={respondent_domain_id}
                labelName={"โรงงาน (Factory)"}
                options={domainrelate}
                column="domain_name"
                setvalue={(v) => setrespondent_company_id(v)}
                bgcolorTextField={true}
                readonly={!isActionAdd || !isCrossCompany}
                required="required"
                Validate={validateText?.Respondent_Department || false}
                shouldFocusError={firstErrorField === "Respondent_Department"}
                validateTextLable={
                  validateText?.Respondent_Department
                    ? "กรุณาเลือกโรงงาน"
                    : ""
                }
              />
            </Grid>
            <Box sx={{ width: "100%" }}>
              <Accordion
                expanded={isMinimizecomplaintOpen}
                onChange={(_, expanded) => {
                  setisMinimizeComplaintOpen(expanded);

                  // ถ้าเปิด complaint → เปิด type ตาม
                  if (expanded) {
                    setisMinimizeTypeOpen(true);
                    setisMinimizeRsOpen(true);
                    setisMinimizeDetailOpen(true);
                    setisMinimizePriorityOpen(true);
                  }
                }}
                sx={{
                  borderRadius: 3,
                  background:"linear-gradient(135deg, #ffebeb 0%, #ffffff 100%)",
                  // background: "#ffebeb",
                  border: "1px solid #f44336",
                  boxShadow: "0 4px 12px rgba(244,67,54,0.1)",
                  // mt: 3,
                }}
              >
                {/* 🔹 หัวข้อ */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#f44336" }} />}
                  aria-controls="dept-content"
                  id="dept-header"
                  sx={{ px: 2 }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 2,
                        px: 2,
                        borderBottom: "none", // 👈 ปิดไว้ก่อน
                        ".Mui-expanded &": {
                        borderBottom: "2px solid #f44336", // 👈 แสดงเฉพาะตอนเปิด
                        },
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
                      <Typography
                        className="sarabun-regular-datatable"
                        sx={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: "#d32f2f",
                        }}
                      >
                        แผนกผู้ทำการออกเอกสาร (Reporting Department)
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                {/* <Divider sx={{ my: 0.1, borderBottom: "1px solid #f44336" }} /> */}
                <AccordionDetails sx={{ p: 3 }}>
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
                        maxDate={dayjs()}
                      />
                    </Grid>
                    <Grid size={4}>
                      <AutocompleteComboBox
                        key={respondent_domain_id?.domain_id || "no-domain"}
                        required="required"
                        value={respondent_department_id}
                        labelName={"แผนกที่พบปัญหา (Department / Area of Detection)"}
                        options={dataset_department_respondent}
                        column="department_name"
                        setvalue={async (val) => {
                          setrespondent_department_id(val);
                          const resp = await Dept_setup_By_Domain_dept_id_Get(val);
                          const arr = Array.isArray(resp?.data)
                            ? resp.data
                            : resp?.data
                              ? [resp.data]
                              : [];

                          const found =
                            arr.find((d: any) => d?.dept_email || d?.email) ??
                            arr ??
                            null;

                          const email = found?.dept_email;
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
                        placeholderlabel="กรุณากรอกชื่อสินค้า"
                        onchange={(e) => {
                          setproduct_name(e);
                          if (onProductNameChange) {
                            onProductNameChange(e);
                          }
                        }}
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
                        placeholderlabel="กรุณากรอกหมายเลข Lot No./Bag No"
                        onchange={(e) => {
                          setlot_no(e);
                          if (onLotNoChange) {
                            onLotNoChange(e);
                          }
                        }}
                        bgcolorTextField={true}
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
                        value={respondent_email}
                        labelName="อีเมล (Email)"
                        placeholderlabel="ไม่พบ E-Mail"
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
                                        placeholderlabel="กรุณากรอกรายละเอียด"
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
                                        placeholderlabel="กรุณากรอกรายละเอียด"
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
                                        placeholderlabel="กรุณากรอกรายละเอียด"
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
                                  placeholderlabel="กรุณากรอกรายละเอียด"
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
                                              if (onPriorityChange) {
                                                onPriorityChange(item);
                                              }
                                            }}
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
                    </AccordionDetails>
                  </Accordion>
                </Box>

                <Box sx={{ width: "100%" }}>
                  <Accordion
                    expanded={isMinimizefileOpen}
                    onChange={() => setisMinimizeFileOpen(!isMinimizefileOpen)}
                    sx={{
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                      border: "1px solid #616161",
                      boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
                      // mt: 0.2,
                      
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
                            py: 2,
                            px: 2,
                            borderBottom: "none", // 👈 ปิดไว้ก่อน
                            ".Mui-expanded &": {
                            borderBottom: "2px solid #616161", // 👈 แสดงเฉพาะตอนเปิด
                            },
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
                              color: "#524f4fff",
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
                              setFile={(files) => handleFileChange(files, "Complaint")}
                              setFileName={() => { }}
                              options={(filteredphoto || []).map((p: any) => ({
                                id: p.id,
                                lov1: p.lov1,
                                lov2: p.lov2,
                                lov_code: "CheckTypeFileImage",
                                isOther: p.lov2,
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
                                          {photoType.lov2 === "Y" && (
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
                                                  if (actualIndex !== -1) {
                                                    handleRemoveFile(actualIndex, "Complaint");
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
                                              }
                                            }}
                                          >
                                            <VisibilityIcon />
                                          </IconButton>

                                          {/* //ปุ่มดาวน์โหลดไฟล์ */}
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
                                                } catch {

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
                </Box>

                <Box sx={{ width: "100%" }}>
                  <Accordion
                    expanded={isMinimizerespondOpen}
                    onChange={() =>
                      setisMinimizeRespondOpen(!isMinimizerespondOpen)
                    }
                    sx={{
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)",
                      border: "1px solid #1976d2",
                      boxShadow: "0 4px 12px rgba(33,150,243,0.1)",
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
                            py: 2,
                            px: 2,
                            borderBottom: "none", // 👈 ปิดไว้ก่อน
                            ".Mui-expanded &": {
                            borderBottom: "2px solid #2196f3", // 👈 แสดงเฉพาะตอนเปิด
                        },
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
                              setrequest_department_id(
                                user[0]?.itasset_department_id
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
                            value={request_domain_id}
                            labelName={"โรงงาน (Factory)"}
                            options={domainrelate}
                            column="domain_name"
                            setvalue={(v) => setrequest_domain_id(v)}
                            bgcolorTextField={true}
                            readonly
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Grid>
            {/* </AccordionDetails>
          </Accordion> */}
        </Paper>
      )}

      {!isActionAdd &&
        !isActionRead &&
        !isActionEdit &&
        !isActionDelete &&
        dataReportTypeValue && (
          <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
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
                      // mt: 3,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "#ff9800" }} />}
                      aria-controls="dept-content"
                      id="dept-header"
                      sx={{ px: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between", // ✅ ดันซ้าย-ขวา
                          width: "100%", // ✅ กินเต็ม
                          py: 2,
                          px: 2,
                          borderBottom: "none", // 👈 ปิดไว้ก่อน
                          ".Mui-expanded &": {
                            borderBottom: "2px solid #ff9800", // 👈 แสดงเฉพาะตอนเปิด
                          },
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
                          (dataelement?.complaint_status_label === "SUBMITED") &&
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
                                e.stopPropagation();
                                handleOpenAdd?.();
                              }}
                            >
                              เพิ่มคำชี้แจง
                            </Button>
                          )}
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
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

                                          {/* ปุ่มดูข้อมูล */}
                                          <Button
                                            variant="contained"
                                            size="medium"
                                            onClick={(e) => {
                                              e.stopPropagation();
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
        )}

      {/*  CLOSE  */}
      {isActionCloseHistory && (
        <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
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
                    border: "1px solid #424242",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    // mt: 3,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#424242" }} />}
                    aria-controls="reporting-dept-content"
                    id="reporting-dept-header"
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          py: 2,
                          px: 2,
                          borderBottom: "none", // 👈 ปิดไว้ก่อน
                          ".Mui-expanded &": {
                          borderBottom: "2px solid #424242", // 👈 แสดงเฉพาะตอนเปิด
                          },
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
                      <Typography
                        className="sarabun-regular-datatable"
                        sx={{ fontSize: 18, fontWeight: 600, color: "#000000" }}
                      >
                        ปิดรายการคำร้องเรียน (Close Complaint)
                      </Typography>
                    </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        mt: 3,
                        width: "100%",
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg, #e0e0e0 0%, #fafafa 100%)",
                        border: "1px solid #424242",
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
                        <Grid size={4}>
                          <AutocompleteComboBox
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
                            value={close_department_id}
                            labelName={"แผนก (Department)"}
                            options={dataset_department}
                            column="department_name"
                            setvalue={(e) => {
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

                                <RadioGroup
                                  row
                                  value={followup_approve?.id || ""} // เก็บ id ของที่เลือก
                                  onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selectedItem = (
                                      filteredFuApprove || []
                                    ).find((item) => item.id === selectedId);
                                    setfollowup_approve(
                                      selectedItem ? { ...selectedItem } : null
                                    );
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
                                                followup_approve?.id === item.id
                                                  ? "2px solid #424242"
                                                  : "none",
                                              bgcolor:
                                                followup_approve?.id === item.id
                                                  ? "#d0f0c0"
                                                  : "#f5f5f5",
                                              "&:hover": {
                                                bgcolor: "#c8e6c9",
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
                          <Accordion
                            expanded={isMinimizedeapp2Open}
                            onChange={() =>
                              setisMinimizeDeapp2Open(!isMinimizedeapp2Open)
                            }
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fafafa",
                              mt: 2,
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
                                {getCloseDetailLabel(followup_approve)}
                                {followup_approve?.lov_code !== "APPROVE" && (<span style={{ color: "red" }}> *</span>)}
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
                          <Accordion
                            expanded={isMinimizeotapp2Open}
                            onChange={() =>
                              setisMinimizeOtapp2Open(!isMinimizeotapp2Open)
                            }
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fafafa",
                              mt: 2,
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
                                {followup_approve?.lov_code !== "APPROVE" && (<span style={{ color: "red" }}> *</span>)}
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
                          <Accordion
                            expanded={isMinimizeclosedfileOpen}
                            onChange={() => setisMinimizeClosedFileOpen(!isMinimizeclosedfileOpen)}
                            sx={{
                              borderRadius: 1,
                              background:
                                "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                              border: "1px solid #616161",
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
                                    borderBottom: isMinimizeclosedfileOpen ? "2px solid #616161" : "none",
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
                                      color: "#524f4fff",
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
                                      setFile={(files) => handleFileChange(files, "Close")}
                                      setFileName={() => { }}
                                      options={(filteredphoto || []).map((p: any) => ({
                                        id: p.id,
                                        lov1: p.lov1,
                                        lov2: p.lov2,
                                        lov_code: "CheckTypeFileImage",
                                        isOther: p.lov2,
                                      }))}
                                      grouped={grouped}
                                      action={action}
                                    />

                                    {/* Grouped display by attachment type - Full width boxes stacked vertically */}
                                    <Box sx={{ mt: 1 }}>
                                      {(filteredphoto || []).map((photoType: any) => {
                                        const items = closeFiles.filter(
                                          (f: any) => f.attachmentType === photoType.id
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
                                            {items.map((item: any, idx: any) => (
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
                                                  {photoType.lov2 === "Y" && (
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
                                                  {(isActionEdit ||
                                                    isActionAdd) && (
                                                      <IconButton
                                                        color="error"
                                                        onClick={() => {
                                                          const actualIndex =
                                                            closeFiles.findIndex(
                                                              (f: any) =>
                                                                f.file.name ===
                                                                item.file.name &&
                                                                f.attachmentType ===
                                                                item.attachmentType
                                                            );
                                                          if (actualIndex !== -1) {
                                                            handleRemoveFile(actualIndex, "Close");
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
                                                        const fileUrl =
                                                          URL.createObjectURL(
                                                            item.file
                                                          );
                                                        window.open(fileUrl, "_blank");
                                                        setTimeout(
                                                          () =>
                                                            URL.revokeObjectURL(
                                                              fileUrl
                                                            ),
                                                          1000
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <VisibilityIcon />
                                                  </IconButton>

                                                  {/* //ปุ่มดาวน์โหลดไฟล์ */}
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

                                                          URL.revokeObjectURL(url);
                                                        } catch {

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

                                      {closeFiles.length === 0 && (
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
                        </Grid>
                      </Grid>
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Paper>
      )}
    </Box>
  );
}
