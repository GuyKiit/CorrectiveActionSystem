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
import BrowseFileUpload from "./BrowseFileUpload";
import { log } from "node:console";
import { cleanAccessData } from "../../../service/initmain/initmain";
import { useListComplaint } from "../core/ListComplaintContext";
import { data } from "react-router-dom";
import { ComplaintFile } from "./BrowseFileUpload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

interface ExplaintBody {
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
};

export default function ExplaintBody({
  action,
  readonlyTextField,
  bgcolorTextField,
  validateText,
  onBlocksChange,
  validateDetailText,
  handleOpenAdd,
}: ExplaintBody) {
  const isActionRead = action === "Read";
  const isActionAdd = action === "Add";
  const isActionEdit = action === "Edit";
  const isActionDelete = action === "Delete";


  const user = cleanAccessData("userSession");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // const handleConfirmDelete = () => {
  //   if (deleteIndex !== null) {
  //     handleRemoveFile(deleteIndex);
  //     setDeleteIndex(null);
  //   }
  //   setOpenConfirm(false);
  // };

  const {
    dataelement,
    date_of_detection,
    respondent_department_id,
    respondent_email,
    product_name,
    detail,
    compTypeOther,
    compRsOther,
    clauseOther,
    dataReportTypeValue,
    dataComplaintType_Combobox,
    dataComplaintRs_Combobox,
    dataphoto_Combobox,

    // Dataset
    dataset_reporttype,
    dataset_company,
    dataset_department,
    ToolOther,
    DecisionOther,

    //Explaint
    dataTooluse,
    dataToolUse_Combobox,
    dataTooluseValue,
    dataDecision_Combobox,
    dataDecisionValue,
    dataSectionapp,
    dataApprove_Combobox,
    dataSectionappValue,
    dataQcapp,
    dataQcappValue,
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
    setrespond_date_within,
    setlot_no,
    setcompTypeOther,
    setotherText,
    setcompRsOther,
    setclauseOther,
    setphoTypeOther,
    setdataReportTypeValue,
    setdataComplaintTypeValue_Combobox,
    setdataComplaintRsValue_Combobox,
    setdataphotoValue_Combobox,
    setdatapriorityValue_Combobox,

    // Dataset
    setdataset_reporttype,
    setdataset_company,
    setdataset_department,
    setdataset_domain,
    setcomplaintFiles,


    //Explaint
    setdataToolUse,
    setdataToolUse_Combobox,
    setdataToolUseValue,
    setToolOther,
    setdataDecision_Combobox,
    setdataDecisionValue,
    setDecisionOther,
    setdataApprove_Combobox,
    setdataSectionapp,
    setdataSectionappValue,
    setdataQcapp,
    setdataQcappValue,
    setexplain_id,
    setcomplaint_id,
    setexplain_seq,
    setobservation_analysis,
    setroot_cause,
    setcorrective_action,
    setpreventive_action_plan,
    setfollow_up_date,
    setresponsible_name,
    setresponsible_company_id,
    setresponsible_department_id,
    setresponsible_position,
    setresponsible_email,
    setresponsible_date,
    setclose_status,
    setclose_name,
    setclose_company_id,
    setclose_department_id,
    setclose_position,
    setclose_email,
    setclose_date,
    setreturn_detail,
    setreturn_name,
    setreturn_company_id,
    setreturn_department_id,
    setreturn_position,
    setreturn_email,
    setreturn_datetime,
    setexplain_record_status,
    setexplain_create_by,
    setexplain_create_datetime,
    setexplain_update_by,
    setexplain_update_datetime,

  } = useListComplaint();

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
  // Hidden Variables ======================================================
  const [isFormHidden, setIsFormHidden] = useState(true);
  const [isDDHidden, setIsDDHidden] = useState(true);
  const [isTUHidden, setIsTUHidden] = useState(true);
  const [isCAHidden, setIsCAHidden] = useState(true);
  const [isPAPHidden, setIsPAPHidden] = useState(true);
  const [isOBSAHidden, setIsOBSAHidden] = useState(true);
  const [isROOTHidden, setIsROOTHidden] = useState(true);

  const [isCasNumberHidden, setisCasNumberHidden] = useState(true);
  const [isFactoryHidden, setisFactoryHidden] = useState(true);
  const [isAreaOfDetectionHidden, setisAreaOfDetectionHidden] = useState(true);
  const [isProductHidden, setisProductHidden] = useState(true);
  const [isLotNoHidden, setisLotNoHidden] = useState(true);
  const [isAttachmentsHidden, setisAttachmentsHidden] = useState(true);
  const [isDocumentIssuanceHidden, setisDocumentIssuanceHidden] =
    useState(true);
  const [isDateOfDetection, setisDateOfDetection] = useState(true);
  const [isRequiredResponseDateHidden, setisRequiredResponseDateHidden] =
    useState(true);
  const [isCTHidden, setisCTHidden] = useState(true);
  const [isDetailHidden, setisDetailHidden] = useState(true);
  const [isPriority, setisPriority] = useState(true);
  const [isReportedByHidden, setisReportedByHidden] = useState(true);
  const [isPositionHidden, setisPositionHidden] = useState(true);
  const [isDepartmentHidden, setisDepartmentHidden] = useState(true);
  const [isEmailHidden, setisEmailHidden] = useState(true);
  const [isPhoneHidden, setisPhoneHidden] = useState(true);

  // สร้าง state สำหรับควบคุม Accordion
  const [isMinimizetoolOpen, setisMinimizeToolOpen] = useState(true);
  const [isMinimizeobservOpen, setisMinimizeObservOpen] = useState(true);
  const [isMinimizeddOpen, setisMinimizeDdOpen] = useState(true);
  const [isMinimizerootOpen, setisMinimizeRootOpen] = useState(true);
  const [isMinimizecaOpen, setisMinimizeCaOpen] = useState(true);
  const [isMinimizepapOpen, setisMinimizePapOpen] = useState(true);
  const [isMinimizefileOpen, setisMinimizeFileOpen] = useState(true);
  const [isMinimizesectionappOpen, setisMinimizeSectionappOpen] = useState(true);
  const [isMinimizeqcappOpen, setisMinimizeQcappOpen] = useState(true);
  const [isMinimizedeappOpen, setisMinimizeDeappOpen] = useState(true);
  const [isMinimizeotappOpen, setisMinimizeOtappOpen] = useState(true);
  const [isMinimizedeapp2Open, setisMinimizeDeapp2Open] = useState(true);
  const [isMinimizeotapp2Open, setisMinimizeOtapp2Open] = useState(true);


  // Function Handlers (On Change Event) ======================================================
  const handleReportTypeChange = (val: LovType | null) => {
    console.log(": Step : 01 handleReportTypeChange", val);

    const code = val?.lov_code || "";

    setIsFormHidden(["CAR", "OBS", "CPAR", "NCR"].includes(code));
    setIsDDHidden(["CAR", "OBS", "CPAR"].includes(code));
    setIsTUHidden(["NCR", "CAR", "CPAR"].includes(code));
    setIsCAHidden(["NCR", "OBS"].includes(code));
    setIsPAPHidden(["NCR", "OBS", "CAR"].includes(code));
    setIsOBSAHidden(["NCR", "CPAR", "CAR"].includes(code));
    setIsROOTHidden(["OBS"].includes(code));
    setdataReportTypeValue(val);

    setrespondent_domain_id(dataset_company[0]);
    setrespondent_company_id(dataset_company[0]);
    setcas_number("");

    setdate_of_detection(null);
    setrespondent_department_id(null);
    setproduct_name("");
    setlot_no("");
    setrespondent_email("");
    setdataComplaintTypeValue_Combobox(null);
    setdataComplaintType([]);
    setcompTypeOther("");
    setdataComplaintRsValue_Combobox(null);
    setcompRsOther("");
    setclauseOther("");
    setdetail("");
    setdatapriorityValue_Combobox(null);
    setdatapriority(null);
    setrespond_date_within(null);
    setdataphotoValue_Combobox(null);
    setdataphoto([]);
    setotherText("");
    setphoTypeOther("");

    setrequest_name("");
    setrequest_position("");
    setrequest_department_id(user);
    setrequest_email("");
    setrequest_phone("");
    setrequest_domain_id(dataset_company[0]);
    setrequest_company_id(dataset_company[0]);
    setFileList([]);
    setcomplaintFiles([]);
    setdataToolUseValue(null)
    setdataToolUse([]);
    setdataDecision([]);
  };

  const handleCheckboxChangeTU = (item: LovType) => {

    setdataToolUse((prev: LovType[] = []) => {
      let newData: LovType[];

      if (prev.some((t) => t.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter((t) => t.id !== item.id);

        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        if (item.lov2 === "Y") {
          setToolOther("");
        }
      } else {
        // เพิ่ม object แบบเต็ม
        newData = [...prev, item];
      }

      // สร้าง array ลดรูป
      const reducedArray = newData.map((t) => ({
        explain_tu_id: t.id,
        label: t.lov1,
        isOther: t.lov2,
      }));
      // อัปเดตเข้า context
      setdataToolUseValue(reducedArray);
      return newData;
    });
  };


  const handleCheckboxChangeDD = (item: LovType) => {
    setdataDecision((prev: LovType[] = []) => {
      //console.log("💚💚item", item);
      let newData: LovType[];

      if (prev.some((dd) => dd.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter((dd) => dd.id !== item.id);

        if (item.lov2 === "Y") {
          setDecisionOther("");
        }
      } else {
        // เพิ่ม object แบบเต็ม
        newData = [...prev, item];
      }

      // สร้าง array ลดรูปสำหรับ context
      const reducedArray = newData.map((dd) => ({
        explain_dd_id: dd.id,
        label: dd.lov1,
        isOther: dd.lov2,
        isClause: dd.lov3,
      }));

      setdataDecisionValue(reducedArray);

      return newData;
    });
  };


  // รับ ComplaintFile[] จาก BrowseFileUpload
  const handleFileChange = (fileArray: ComplaintFile[]) => {
    if (!fileArray || fileArray.length === 0) return;
    const updatedList = [...fileList, ...fileArray];

    setFileList(updatedList);
    setcomplaintFiles(updatedList);
  };

  // Functions (Initial, Calculation or ETC.) =================================================
  const resetForm = () => {
    setdataReportTypeValue("");
    setcas_number("");
    setproduct_name("");
    setlot_no("");
    setrequest_name("");
    setrequest_company_id(null);
    setrequest_domain_id("");
    setrequest_department_id(null);
    setrequest_position("");
    setrequest_email("");
    setrequest_phone("");
    setrespondent_company_id(null);
    setrespondent_domain_id("");
    setrespondent_department_id(null);
    setrespondent_email("");

    setdoc_date(dayjs(null));
    setrespond_date_within(dayjs(null));
    setdetail("");
    setcompTypeOther("");
    setotherText("");
    setcompRsOther("");
  };

  const handleRemoveFile = (index: number) => {
    setFileList((prev) => {
      const updatedList = prev.filter((_, i) => i !== index);
      return updatedList;
    });
  };
  useEffect(() => {

    setcomplaintFiles(fileList); // sync
  }, [fileList, filteredTooluse]);

  // READ - Get Complaints
  const ComplaintFile_Get = async () => {
    setIsLoadingScreen(true);
    const dataset = {
      complaint_id: dataelement?.id,
      cf_type: "Complaint",
    };

    try {
      let response = await _POST(dataset, "/ComplaintFile/ComplaintFileGet");
      if (response && response.status === "success") {
        setIsLoadingScreen(false);
        const responseData: any = [];

        if (Array.isArray(response.data)) {

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
            })
          );

          setFileList(mappedFiles);
          setcomplaintFiles(mappedFiles);
        }
      }
    } catch (e) {
    }
  };




  React.useEffect(() => {
    const updateData = async () => {
      // ถ้าไม่มี anything ที่จำเป็นก็ยังไม่ return ทันที — เราต้องการให้ logic พยายามทำงานเมื่อข้อมูลพร้อม
      // 1) เตรียม newDataset จาก dataset_reporttype (ถ้ามี)
      let newDataset: LovType[] | undefined = Array.isArray(dataset_reporttype)
        ? dataset_reporttype
        : undefined;

      // ถ้ามี dataset_reporttype และ dataelement ให้เรียก setValueMas เพื่อ map ค่า (safe)
      if (Array.isArray(dataset_reporttype) && dataelement) {
        try {
          const mapped = await setValueMas(
            dataset_reporttype,
            dataelement.report_type,
            "id"
          );
          // mapped อาจเป็น undefined หรือ array — ให้ใช้ mapped ถ้ามีค่าที่แตกต่างจากเดิม
          if (mapped && Array.isArray(mapped)) {
            // ถ้า different -> update state
            if (JSON.stringify(mapped) !== JSON.stringify(dataset_reporttype)) {
              setdataset_reporttype(mapped);
            }
            newDataset = mapped;
          } else {
            // ถ้า mapped เป็น object เดียว ๆ (กรณีฟังก์ชันคืน object) — เราอยากให้ newDataset เป็น array
            if (mapped && !Array.isArray(mapped)) {
              newDataset = Array.isArray(dataset_reporttype)
                ? dataset_reporttype
                : [mapped];
            }
          }
        } catch (err) {
          console.error("setValueMas error:", err);
        }
      }

      // 2) ถ้า action === "Read" และมี dataelement.report_type ให้หา default จาก newDataset (ถ้ามี)
      if (
        (isActionRead || isActionEdit || isActionDelete) &&
        dataelement?.report_type &&
        Array.isArray(newDataset) &&
        newDataset.length > 0
      ) {
        const defaultVal = newDataset.find(
          (item: LovType) =>
            // บางที dataelement.report_type อาจเก็บ lov_code หรือ id ขึ้นกับ backend — เช็คทั้งสอง
            item.lov_code === dataelement.report_type ||
            item.id === dataelement.report_type
        );

        if (defaultVal) {
          // ป้องกัน set ซ้ำ
          if (
            !dataReportTypeValue ||
            dataReportTypeValue.id !== defaultVal.id
          ) {
            setdataReportTypeValue(defaultVal);
          }
        }
      }
      // 4) ถ้ามี dataReportTypeValue (จาก state หรือ เพิ่ง set ข้างบน) ให้กรอง complaint/attach/reference
      const reportTypeToUse = dataReportTypeValue; // ใช้ state ปัจจุบัน (ซึ่งเราเพิ่งอาจจะ set)
      if (reportTypeToUse) {
        const val = reportTypeToUse;

        const newFilteredSecApprove = (
          dataApprove_Combobox || []
        ).filter(
          (item: LovType) =>
            item.lov_type === "approve_select"
        );
        setFilteredSecApprove((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredSecApprove))
            return newFilteredSecApprove;
          return prev;
        });

        const newFilteredQcApprove = (
          dataApprove_Combobox || []
        ).filter(
          (item: LovType) =>
            item.lov_type === "approve_select"
        );
        setFilteredQcApprove((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredQcApprove))
            return newFilteredQcApprove;
          return prev;
        });


        const newFilteredToolUse = (
          dataToolUse_Combobox || []
        ).filter(
          (item: LovType) =>
            item.lov_type === "tool_use"
        );
        setFilteredToolUse((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredToolUse))
            return newFilteredToolUse;
          return prev;
        });

        const newFilteredPhoto = (dataphoto_Combobox || []).filter(
          (item: LovType) => item.lov_type === "attach_type"
        );
        setFilteredphoto((prev: LovType[]) => {
          if (JSON.stringify(prev) !== JSON.stringify(newFilteredPhoto))
            return newFilteredPhoto;
          return prev;
        });

        if (val.lov_code === "NCR") {
          const newFilteredDecision = (
            dataDecision_Combobox || []
          ).filter(
            (item: LovType) =>
              item.lov_type === "decision_disposition"
          );
          setFilteredDecision((prev: LovType[]) => {
            if (JSON.stringify(prev) !== JSON.stringify(newFilteredDecision))
              return newFilteredDecision;
            return prev;
          });
        } else {
          setFilteredDecision([]);
        }
      } else {
        // ถ้ายังไม่มี reportType ก็ reset
        setFilteredToolUse([]);
        setFilteredDecision([]);
        setFilteredQcApprove([]);
        setFilteredSecApprove([]);
        setFilteredphoto([]);
        // หมายเหตุ: filteredpriority เรา update ข้างบนแล้ว
      }
    };

    updateData();
    // dependency: ให้ trigger เมื่อสิ่งที่สำคัญเปลี่ยนจริง ๆ (action, property ที่เปลี่ยน, dataset ที่ load)
  }, [
    action,
    dataelement?.report_type, // ใช้ property เพื่อให้ effect รันเมื่อ report_type เปลี่ยน
    dataset_reporttype,
    dataToolUse_Combobox,
    dataDecision_Combobox,
    dataphoto_Combobox,
    dataApprove_Combobox,
    dataReportTypeValue, // เพราะเรใช้ state นี้ต่อใน effect (และต้องการให้ flow ใช้ค่าล่าสุด)
  ]);


  React.useEffect(() => {

    if (dataelement && action != "Add") {
      setrespondent_company_id(
        dataset_company.find(
          (el: any) =>
            el.itasset_company_id == String(dataelement.respondent_company_id)
        )
      );
      setcas_number(dataelement?.cas_number || "");
      setdoc_date(
        dataelement?.doc_date
          ? dayjs(dataelement.doc_date, "DD-MM-YYYY")
          : dayjs()
      );
      setdate_of_detection(dayjs(dataelement?.date_of_detection));
      setrespondent_department_id(
        dataset_department.find(
          (el: any) =>
            el.itasset_department_id ==
            String(dataelement.respondent_department_id)
        )
      );
      setproduct_name(
        dataelement?.product_name ? dataelement?.product_name : ""
      );
      setlot_no(dataelement?.lot_no ? dataelement?.lot_no : "");
      setrespondent_email(
        dataelement?.respondent_email ? dataelement?.respondent_email : ""
      );
      setdataToolUse(setExplainTU(dataelement?.complaintType));
      setToolOther(dataelement?.other ? dataelement?.other : "");
      setdataDecision(setExplainDD(dataelement?.complaintRs));
      setDecisionOther(dataelement?.other ? dataelement?.other : "");
      setdetail(dataelement?.detail ? dataelement?.detail : "");
      setrespond_date_within(
        dataelement?.respond_date_within
          ? dayjs(dataelement.respond_date_within, "DD-MM-YYYY")
          : dayjs()
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
      setrequest_company_id(
        dataset_company.find(
          (el: any) =>
            el.itasset_company_id == String(dataelement.request_company_id)
        )
      );

      // สมมติ LovType คือ { id: string; label: string }

      const tu = setExplainTU(dataelement?.complaintType);
      setdataToolUse(tu);

      // ถ้ามี complaintType ที่เป็น Other ให้ดึงค่ามา
      const othertu = tu.find((el: any) => el.lov2 === "Y");
      setToolOther(othertu?.other || "");

      const dd = setExplainDD(dataelement?.complaintRs);
      setdataDecision(dd);

      const otherdd = dd.find((el: any) => el.lov2 === "Y");
      setDecisionOther(otherdd?.other || "");
    }
  }, [dataset_reporttype]);

  React.useEffect(() => {
    // เฉพาะตอน Read เท่านั้น
    if (action === "Read" || action === "Edit" || action === "Delete") {
      ComplaintFile_Get();
    }
  }, [action, dataelement]);

  const setExplainTU = (data: any) => {
    const newData: any[] = [];
    Array.isArray(data) &&
      data.forEach((el) => {
        const filter = dataToolUse_Combobox.find(
          (item: any) => item.id === el.explain_tu_id
        );

        if (filter) {
          newData.push({
            ...filter,
            other: el.other || "", // ⭐ เก็บค่าข้อความ Other มาด้วย
          });
        }
      });
    return newData;
  };

  const setExplainDD = (data: any) => {
    const newData: any[] = [];
    Array.isArray(data) &&
      data.forEach((el) => {
        const filter = dataDecision_Combobox.find(
          (item: any) => item.id === el.explain_dd_id
        );

        if (filter) {
          newData.push({
            ...filter,
            other: el.other || "", // ⭐ เก็บค่าข้อความ Other มาด้วย
          });
        }
      });
    return newData;
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: "2px solid #F29739",
        borderRadius: 2,
        backgroundColor: "#ffffff",
        // boxShadow: '0 0 10px 2px rgba(0, 98, 233, 0.5)',
        // transition: 'box-shadow 0.3s ease',
        // '&:hover': {
        //   boxShadow: '0 0 20px 4px rgba(0, 98, 233, 0.8)',
        // },
      }}
    >
      <div className="px-2 pt-2 pb-5">
        <label className="sarabun-regular-datatable">
          สำหรับผู้รับผิดชอบหรือหน่วยงานที่เกี่ยวข้อง
        </label>
      </div>
      <Divider sx={{ my: 0.1, borderColor: "#F29739" }} />
      <Grid container spacing={2} mt={2}>
        <Grid size={6}>
          <AutocompleteComboBox
            required="required"
            value={dataReportTypeValue}
            labelName={"ประเภทรายงาน (Report Type)"}
            options={dataset_reporttype} // <-- แก้ตรงนี้
            column="lov_code"
            setvalue={handleReportTypeChange}
            readonly={isActionRead ? true : isActionEdit ? true : isActionDelete ? true : readonlyTextField}
            bgcolorTextField={isActionRead ? true : isActionEdit ? true : isActionDelete ? true : bgcolorTextField}

          />
        </Grid>
      </Grid>

      {/* ====== Dynamic ฟอร์ม สำหรับเลือกประเภทเอกสาร ====== */}
      {isFormHidden && dataReportTypeValue && (
        <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
          <label className="sarabun-regular-datatable">
            {dataReportTypeValue?.lov4}
          </label>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 3,
                width: "100%",
                borderRadius: 3,
                background: "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
                border: "1px solid #ffcdd2",
                boxShadow: "0 4px 12px rgba(244,67,54,0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  pb: 2,
                  borderBottom: "2px solid #f44336",
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
                <label
                  className="sarabun-regular-datatable"
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#d32f2f",
                    margin: 0,
                  }}
                >
                  ข้อมูลผู้ชี้แจง
                </label>
              </Box>
              <Grid container spacing={3}>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={responsible_name}
                    labelName="ชื่อผู้ดำเนินการ (Responsible Person)"
                    onchange={(e) => setresponsible_name(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={responsible_company_id}
                    labelName="บริษัท (Company)"
                    onchange={(e) => setresponsible_company_id(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <AutocompleteComboBox
                    required="required"
                    value={responsible_department_id}
                    labelName={"แผนก (Department)"}
                    options={dataset_department}
                    column="department_name"
                    setvalue={(e) => { setresponsible_department_id(e); }}
                    bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={responsible_position}
                    labelName="ตำแหน่ง (Position)"
                    onchange={(e) => setresponsible_position(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={responsible_email}
                    labelName="อีเมล (Email)"
                    onchange={(e) => setresponsible_email(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <DesktopDatePickers
                    required="required"
                    labelName={"วันที่ชี้แจง (Date)"}
                    value={responsible_date}
                    handleChange={(val) => setresponsible_date(val ?? null)}
                    bgcolorTextField={action === "Add" ? false : true}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <DesktopDatePickers
                    required="required"
                    labelName={"กำหนดวันตรวจติดตามผลวันที่ (Follow-up Date)"}
                    value={follow_up_date}
                    handleChange={(val) => setfollow_up_date(val ?? null)}
                    bgcolorTextField={action === "Add" ? false : true}
                    readonly={isActionRead || isActionEdit || isActionDelete}
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

                <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                  {/* ✅ Accordion แทน Paper */}
                  {isTUHidden && dataReportTypeValue && (
                    <Grid size={12}>
                      <Accordion expanded={isMinimizetoolOpen}
                        onChange={() => setisMinimizeToolOpen(!isMinimizetoolOpen)}
                        sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="complaint-type-content"
                          id="complaint-type-header"
                        >
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                          >
                            เครื่องมือที่ใช้ (Tools Used)
                            <span style={{ color: "red" }}> *</span>
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Divider sx={{ my: 0 }} />
                          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                            <Grid container spacing={2}>
                              {(filteredTooluse || []).map((item: LovType) => (
                                <Grid size={3} key={item.id}>
                                  <FullWidthCheckbox
                                    labelName={item.lov1}
                                    value={(dataTooluse || []).some((t: any) => t.id === item.id)}
                                    onchange={() => handleCheckboxChangeTU(item)}
                                    readonly={isActionRead || isActionDelete}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                            <Box sx={{ mt: "auto", pt: 2 }}>
                              {(dataTooluse || []).some((t: any) => t.lov2 === "Y") && (
                                <FullWidthTextArea
                                  value={ToolOther}
                                  labelName="Other:"
                                  onchange={(e) => setToolOther(e)}
                                  bgcolorTextField={
                                    action === "Add" ? false : isActionEdit ? false : true
                                  }
                                  readonly={isActionRead || isActionDelete}
                                />
                              )}
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {!isDDHidden && dataReportTypeValue && (
                    <Grid size={12}>
                      <Accordion
                        expanded={isMinimizeddOpen}
                        onChange={() => setisMinimizeDdOpen(!isMinimizeddOpen)}
                        sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="reference-standard-content"
                          id="reference-standard-header"
                        >
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                          >
                            การตัดสินใจเกี่ยวกับแนวทางการจัดการ (Decision on Disposition)
                            <span style={{ color: "red" }}> *</span>
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Divider sx={{ my: 0 }} />
                          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                            <Grid container spacing={2}>
                              {filteredDecision.map((item: LovType) => (
                                <Grid size={3} key={item.id}>
                                  <FullWidthCheckbox
                                    labelName={item.lov1}
                                    value={dataDecision.some((dd: any) => dd.id === item.id)}
                                    onchange={() => handleCheckboxChangeDD(item)}
                                    readonly={isActionRead || isActionDelete}
                                  />
                                </Grid>
                              ))}
                            </Grid>

                            <Box sx={{ mt: "auto", pt: 2 }}>
                              {dataDecision.some((t: any) => t.lov2 === "Y") && (
                                <FullWidthTextArea
                                  value={DecisionOther}
                                  labelName="Other:"
                                  onchange={(e) => setDecisionOther(e)}
                                  bgcolorTextField={
                                    action === "Add" ? false : isActionEdit ? false : true
                                  }
                                  readonly={isActionRead || isActionDelete}
                                />
                              )}
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}
                </Grid>
                {!isOBSAHidden && dataReportTypeValue && (
                  <Accordion
                    expanded={isMinimizeobservOpen}
                    onChange={() => setisMinimizeObservOpen(!isMinimizeobservOpen)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      mt: 2  // <-- เพิ่ม margin-top
                    }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="detail-content"
                      id="detail-header"
                    >
                      <Typography
                        className="sarabun-regular-datatable"
                        sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                      >
                        การวิเคราะห์เบื้องต้นของข้อสังเกต (Observation Analysis)
                        <span style={{ color: "red" }}> *</span>
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Box sx={{ mt: -3 }}>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                          {/* Response Date Field - positioned after Emergency option */}
                          <Grid size={12}>
                            <FullWidthTextArea
                              value={observation_analysis}
                              labelName=""
                              onchange={(e) => setobservation_analysis(e)}
                              bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                              readonly={isActionRead || isActionDelete}
                            />

                          </Grid>
                        </Grid>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {!isROOTHidden && dataReportTypeValue && (
                  <Accordion
                    expanded={isMinimizerootOpen}
                    onChange={() => setisMinimizeRootOpen(!isMinimizerootOpen)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      mt: 2  // <-- เพิ่ม margin-top
                    }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="detail-content"
                      id="detail-header"
                    >
                      <Typography
                        className="sarabun-regular-datatable"
                        sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                      >
                        คำอธิบายการวิเคราะห์ (Root Cause)
                        <span style={{ color: "red" }}> *</span>
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Box sx={{ mt: -3 }}>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                          {/* Response Date Field - positioned after Emergency option */}
                          <Grid size={12}>
                            <FullWidthTextArea
                              value={root_cause}
                              labelName=""
                              onchange={(e) => setroot_cause(e)}
                              bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                              readonly={isActionRead || isActionDelete}
                            />

                          </Grid>
                        </Grid>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {!isCAHidden && dataReportTypeValue && (
                  <Accordion
                    expanded={isMinimizecaOpen}
                    onChange={() => setisMinimizeCaOpen(!isMinimizecaOpen)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      mt: 2  // <-- เพิ่ม margin-top
                    }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="detail-content"
                      id="detail-header"
                    >
                      <Typography
                        className="sarabun-regular-datatable"
                        sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                      >
                        การดำเนินการแก้ไข (Corrective Action)
                        <span style={{ color: "red" }}> *</span>
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Box sx={{ mt: -3 }}>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                          {/* Response Date Field - positioned after Emergency option */}
                          <Grid size={12}>
                            <FullWidthTextArea
                              value={corrective_action}
                              labelName=""
                              onchange={(e) => setcorrective_action(e)}
                              bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                              readonly={isActionRead || isActionDelete}
                            />

                          </Grid>
                        </Grid>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {!isPAPHidden && dataReportTypeValue && (
                  <Accordion
                    expanded={isMinimizepapOpen}
                    onChange={() => setisMinimizePapOpen(!isMinimizepapOpen)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      mt: 2  // <-- เพิ่ม margin-top
                    }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="detail-content"
                      id="detail-header"
                    >
                      <Typography
                        className="sarabun-regular-datatable"
                        sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                      >
                        แผนการป้องกันไม่ให้ปัญหาเกิดขึ้นซ้ำ (Preventive Action Plan)
                        <span style={{ color: "red" }}> *</span>
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Box sx={{ mt: -3 }}>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                          {/* Response Date Field - positioned after Emergency option */}
                          <Grid size={12}>
                            <FullWidthTextArea
                              value={preventive_action_plan}
                              labelName=""
                              onchange={(e) => setpreventive_action_plan(e)}
                              bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                              readonly={isActionRead || isActionDelete}
                            />

                          </Grid>
                        </Grid>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                <Accordion expanded={isMinimizefileOpen}
                  onChange={() => setisMinimizeFileOpen(!isMinimizefileOpen)}
                  sx={{ borderRadius: 2, backgroundColor: "#fafafa", mt: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="complaint-type-content"
                    id="complaint-type-header"

                  >
                    <Typography
                      className="sarabun-regular-datatable"
                      sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                    >
                      แนบไฟล์ (Attachments)
                      <span style={{ color: "red" }}> *</span>
                    </Typography>
                  </AccordionSummary>


                  <AccordionDetails>

                    <Grid container spacing={2}>
                      {
                        <Grid size={12}>
                          <BrowseFileUpload
                            setFile={handleFileChange}
                            setFileName={() => { }}
                            options={(filteredphoto || []).map((p: any) => ({
                              id: p.id,
                              lov1: p.lov1,
                            }))}
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
                                  sx={{ p: 2, borderRadius: 2, mb: 2, width: "100%" }}
                                >
                                  <label
                                    className="sarabun-regular-datatable"
                                    style={{ fontWeight: 600, fontSize: "16px" }}
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
                                          {(item.file.size / (1024 * 1024)).toFixed(
                                            2
                                          )}{" "}
                                          MB
                                        </div>
                                        {photoType.id === "TRR_AT_4" && (
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
                                        {(action == "Edit" || action == "Add") && (
                                          <IconButton
                                            color="error"
                                            onClick={() => handleRemoveFile(idx)}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        )}

                                        {/* //ปุ่มดูไฟล์ */}

                                        <IconButton
                                          color="primary"
                                          onClick={() =>
                                            (action === "Read" || action === "Delete" || action === "Edit")
                                              ? window.open(item.img_url, "_blank")
                                              : window.open(
                                                URL.createObjectURL(item.file),
                                                "_blank"
                                              )
                                          }
                                        >
                                          <VisibilityIcon />
                                        </IconButton>

                                        {/* //ปุ่มดาวน์โหลดไฟล์ */}
                                        {action === "Read"
                                          && (
                                            <IconButton
                                              color="primary"
                                              onClick={async () => {
                                                if (!item.img_url) return;

                                                try {
                                                  const response = await fetch(
                                                    item.img_url,
                                                    { method: "GET" }
                                                  );
                                                  const blob = await response.blob();
                                                  const url =
                                                    URL.createObjectURL(blob);

                                                  const link =
                                                    document.createElement("a");
                                                  link.href = url;
                                                  link.setAttribute(
                                                    "download",
                                                    item.original_file_name ?? "file"
                                                  );
                                                  document.body.appendChild(link);
                                                  link.click();
                                                  document.body.removeChild(link);

                                                  URL.revokeObjectURL(url); // cleanup memory
                                                } catch (err) {
                                                  // //console.error(
                                                  //   "Download failed:",
                                                  //   err
                                                  // );
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
                                sx={{ p: 2, textAlign: "center", color: "#999" }}
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
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 3,
                width: "100%",
                borderRadius: 3,
                background: "linear-gradient(135deg, #e6f4ea 0%, #ffffff 100%)",
                border: "1px solid #a5d6a7",
                boxShadow: "0 4px 12px rgba(158,158,158,0.12)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  pb: 2,
                  borderBottom: "2px solid #81c784",
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    backgroundColor: "#66bb6a",
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
                  ข้อมูลผู้รับรอง (Section Head)
                </label>
              </Box>
              <Grid container spacing={3}>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={product_name}
                    labelName="ชื่อผู้ดำเนินการ (Responsible Person)"
                    onchange={(e) => setproduct_name(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={product_name}
                    labelName="บริษัท (Company)"
                    onchange={(e) => setproduct_name(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <AutocompleteComboBox
                    required="required"
                    value={respondent_department_id}
                    labelName={
                      "แผนก (Department)"
                    }
                    options={dataset_department}
                    column="department_name"
                    setvalue={(e) => {
                      // //console.log(e); // ดูค่าของ e ที่ถูกส่งมาจาก AutocompleteComboBox
                      setrespondent_department_id(e);
                    }}
                    bgcolorTextField={
                      action === "Add" ? false : isActionEdit ? false : true
                    }
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={product_name}
                    labelName="แผนก (Position)"
                    onchange={(e) => setproduct_name(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={respondent_email}
                    labelName="อีเมล (Email)"
                    onchange={(e) => setrespondent_email(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <DesktopDatePickers
                    required="required"
                    labelName={"วันที่อนุมัติ (Date)"}
                    value={date_of_detection}
                    handleChange={(val) => setdate_of_detection(val ?? null)}
                    bgcolorTextField={action === "Add" ? false : true}
                    readonly={isActionRead || isActionEdit || isActionDelete}
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
                    borderBottom: "1px solid #66bb6a",
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 16,
                      backgroundColor: "#388e3c",
                      borderRadius: 0.5,
                      mr: 1.5,
                    }}
                  />
                  <label
                    className="sarabun-regular-datatable"
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#2e7d32",
                      margin: 0,
                    }}
                  >
                    รายละเอียด
                  </label>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                {/* ✅ Accordion แทน Paper */}
                {dataReportTypeValue && (
                  <Grid size={12}>
                    <Accordion
                      expanded={isMinimizesectionappOpen}
                      onChange={() => setisMinimizeSectionappOpen(!isMinimizesectionappOpen)}
                      sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="complaint-type-content"
                        id="complaint-type-header"
                      >
                        <Typography
                          className="sarabun-regular-datatable"
                          sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                        >
                          Approve หัวหน้าส่วน (Section Approve)
                          <span style={{ color: "red" }}> *</span>
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                          {/* ✅ ใช้ RadioGroup แทน Checkbox */}
                          <RadioGroup
                            row
                            value={dataSectionapp?.id || ""} // เก็บ id ของที่เลือก
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const selectedItem = (filteredSecApprove || []).find(
                                (item) => item.id === selectedId
                              );
                              setdataSectionapp(selectedItem ? { ...selectedItem } : null); // เก็บแค่ 1 ค่า
                            }}
                          >
                            <Grid container spacing={2}>
                              {(filteredSecApprove || []).map((item: LovType) => (
                                <Grid size={3} key={item.id}>
                                  <FormControlLabel
                                    value={item.id}
                                    control={<Radio />}
                                    label={item.lov1}
                                    disabled={isActionRead || isActionDelete}
                                    sx={{
                                      m: 0,
                                      px: 2,
                                      py: 1,
                                      borderRadius: 2,
                                      border: dataSectionapp?.id === item.id ? "2px solid #4caf50" : "none",
                                      bgcolor: dataSectionapp?.id === item.id ? "#d0f0c0" : "#f5f5f5", // ✅ เขียวพาสเทลถ้าเลือก, เทาอ่อนถ้ายังไม่เลือก
                                      "&:hover": {
                                        bgcolor: "#c8e6c9", // สี hover
                                      },
                                    }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </RadioGroup>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    {dataReportTypeValue && (
                      <Accordion
                        expanded={isMinimizedeappOpen}
                        onChange={() => setisMinimizeDeappOpen(!isMinimizedeappOpen)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          mt: 2  // <-- เพิ่ม margin-top
                        }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="detail-content"
                          id="detail-header"
                        >
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                          >
                            หมายเหตุการอนุมัติ
                            <span style={{ color: "red" }}> *</span>
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Box sx={{ mt: -3 }}>
                            <Divider sx={{ my: 1 }} />
                            <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                              {/* Response Date Field - positioned after Emergency option */}
                              <Grid size={12}>
                                <FullWidthTextArea
                                  value={root_cause}
                                  labelName=""
                                  onchange={(e) => setroot_cause(e)}
                                  bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                                  readonly={isActionRead || isActionDelete}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    {dataReportTypeValue && (
                      <Accordion
                        expanded={isMinimizeotappOpen}
                        onChange={() => setisMinimizeOtappOpen(!isMinimizeotappOpen)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          mt: 2  // <-- เพิ่ม margin-top
                        }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="detail-content"
                          id="detail-header"
                        >
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                          >
                            หมายเหตุเพิ่มเติม
                            <span style={{ color: "red" }}> *</span>
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Box sx={{ mt: -3 }}>
                            <Divider sx={{ my: 1 }} />
                            <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                              {/* Response Date Field - positioned after Emergency option */}
                              <Grid size={12}>
                                <FullWidthTextArea
                                  value={root_cause}
                                  labelName=""
                                  onchange={(e) => setroot_cause(e)}
                                  bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                                  readonly={isActionRead || isActionDelete}
                                />

                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 3,
                width: "100%",
                borderRadius: 3,
                background: "linear-gradient(135deg, #e6f4ea 0%, #ffffff 100%)",
                border: "1px solid #a5d6a7",
                boxShadow: "0 4px 12px rgba(158,158,158,0.12)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  pb: 2,
                  borderBottom: "2px solid #81c784",
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    backgroundColor: "#66bb6a",
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
                  ข้อมูลผู้รับรอง (QC)
                </label>
              </Box>
              <Grid container spacing={3}>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={product_name}
                    labelName="ชื่อผู้ดำเนินการ (Responsible Person)"
                    onchange={(e) => setproduct_name(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={product_name}
                    labelName="บริษัท (Company)"
                    onchange={(e) => setproduct_name(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <AutocompleteComboBox
                    required="required"
                    value={respondent_department_id}
                    labelName={
                      "แผนก (Department)"
                    }
                    options={dataset_department}
                    column="department_name"
                    setvalue={(e) => {
                      // //console.log(e); // ดูค่าของ e ที่ถูกส่งมาจาก AutocompleteComboBox
                      setrespondent_department_id(e);
                    }}
                    bgcolorTextField={
                      action === "Add" ? false : isActionEdit ? false : true
                    }
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={product_name}
                    labelName="แผนก (Position)"
                    onchange={(e) => setproduct_name(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={respondent_email}
                    labelName="อีเมล (Email)"
                    onchange={(e) => setrespondent_email(e)}
                    readonly={isActionRead || isActionDelete}
                  />
                </Grid>
                <Grid size={4}>
                  <DesktopDatePickers
                    required="required"
                    labelName={"วันที่อนุมัติ (Date)"}
                    value={date_of_detection}
                    handleChange={(val) => setdate_of_detection(val ?? null)}
                    bgcolorTextField={action === "Add" ? false : true}
                    readonly={isActionRead || isActionEdit || isActionDelete}
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
                    borderBottom: "1px solid #66bb6a",
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 16,
                      backgroundColor: "#388e3c",
                      borderRadius: 0.5,
                      mr: 1.5,
                    }}
                  />
                  <label
                    className="sarabun-regular-datatable"
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#2e7d32",
                      margin: 0,
                    }}
                  >
                    รายละเอียด
                  </label>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                {/* ✅ Accordion แทน Paper */}
                {dataReportTypeValue && (
                  <Grid size={12}>
                    <Accordion
                      expanded={isMinimizeqcappOpen}
                      onChange={() => setisMinimizeQcappOpen(!isMinimizeqcappOpen)}
                      sx={{ borderRadius: 2, backgroundColor: "#fafafa" }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="complaint-type-content"
                        id="complaint-type-header"
                      >
                        <Typography
                          className="sarabun-regular-datatable"
                          sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                        >
                          Reviewed ผู้จัดการคุณภาพ (QMR)
                          <span style={{ color: "red" }}> *</span>
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                          {/* ✅ ใช้ RadioGroup แทน Checkbox */}
                          <RadioGroup
                            row
                            value={dataQcapp?.id || ""} // เก็บ id ของที่เลือก
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const selectedItem = (filteredQcApprove || []).find(
                                (item) => item.id === selectedId
                              );
                              setdataQcapp(selectedItem ? { ...selectedItem } : null); // เก็บแค่ 1 ค่า
                            }}
                          >
                            <Grid container spacing={2}>
                              {(filteredQcApprove || []).map((item: LovType) => (
                                <Grid size={3} key={item.id}>
                                  <FormControlLabel
                                    value={item.id}
                                    control={<Radio />}
                                    label={item.lov1}
                                    disabled={isActionRead || isActionDelete}
                                    sx={{
                                      m: 0,
                                      px: 2,
                                      py: 1,
                                      borderRadius: 2,
                                      border: dataQcapp?.id === item.id ? "2px solid #4caf50" : "none",
                                      bgcolor: dataQcapp?.id === item.id ? "#d0f0c0" : "#f5f5f5", // ✅ เขียวพาสเทลถ้าเลือก, เทาอ่อนถ้ายังไม่เลือก
                                      "&:hover": {
                                        bgcolor: "#c8e6c9", // สี hover
                                      },
                                    }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </RadioGroup>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    {dataReportTypeValue && (
                      <Accordion
                        expanded={isMinimizedeapp2Open}
                        onChange={() => setisMinimizeDeapp2Open(!isMinimizedeapp2Open)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          mt: 2  // <-- เพิ่ม margin-top
                        }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="detail-content"
                          id="detail-header"
                        >
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                          >
                            หมายเหตุการอนุมัติ
                            <span style={{ color: "red" }}> *</span>
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Box sx={{ mt: -3 }}>
                            <Divider sx={{ my: 1 }} />
                            <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                              {/* Response Date Field - positioned after Emergency option */}
                              <Grid size={12}>
                                <FullWidthTextArea
                                  value={root_cause}
                                  labelName=""
                                  onchange={(e) => setroot_cause(e)}
                                  bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                                  readonly={isActionRead || isActionDelete}
                                />

                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    {dataReportTypeValue && (
                      <Accordion
                        expanded={isMinimizeotapp2Open}
                        onChange={() => setisMinimizeOtapp2Open(!isMinimizeotapp2Open)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          mt: 2  // <-- เพิ่ม margin-top
                        }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="detail-content"
                          id="detail-header"
                        >
                          <Typography
                            className="sarabun-regular-datatable"
                            sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}
                          >
                            หมายเหตุเพิ่มเติม
                            <span style={{ color: "red" }}> *</span>
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Box sx={{ mt: -3 }}>
                            <Divider sx={{ my: 1 }} />
                            <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                              {/* Response Date Field - positioned after Emergency option */}
                              <Grid size={12}>
                                <FullWidthTextArea
                                  value={root_cause}
                                  labelName=""
                                  onchange={(e) => setroot_cause(e)}
                                  bgcolorTextField={action === "Add" ? false : isActionEdit ? false : true}
                                  readonly={isActionRead || isActionDelete}
                                />

                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
