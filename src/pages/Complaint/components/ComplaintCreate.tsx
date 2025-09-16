import React, { useState, useRef, use } from "react";
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
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

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

interface ComplaintBody {
  action: string;
  disableTextField?: boolean;
  readonlyTextField?: boolean;
  bgcolorTextField?: boolean;
  disableComBoBox?: boolean;
  dataelement?: any;
  validateText?: Validate;
  validateDetailText?: { [index: number]: detail };
  onBlocksChange?: (blocks: Block[]) => void;
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
};

export default function ComplaintBody({
  action,
  dataelement,
  readonlyTextField,
  bgcolorTextField,
  validateText,
  onBlocksChange,
  validateDetailText,
}: ComplaintBody) {
  const user = cleanAccessData("userSession");
  const allowedTypes = [
    "application/pdf",
    "image/jpg",
    "image/jpeg",
    "image/png",
  ];

  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);

  const handlePreviewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileBuffer(e.target?.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  };

  const {
    Complaint_no,
    no,
    cas_number,
    doc_date,
    date_of_detection,
    request_name,
    request_company_id,
    request_domain_id,
    request_position,
    request_email,
    request_phone,
    request_date,
    respondent_company_id,
    // request_department_id,
    respondent_domain_id,
    respondent_department_id,
    respondent_email,
    respondent_other_name,
    respondent_other_email,
    area_of_detection_dept_id,
    area_of_detection_dept_name,
    product_name,
    detail,
    priority_level,
    respond_date_within,
    lot_no,
    user_file_name,
    other,
    compTypeOther,
    compRsOther,
    clauseOther,
    photoOther,
    phoTypeOther,
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
    datapriority_Combobox,
    datapriorityValue_Combobox,

    // Dataset
    dataset_reporttype,
    dataset_company,
    dataset_department,
    dataset_domain,
    complaintFiles,

    setComplaint_no,
    setno,
    setcas_number,
    setdoc_date,
    setdate_of_detection,
    setrequest_name,
    setrequest_company_id,
    setrequest_domain_id,
    // setrequest_department_id,
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
    setarea_of_detection_dept_id,
    setarea_of_detection_dept_name,
    setproduct_name,
    setdetail,
    setcomplaint_type_other,
    setpriority_level,
    setrespond_date_within,
    setlot_no,
    setother,
    setcompTypeOther,
    setcompRsOther,
    setclauseOther,
    setphotoOther,
    setphoTypeOther,

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
    setdataComplaintRsValue_Combobox,
    setdataphoto_Combobox,
    setdataphotoValue_Combobox,
    setdatapriority_Combobox,
    setdatapriorityValue_Combobox,

    // Dataset
    setdataset_reporttype,
    setdataset_company,
    setdataset_department,
    setdataset_domain,
    setcomplaintFiles,
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
  const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>(
    []
  );
  const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
  const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
  const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);

  // Value Variables ======================================================
  const [dataComplaintType, setdataComplaintType] = useState<LovType[]>([]);
  const [dataComplaintRs, setdataComplaintRs] = useState<LovType[]>([]);
  const [dataphoto, setdataphoto] = useState<LovType[]>([]);
  const [datapriority, setdatapriority] = useState<LovType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileAttachmentTypes, setFileAttachmentTypes] = useState<{
    [fileIndex: number]: string;
  }>({});
  const [fileOtherTexts, setFileOtherTexts] = useState<{
    [fileIndex: number]: string;
  }>({});
  const [fileList, setFileList] = useState<FileData[]>([]);
  const [request_department_id, setrequest_department_id] = React.useState<{
    itasset_department_id: number;
    itasset_department_name: string;
  } | null>(null);

  // Hidden Variables ======================================================
  const [isFormHidden, setisFormHidden] = useState(true);

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
  const [isRSHidden, setIsRSHidden] = useState(true);
  const [isDetailHidden, setisDetailHidden] = useState(true);
  const [isPriority, setisPriority] = useState(true);
  const [isReportedByHidden, setisReportedByHidden] = useState(true);
  const [isPositionHidden, setisPositionHidden] = useState(true);
  const [isDepartmentHidden, setisDepartmentHidden] = useState(true);
  const [isEmailHidden, setisEmailHidden] = useState(true);
  const [isPhoneHidden, setisPhoneHidden] = useState(true);

  // Function Handlers (On Change Event) ======================================================
  const handleReportTypeChange = (val: LovType | null) => {
    console.log(val, "valvalvalvalvalvalvalvalvalvalvalvalvalvalvalval");

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
    console.log(dataReportTypeValue, "dataReportTypeValue");

    setdataComplaintTypeValue_Combobox(null);
    setdataComplaintType([]);
    setdataComplaintRsValue_Combobox(null);
    setdataComplaintRs([]);
    setdataphotoValue_Combobox(null);
    setdataphoto([]);
    setdatapriorityValue_Combobox(null);
    setdatapriority(null);
    setcas_number("");
    setarea_of_detection_dept_id("");
    setproduct_name("");
    setlot_no("");
    setdetail("");
    setcompTypeOther("");
    setcompRsOther("");
    setclauseOther("");
    setphoTypeOther("");
    setrespond_date_within(null);
    setrespondent_domain_id(dataset_company[0]);
    setrespondent_company_id(dataset_company[0]);
    setrequest_domain_id(dataset_company[0]);
    setrequest_company_id(dataset_company[0]);
    setrequest_department_id(user);
  };

  const handleCheckboxChangeCT = (item: LovType) => {
    console.log("💛💛item", item);

    setdataComplaintType((prev: LovType[] = []) => {
      let newData: LovType[];

      if (prev.some((c) => c.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter((c) => c.id !== item.id);

        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        if (item.lov2 === "Y") {
          setcompTypeOther("");
        }
        // if (item.id === "TRR_CT_CAR_99") {
        //   setcompTypeOther("");
        // }
        // if (item.id === "TRR_CT_OBS_99") {
        //   setcompTypeOther("");
        // }
        // if (item.id === "TRR_CT_CPAR_99") {
        //   setcompTypeOther("");
        // }
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

      // ดู log
      console.log("Reduced array:", reducedArray);

      // อัปเดตเข้า context
      setdataComplaintTypeValue_Combobox(reducedArray);
      // อัปเดตเข้า context เป็น array ลดรูป (แค่ id, lov1)
      // setdataComplaintTypeValue_Combobox(
      //   newData.map(c => ({ id: c.id, lov1: c.lov1 }))
      // );

      return newData;
    });
  };

  const handleCheckboxChangeRS = (item: LovType) => {
    setdataComplaintRs((prev: LovType[] = []) => {
      console.log("💚💚item", item);
      let newData: LovType[];

      if (prev.some((rs) => rs.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter((rs) => rs.id !== item.id);

        if (item.lov2 === "Y") {
          setcompRsOther("");
        }
        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        // if (item.id === "TRR_RS_NCR_99") {
        //   setcompRsOther("");
        // }
        if (item.id === "TRR_RS_NCR_6") {
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
      }));
      // const reducedArray = newData.map(rs => ({ complaint_type_id: rs.id, lov1: rs.lov1 }));

      console.log("Reduced array:", reducedArray);

      setdataComplaintRsValue_Combobox(reducedArray);

      return newData;
    });
  };
  const handleCheckboxChangePhotoType = (item: LovType) => {
    setdataphoto((prev: LovType[] = []) => {
      let newData: LovType[];

      if (prev.some((pho) => pho.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = [];

        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        if (item.id === "TRR_AT_4") {
          setphoTypeOther("");
        }
      } else {
        // เพิ่ม object แบบเต็ม
        newData = [item];
      }

      // สร้าง array ลดรูปสำหรับ context
      const reducedArray = newData.map((pho) => ({
        complaint_at_id: pho.id,
        label: pho.lov1,
      }));

      console.log("Reduced array:", reducedArray);

      setdataphotoValue_Combobox(reducedArray);

      return newData;
    });
  };
  const handleCheckboxChangePriority = (item: LovType) => {
    setdatapriority((prev) => (prev?.id === item.id ? null : item));
  };

  // รับ ComplaintFile[] จาก BrowseFileUpload
  const handleFileChange = (fileArray: ComplaintFile[]) => {
    if (!fileArray || fileArray.length === 0) return;

    const updatedList = [...fileList, ...fileArray];
    setFileList(updatedList);
    setcomplaintFiles(updatedList);
    // sync context
  };

  const handleRemoveFile = (index: number) => {
    setFileList((prev) => {
      const updatedList = prev.filter((_, i) => i !== index);
      setcomplaintFiles(updatedList); // sync
      return updatedList;
    });
  };
  const handleFileAttachmentTypeChange = (index: number, type: string) => {
    const updated = [...fileList];
    updated[index] = {
      ...updated[index],
      attachmentType: type,
      otherText: type === "TRR_AT_4" ? updated[index].otherText : "",
    };
    setFileList(updated);
    setcomplaintFiles(updated);
  };

  const handleFileOtherTextChange = (index: number, text: string) => {
    const updated = [...fileList];
    updated[index] = { ...updated[index], otherText: text };
    setFileList(updated);
    setcomplaintFiles(updated);
    return updated;
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
    setrespond_date_within(null);
    setdetail("");
    setcompTypeOther("");
    setcompRsOther("");
  };

  const priorityCalculateRespondDate = (
    daysToAdd: number,
    checked: boolean
  ) => {
    if (checked) {
      const newDate = dayjs().add(daysToAdd, "day"); // use dayjs instead of Date
      setrespond_date_within(newDate);
    } else {
      setrespond_date_within(null);
    }
  };

  React.useEffect(() => {
    // if (user && user.length > 0) {
    //   setrequest_department_id({
    //     itasset_department_id: user[0].itasset_department_id,
    //     itasset_department_name: user[0].itasset_department_name
    //   });
    // }

    if (dataReportTypeValue) {
      const val = dataReportTypeValue;

      // กรอง complaint type
      const filtered = (dataComplaintType_Combobox || []).filter(
        (item: LovType) =>
          item.lov_type === "complaint_type" && item.lov_code === val.id
      );
      console.log("🖤🤎filtered", filtered);

      setFilteredComplaintType(filtered);

      // กรอง attach type
      const filteredpho = (dataphoto_Combobox || []).filter(
        (item: LovType) => item.lov_type === "attach_type"
      );
      setFilteredphoto(filteredpho);

      // กรอง priority
      const filteredpriority = (datapriority_Combobox || []).filter(
        (item: LovType) => item.lov_type === "priority_level"
      );
      setFilteredpriority(filteredpriority);

      // ถ้าเลือก NCR → filter Reference Standard
      if (val.lov_code === "NCR") {
        const filteredRs = (dataComplaintRs_Combobox || []).filter(
          (item: LovType) =>
            item.lov_type === "reference_standard" && item.lov_code === val.id
        );
        setFilteredComplaintRs(filteredRs);
      }
    } else {
      // reset ถ้า val null
      setFilteredComplaintType([]);
      setFilteredComplaintRs([]);
      setFilteredphoto([]);
      setFilteredpriority([]);
    }
  }, [
    user,
    dataReportTypeValue,
    dataComplaintType_Combobox,
    dataComplaintRs_Combobox,
    dataphoto_Combobox,
    datapriority_Combobox,
    dataelement,
  ]);

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
          ประเภทข้อมูลแบบฟอร์ม
        </label>
      </div>
      <Divider sx={{ my: 0.1, borderColor: "#F29739" }} />
      <Grid container spacing={2} mt={2}>
        <Grid size={6}>
          <AutocompleteComboBox
            required="required"
            value={dataReportTypeValue}
            labelName={"ประเภทรายงาน (Report Type)"}
            options={dataset_reporttype}
            column="lov_code"
            setvalue={handleReportTypeChange}
            readonly={action === "Edit" ? false : readonlyTextField}
            bgcolorTextField={action === "Edit" ? false : bgcolorTextField}
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
            <Grid size={4} mt={2}>
              <AutocompleteComboBox
                value={respondent_company_id}
                labelName={"โรงงาน (Factory)"}
                options={dataset_company}
                column="domain_name"
                setvalue={(v) => setrespondent_company_id(v)}
                readonly
              />
            </Grid>
            <Grid size={4} mt={2}>
              <FullWidthTextField
                value={cas_number}
                labelName="CAS Number"
                onchange={(e) => {
                  setcas_number(e);
                }}
                readonly
              />
            </Grid>
            <Grid size={4} mt={2}>
              <DesktopDatePickers
                labelName={"วันที่ออกเอกสาร (Document Issuance Date)"}
                value={doc_date}
                handleChange={(val) => setdoc_date}
                bgcolorTextField={true}
                readonly
              />
            </Grid>
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
                  แผนกผู้ถูกร้องเรียน (Respondent Department)
                </label>
              </Box>
              <Grid container spacing={3}>
                {/* <Grid size={4}>
                  <AutocompleteComboBox
                    value={respondent_domain_id}
                    labelName={"Domain"}
                    options={dataset_domain}
                    column="domain_id"
                    setvalue={setrespondent_domain_id}
                    readonly
                  />
                </Grid> */}
                <Grid size={4}>
                  <DesktopDatePickers
                    required="required"
                    labelName={"วันที่พบปัญหา (Date of Detection)"}
                    value={date_of_detection}
                    handleChange={(val) => setdate_of_detection(val ?? null)}
                    readonly={action === "Read"}
                  />
                </Grid>
                <Grid size={4}>
                  <AutocompleteComboBox
                    required="required"
                    value={respondent_department_id}
                    labelName={
                      "แผนกที่พบปัญหา (Department / Area of Detection)"
                    }
                    options={dataset_department}
                    column="itasset_department_name"
                    setvalue={(e) => {
                      console.log(e); // ดูค่าของ e ที่ถูกส่งมาจาก AutocompleteComboBox
                      setrespondent_department_id(e);
                    }}
                    readonly={action === "Read"}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={product_name}
                    labelName="ชื่อสินค้า (Product Name)"
                    onchange={(e) => setproduct_name(e)}
                    readonly={action === "Read"}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={lot_no}
                    labelName="Lot No./Bag No"
                    onchange={(e) => setlot_no(e)}
                    readonly={action === "Read"}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    required="required"
                    value={respondent_email}
                    labelName="อีเมล (Email)"
                    onchange={(e) => setrespondent_email(e)}
                    readonly={action === "Read"}
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
                  {dataReportTypeValue && (
                    <Grid size={6} sx={{ display: "flex" }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          minHeight: "400px",
                        }}
                      >
                        <label
                          className="sarabun-regular-datatable"
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#333",
                            margin: 0,
                          }}
                        >
                          ประเภทข้อร้องเรียน (Type Of Complaint){" "}
                          <span style={{ color: "red" }}> *</span>
                        </label>
                        <Divider sx={{ my: 2 }} />
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
                                <Grid size={6} key={item.id}>
                                  <FullWidthCheckbox
                                    labelName={item.lov1}
                                    value={dataComplaintType.some(
                                      (c) => c.id === item.id
                                    )}
                                    onchange={() =>
                                      handleCheckboxChangeCT(item)
                                    }
                                    readonly={action === "Read"}
                                  />
                                </Grid>
                              )
                            )}
                          </Grid>
                          <Box sx={{ mt: "auto", pt: 2 }}>
                            {dataComplaintType.some((c) => c.lov2 === "Y") && (
                              <FullWidthTextArea
                                value={compTypeOther}
                                labelName="Other:"
                                onchange={(e) => setcompTypeOther(e)}
                                readonly={action === "Read"}
                              />
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  )}

                  {!isRSHidden && dataReportTypeValue && (
                    <Grid size={6} sx={{ display: "flex" }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "#fafafa",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          minHeight: "400px",
                        }}
                      >
                        <label
                          className="sarabun-regular-datatable"
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#333",
                            margin: 0,
                          }}
                        >
                          มาตรฐานอ้างอิง (Reference Standard){" "}
                          <span style={{ color: "red" }}> *</span>
                        </label>
                        <Divider sx={{ my: 2 }} />
                        <Box
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Grid container spacing={2}>
                            {filteredComplaintRs.map((item: LovType) => (
                              <Grid size={6} key={item.id}>
                                <FullWidthCheckbox
                                  labelName={item.lov1}
                                  value={dataComplaintRs.some(
                                    (rs) => rs.id === item.id
                                  )}
                                  onchange={() => handleCheckboxChangeRS(item)}
                                  readonly={action === "Read"}
                                />
                              </Grid>
                            ))}
                          </Grid>
                          <Box sx={{ mt: "auto", pt: 2 }}>
                            {/* {dataComplaintRs.some(rs => rs.id === "TRR_RS_NCR_99") && (
                              <FullWidthTextArea
                                value={compRsOther}
                                labelName="Other:"
                                onchange={(e) => setcompRsOther(e)}
                                readonly={action === "Read"}
                              />
                            )} */}
                            {dataComplaintRs.some((rs) => rs.lov2 === "Y") && (
                              <FullWidthTextArea
                                value={compRsOther}
                                labelName="Other:"
                                onchange={(e) => setcompRsOther(e)}
                                readonly={action === "Read"}
                              />
                            )}
                            {dataComplaintRs.some(
                              (rs) => rs.id === "TRR_RS_NCR_6"
                            ) && (
                              <FullWidthTextArea
                                value={clauseOther}
                                labelName="Clause:"
                                onchange={(e) => setclauseOther(e)}
                                readonly={action === "Read"}
                              />
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
                {/* Priority Section */}
                {dataReportTypeValue && (
                  <Box sx={{ mt: 3 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <label
                        className="sarabun-regular-datatable"
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#333",
                          margin: 0,
                        }}
                      >
                        รายละเอียด (Detail){" "}
                        <span style={{ color: "red" }}> *</span>
                      </label>
                      <Divider sx={{ my: 2 }} />
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
                            onchange={(e) => setdetail(e)}
                            readonly={action === "Read"}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}
                {/* Priority Section */}
                {dataReportTypeValue && (
                  <Box sx={{ mt: 3 }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <label
                        className="sarabun-regular-datatable"
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#333",
                          margin: 0,
                        }}
                      >
                        ระดับความสำคัญ (Priority){" "}
                        <span style={{ color: "red" }}> *</span>
                      </label>
                      <Divider sx={{ my: 2 }} />
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
                                      checked={datapriority?.id === item.id}
                                      onChange={(e) => {
                                        // console.log("Priority selected:", e);
                                        console.log("Priority selected:", item);
                                        setdatapriorityValue_Combobox(item.id);
                                        setdatapriority(item);
                                        const days = Number(item.lov3 ?? 0);
                                        priorityCalculateRespondDate(
                                          days,
                                          true
                                        );
                                        console.log(
                                          "เลือก priority:",
                                          item.lov_code,
                                          "Days:",
                                          days
                                        );
                                      }}
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
                    </Paper>
                  </Box>
                )}
              </Box>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 3,
                width: "100%",
                borderRadius: 3,
                background: "linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)",
                border: "1px solid #bbdefb",
                boxShadow: "0 4px 12px rgba(33,150,243,0.1)",
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
                    backgroundColor: "#2196f3",
                    borderRadius: 1,
                    mr: 2,
                  }}
                />
                <label
                  className="sarabun-regular-datatable"
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1976d2",
                    margin: 0,
                  }}
                >
                  แผนกที่ทำการร้องเรียน (Reporting Department)
                </label>
              </Box>
              <Grid container spacing={3}>
                <Grid size={4}>
                  <FullWidthTextField
                    value={
                      user[0]?.employee_username
                        ? user[0]?.employee_username
                        : "-"
                    }
                    labelName="ชื่อผู้ออกเอกสาร (Reported by)"
                    onchange={(e) => setrequest_name(e.target.value)}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    value={
                      user[0]?.employee_position
                        ? user[0]?.employee_position
                        : "-"
                    }
                    labelName="ตำแหน่ง (Position)"
                    onchange={(e) => setrequest_position(e.target.value)}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  {/* <AutocompleteComboBox
                    required="required"
                    value={request_department_id}
                    labelName={"แผนก (Department)"}
                    options={dataset_department}
                    column="itasset_department_name"
                    setvalue={setrequest_department_id}
                  /> */}
                  <FullWidthTextField
                    value={
                      user[0]?.itasset_department_id
                        ? user[0]?.itasset_department_name
                        : "-"
                    }
                    labelName="แผนก (Department)"
                    onchange={(e) => setrequest_department_id(e.target.value)}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    value={
                      user[0]?.employee_email ? user[0]?.employee_email : "-"
                    }
                    labelName="อีเมล (Email)"
                    onchange={(e) => setrequest_email(e.target.value)}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    value={user[0]?.employee_tel ? user[0]?.employee_tel : "-"}
                    labelName="เบอร์โทรศัพท์ (Phone)"
                    onchange={(e) => setrequest_phone(e.target.value)}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <AutocompleteComboBox
                    value={request_company_id}
                    labelName={"โรงงาน (Factory)"}
                    options={dataset_company}
                    column="domain_name"
                    setvalue={(v) => setrequest_company_id(v)}
                    readonly
                  />
                </Grid>
                {/* <Grid size={4}>
                  <AutocompleteComboBox
                    value={request_domain_id}
                    labelName={"โดเมน (Domain)"}
                    options={dataset_domain}
                    column="domain_id"
                    setvalue={setrequest_domain_id}
                    readonly
                  />
                </Grid> */}
                <Grid size={4}>
                  <AutocompleteComboBox
                    required="required"
                    value={
                      dataset_department.find(
                        (d: any) =>
                          d.itasset_department_id === area_of_detection_dept_id
                      ) || null
                    }
                    labelName={
                      "แผนกที่พบปัญหา (Department / Area of Detection)"
                    }
                    options={dataset_department}
                    column="itasset_department_name"
                    setvalue={(v) => {
                      setarea_of_detection_dept_id(
                        v?.itasset_department_id ?? null
                      );
                      setarea_of_detection_dept_name(
                        v?.itasset_department_name ?? ""
                      );
                    }}
                    readonly={action === "Read"}
                  />
                  {/* <FullWidthTextField
                    value={user[0]?.itasset_department_id ? user[0]?.itasset_department_id : '-'}
                    labelName="แผนกที่พบปัญหา (Department / Area of Detection)"
                    onchange={(e) => setarea_of_detection_dept_id(e.target.value)}
                    readonly
                  /> */}
                </Grid>
              </Grid>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 3,
                width: "100%",
                borderRadius: 3,
                background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                border: "1px solid #e0e0e0",
                boxShadow: "0 4px 12px rgba(158,158,158,0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  pb: 2,
                  borderBottom: "2px solid #9e9e9e",
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    backgroundColor: "#9e9e9e",
                    borderRadius: 1,
                    mr: 2,
                  }}
                />
                <label
                  className="sarabun-regular-datatable"
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#616161",
                    margin: 0,
                  }}
                >
                  แนบไฟล์ (Attachments)
                </label>
              </Box>

              <Grid container spacing={2}>
                {dataReportTypeValue && (
                  <Grid size={12}>
                    {/* <Paper elevation={2} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                      <label
                        className="sarabun-regular-datatable"
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#333',
                          margin: 0
                        }}
                      >
                        Please attach any relevant documents or photos
                      </label>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={2}>
                        {(filteredphoto || []).map((item: LovType) => (
                          <Grid size={6} key={item.id}>
                            <FullWidthCheckbox
                              labelName={item.lov1}
                              value={dataphoto.some(pho => pho.id === item.id)}
                              onchange={() => handleCheckboxChangePhotoType(item)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      {dataphoto.some(pho => pho.id === "TRR_AT_4") && (
                        <FullWidthTextArea
                          value={phoTypeOther}
                          labelName="Other:"
                          onchange={(e) => setphoTypeOther(e)}
                        />
                      )}
                    </Paper> */}

                    <BrowseFileUpload
                      setFile={handleFileChange}
                      setFileName={() => {}}
                      options={(filteredphoto || []).map((p: any) => ({
                        id: p.id,
                        lov1: p.lov1,
                      }))}
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
                                    style={{ fontSize: "15px", color: "#484444ff" }}
                                  >
                                    {(item.file.size / (1024 * 1024)).toFixed(
                                      2
                                    )}{" "}
                                    MB
                                  </div>
                                  {photoType.id === "TRR_AT_4" && (
                                    <div
                                      style={{
                                        //fontWeight: "bold",
                                        fontSize:  "15px",
                                        color: "#484444ff",
                                        marginTop: "4px",
                                      }}
                                    >
                                      รายละเอียด: {item.otherText}
                                    </div>
                                  )}
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleRemoveFile(
                                        fileList.findIndex((f) => f === item)
                                      )
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      window.open(
                                        URL.createObjectURL(item.file),
                                        "_blank"
                                      )
                                    }
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
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
                          ยังไม่มีไฟล์ที่อัปโหลด
                        </Paper>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Grid container spacing={2}></Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
