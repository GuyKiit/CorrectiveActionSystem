//ทำobj เป็น array
import React, { useState, useRef, use } from "react";
import AddIcon from '@mui/icons-material/Add';
import { setValueMas } from "../../../../libs/setvaluecallback";
import DeleteIcon from '@mui/icons-material/Delete';
import { _POST } from "../../../service/mas";
import { _formatNumber, _formatNumberNotdecimal } from "../../../../libs/datacontrol";
import dayjs from "dayjs";
import { Box, Divider, IconButton, Paper, Table, TableCell, TableRow, TableBody, TableHead, TableContainer, styled, TextField, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid2, Stack } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import DesktopDatePickers from "../../../components/MUI/DesktopDatePicker";
import FullWidthButton from "../../../components/MUI/FullWidthButton";
import FullWidthTextArea from "../../../components/MUI/FullWidthTextFieldArea";
import FullWidthCheckbox from "../../../components/MUI/FullWidthCheckbox";
import Grid from '@mui/material/Grid2';
import TimePickerTextField from "../../../components/MUI/TimePickerTextField";
import FullSweetalert from "../../../components/MUI/Sweetalert";
import { v4 as uuidv4 } from 'uuid';
import { useData } from "../../../auth/core/DataContext";
import { useLayout } from "../../../layout/core/LayoutProvider";
import { Collapse } from "@mui/material";
import BrowseFileUpload from "./BrowseFileUpload";
import { log } from "node:console";
import { cleanAccessData } from "../../../service/initmain/initmain";
import { useListComplaint } from "../core/ListComplaintContext";
import { data } from "react-router-dom";

type Validate = {
  Product_Group: boolean,
}

type detail = {
  qty?: false,
}

type Block = {
  id: any,
  season: number,
  groupProduct: number,
  prod_id: any,
  customer: any,
  address: any,
  tms_Complaint_no: string,
  order_po: string,
  order_do: string,
  qty: any,
  pack_unit: any,
  total_weight_ton: any,
  note: any,
  isValid: boolean,
  validateMessage: string,
  req: any,
};

interface ComplaintBody {
  action: string
  disableTextField?: boolean
  readonlyTextField?: boolean
  bgcolorTextField?: boolean
  disableComBoBox?: boolean
  dataelement?: any
  validateText?: Validate
  validateDetailText?: { [index: number]: detail }
  onBlocksChange?: (blocks: Block[]) => void;


}

type LovType = {
  id: string;
  lov_id: string;
  lov_group: string;
  lov_type: string;
  lov_code: string;
  lov1: string;
  lov3: string;
};

export default function ComplaintInsert({
  action,
  dataelement,
  readonlyTextField,
  bgcolorTextField,
  validateText,
  onBlocksChange,
  validateDetailText


}: ComplaintBody) {
  const user = cleanAccessData('userSession');
  console.log(user[0].employee_username, "userrrr");
  const {
    Complaint_no,
    no,
    cas_number,
    doc_date,
    date_of_detection,
    request_name,
    request_company_id,
    request_domain_id,
    request_department_id,
    request_position,
    request_email,
    request_phone,
    request_date,
    respondent_company_id,
    respondent_domain_id,
    respondent_department_id,
    respondent_email,
    respondent_other_name,
    respondent_other_email,
    area_of_detection_dept,
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


    setComplaint_no,
    setno,
    setcas_number,
    setdoc_date,
    setdate_of_detection,
    setrequest_name,
    setrequest_company_id,
    setrequest_domain_id,
    setrequest_department_id,
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
    setarea_of_detection_dept,
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

  } = useListComplaint();

  // Utility Variables ======================================================
  const { Customer } = useData()
  const { setIsLoadingScreen } = useLayout()

  // Get Master Variables ======================================================
  const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>([]);
  const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
  const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
  const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);

  // Value Variables ======================================================
  const [dataComplaintType, setdataComplaintType] = useState<LovType[]>([]);
  const [dataComplaintRs, setdataComplaintRs] = useState<LovType[]>([]);
  const [dataphoto, setdataphoto] = useState<LovType[]>([]);
  const [datapriority, setdatapriority] = useState<LovType | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // Hidden Variables ======================================================
  const [isFormHidden, setisFormHidden] = useState(true);

  const [isCasNumberHidden, setisCasNumberHidden] = useState(true);
  const [isFactoryHidden, setisFactoryHidden] = useState(true);
  const [isAreaOfDetectionHidden, setisAreaOfDetectionHidden] = useState(true);
  const [isProductHidden, setisProductHidden] = useState(true);
  const [isLotNoHidden, setisLotNoHidden] = useState(true);
  const [isAttachmentsHidden, setisAttachmentsHidden] = useState(true);
  const [isDocumentIssuanceHidden, setisDocumentIssuanceHidden] = useState(true);
  const [isDateOfDetection, setisDateOfDetection] = useState(true);
  const [isRequiredResponseDateHidden, setisRequiredResponseDateHidden] = useState(true);
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
    console.log(val, 'valvalvalvalvalvalvalvalvalvalvalvalvalvalvalval');

    if (val?.lov_code === "CAR" || val?.lov_code === "OBS" || val?.lov_code === "CPAR") {
      setIsRSHidden(true);
    } else {
      setIsRSHidden(false);
    }

    setdataReportTypeValue(val);
    console.log(dataReportTypeValue, 'dataReportTypeValue');

    setdataComplaintTypeValue_Combobox(null);
    setdataComplaintType([]);
    setdataComplaintRsValue_Combobox(null);
    setdataComplaintRs([]);
    setdataphotoValue_Combobox(null);
    setdataphoto([]);
    setdatapriorityValue_Combobox(null);
    setdatapriority(null);
    setcas_number("");
    setarea_of_detection_dept("");
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



    // if (!val) {
    //   setFilteredComplaintType([]);
    //   setFilteredComplaintRs([]);
    //   setFilteredphoto([]);
    //   setFilteredpriority([]);

    //   return;
  };
  const handleCheckboxChangeCT = (item: LovType) => {
    console.log("item", item);

    setdataComplaintType((prev: LovType[] = []) => {
      let newData: LovType[];

      if (prev.some(c => c.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter(c => c.id !== item.id);

        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        if (item.id === "TRR_CT_NCR_99") {
          setcompTypeOther("");
        }
        if (item.id === "TRR_CT_CAR_99") {
          setcompTypeOther("");
        }
        if (item.id === "TRR_CT_OBS_99") {
          setcompTypeOther("");
        }
        if (item.id === "TRR_CT_CPAR_99") {
          setcompTypeOther("");
        }
      } else {
        // เพิ่ม object แบบเต็ม
        newData = [...prev, item];
      }

      // สร้าง array ลดรูป
      const reducedArray = newData.map(c => (
        {
          complaint_type_id: c.id,
          label: c.lov1
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
      let newData: LovType[];

      if (prev.some(rs => rs.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = prev.filter(rs => rs.id !== item.id);

        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        if (item.id === "TRR_RS_NCR_99") {
          setcompRsOther("");
        }
        if (item.id === "TRR_RS_NCR_6") {
          setclauseOther("");
        }
      }
      else {
        // เพิ่ม object แบบเต็ม
        newData = [...prev, item];
      }

      // สร้าง array ลดรูปสำหรับ context
      const reducedArray = newData.map(rs => ({ complaint_type_id: rs.id, lov1: rs.lov1 }));

      console.log("Reduced array:", reducedArray);

      setdataComplaintRsValue_Combobox(reducedArray);

      return newData;
    });
  };
  const handleCheckboxChangePhotoType = (item: LovType) => {
    setdataphoto((prev: LovType[] = []) => {
      let newData: LovType[];

      if (prev.some(pho => pho.id === item.id)) {
        // ถ้ามีอยู่แล้ว → เอาออก
        newData = [];

        // ถ้าเอาออกแล้วเป็น Other → เคลียร์ค่า
        if (item.id === "TRR_AT_4") {
          setphoTypeOther("");
        }
      }
      else {
        // เพิ่ม object แบบเต็ม
        newData = [item];
      }

      // สร้าง array ลดรูปสำหรับ context
      const reducedArray = newData.map(pho => ({
        complaint_at_id: pho.id,
        label: pho.lov1
      }));

      console.log("Reduced array:", reducedArray);

      setdataphotoValue_Combobox(reducedArray);

      return newData;
    });
  };
  const handleCheckboxChangePriority = (item: LovType) => {
    setdatapriority(prev => (prev?.id === item.id ? null : item));
  };
  const handleFileChange = (fileArray: File[]) => {
    const file = fileArray[0]; // เลือกไฟล์ตัวแรก
    if (file) {
      setFiles(prev => [...prev, file]); // push File เดี่ยวเข้า File[]
    }
  };
  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
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
  const priorityCalculateRespondDate = (daysToAdd: number, checked: boolean) => {
    if (checked) {
      const newDate = dayjs().add(daysToAdd, "day"); // use dayjs instead of Date
      setrespond_date_within(newDate);
    } else {
      setrespond_date_within(null);
    }
  };

  React.useEffect(() => {

    if (dataReportTypeValue) {
      const val = dataReportTypeValue;

      // กรอง complaint type
      const filtered = (dataComplaintType_Combobox || []).filter((item: LovType) =>
        item.lov_type === "complaint_type" && item.lov_code === val.id
      );
      setFilteredComplaintType(filtered);

      // กรอง attach type
      const filteredpho = (dataphoto_Combobox || []).filter((item: LovType) =>
        item.lov_type === "attach_type"
      );
      setFilteredphoto(filteredpho);

      // กรอง priority
      const filteredpriority = (datapriority_Combobox || []).filter((item: LovType) =>
        item.lov_type === "priority_level"
      );
      setFilteredpriority(filteredpriority);

      // ถ้าเลือก NCR → filter Reference Standard
      if (val.lov_code === "NCR") {
        const filteredRs = (dataComplaintRs_Combobox || []).filter((item: LovType) =>
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
  }, [dataReportTypeValue, dataComplaintType_Combobox, dataComplaintRs_Combobox, dataphoto_Combobox, datapriority_Combobox]);

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: '2px solid #F29739',
        borderRadius: 2,
        backgroundColor: '#ffffff',
        // boxShadow: '0 0 10px 2px rgba(0, 98, 233, 0.5)',
        // transition: 'box-shadow 0.3s ease',
        // '&:hover': {
        //   boxShadow: '0 0 20px 4px rgba(0, 98, 233, 0.8)',
        // },
      }}>


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
          <label className="sarabun-regular-datatable">{dataReportTypeValue?.lov4}</label>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
            <Grid size={4}>
              <FullWidthTextField
                value={cas_number}
                labelName="CAS Number"
                onchange={(e) => { setcas_number(e); }}
              // hidden={true}
              />
            </Grid>
            <Grid size={4}>
              <FullWidthTextField
                required="required"
                value={product_name}
                labelName="Product Name"
                onchange={(e) => setproduct_name(e)}
              />
            </Grid>
            <Grid size={4}>
              <FullWidthTextField
                required="required"
                value={lot_no}
                labelName="Lot No./Bag No"
                onchange={(e) => setlot_no(e)}
              />
            </Grid>
            <Paper elevation={2} sx={{ p: 2, mt: 2, width: "100%" }}>
              <div className="px-2 pt-2 pb-5">
                <label className="sarabun-regular-datatable">
                  Respondent
                </label>
                <Divider sx={{ my: 0.1, borderColor: "#FFFFF" }} />
              </div>
              <Grid container spacing={2}>
                <Grid size={4}>
                  <AutocompleteComboBox
                    value={respondent_company_id}
                    labelName={"Factory"}
                    options={dataset_company}
                    column="domain_name"
                    setvalue={(v) => setrespondent_company_id(v)}
                    // setvalue={setrespondent_company_id}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <AutocompleteComboBox
                    value={respondent_domain_id}
                    labelName={"Domain"}
                    options={dataset_domain}
                    column="domain_id"
                    setvalue={setrespondent_domain_id}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <AutocompleteComboBox
                    required="required"
                    value={respondent_department_id}
                    labelName={"Department"}
                    options={dataset_department}
                    column="itasset_department_name"
                    setvalue={setrespondent_department_id}
                  />
                </Grid>
                <Grid size={4}>
                  <FullWidthTextField
                    value={user[0]?.employee_email ? user[0]?.employee_email : '-'}
                    labelName="Email"
                    onchange={(e) => setrespondent_email(e.target.value)}
                  />
                </Grid>
                <Grid size={4}>
                  <DesktopDatePickers
                    required="required"
                    labelName={"Date of Detection"}
                    value={date_of_detection}
                    handleChange={(val) => setdate_of_detection(val ?? null)}
                  />
                </Grid>
                <Grid size={4}>
                  <DesktopDatePickers
                    labelName={"Document Issuance Date"}
                    value={doc_date}
                    handleChange={(val) => setdoc_date}
                    readonly
                  />
                </Grid>
                <Grid size={4}>
                  <DesktopDatePickers
                    labelName={"Required Response Date"}
                    value={respond_date_within}
                    handleChange={(val) => setrespond_date_within}
                    readonly
                  />
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={2}>
              {dataReportTypeValue && (
                <Grid size={6}>
                  <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                    <label className="sarabun-regular-datatable">Type Of Complaint</label>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      {(filteredComplaintType || []).map((item: LovType) => (
                        <Grid size={6} key={item.id}>
                          <FullWidthCheckbox
                            labelName={item.lov1}
                            value={dataComplaintType.some(c => c.id === item.id)}
                            onchange={() => handleCheckboxChangeCT(item)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    {dataComplaintType.some(c => c.id === "TRR_CT_NCR_99") && (
                      <FullWidthTextArea
                        value={compTypeOther}
                        labelName="Other:"
                        onchange={(e) => setcompTypeOther(e)}
                      />
                    )}
                  </Paper>
                </Grid>
              )}

              {!isRSHidden && dataReportTypeValue && (
                <Grid size={6}>
                  <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                    <label className="sarabun-regular-datatable">Reference Standard</label>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      {filteredComplaintRs.map((item: LovType) => (
                        <Grid size={6} key={item.id}>
                          <FullWidthCheckbox
                            labelName={item.lov1}
                            value={dataComplaintRs.some(rs => rs.id === item.id)}
                            onchange={() => handleCheckboxChangeRS(item)}
                          // hidden={true}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    {dataComplaintRs.some(rs => rs.id === "TRR_RS_NCR_99") && (
                      <FullWidthTextArea
                        value={compRsOther}
                        labelName="Other:"
                        onchange={(e) => setcompRsOther(e)}
                      />
                    )}
                    {dataComplaintRs.some(rs => rs.id === "TRR_RS_NCR_6") && (
                      <FullWidthTextArea
                        value={clauseOther}
                        labelName="Clause:"
                        onchange={(e) => setclauseOther(e)}
                      />
                    )}
                  </Paper>
                </Grid>
              )}
              <Grid size={7}>
                <FullWidthTextArea
                  required="required"
                  value={detail}
                  labelName="Detail"
                  onchange={(e) => setdetail(e)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {/* Row 1: Priority */}
              {dataReportTypeValue && (
                <Grid size={5}>
                  <label className="sarabun-regular-datatable">Priority</label>
                  <Grid container spacing={2}>
                    {(filteredpriority || []).map((item: LovType) => (
                      <Grid size={3} key={item.id}>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={datapriority?.id === item.id}
                              onChange={(e) => {
                                console.log("eeeeeeeeeeee", e);
                                setdatapriorityValue_Combobox(item.lov_code);
                                // update priority state
                                setdatapriority(item);
                                // ดึงจำนวนวันจาก lov3 ของ item ที่เลือก
                                const days = Number(item.lov3 ?? 0);
                                // คำนวณวันที่
                                priorityCalculateRespondDate(days, true); // ใช้ true เพราะกดเลือกแล้ว
                                // log ค่า item ที่เลือก
                                console.log("เลือก priority:", item.lov_code, "Days:", days);
                              }}
                            />
                          }
                          label={item.lov_code}
                          sx={{ width: "100%", m: 0 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
              <Paper elevation={2} sx={{ p: 2, mt: 2, width: "100%" }}>
                <div className="px-2 pt-2 pb-5">
                  <label className="sarabun-regular-datatable">
                    Request
                  </label>
                  <Divider sx={{ my: 0.1, borderColor: "#FFFFF" }} />
                </div>
                <Grid container spacing={3}>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={user[0]?.employee_username ? user[0]?.employee_username : '-'}
                      labelName="Reported by"
                      onchange={(e) => setrequest_name(e.target.value)}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox
                      value={request_company_id}
                      labelName={"Factory"}
                      options={dataset_company}
                      column="domain_name"
                      setvalue={(v) => setrequest_company_id(v)}
                      // setvalue={setrespondent_company_id}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox
                      required="required"
                      value={request_domain_id}
                      labelName={"Domain"}
                      options={dataset_domain}
                      column="domain_id"
                      setvalue={setrequest_domain_id}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={user[0]?.itasset_department_id ? user[0]?.itasset_department_id : '-'}
                      labelName="Department / Area of Detection"
                      onchange={(e) => setarea_of_detection_dept(e.target.value)}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <AutocompleteComboBox
                      required="required"
                      value={request_department_id}
                      labelName={"Department"}
                      options={dataset_department}
                      column="itasset_department_name"
                      setvalue={setrequest_department_id}
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={user[0]?.employee_position ? user[0]?.employee_position : '-'}
                      labelName="Position"
                      onchange={(e) => setrequest_position(e.target.value)}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={user[0]?.employee_email ? user[0]?.employee_email : '-'}
                      labelName="Email"
                      onchange={(e) => setrequest_email(e.target.value)}
                      readonly
                    />
                  </Grid>
                  <Grid size={4}>
                    <FullWidthTextField
                      value={user[0]?.employee_tel ? user[0]?.employee_tel : '-'}
                      labelName="Phone"
                      onchange={(e) => setrequest_phone(e.target.value)}
                      readonly
                    />
                  </Grid>
                </Grid>
              </Paper>
              {dataReportTypeValue && (
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                      <label className="sarabun-regular-datatable">Please attach any relevant documents or photost</label>
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
                    </Paper>
                  </Grid>
                </Grid>
              )}
              <Grid container spacing={2}>
                <Grid container spacing={2}>
                  <Grid container spacing={2}>
                    <BrowseFileUpload setFile={handleFileChange} setFileName={() => { }} />
                    {/* ตารางแสดงไฟล์ */}
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>ชื่อไฟล์</TableCell>
                            <TableCell>ขนาด (MB)</TableCell>
                            <TableCell>จัดการ</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {files.map((file: File, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{file.name}</TableCell>
                              <TableCell>{(file.size / (1024 * 1024)).toFixed(2)} MB</TableCell>
                              <TableCell>
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleRemoveFile(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>


            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

