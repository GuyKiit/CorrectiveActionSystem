
import React, { useState, useRef } from "react";

import { setValueMas } from "../../../../libs/setvaluecallback";

import { _POST } from "../../../service/mas";
import { _formatNumber, _formatNumberNotdecimal } from "../../../../libs/datacontrol";
import dayjs from "dayjs";
import { useListComplaint } from "../core/ListComplaintContext";
import { Box, Divider, IconButton, Paper, Table, TableCell, TableRow, TableBody, TableHead, TableContainer, styled, TextField, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid2, Stack } from "@mui/material";
import Grid from '@mui/material/Grid2';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import DesktopDatePickers from "../../../components/MUI/DesktopDatePicker";
import FullWidthButton from "../../../components/MUI/FullWidthButton";
import FullWidthTextArea from "../../../components/MUI/FullWidthTextFieldArea";
import FullWidthCheckbox from "../../../components/MUI/FullWidthCheckbox";
import Tab from '@mui/material/Tab';

type Validate = {
    driverName: boolean,
    driverTel: boolean,
    truckPlateSub: boolean,
    truckType: boolean,
    finalMois: boolean,
    sampleAttr: boolean,
    workShift: boolean,
}

interface ComplaintBody {
    action: string
    disableTextField?: boolean
    readonlyTextField?: boolean
    bgcolorTextField?: boolean
    disableComBoBox?: boolean
    dataelement?: any
    validateText?: Validate

    startDate?: any;
    setStartDate?: (value: any) => void;

    endDate?: any;
    setEndDate?: (value: any) => void;

}

type LovType = {
    id: string;
    lov_id: string;
    lov_group: string;
    lov_type: string;
    lov_code: string;
    lov1: string;
    lov3: string;
    complaint_type_id: string;
    complaint_at_id: string;
};

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

export default function CompalintView({
    action,
    dataelement,
    readonlyTextField,
    bgcolorTextField,
    validateText,

}: ComplaintBody) {

    const {
        Complaint_no,
        no,
        report_type,
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
        compTypeOther,
        compRsOther,
        priority_level,
        respond_date_within,
        lot_no,
        user_file_name,
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
        dataset_reporttype,
        dataReportTypeValue,
        dataComplaintTypeValue_Combobox,
        dataComplaintType_Combobox,
        dataComplaintRsValue_Combobox,
        dataComplaintRs_Combobox,
        dataphotoValue_Combobox,
        dataphoto_Combobox,
        datapriorityValue_Combobox,
        datapriority_Combobox,
        datapriority,
        PriorityLevel,
        clauseOther,
        phoTypeOther,
        employee_tel,



        setComplaint_no,
        setno,
        setreport_type,
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
        setcompTypeOther,
        setcompRsOther,
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
        setdataset_reporttype,
        setdatapriorityValue_Combobox,
        setdatapriority_Combobox,
        setdatapriority,
        setPriorityLevel,
        setclauseOther,
        setphoTypeOther,
    } = useListComplaint()

    
    const [ComplaintCarData, setComplaintCarData] = useState<ComplaintCarData[] | null>(null);
    const [ComplaintServiceData, setComplaintServiceData] = useState<ComplaintServiceData[] | null>(null);
    const [ComplaintImgData, setComplaintImgData] = useState<ComplaintImgData[] | null>(null);

    const [open, setOpen] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [imageLoading, setImageLoading] = React.useState(true);

    const [startDueDate, setStartDueDate] = React.useState<dayjs.Dayjs | undefined | null>();
    const [endDueDate, setEndDueDate] = React.useState<dayjs.Dayjs | undefined | null>();
    const [dataComplaintType, setdataComplaintType] = useState<LovType[]>([]);
    const [dataComplaintRs, setdataComplaintRs] = useState<LovType[]>([]);
    const [dataComplaintphoto, setdataComplaintphoto] = useState<LovType[]>([]);
    const [dataPriority, setdataPriority] = useState<string>("");
    const [filteredComplaintType, setFilteredComplaintType] = useState<LovType[]>([]);
    const [filteredComplaintRs, setFilteredComplaintRs] = useState<LovType[]>([]);
    const [filteredpriority, setFilteredpriority] = useState<LovType[]>([]);
    const [filteredphoto, setFilteredphoto] = useState<LovType[]>([]);
    const [isRSHidden, setIsRSHidden] = React.useState(true); // เริ่มต้นแสดง
    const [value, setValue] = React.useState(0);


    // Function Handlers (On Change Event) ======================================================
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // Functions (Initial, Calculation or ETC.) =================================================
    const resetForm = () => {
        setcas_number("");
        setarea_of_detection_dept("");
        setproduct_name("");
        setlot_no("");
        setuser_file_name("");
        setdetail("");
        setdatapriority("");
    };

    React.useEffect(() => {
        previewComplaint();
        // Complaint_cer_Get()
        // Complaint_img_Get()
        // cer_detail_Get()
        // กรอง complaint type

        // console.log("✨✨✨✨✨✨✨ dataelement", dataelement);
        // console.log("✨✨✨✨✨✨✨ dataelement.complaint_type", dataelement.complaint_type);

        console.log("💥💥💥💥💥💥💥💥💥💥💥 [dataelement.report_type] : ", dataelement?.report_type, "💥💥💥💥💥💥💥💥💥💥💥");

        const filtered = (dataComplaintType_Combobox || []).filter((item: LovType) =>
            // item.lov_type === "complaint_type" && item.lov_code === dataelement.report_type
            // item.lov_type === "complaint_type" && item.lov_code === "TRR_RT_NCR"
            item.lov_type === "complaint_type" && item.lov_code === dataelement.report_type
        );
        const filteredRs = (dataComplaintRs_Combobox || []).filter((item: LovType) =>
            // item.lov_type === "reference_standard" && item.lov_code === "TRR_RT_NCR"
            item.lov_type === "reference_standard" && item.lov_code === dataelement.report_type
        );
        const filteredpriority = (datapriority_Combobox || []).filter((item: LovType) =>
            item.lov_type === "priority_level"
        );
        const filteredphoto = (dataphoto_Combobox || []).filter((item: LovType) =>
            item.lov_type === "attach_type"
        );
        console.log("filtered", filtered);
        setFilteredComplaintType(filtered);
        console.log("filteredRS", filteredRs);
        setFilteredComplaintRs(filteredRs);
        console.log("filteredpriority", filteredpriority);
        setFilteredpriority(filteredpriority);
        console.log("filteredphoto", filteredphoto);
        setFilteredphoto(filteredphoto);
    }, [dataComplaintType_Combobox, dataComplaintRs_Combobox, datapriority_Combobox, dataphoto_Combobox, dataelement]);

    console.log("❤❤❤❤❤❤dataelement.report_type =", dataelement.report_type);
    console.log("❤❤❤❤❤❤dataComplaintType_Combobox =", dataComplaintType_Combobox);
    console.log("❤❤❤❤❤❤dataComplaintRs_Combobox =", dataComplaintRs_Combobox);

    const previewComplaint = async () => {
        console.log(dataelement, 'dataelement');
        console.log("dataset_reporttype", dataset_reporttype);
        console.log("NCR TEST", extractReportType("TRR_RT_NCR"));
        console.log("OBS TEST", extractReportType("TRR_RT_OBS"));
        console.log("CAR TEST", extractReportType("TRR_RT_CAR"));
        console.log("CPAR TEST", extractReportType("TRR_RT_CPAR"));



        if (dataelement) {
            console.log("dataelement.report_type", dataelement.report_type);

            setreport_type(dataelement.report_type)
            setcas_number(dataelement.cas_number)
            setrequest_company_id(dataelement.request_company_id)
            setarea_of_detection_dept(dataelement.area_of_detection_dept)
            setproduct_name(dataelement.product_name)
            setlot_no(dataelement.lot_no)
            setuser_file_name(dataelement.user_file_name)
            setdetail(dataelement.detail)
            setrespondent_company_id(dataelement.respondent_company_id)
            setrespondent_domain_id(dataelement.respondent_domain_id)
            setrespondent_department_id(dataelement.respondent_department_id)
            setrespondent_email(dataelement.respondent_email)
            setrequest_name(dataelement.request_name)
            setrequest_position(dataelement.request_position)
            setrequest_department_id(dataelement.request_department_id)
            setrequest_email(dataelement.request_email)
            setrequest_phone(dataelement.request_phone)
            setdataComplaintType(dataelement?.complaintType)
            setdataComplaintRs(dataelement?.complaintRs)
            setdataComplaintphoto(dataelement?.complaintPhoto)
            setIsRSHidden(extractReportType(dataelement.report_type) != "NCR" ? true : false);
            // setIsRSHidden(dataelement.lov_code !== "TRR_RT_NCR");
            // แปลง priority text → id ของ RadioGroup
            const selectedPriority = datapriority_Combobox.find(
                (item: any) =>
                    item.lov_code === dataelement.priority_level || item.lov1 === dataelement.priority_level
            );
            setdataPriority(selectedPriority?.id || ""); // id ของ priority หรือ "" ถ้าไม่เจอ
            // setdoc_date(dayjs(parseInt(dataelement.doc_date.match(/\d+/)[0])).format("DD/MM/YYYY HH:mm:ss"))

            console.log("dataComplaintType_Combobox", dataComplaintType_Combobox);

            console.log("dataelement?.complaint_type_id", dataelement?.complaintType);
            console.log("dataelement?.complaint_type_id", dataelement?.complaintRs);
            console.log("dataelement?.complaint_at_id", dataelement?.complaintPhoto);
            console.log("dataelement?.priority_level", dataelement?.priority_level);
            const data_ComplaintType = await setValueMas(dataComplaintType_Combobox, dataelement?.complaint_type_id, "id")
            const data_ComplaintRs = await setValueMas(dataComplaintRs_Combobox, dataelement?.complaint_type_id, "id")
            const data_ComplaintPhoto = await setValueMas(dataphoto_Combobox, dataelement?.complaint_at_id, "id")
            const data_Priority = await setValueMas(datapriority_Combobox, dataelement?.priority_level, "id")
            // setdataComplaintTypeValue_Combobox && setdataComplaintTypeValue_Combobox(data_ComplaintType)
            console.log("data_ComplaintType", data_ComplaintType);
            console.log("data_ComplaintRs", data_ComplaintRs);
            console.log("data_ComplaintPhoto", data_ComplaintPhoto);
            console.log("data_Priority", data_Priority);
            console.log(dataset_reporttype);
            // setIsRSHidden(dataset_reporttype)

        }

    }

    return (
        <Box
            sx={{
                p: 2,
                mt: 5,
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
                    ข้อมูลแบบฟอร์มComplaint
                </label>
            </div>
            <Divider sx={{ my: 0.1, borderColor: "#F29739" }} />
            <Grid size={4}>
                <FullWidthTextField
                    value={
                        dataset_reporttype?.find(
                            (c: any) => c.id === report_type
                        )?.lov_code 
                    }
                    // required={"required"}
                    labelName={"ReportType"}
                    onchange={(e) => {
                        setdataReportTypeValue(e);
                    }}
                    readonly
                    bgcolorTextField={bgcolorTextField}
                />
            </Grid>
            <Grid container spacing={2} mt={2}>
                <Grid size={4}>
                    <FullWidthTextField
                        value={cas_number}
                        // required={"required"}
                        labelName={"CasNumber"}
                        onchange={(e) => {
                            setcas_number(e);
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid size={4}>
                    <FullWidthTextField
                        value={product_name}
                        //required={"required"}
                        labelName={"ProductName"}
                        onchange={(e) => {
                            setproduct_name(e);
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid size={4}>
                    <FullWidthTextField
                        value={lot_no}
                        //required={"required"}
                        labelName={"Lot No./ Bag No."}
                        onchange={(e) => {
                            setlot_no(e);
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid size={4}>
                    <FullWidthTextField
                        value={respondent_company_id}
                        //required={"required"}
                        labelName={"Factory"}
                        onchange={(e) => {
                            setrespondent_company_id(e);
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid size={4}>
                    <FullWidthTextField
                        value={respondent_domain_id}
                        //required={"required"}
                        labelName={"Domain"}
                        onchange={(e) => {
                            setrespondent_domain_id(e);
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid size={4}>
                    <FullWidthTextField
                        value={respondent_department_id}
                        //required={"required"}
                        labelName={"Department"}
                        onchange={(e) => {
                            setrespondent_department_id(e);
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid size={4}>
                    <FullWidthTextField
                        value={respondent_email}
                        //required={"required"}
                        labelName={"Email"}
                        onchange={(e) => {
                            setrespondent_email(e);
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid size={4}>
                    <DesktopDatePickers
                        labelName={"Date of Detection"}
                        value={date_of_detection}
                        handleChange={(val) => {
                            if (val) {
                                setdate_of_detection(val); // val เป็น Dayjs แน่นอน
                            }
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid size={4}>
                    <DesktopDatePickers
                        labelName={"Document Issuance Date"}
                        value={doc_date}
                        handleChange={(val) => {
                            if (val) {
                                setdoc_date(val); // val เป็น Dayjs แน่นอน
                            }
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                
                <Grid size={4}>
                    <DesktopDatePickers
                        labelName={"Required Response Date"}
                        value={respond_date_within}
                        handleChange={(val) => {
                            if (val) {
                                setrespond_date_within(val); // val เป็น Dayjs แน่นอน
                            }
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                            <label className="sarabun-regular-datatable">Type Of Complaint</label>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                {(filteredComplaintType || []).map((item: LovType) => {
                                    console.log('dataComplaintType:', dataComplaintType);
                                    const isChecked = dataComplaintType.some(c => {
                                        console.log('Checking c:', c, 'against item.id:', item.id);
                                        return c.complaint_type_id === item.id; // เปลี่ยนจาก c.id เป็น c.complaint_type_id
                                    });

                                    console.log('Result for item', item.id, 'isChecked:', isChecked);

                                    return (
                                        <Grid size={6} key={item.id}>
                                            <FullWidthCheckbox
                                                labelName={item.lov1}
                                                value={isChecked}
                                                readonly={true}
                                                onchange={() => { }}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                            {/* แสดงช่อง Other ถ้ามีเลือกตัว TRR_CT_NCR_99 */}
                            {dataComplaintTypeValue_Combobox?.id === "TRR_CT_NCR_99" && (
                                <FullWidthTextArea
                                    value={compTypeOther}
                                    labelName="Other:"
                                    readonly
                                />
                            )}
                        </Paper>
                    </Grid>

                    {!isRSHidden && (
                        <Grid size={6}>
                            <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                                <label className="sarabun-regular-datatable">Reference Standard</label>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    {(filteredComplaintRs || []).map((item: LovType) => {
                                        console.log("❤❤❤❤filteredComplaintRs", filteredComplaintRs);

                                        console.log('dataComplaintRs:', dataComplaintRs);
                                        const isChecked = dataComplaintRs.some(c => {
                                            console.log('Checking c:', c, 'against item.lov_code:', item.lov_code);
                                            return c.complaint_type_id === item.id;
                                        });

                                        console.log('Result for itemmmmm', item.id, 'isCheckeddddd:', isChecked);

                                        return (
                                            <Grid size={6} key={item.id}>
                                                <FullWidthCheckbox
                                                    labelName={item.lov1}
                                                    value={isChecked}
                                                    readonly={true}
                                                    onchange={() => { }}
                                                />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                                {dataComplaintRsValue_Combobox?.some((c: any) => c.id === "TRR_RS_NCR_6") && (
                                    <FullWidthTextArea
                                        value={clauseOther}
                                        labelName="clause:"
                                        readonly
                                    />
                                )}
                                {dataComplaintRsValue_Combobox?.some((c: any) => c.id === "TRR_RS_NCR_99") && (
                                    <FullWidthTextArea
                                        value={compRsOther}
                                        labelName="Other:"
                                        readonly
                                    />
                                )}
                            </Paper>
                        </Grid>
                    )}
                </Grid>

                <Grid size={3}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Priority</FormLabel>
                        <RadioGroup row value={dataPriority}>
                            {datapriority_Combobox.map((item: any) => (
                                <FormControlLabel
                                    key={item.id}
                                    value={item.id}        // ต้องตรงกับ state
                                    control={<Radio />}
                                    label={item.lov_code}  // หรือ lov1 ตามที่แสดง
                                    disabled
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid size={12}>
                    <FullWidthTextArea
                        value={detail}
                        //required={"required"}
                        labelName={"Detail"}
                        onchange={(e) => {
                            setdetail(e);
                        }}
                        readonly
                        bgcolorTextField={bgcolorTextField}
                    />
                </Grid>
                <Grid size={6}>
                    <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                        <label className="sarabun-regular-datatable">Please attach any  photost</label>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                            {(filteredphoto || []).map((item: LovType) => {
                                const isChecked = (dataelement?.complaintFile || []).some(
                                    (c: { complaint_at_id: string; }) => c.complaint_at_id === item.id // ตรงกับ id แน่นอน
                                );

                                console.log('Result for itemmmmm', item.id, 'isCheckeddddd:', isChecked);

                                return (
                                    <Grid size={6} key={item.id}>
                                        <FullWidthCheckbox
                                            labelName={item.lov1}
                                            value={isChecked}
                                            readonly={true}
                                            onchange={() => { }}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Paper>
                </Grid>

                <Grid container spacing={2} mt={2}>
                    <Grid size={4}>
                        <FullWidthTextField
                            value={request_name}
                            //required={"required"}
                            labelName={"Reported By"}
                            onchange={(e) => {
                                setrequest_name(e);
                            }}
                            readonly
                            bgcolorTextField={bgcolorTextField}
                        // Validate={validateText && validateText.driverTel}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FullWidthTextField
                            value={request_company_id}
                            //required={"required"}
                            labelName={"Factory"}
                            onchange={(e) => {
                                setrequest_company_id(e);
                            }}
                            readonly
                            bgcolorTextField={bgcolorTextField}
                        // Validate={validateText && validateText.driverTel}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FullWidthTextField
                            value={request_name}
                            //required={"required"}
                            labelName={"Domain"}
                            onchange={(e) => {
                                setrequest_domain_id(e);
                            }}
                            readonly
                            bgcolorTextField={bgcolorTextField}
                        // Validate={validateText && validateText.driverTel}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FullWidthTextField
                            value={area_of_detection_dept}
                            //required={"required"}
                            labelName={"Department / Area of Detection"}
                            onchange={(e) => {
                                setarea_of_detection_dept(e);
                            }}
                            readonly
                            bgcolorTextField={bgcolorTextField}
                        // Validate={validateText && validateText.driverTel}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FullWidthTextField
                            value={request_department_id}
                            //required={"required"}
                            labelName={"Department"}
                            onchange={(e) => {
                                setrequest_department_id(e);
                            }}
                            readonly
                            bgcolorTextField={bgcolorTextField}
                        // Validate={validateText && validateText.driverTel}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FullWidthTextField
                            value={request_position}
                            //required={"required"}
                            labelName={"Position"}
                            onchange={(e) => {
                                setrequest_position(e);
                            }}
                            readonly
                            bgcolorTextField={bgcolorTextField}
                        // Validate={validateText && validateText.driverTel}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FullWidthTextField
                            value={request_email}
                            //required={"required"}
                            labelName={"Email"}
                            onchange={(e) => {
                                setrequest_email(e);
                            }}
                            readonly
                            bgcolorTextField={bgcolorTextField}
                        // Validate={validateText && validateText.driverTel}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FullWidthTextField
                            value={request_phone}
                            //required={"required"}
                            labelName={"Phone"}
                            onchange={(e) => {
                                setrequest_phone(e);
                            }}
                            readonly
                            bgcolorTextField={bgcolorTextField}
                        // Validate={validateText && validateText.driverTel}
                        />
                    </Grid>

                </Grid>
            </Grid>
        </Box >
    )
}

export function extractReportType(code?: string): string {

    if (!code) return "";

    const prefix = "TRR_RT_";

    if (code.includes(prefix)) {
        return code.split(prefix)[1].trim().toUpperCase();
    }

    const parts = code.split("_");
    return (parts[parts.length - 1] || "").trim().toUpperCase();
}